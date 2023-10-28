import { connectingDatabase, prisma } from "@/utils/server-helpers"
import { PrismaClient } from "@prisma/client"
import { log } from "console"
import { NextRequest, NextResponse } from "next/server"
import prismaClicnt from "@/utils/prismadb"

export async function POST (request: NextRequest) {
    NextResponse.json({msg: "post alive!!"})
}

export async function GET (req: NextRequest) {
    try {
        const recipes = await prismaClicnt.recipe.findMany()
        NextResponse.json({msg: "get alive!!", recipes})
    } catch (error) {
        return NextResponse.json({msg: "error occured", error}, {status: 500})
    }
}


// export const POST = async (req: NextRequest, res: Response) => {
//     // log(req.method)
//     // NextResponse.json({msg: "alive!!"})

    

// //   res.json({msg: "alive"})
// }

// export const POST = async (req: Request, res: Response) => {
//     try {
//         const {label, cuisineType, co2EmissionsClass, uri, images, calories} = await req.json()
//         if(label && cuisineType && co2EmissionsClass && uri && images && calories) {
//             log("we're here, all values are here")
//             await connectingDatabase()
//             const newItemForCollection = await prisma.recipe.create({data: {calories, cuisineType, label, uri, images,co2EmissionsClass}})
//             return NextResponse.json({newItemForCollection}, {status: 201})
//         } else {
//             return NextResponse.json({message: "Invalid request, possibly required data are missing"}, {status: 422})
//             // return res.json({message: "invalid data!!"})
//         }
//     } catch (error) {
//         log(error)
//         return NextResponse.json({message: "Server Error"}, {status: 500})
//         // throw new Error("Data write operation failed....")
//     } finally {
//         prisma.$disconnect()
//     }
// }