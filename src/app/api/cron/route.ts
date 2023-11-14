import { log } from "console";
import { NextRequest, NextResponse } from "next/server";
import cron from "node-cron"

export const POST = async (req: NextRequest) => {
    try {
        // const scheduledTask = cron.schedule("*****", () => {
        //     console.log("run this per minute")
        // })

        // scheduledTask.start();
        var task = cron.schedule('* * * * *', () =>  {
            console.log('will execute every minute until stopped');
            
            // setTimeout(() => {
            //     task.stop();
            //     log("scrton stopped!!")
            //   }, 20000)
          });

          task.stop();
          
        //   setTimeout(() => {
        //     task.stop();
        //   }, 2000)

          return NextResponse.json({ msg: "cron successfull!!" })

    } catch (error) {
        log(error)
        return NextResponse.json({ message: "Server Error" }, { status: 500 })
    }
}