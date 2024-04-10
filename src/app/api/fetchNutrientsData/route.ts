import { connectDB } from "@/db/dbConfig";
import UserModel from "@/models/userModel";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connectDB();

  // Fetch request body
  const reqBody = await request.json();
  if (!reqBody) {
    return NextResponse.json(
      { message: "Request data required." },
      { status: 400 }
    );
  }

  // Fetch required field from the request body
  const { email, text } = reqBody;
  if (!email || !text) {
    return NextResponse.json(
      {
        message: "Email, text and date. All are required",
      },
      { status: 400 }
    );
  }

  // Check if user is valid or not
  const userObject = await UserModel.findOne({ email });
  if (!userObject) {
    return NextResponse.json(
      { message: "User does not exist" },
      { status: 404 }
    );
  }

  // Clean the user entered text
  const cleaned_text = text.replace(/[^a-zA-Z0-9 ]/g, "");

  /* 
  https://trackapi.nutritionix.com/v2/natural/nutrients?x-app-id=6eb9a7e0&x-app-key=38e6189f31cef357f85011bec1dafbe6&x-remote-user-id=0
*/

  // If user exists, fetch calories
  const BASE_URL = process.env.NUTRITIONIX_BASE_URL!;
  const APP_ID = process.env.NUTRITIONIX_APPID;
  const APP_KEY = process.env.NUTRITIONIX_APIKEY;

  const queryBody = {
    query: cleaned_text,
  };

  try {
    const nutritionixResponse: any = await axios.post(BASE_URL, queryBody, {
      params: {
        "x-app-id": APP_ID,
        "x-app-key": APP_KEY,
        "x-remote-user-id": "0",
      },
    });

    // Get response
    const responseData = nutritionixResponse.data;

    // Get food data - array
    const foodData = responseData.foods;

    // Calculate total data
    let totalCalories = 0;
    let totalFat = 0;
    let totalCarbs = 0;
    let totalSodium = 0;
    let totalSugars = 0;
    let totalProtein = 0;

    // Map the array and calculate the total of each required value
    foodData.forEach(
      (food: {
        nf_calories: number;
        nf_total_fat: number;
        nf_total_carbohydrate: number;
        nf_sodium: number;
        nf_sugars: number;
        nf_protein: number;
      }) => {
        totalCalories += food.nf_calories;
        totalFat += food.nf_total_fat;
        totalCarbs += food.nf_total_carbohydrate;
        totalSodium += food.nf_sodium;
        totalSugars += food.nf_sugars;
        totalProtein += food.nf_protein;
      }
    );

    const totalNutrients = {
      protein: totalProtein,
      carbs: totalCarbs,
      sugars: totalSugars,
      fats: totalFat,
      sodium: totalSodium,
      calories: totalCalories,
      day: new Date().getDate(),
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      date: new Date(),
    };

    // Add the data to the database
    try {
      userObject.nutrientsData.push(totalNutrients);

      // Save the updated user document
      await userObject.save();

      // Serve the response on successfull appending of data
      return NextResponse.json(
        { message: "Data has been saved in DB", data: totalNutrients },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json({ message: error }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
