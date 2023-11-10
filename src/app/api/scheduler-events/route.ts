import prisma from "@/utils/prismaClientHandler";
import { connectingDatabase } from "@/utils/server-helpers";
import { log } from "console";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const userEmail = searchParams.get('email')
        const userName = searchParams.get('name')

        await connectingDatabase()

        const eventsAll = await prisma.recipe.findMany({})

        const eventsData = await prisma.events.findMany({
            where: {
                user: {
                    email: userEmail!,
                    name: userName!
                }
            }
            
        })

        console.log(eventsData.length, "all found!!", eventsAll.length)

        return NextResponse.json({ msg: "het is leven!!", eventsData }, { status: 201 })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ msg: "error occured!!" }, { status: 500 })
    }
}

export const POST = async (req: Request) => {
    try {
        const {description, end, id, start, title, recipes, user} = await req.json()

        await connectingDatabase()

        const newEvent = await prisma.events.create({
            data: {
                description,
                end,
                start,
                title,
                // id,
                // recipes,
                user,
                recipes: {
                    data: recipes
                }
            }
        })

        // console.log(newEvent, "nmew event!!")
        
        return NextResponse.json({ msg: "het is leven!!", newEvent })

    } catch (error) {
        log(error, "error occured")
        return NextResponse.json({ msg: "error occured!!" }, { status: 500 })
    } finally {
        prisma.$disconnect()
    }
}

export async function PUT (req: Request) {
    try {
        const {id, start, end, title, description} = await req.json()

        await connectingDatabase()

        console.log(id, start, "what what!!")

        const resp = await prisma.events.update({
            where: {
                id: id
            },
            data: {
                start,
                end,
                title,
                description
            }
        })

        return NextResponse.json({ msg: "het is leven!!", resp })
    } catch (error) {
        log(error, "error occured")
        return NextResponse.json({ msg: "error occured!!" }, { status: 500 })
    } finally {
        prisma.$disconnect()
    }
}

export async function DELETE (req: Request) {
    try {
        const {id} = await req.json()
        // console.log(id, "id!!")
        await connectingDatabase()
        const resp = await prisma.events.delete({
            where: {
                id
            }
        })
        return NextResponse.json({ msg: "het is leven!!", id, resp })
    } catch (error) {
        log(error, "error occured")
        return NextResponse.json({ msg: "error occured!!" }, { status: 500 })
    }
}