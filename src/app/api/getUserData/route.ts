import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const url = new URL(request.url)

    const userName = url.searchParams.get("useremail")
    if(!userName){
        return NextResponse.json({"message": "No query provided"})
    }

    return NextResponse.json({"message":userName})
}