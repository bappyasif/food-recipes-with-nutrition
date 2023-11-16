import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/utils/prismaClientHandler"
import CredentialsProvider from "next-auth/providers/credentials"
import {compare} from "bcrypt"

export const nextAuthOptions: NextAuthOptions = {
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
        }),
        CredentialsProvider({
            name: "Credentials",

            credentials: {
                email: { label: "Your Email", type: "email", placeholder: "jsmith@wc.yo" },
                password: { label: "Your Password", type: "password" }
            },

            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                const userFound = await prisma.creduser.findUnique({
                    where: {
                        email: credentials?.email,
                    }
                })

                const isValid = await compare(credentials?.password!, userFound?.password!)

                if (isValid) {
                    return userFound
                } else {
                    throw new Error('User does not exists. Please make sure you insert the correct email & password.')
                }
            },
        }),
    ],
    debug: process.env.NODE_ENV === "development",
    // when using with credentials, this needs to be a jwt token otherwise session wont be created for user
    session: {
        strategy: "jwt"
    }
}