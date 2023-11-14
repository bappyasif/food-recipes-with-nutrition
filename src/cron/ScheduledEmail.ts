"use server"

import cron from "node-cron"

const task = cron.schedule("*****", () => {
    console.log("run this per muinite")
})

task.start()