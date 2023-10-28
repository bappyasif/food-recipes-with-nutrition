import { NextResponse } from "next/server"

export const GET = async (req: Request) => {
    NextResponse.json({msg: "get alive!!"})
}