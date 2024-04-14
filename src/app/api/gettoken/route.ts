import { connectDB } from "@/db/dbConfig";
import UserModel from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface GetTokenRequestInterface {
  email: string;
}

export async function POST(request: NextRequest) {
  // Connect to DB
  await connectDB();

  // Fetch request body and user email
  const requestBody: GetTokenRequestInterface = await request.json();

  const userEmail = requestBody.email;

  // Search if user exists in the database
  const userData = await UserModel.findOne({ email: userEmail });
  if (!userData) {
    return NextResponse.json(
      {
        tokenCreated: false,
      },
      { status: 400 }
    );
  }

  // If user exists, create JWT token with user data payload and return token
  const tokenData = {
    id: userData._id,
    name: userData.name,
    username: userData.username,
    email: userData.email,
    photourl: userData.avatarUrl
  };

  const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
    expiresIn: "1d",
  });

  return NextResponse.json(
    {
      tokenCreated: true,
      token: token,
    },
    { status: 200 }
  );
}
