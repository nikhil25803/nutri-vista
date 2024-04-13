import { decodeToken } from "@/app/helpers/decodeToke";
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

  if (categoryData.length <= 0) {
    return NextResponse.json(
      { message: "No record available", data: null },
      { status: 400 }
    );
  }

  // Return the category data
  return NextResponse.json(
    { message: "Last Entry has been fetched!", data: categoryData[0] },
    { status: 200 }
  );
}
