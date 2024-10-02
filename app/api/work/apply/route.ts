import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import client from '@/db';
import authValues from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authValues);
  
  // Check if the user is signed in
  if (!session || !session.user.id) {
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { projectId, proposal } = body;

  // Validate input
  if (!projectId || !proposal) {
    return NextResponse.json({ msg: "Project ID and proposal are required" }, { status: 400 });
  }

  try {
    // Create a new application (Gig) for the project
    const application = await client.gig.create({
      data: {
        freelancerId: session.user.id,
        projectId,
        proposal,
        status: 'PENDING', // Default status
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "An error occurred while applying for the project" }, { status: 500 });
  }
}
