import { log } from "console"
import {PrismaClient} from "@prisma/client"

export const prisma = new PrismaClient()

export const connectingDatabase = async () => {
    try {
        await prisma.$connect()
    } catch (error) {
        log(error)
        throw new Error ("Database connection has failed....")
    }
}