/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    city: string;
  }
  
  interface Session {
    user: {
      id: string;
      role: string;
      city: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}
