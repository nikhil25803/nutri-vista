import { connectDB } from "@/db/dbConfig";
import UserModel from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connectDB();

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
    category! in ["calories", "fat", "carbs", "sodium", "sugars", "protein"]
  ) {
    return NextResponse.json(
      {
        message: "Invalid category submitted.",
        categories_allowed: [
          "calories",
          "fat",
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

    catDataArray[dayOfMonth-1] = catValue;
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
