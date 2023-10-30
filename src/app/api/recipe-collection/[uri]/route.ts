import prisma from "@/utils/prismaClientHandler"
import { connectingDatabase } from "@/utils/server-helpers"
import { log } from "console"
import { NextRequest, NextResponse } from "next/server"

export const PUT = async (req: NextRequest, { params }: { params: { uri: string } }) => {
    try {
        const {uri} = params
        console.log(uri, "URI here!!")
        // const {uri} = await req.json()
        if(uri as string) {
            await connectingDatabase()
            const foundId = await prisma.recipe.findUnique({where: {id: uri}})
            console.log(foundId, "foundId")
            // const resp = await prisma.recipe.update({
            //     where: {},
            //     data: {
            //         count: {
            //             increment: 1
            //         }
            //     }
            // })
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