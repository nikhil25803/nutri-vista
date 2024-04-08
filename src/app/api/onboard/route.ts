import { connectDB } from "@/db/dbConfig";
import UserModel from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

// Connect DB
connectDB();

export async function POST(request: NextRequest) {
  const requestBody = await request.json();

  // Checking the provider
  let authProvider = "";
  if (requestBody.iss) {
    authProvider = "google";
  } else {
    authProvider = "github";
  }

  // Extracting email
  const userEmail = requestBody.email;

  // Check if user already exist or not
  const userData = await UserModel.findOne({ userEmail });

  console.log("User Data: ", userData);
  // If existing user
  if (userData) {
    console.log("User already exists");
    // Create a response
    return NextResponse.json(
      {
        message: "LoggedIn Successfully",
        success: true,
      },
      { status: 200 }
    );
  } else {
    const onboardPayload: { [key: string]: string | Array<object> } = {};

    // Format Username
    const formattedUsername = requestBody.email
      .split("@")[0]
      .replace(/\./g, "");

    // Add data to payload accordingly
    onboardPayload.username = formattedUsername;
    onboardPayload.name = requestBody.name;
    onboardPayload.email = requestBody.email;
    onboardPayload.nutrientsData = [];

    if (authProvider != "" && authProvider == "google") {
      onboardPayload.avatarUrl = requestBody.picture;
    }
    if (authProvider != "" && authProvider == "github") {
      onboardPayload.avatarUrl = requestBody.avatar_url;
    }

    // Define new user
    const newUser = new UserModel(onboardPayload);

    // Create new user
    const savedUser = await newUser.save();

    // Create a response
    return NextResponse.json(
      {
        message: "New user has been created.",
        success: true,
      },
      { status: 200 }
    );
  }
}
