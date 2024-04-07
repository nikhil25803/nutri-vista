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
  const userData = await UserModel.findOne({ userEmail }).select(
    "-nutrientsData"
  );
  // If existing user
  console.log("User Data: ", userData);
  if (userData) {
    // Create token and store
    const tokenData = {
      username: userData.username,
      email: userData.email,
      name: userData.name,
      avatar: userData.avatarUrl,
    };

    // Create a response
    const response = NextResponse.json(
      {
        message: "LoggedIn Successfully",
        success: true,
      },
      { status: 200 }
    );

    return response;
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

    // Create token and store
    const tokenData = {
      username: savedUser.username,
      email: savedUser.email,
      name: savedUser.name,
      avatar: savedUser.avatarUrl,
    };

    // Create a response
    const response = NextResponse.json(
      {
        message: "New user has been created.",
        success: true,
      },
      { status: 200 }
    );

    return response;
  }
}
