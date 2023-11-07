import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const nextAuthOptions:NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    // nextUrl: process.env.NODE_ENV === "development" ? "http://localhost:3000" : process.env.NEXTAUTH_URL,
    providers: [
        GoogleProvider({
            clientId: (process.env.GOOGLE_CLIENT_ID) as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ]
}