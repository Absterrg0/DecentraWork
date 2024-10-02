import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import client from '@/db';
import bcrypt from 'bcrypt';

export const authValues: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID! ,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text', placeholder: 'Enter Username' },
                password: { label: 'Password', type: 'password', placeholder: 'Enter Password' }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error("Missing Username or Password");
                }

                try {
                    const user = await client.user.findFirst({
                        where: { username: credentials.username }
                    });

                    if (!user) {
                        throw new Error("No user found with this username");
                    }

                    const isValidPassword = await bcrypt.compare(credentials.password, user.password);
                    if (!isValidPassword) {
                        throw new Error("Incorrect Password");
                    }

                    // Return user object if authentication is successful
                    return {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                    };
                } catch (e) {
                    console.error(e);
                    throw new Error("Username/Password is Incorrect");
                }
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
};

export default authValues;
