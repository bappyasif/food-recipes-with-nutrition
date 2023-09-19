import moment from 'moment'
import React from 'react'
import {Calendar, momentLocalizer} from "react-big-calendar"

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const events = [
    {
        start: moment().toDate(),
        end: moment().add(0, "days").toDate(),
        title: "Bees bees"
    },
    {
        start: moment().add(1, "days").toDate(),
        end: moment().add(2, "day").toDate(),
        title: "Bees bees - II"
    }
]

export const MostBasic = () => {
  return (
    <div>
        MostBasic
        <Calendar 
            localizer={localizer}
            defaultDate={new Date()}
            defaultView='month'
            events={events}
            style={{height: "40vh"}}
        />
    </div>
  )
}
