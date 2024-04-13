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
  const category = url.searchParams.get("category")?.toLocaleLowerCase();

  if (!userEmail) {
    return NextResponse.json(
      {
        message: "No user email found in query parameter.",
      },
      { status: 400 }
    );
  }
  if (!category) {
    return NextResponse.json(
      {
        message: "No category found in query parameter.",
      },
      { status: 400 }
    );
  }

  if (
    !["calories", "fats", "carbs", "sodium", "sugars", "protein"].includes(
      category
    )
  ) {
    return NextResponse.json(
      {
        message: "Invalid category submitted.",
        categories_allowed: [
          "calories",
          "fats",
          "carbs",
          "sodium",
          "sugars",
          "protein",
        ],
      },
      { status: 400 }
    );
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

  // Mongo DB Aggregation pipeline to fetch category data
  const categoryData = await UserModel.aggregate([
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
        [`nutrientsData.${category.toLowerCase()}`]: 1,
        "nutrientsData.day": 1,
        "nutrientsData.month": 1,
        "nutrientsData.year": 1,
        "nutrientsData.date": 1,
      },
    },
  ]);

  // Fetch the array of data
  const categoryArrayData = categoryData[0].nutrientsData;

  if (categoryArrayData.lenght <= 0) {
    return NextResponse.json(
      {
        message: "No data available",
      },
      { status: 400 }
    );
  }

  let daysArray: number[] = [];
  let catDataArray: number[] = [];

  const currentMonth = currentDate.getMonth() + 1;
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentMonth,
    0
  ).getDate();

  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
    catDataArray.push(0);
  }

  // Populate fatDataArray with fat data
  for (const data of categoryArrayData) {
    const dayOfMonth = data.day;
    const catValue = parseInt(data[category.toLocaleLowerCase()]);

    catDataArray[dayOfMonth - 1] = catValue;
  }

  return NextResponse.json(
    {
      message: "Data has been fetched successfully",
      labels: daysArray,
      data: catDataArray,
    },
    { status: 200 }
  );
}
