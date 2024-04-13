import { decodeToken } from "@/app/helpers/decodeToke";
import { connectDB } from "@/db/dbConfig";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connectDB();

  const userToken = request.headers.get("usertoken")
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
  if (tokenValidation.isvalid) {
    return NextResponse.json(
      {
        message: "Token Validated",
        data: tokenValidation.data,
      },
      { status: 200 }
    );
  }
  return NextResponse.json(
    { message: "Token is expired or invalid", data: null },
    { status: 400 }
  );
}
