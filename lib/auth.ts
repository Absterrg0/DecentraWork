import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import client from '@/db';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client'

export const authValues: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text', placeholder: 'Enter Email Address' },
                password: { label: 'Password', type: 'password', placeholder: 'Enter Password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    throw new Error("Missing Email or Password");
                }

                try {
                    const user: User | null = await client.user.findFirst({
                        where: { email: credentials.email }
                    });

                    if (!user) {
                        throw new Error("No user found with this email");
                    }

                    const isValidPassword = await bcrypt.compare(credentials.password, user.password);
                    if (!isValidPassword) {
                        throw new Error("Incorrect Password");
                    }

                    // Return user object if authentication is successful
                    return {
                        id: user.id.toString(),
                        email: user.email,
                        name: user.name
                    };
                } catch (e) {
                    console.error(e);
                    throw new Error("Email/Password is Incorrect");
                }
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
};

export default authValues;
