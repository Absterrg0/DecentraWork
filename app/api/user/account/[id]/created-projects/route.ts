import authValues from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import client from '@/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authValues);
    
    if (!session || !session.user) {
        return NextResponse.json({
            msg: "Unauthorized"
        }, { status: 401 });
    }
    
    try {
        const userId = parseInt(params.id);

        // Ensure the user is fetching their own data
        if (session.user.id !== params.id) {
            return NextResponse.json({
                msg: "Forbidden"
            }, { status: 403 });
        }

        // Fetch projects where user is the client or assigned freelancer
        const createdProjects = await client.project.findMany({
            where: {
                clientId: userId,
                assignedId: { not: null }, // Ensure the project has an assigned freelancer
            },
            include: {
                assigned: true // Include freelancer details
            }
        });

        const assignedProjects = await client.project.findMany({
            where: {
                assignedId: userId, // Projects where the user is the assigned freelancer
            },
            include: {
                client: true // Include client details
            }
        });

        // Combine both results into one response
        return NextResponse.json({
            createdProjects,
            assignedProjects
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            msg: "Something went wrong"
        }, { status: 500 });
    }
}
