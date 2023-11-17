import { AddedRecipesToEvent } from "@/email/AddedRecipesToEvent";
import { log } from "console";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_RESEND_API_KEY)

export const POST = async (req: NextRequest) => {
    try {
        const {email} = await req.json()

        const { data, error } = await resend.emails.send({
            from: 'Whats Cooking Yo!! App <onboarding@resend.dev>',
            // to: [email],
            // to: [email, "delivered@resend.dev"],
            // to: [email, "asifuzzamanbappy@gmail.com"],
            to: ["asifuzzamanbappy@gmail.com"],
            reply_to: "asifuzzamanbappy@gmail.com",
            subject: "New Event Added Successfully In Scheduler",
            react: AddedRecipesToEvent() as React.ReactElement
        });

        log('Message sent: %s', data?.id);

        if (data?.id) {
            return NextResponse.json({ msg: "message sent!!", msgId: data?.id, sent: true })
        } else {
            log(error)
            return NextResponse.json({ msg: "email failed", sent: false }, { status: 400 })
        }
    } catch (error) {
        log(error)
        return NextResponse.json({ message: "Server Error" }, { status: 500 })
    }

}