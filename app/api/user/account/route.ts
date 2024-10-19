import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import client from '@/db';

// Define the expected structure of the request body
interface UserBody {
  name: string;
  email: string;
  password: string;
  solanaAddress?: string; // Optional
  ethereumAddress?: string; // Optional
}

export async function POST(req: NextRequest) {
  try {
    const body: UserBody = await req.json();

    // Validate required fields
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json({ msg: "Missing required fields" }, { status: 400 });
    }

    // Check if the email already exists
    const existingUser = await client.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return NextResponse.json({ msg: "User already exists for this email" }, { status: 400 });
    }

    // Hash the password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(body.password, 10);
    } catch (err) {
      console.error("Error hashing password:", err);
      return NextResponse.json({ msg: "Error creating account, try again" }, { status: 500 });
    }

    // Create the user with wallet addresses and empty skills array initially
    const newUser = await client.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        walletAddressSOL: body.solanaAddress || '', // Store as empty string if not provided
        walletAddressETH: body.ethereumAddress || '', // Store as empty string if not provided
        skills: [], // Empty skills array initially
      },
    });

    // Respond with a success message (but no sensitive data like password)
    return NextResponse.json({
      msg: "You have successfully signed up.",
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating user:", error);

    // Return a general error message with proper status code
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
