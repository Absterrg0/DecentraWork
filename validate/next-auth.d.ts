// /types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

// Extend the default session and user types to allow numeric IDs
declare module "next-auth" {
  interface Session {
    user: {
      id: number; // Adding the id as a number
    } & DefaultSession["user"]; // Merge with the default user type
  }

  interface User {
    id: number; // Adding id as a number for the User type
    username: string;
    email: string;
  }
}
