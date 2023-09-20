import moment from 'moment'
import React, { useState } from 'react'
import BigCalendar, { Calendar, momentLocalizer } from "react-big-calendar"
import withDragAndDrop, { EventInteractionArgs, withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop'

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

// BigCalendar.momentLocalizer(moment)

// const DragAndDropCalendar = withDragAndDrop(BigCalendar)

const localizer = momentLocalizer(moment)

const DragAndDropCalendar = withDragAndDrop(Calendar)

export const WithDnd = () => {
    const [events, setEvents] = useState(ITEMS)

    const handleMoveEvent = (e:EventInteractionArgs<object>) => {
        const {end, event, start} = e;

        const foundIdx = events.findIndex(item => item === event)
        const updatedEvent:any = {...event, end, start}

        const nextEvents: typeof events = [...events]
        nextEvents.splice(foundIdx, 1, updatedEvent)

        setEvents(nextEvents)
        // console.log("moving event", foundIdx, events[foundIdx].title)
    }

    const handleResizeEvent:withDragAndDropProps["onEventDrop"] = (data) => {
        const {end, start, event} = data;

        const nextEvents = events.map(item => {
            return item.id === event?.id ? {...item, start, end} : item
        })

        setEvents(nextEvents)

        console.log(event?.id, "!!", event)
    }

    // const handleResizeEvent:withDragAndDropProps["onEventResize"] = (data) => {
    //     const {end, start, isAllDay} = data;

    //     setEvents(currentEvents => {
    //         const firstEvent = {
    //             start: new Date(start),
    //             end: new Date(end),
    //             // allDay: isAllDay,
    //             // desc: undefined
    //         }

    //         return [...currentEvents, firstEvent]
    //     })
        
    //     console.log("resizing event", data)
    // }

    return (
        <div>
            WithDnd {events.length}
            <DragAndDropCalendar
                localizer={localizer}
                events={events}
                selectable
                resizable
                onEventResize={handleResizeEvent}
                onEventDrop={handleMoveEvent}
                defaultView='month'
                defaultDate={new Date(2015, 3, 12)}

                style={{
                    height: "40vh"
                }}
            />
        </div>
    )
}

const ITEMS = [
    {
        id: 0,
        title: "All Day Event very long title",
        allDay: true,
        start: new Date(2015, 3, 0),
        end: new Date(2015, 3, 1)
    }, {
        id: 1,
        title: "Long Event",
        start: new Date(2015, 3, 7),
        end: new Date(2015, 3, 10)
    }, {
        id: 2,
        title: "DTS STARTS",
        start: new Date(2016, 2, 13, 0, 0, 0),
        end: new Date(2016, 2, 20, 0, 0, 0)
    }, {
        id: 3,
        title: "DTS ENDS",
        start: new Date(2016, 10, 6, 0, 0, 0),
        end: new Date(2016, 10, 13, 0, 0, 0)
    }, {
        id: 4,
        title: "Some Event",
        start: new Date(2015, 3, 9, 0, 0, 0),
        end: new Date(2015, 3, 9, 0, 0, 0)
    }, {
        id: 5,
        title: "Conference",
        start: new Date(2015, 3, 11),
        end: new Date(2015, 3, 13),
        desc: "Big conference for important people"
    }, {
        id: 6,
        title: "Meeting",
        start: new Date(2015, 3, 12, 10, 30, 0, 0),
        end: new Date(2015, 3, 12, 12, 30, 0, 0),
        desc: "Pre-meeting meeting, to prepare for the meeting"
    }, {
        id: 7,
        title: "Lunch",
        start: new Date(2015, 3, 12, 12, 0, 0, 0),
        end: new Date(2015, 3, 12, 13, 0, 0, 0),
        desc: "Power lunch"
    }, {
        id: 8,
        title: "Meeting",
        start: new Date(2015, 3, 12, 14, 0, 0, 0),
        end: new Date(2015, 3, 12, 15, 0, 0, 0)
    }, {
        id: 9,
        title: "Happy Hour",
        start: new Date(2015, 3, 12, 17, 0, 0, 0),
        end: new Date(2015, 3, 12, 17, 30, 0, 0),
        desc: "Most important meal of the day"
    }, {
        id: 10,
        title: "Dinner",
        start: new Date(2015, 3, 12, 20, 0, 0, 0),
        end: new Date(2015, 3, 12, 21, 0, 0, 0)
    }, {
        id: 11,
        title: "Birthday Party",
        start: new Date(2015, 3, 13, 7, 0, 0),
        end: new Date(2015, 3, 13, 10, 30, 0)
    }, {
        id: 12,
        title: "Late Night Event",
        start: new Date(2015, 3, 17, 19, 30, 0),
        end: new Date(2015, 3, 18, 2, 0, 0)
    }, {
        id: 13,
        title: "Multi-day Event",
        start: new Date(2015, 3, 20, 19, 30, 0),
        end: new Date(2015, 3, 22, 2, 0, 0)
    }, {
        id: 14,
        title: "Today",
        start: new Date(new Date().setHours(new Date().getHours() - 3)),
        end: new Date(new Date().setHours(new Date().getHours() + 3))
    }
];
