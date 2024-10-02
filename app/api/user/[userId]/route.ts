import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authValues from "@/lib/auth";
import client from '@/db'; // Your Prisma client
import bcrypt from 'bcrypt';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
    const session = await getServerSession(authValues);

    // Step 1: Check if the user is authenticated
    if (!session || !session.user.id) {
        return NextResponse.json({
            msg: "Unauthorized"
        }, { status: 401 });
    }

    try {
        // Step 2: Fetch user details from the database
        const userDetails = await client.user.findUnique({
            where: { id: Number(params.userId) },
            include: {
                createdProjects: true, // Include projects created by the user
                appliedGigs: true, // Include gigs the user applied for
                reviews: true, // Include reviews made by the user
                payments: true // Include payments made by the user
            }
        });

        // Step 3: Check if user exists
        if (!userDetails) {
            return NextResponse.json({
                msg: "User not found"
            }, { status: 404 });
        }

        // Step 4: Return the user details
        return NextResponse.json(userDetails, { status: 200 });

    } catch (error) {
        console.error('Error fetching user details:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}




export async function PUT(request: Request, { params }: { params: { userId: string } }) {
    const session = await getServerSession(authValues);

    // Step 1: Check if the user is authenticated
    if (!session || !session.user.id) {
        return NextResponse.json({
            msg: "Unauthorized"
        }, { status: 401 });
    }

    // Step 2: Check if the user is trying to update their own details
    if (Number(params.userId) !== session.user.id) {
        return NextResponse.json({
            msg: "You can only update your own details"
        }, { status: 403 });
    }

    const body = await request.json();
    const { email, password, bio, walletAddress } = body;

    // Step 3: Prepare the update data
    const updateData: any = {};
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10); // Hash the password before saving
    if (bio) updateData.bio = bio;
    if (walletAddress) updateData.walletAddress = walletAddress;

    try {
        // Step 4: Update the user in the database
        const updatedUser = await client.user.update({
            where: { id: Number(params.userId) },
            data: updateData,
        });

        // Step 5: Return the updated user details
        return NextResponse.json(updatedUser, { status: 200 });

    } catch (error) {
        console.error('Error updating user details:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
