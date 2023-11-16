import prisma from "@/utils/prismaClientHandler";
import { connectingDatabase } from "@/utils/server-helpers";
import { hash } from "bcrypt";
import { log } from "console";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const {username, email, password} = await req.json()
        if(!username || !email || !password) {
            return NextResponse.json({msg: "Either Username, email, or password is missing"}, {status: 401})
        }

        connectingDatabase();

        const hashedPassword = await hash(password, 11)
        
        if(hashedPassword) {
            const newUser = await prisma.creduser.create({
                data: {
                    email,
                    password: hashedPassword,
                    userName: username
                }
            })
    
            if(newUser.id) {
                return NextResponse.json({msg: "User created!!"}, {status: 201})
            } else {
                return NextResponse.json({msg: "signup failed!!"}, {status: 402})
            }
        }

    } catch (error) {
        log(error, "error occured!!")
        return NextResponse.json({ message: "Server Error" }, { status: 500 })
    } finally {
        prisma.$disconnect()
    }
}