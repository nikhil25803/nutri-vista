import { connectDB } from "@/db/dbConfig";
import UserModel from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connectDB();

  const url = new URL(request.url);

  const userEmail = url.searchParams.get("useremail");
  if (!userEmail) {
    return NextResponse.json(
      {
        message: "No user email found in query parameter.",
      },
      { status: 400 }
    );
  }

  // Search user
  const userObject = await UserModel.findOne({ email: userEmail });
  if (!userObject) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  // Mongo DB Aggregation pipeline to fetch most recent nutrients data sorted by date
  const categoryData = await UserModel.aggregate([
    {
      $match: {
        email: userEmail,
      },
    },
    {
      $unwind: "$nutrientsData",
    },
    {
      $sort: { "nutrientsData.date": -1 },
    },
    {
      $group: {
        _id: "$_id", // Group by the user ID
        nutrientsData: { $first: "$nutrientsData" },
      },
    },
    {
      $replaceRoot: { newRoot: "$nutrientsData" },
    },
    {
      $project: {
        date: 0,
        _id: 0,
      },
    },
  ]);

  // Return the category data
  return NextResponse.json({ message: categoryData }, { status: 200 });
}
