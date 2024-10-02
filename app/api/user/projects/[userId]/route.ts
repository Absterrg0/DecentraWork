import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authValues from "@/lib/auth";
import client from '@/db'; // Your Prisma client

export async function GET(request: Request, { params }: { params: { userId: number } }) {
    const session = await getServerSession(authValues);

    // Step 1: Check if the user is authenticated
    if (!session || !session.user.id) {
        return NextResponse.json({
            msg: "Unauthorized"
        }, { status: 401 });
    }

    // Step 2: Check if the user is trying to access their own projects or another user's projects
    if (session.user.id !== params.userId) {
        return NextResponse.json({
            msg: "Forbidden: You can only view your own projects."
        }, { status: 403 });
    }

    try {
        // Step 3: Fetch all projects for the authenticated user
        const userProjects = await client.project.findMany({
            where: { clientId: session.user.id },
            include: {
                gigs: true, // Include gigs related to the projects if needed
                payments: true, // Include payments related to the projects if needed
                dispute: true // Include disputes related to the projects if needed
            }
        });

        // Step 4: Return the user's projects
        return NextResponse.json(userProjects, { status: 200 });

    } catch (error) {
        console.error('Error fetching user projects:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
