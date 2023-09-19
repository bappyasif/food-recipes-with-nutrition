import React, { useState } from 'react'
import eventsList from "./events"
import moment from 'moment';
import { CalendarProps, momentLocalizer } from 'react-big-calendar';
// import BigCalendar from "react-big-calendar"
import {Calendar} from "react-big-calendar"
import withDragAndDrop, {
    withDragAndDropProps,
  } from "react-big-calendar/lib/addons/dragAndDrop";

const DnDBigCalendar = withDragAndDrop(Calendar);
type DnDType = CalendarProps & withDragAndDropProps;
type CustomCalendarProps = Omit<DnDType, "components" | "localizer">;

export const DndCalender = () => {
    const [events, setEvents] = useState(eventsList);

    const localizer = momentLocalizer(moment);

    const handleEventDrop = ({ event, start, end, allDay }: {event:any, start: any, end: any, allDay: any}) => {
        const idx = events.indexOf(event);
        const updatedEvent = { ...event, start, end };
    
        const nextEvents = [...events];
        nextEvents.splice(idx, 1, updatedEvent);
    
        setEvents(nextEvents);
      };
    
      const handleEventResize = ({ event, start, end, allDay }: {event:any, start: any, end: any, allDay: any}) => {
        const nextEvents = events.map((existingEvent) => {
          return existingEvent.id === event.id
            ? { ...existingEvent, start, end }
            : existingEvent;
        });
        setEvents(nextEvents);
      };

  return (
    <div>
        DndCalender - {events.length}
        <DndBigCalender events={events} handleEventDrop={handleEventDrop} handleEventResize={handleEventResize} localizer={localizer} />
    </div>
  )
}


const DndBigCalender = ({localizer, events, handleEventDrop, handleEventResize}: {localizer:any, events:any, handleEventDrop:any, handleEventResize:any}) => (
    <DnDBigCalendar
      localizer={localizer}
    //   step={}
      timeslots={2}
      events={events}
    //   messages={{
    //     next: "अगला",
    //     previous: "पिछला",
    //     today: "आज",
    //     month: "महीना",
    //     week: "सप्ताह",
    //     day: "दिन",
    //     agenda: "कार्यसूची",
    //     date: "तारीख",
    //     time: "समय",
    //     event: "घटना"
    //   }}
      onEventDrop={handleEventDrop}
      onEventResize={handleEventResize}
      resizable
      selectable
    />
)