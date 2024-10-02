import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authValues from "@/lib/auth";
import client from '@/db';

export  async function POST(req: NextRequest) {
  // Step 1: Get user session
  const session = await getServerSession(authValues);

  if (!session || !session.user || !session.user.id) {
    // Block the request if the user is not authenticated
    return NextResponse.json({ error: 'You must be logged in to create a project.' }, { status: 401 });
  }

  try {
    // Step 2: Parse the request body
    const { title, description, budget, deadline, skillTags } = await req.json();

    // Step 3: Validate the input
    if (!title || !description || !budget || !Array.isArray(skillTags)) {
      return NextResponse.json({ error: 'Title, description, budget, and skillTags are required. skillTags must be an array.' }, { status: 400 });
    }

    // Step 4: Create the project in the database
    const project = await client.project.create({
      data: {
        title,
        description,
        budget,
        deadline: deadline ? new Date(deadline) : null, // Convert deadline to Date if provided
        clientId: session.user.id, // The authenticated user who is creating the project
        skillTags, // Assuming this is an array of strings
      },
    });

    // Step 5: Return success response
    return NextResponse.json({ message: 'Project created successfully', project }, { status: 201 });

  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}




export async function GET() {
    const session = await getServerSession(authValues);
    
    // Step 1: Check if the user is authenticated
    if (!session || !session.user.id) {
        return NextResponse.json({
            msg: "Unauthorized"
        }, { status: 401 });
    }

    try {
        // Step 2: Fetch projects with related properties
        const projects = await client.project.findMany({
            include: {
                client: {
                    select: {
                        id: true,
                        username: true,
                        email: true // Select only the necessary fields from the User model
                    }
                },
                gigs: {
                    select: {
                        id: true,
                        status: true // Include essential gig fields
                    }
                },
                payments: {
                    select: {
                        id: true,
                        amount: true,
                        status: true // Include essential payment fields
                    }
                },
                dispute: {
                    select: {
                        id: true,
                        status: true // Include essential dispute fields
                    }
                },
                // If you have a category relation, include it as well
            }
        });

        // Step 3: Return the projects in the response
        return NextResponse.json(projects);
        
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}