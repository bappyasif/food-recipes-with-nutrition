import { connectingDatabase, prisma } from "@/utils/server-helpers"
import { PrismaClient } from "@prisma/client"
import { log } from "console"
import { NextRequest, NextResponse } from "next/server"

// export async function POST (request: NextRequest) {
//     return NextResponse.json({msg: "post alive!!"})
// }

// export async function POST (request: NextRequest) {
//     // if empty json body in request will show error of "unexpected end of json input"
//     const tt = await request.json();
//     log(tt, "tt")
//     return NextResponse.json({msg: "post alive!!"})
// }

export async function GET (req: NextRequest) {
    try {
        const recipes = await prisma.recipe.findMany()
        // const recipes = await prismaClicnt.recipe.findMany()
        // const recipes = await clientPrisma.recipe.findMany()
        return NextResponse.json({msg: "get alive!!", recipes}, {status: 201})
    } catch (error) {
        return NextResponse.json({msg: "error occured", error}, {status: 500})
    }
}


// export const POST = async (req: NextRequest, res: Response) => {
//     // log(req.method)
//     // NextResponse.json({msg: "alive!!"})

    

// //   res.json({msg: "alive"})
// }

export const PUT = async (req: NextRequest) => {
    try {
        const {uri} = await req.json()
        if(uri as string) {
            await connectingDatabase()
            const foundRecipe = await prisma.recipe.findFirst({where: {uri: uri}})
            if(foundRecipe?.uri) {
                const resp = await prisma.recipe.update({
                    select: {
                        count: true
                    },
                    where: {
                        // uri: jhgjh
                        // uri: uri
                        id: foundRecipe?.id
                    },
                    data: {
                        count: {
                            increment: 1
                        }
                    }
                })
                return NextResponse.json({resp}, {status: 201})
            } else {
                return NextResponse.json({message: "unknown method, uri missing"}, {status: 423})
            }
            // const foundId = await prisma.recipe.findUnique({where: {uri: uri}})
            // const resp = await prisma.recipe.update({
            //     select: {
            //         count: true
            //     },
            //     where: {
            //         // uri: jhgjh
            //         uri: uri
            //     },
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

export const POST = async (req: NextRequest, res: Response) => {
    try {
        const {label, cuisineType, co2EmissionsClass, uri, images, calories, count} = await req.json()
        
        // log(label, cuisineType, co2EmissionsClass, uri, images, calories, "body data!!")

        if(label && cuisineType && co2EmissionsClass && uri && images && calories && count) {
            // log("we're here, all values are here")
            // return NextResponse.json({msg: "done"}, {status: 201})
            await connectingDatabase()
            const newItemForCollection = await prisma.recipe.create({data: {calories, cuisineType, label, uri, images, co2EmissionsClass, count}})
            return NextResponse.json({newItemForCollection}, {status: 201})
        } else {
            return NextResponse.json({message: "Invalid request, possibly required data are missing"}, {status: 422})
            // return res.json({message: "invalid data!!"})
        }
    } catch (error) {
        log(error)
        return NextResponse.json({message: "Server Error"}, {status: 500})
        // throw new Error("Data write operation failed....")
    } finally {
        prisma.$disconnect()
    }
}