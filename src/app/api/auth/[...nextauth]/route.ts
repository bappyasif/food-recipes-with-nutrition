import { nextAuthOptions } from "@/lib/auth"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

// export const nextAuthOptions = {
//     secret: process.env.NEXTAUTH_SECRET,
//     // nextUrl: process.env.NODE_ENV === "development" ? "http://localhost:3000" : process.env.NEXTAUTH_URL,
//     providers: [
//         GoogleProvider({
//             clientId: (process.env.GOOGLE_CLIENT_ID) as string,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET!
//         })
//     ]
// }

const handler = NextAuth(nextAuthOptions)

export {handler as GET, handler as POST}