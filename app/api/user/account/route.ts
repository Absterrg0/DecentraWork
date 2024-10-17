import { NextRequest,NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import client from '@/db'
export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      
      // Validate required fields
      if (!body.name || !body.email || !body.password) {
        return NextResponse.json({ msg: "Missing required fields" }, { status: 400 });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(body.password, 10);
      
      // Create the user with an empty skills array initially
      const newUser = await client.user.create({
        data: {
          name: body.name,
          email: body.email,
          password: hashedPassword,
          skills: [], // Empty skills array initially
        },
      });
  
      // Return the newly created user data (excluding password for security)
      return NextResponse.json({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      });
  
    } catch (e) {
      console.error("Error creating user:", e);
  
      // Return a more specific error message with proper status code
      return NextResponse.json({ msg: "Error occurred while creating user" }, { status: 500 });
    }
  }