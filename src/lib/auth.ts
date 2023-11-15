import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import {PrismaAdapter} from "@auth/prisma-adapter"
import prisma from "@/utils/prismaClientHandler"

export const nextAuthOptions:NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    
    adapter: PrismaAdapter(prisma),

    providers: [
        GoogleProvider({
            clientId: (process.env.GOOGLE_CLIENT_ID) as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        EmailProvider({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM
        })
    ]
}