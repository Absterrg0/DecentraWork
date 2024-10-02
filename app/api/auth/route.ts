import { NextRequest, NextResponse } from "next/server";
import client from '@/db'; // Assuming your Prisma client is set up in this file
import bcrypt from 'bcrypt'; // To hash the password

export async function POST(req: NextRequest) {
  try {
    // 1. Parse the request body
    const { username, email, password, walletAddress } = await req.json();

    // 2. Input validation
    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
    }

    // 3. Check if the user already exists
    const existingUser = await client.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists.' }, { status: 400 });
    }

    // 4. Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create the user in the database
    const newUser = await client.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        walletAddress, // Optional, if the wallet address is provided
      },
    });

    // 6. Return success response
    return NextResponse.json({ message: 'User created successfully!', user: { id: newUser.id, email: newUser.email } }, { status: 201 });

  } catch (error) {
    // Error handling
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
