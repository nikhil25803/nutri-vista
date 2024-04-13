import { decodeToken } from "@/app/helpers/decodeToke";
import { connectDB } from "@/db/dbConfig";
import UserModel from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connectDB();

  const userToken = request.headers.get("usertoken");
  if (!userToken) {
    return NextResponse.json(
      {
        message: "User token is not provided.",
      },
      { status: 400 }
    );
  }

  // Check if token is valid or not
  const tokenValidation = decodeToken(userToken);
  if (!tokenValidation.isvalid) {
    return NextResponse.json(
      { message: "Token is expired or invalid", data: null },
      { status: 400 }
    );
  }

  const url = new URL(request.url);

  const userEmail = url.searchParams.get("useremail");
  if (!userEmail) {
    return NextResponse.json({ message: "No query provided" });
  }

  // Search user
  const userObject = await UserModel.findOne({ email: userEmail });
  if (!userObject) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  // Get the current date
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);

  // Calculate the date 30 days ago
  const thirtyDaysAgo = new Date(currentDate);
  thirtyDaysAgo.setDate(currentDate.getDate() - 30);

  // If user exists, collect nutrients data
  const userData = await UserModel.aggregate([
    {
      $match: {
        email: userEmail,
        "nutrientsData.date": { $gte: thirtyDaysAgo, $lte: currentDate },
      },
    },
    {
      $unwind: "$nutrientsData",
    },
    {
      $match: {
        "nutrientsData.date": { $gte: thirtyDaysAgo, $lte: currentDate },
      },
    },
    {
      $group: {
        _id: null,
        nutrientsData: { $push: "$nutrientsData" },
      },
    },
    {
      $project: {
        _id: 0,
        nutrientsData: 1,
      },
    },
  ]);

  const nutrientsData = userData[0].nutrientsData;

  // Calculate total data
  let totalCalories = 0;
  let totalFat = 0;
  let totalCarbs = 0;
  let totalSodium = 0;
  let totalSugars = 0;
  let totalProtein = 0;

  // Map the array and calculate the total of each required value
  nutrientsData.forEach((food: any) => {
    totalCalories += parseInt(food.calories);
    totalFat += parseInt(food.fats);
    totalCarbs += parseInt(food.carbs);
    totalSodium += parseInt(food.sodium);
    totalSugars += parseInt(food.sugars);
    totalProtein += parseInt(food.protein);
  });

  const response = {
    totalCalories,
    totalFat,
    totalCarbs,
    totalSodium,
    totalSugars,
    totalProtein,
  };

  return NextResponse.json(
    {
      message: "Data has been fetched",
      name: userObject.name,
      username: userObject.username,
      data: response,
    },
    { status: 200 }
  );
}
