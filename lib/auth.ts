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

                    return {
                        id: user.id.toString(),
                        email: user.email,
                        name: user.name,
                        experience: user.experience,
                        skills: user.skills,
                        bio: user.bio,
                    };
                } catch (e) {
                    console.error(e);
                    throw new Error("Email/Password is Incorrect");
                }
            }
        })
    ],
    pages: {
        signIn: '/auth/signin', // Custom sign-in page
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (account && user) {
                return {
                    ...token,
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    experience: (user as any).experience,
                    skills: (user as any).skills,
                    bio: (user as any).bio,
                };
            }
            return token;
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id as string,
                    email: token.email as string,
                    name: token.name as string,
                    experience: token.experience as string | null,
                    skills: token.skills as string[],
                    bio: token.bio as string | null,
                }
            };
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
};

export default authValues;