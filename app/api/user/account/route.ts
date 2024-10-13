import { NextRequest, NextResponse } from "next/server";
import client from '@/db';
import bcrypt from 'bcrypt';
import { getServerSession } from "next-auth";
import authValues from "@/lib/auth";

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

export async function GET(req: NextRequest) {
  const session = await getServerSession(authValues);
  if(!session||!session.user){
    return NextResponse.json({
      msg:"Unauthorized"
    })
  }
  try {

    // Fetch the user details from the database using Prisma
    const user = await client.user.findUnique({
      where: {
        id: parseInt(session.user.id),
      },
      select: {
        id: true,
        name: true,
        email: true,
        experience: true,
        skills: true,
        bio: true,
      }, // Select specific fields to return (excluding sensitive data like password)
    });

    if (!user) {
      return NextResponse.json({ msg: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ msg: 'Error fetching user details' }, { status: 500 });
  }
}

export async function PUT(req:NextRequest){
  const session = await getServerSession(authValues);
  if(!session||!session.user){
    return NextResponse.json({
      msg:"Unauthorized"
    })
  }
    const body = await req.json();
    try{
      const response = await client.user.update({
        where:{
          id: parseInt(session.user.id)        
        },
        data:{
          bio:body.bio,
          experience:body.experience,
          skills:body.skills
        }
      })
      return NextResponse.json(response)
    }
    catch(e){
      console.error(e);
      return NextResponse.json({
        msg:"Error occurred while updating information"
      })
    }
}