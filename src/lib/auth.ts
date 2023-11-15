import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/utils/prismaClientHandler"
import CredentialsProvider from "next-auth/providers/credentials"
import {compare, hash} from "bcrypt"

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
            name: "Login With Credentials",

            credentials: {
                username: { label: "Your Username", type: "text", placeholder: "jsmith" },
                email: { label: "Your Email", type: "email", placeholder: "jsmith@wc.yo" },
                password: { label: "Your Password", type: "password" }
            },

            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                const userFound = await prisma.creduser.findUnique({
                    where: {
                        email: credentials?.email,
                        // password: credentials?.password
                    }
                })

                const isValid = await compare(credentials?.password!, userFound?.password!)

                console.log(isValid, "isValid!!")

                if (isValid) {
                // if (userFound?.email) {
                    return userFound
                } else {
                    const hashedPassword = await hash(credentials?.password!, 11)
                    console.log(hashedPassword, "hashed P{asswor!!")

                    if(hashedPassword) {
                        const newUser = await prisma.creduser.create({
                            data: {
                                email: credentials?.email!,
                                // password: credentials.password,
                                // password: await hash(credentials.password, 11),
                                password: hashedPassword,
                                userName: credentials?.username!
                            }
                        })

                        return newUser

                    } else {
                        throw new Error('User does not exists. Please make sure you insert the correct email & password.')
                    }
                }
            },
        }),
    ],
    callbacks: {
        // redirect: async ({ url, baseUrl }) => {
        //     return baseUrl
        // },
        jwt: async ({ token, user, account, profile, isNewUser }) => {
            if (user) {
                token.id = user.id
            }
            return token
        },
        session: async ({ session, user, token }) => {
            token?.user && (session.user = token.user)

            return session
        }
    }
}