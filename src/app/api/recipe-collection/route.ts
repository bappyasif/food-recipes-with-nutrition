import { nextAuthOptions } from "@/lib/auth"
import prisma from "@/utils/prismaClientHandler"
import { connectingDatabase } from "@/utils/server-helpers"
import { log } from "console"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
// import { nextAuthOptions } from "../auth/[...nextauth]/route"

export async function GET (req: NextRequest) {
    const session = await getServerSession(nextAuthOptions)

    try {
        if(session?.user?.email) {
            const recipes = await prisma.recipe.findMany()
            return NextResponse.json({msg: "get alive!!", recipes}, {status: 201})
        } else {
            const recipes = (await prisma.recipe.findMany()).slice(0,6)
            return NextResponse.json({msg: "get alive!!", recipes}, {status: 201})
        }
    } catch (error) {
        return NextResponse.json({msg: "error occured", error}, {status: 500})
    }
}

export const PUT = async (req: NextRequest) => {
    try {
        const {uri, images} = await req.json()
        
        if(uri as string) {
            await connectingDatabase()
            const foundRecipe = await prisma.recipe.findFirst({where: {uri: uri}})
            if(foundRecipe?.uri) {
                const resp = await prisma.recipe.update({
                    select: {
                        count: true,
                    },
                    where: {
                        id: foundRecipe?.id
                    },
                    data: {
                        count: {
                            increment: 1
                        },
                        lastUpdated: new Date(),
                        images: images
                    }
                })
                return NextResponse.json({resp}, {status: 201})
            } else {
                return NextResponse.json({message: "unknown method, uri missing"}, {status: 423})
            }
            
        } else {
            return NextResponse.json({message: "Invalid request, uri missing"}, {status: 422})
        }
    } catch (error) {
        log(error)
        return NextResponse.json({message: "Server Error"}, {status: 500})
    } finally {
        prisma.$disconnect()
    }
}

export const POST = async (req: NextRequest, res: Response) => {
    try {
        const {label, cuisineType, co2EmissionsClass, uri, images, calories, count} = await req.json()

        if(label && cuisineType && co2EmissionsClass && uri && images && calories && count) {
            await connectingDatabase()
            const newItemForCollection = await prisma.recipe.create({data: {calories, cuisineType, label, uri, images, co2EmissionsClass, count, lastUpdated: new Date()}})
            return NextResponse.json({newItemForCollection}, {status: 201})
        } else {
            return NextResponse.json({message: "Invalid request, possibly required data are missing"}, {status: 422})
        }
    } catch (error) {
        log(error)
        return NextResponse.json({message: "Server Error"}, {status: 500})
        // throw new Error("Data write operation failed....")
    } finally {
        prisma.$disconnect()
    }
}