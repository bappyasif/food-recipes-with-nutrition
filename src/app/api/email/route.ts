import { log } from "console";
import { NextRequest, NextResponse } from "next/server"

import nodemailer from 'nodemailer';

export const POST = async (req: NextRequest) => {

    const { email } = await req.json()

    try {
        if (email) {
            const transporter = nodemailer.createTransport({
                host: 'smtp.resend.com',
                secure: true,
                port: 465,
                auth: {
                    user: 'resend',
                    pass: process.env.NEXT_RESEND_API_KEY,
                },
            });

            const info = await transporter.sendMail({
                from: 'onboarding@resend.dev',
                // to: 'asifuzzamanbappy@gmail.com',
                to: email,
                replyTo: "asifuzzamanbappy@gmail.com",
                subject: 'Hello World',
                html: '<strong>!!It works!!</strong>'
            });

            log('Message sent: %s', info.messageId);

            if (info.messageId) {
                return NextResponse.json({ msg: "message sent!!", msgId: info.messageId, sent: true })
            } else {
                return NextResponse.json({ msg: "email failed", sent: false }, { status: 400 })
            }

        } else {
            return NextResponse.json({ msg: "email failed", sent: false }, { status: 400 })
        }

    } catch (error) {
        log(error)
        return NextResponse.json({ message: "Server Error" }, { status: 500 })
    }
}