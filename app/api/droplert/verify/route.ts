import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Check for the Authorization header.
    const authorizationHeader = req.headers.get("authorization");
    if (!authorizationHeader) {
      return NextResponse.json(
        { msg: "Missing Authorization header" },
        { status: 401 }
      );
    }

    // Extract the API key from the header.
    const apiKey = authorizationHeader.split("Bearer ")[1];
    if (!apiKey) {
      return NextResponse.json(
        { msg: "Invalid Authorization header format" },
        { status: 401 }
      );
    }

    // Retrieve the stored API key from the .env file.
    const storedApiKey = process.env.DROPLERT_KEY;
    if (!storedApiKey) {
      return NextResponse.json(
        { msg: "Server misconfiguration: API key is missing" },
        { status: 500 }
      );
    }

    // Compare the provided API key with the stored API key.
    if (apiKey !== storedApiKey) {
      return NextResponse.json(
        { msg: "Invalid API key" },
        { status: 403 }
      );
    }

    // If the keys match, validation is successful.
    return NextResponse.json(
      { msg: "API Key validation successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in API key verification handler:", error);

    // Return a generic error response.
    return NextResponse.json(
      { msg: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
