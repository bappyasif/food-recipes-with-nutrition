"use client"

import React, { useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import eventsList from "./events"
import "react-big-calendar/lib/css/react-big-calendar.css";
// import 'react-big-calendar/lib/addons/dragAndDrop/styles'; // if using Dnd
import styles from "./Calender.module.css"
import "./styles.css"
import { DndCalender } from './DndCalender'

export const Scheduler = () => {
    return (
        <div>
            Scheduler
            <DndCalender />
            {/* <MyCalendar /> */}
        </div>
    )
}

const localizer = momentLocalizer(moment)

const MyCalendar = () => (

    <div>
        <Calendar
            // className={`${styles["rbc-header"]}`}
            localizer={localizer}
            events={eventsList}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
        />
    </div>
)