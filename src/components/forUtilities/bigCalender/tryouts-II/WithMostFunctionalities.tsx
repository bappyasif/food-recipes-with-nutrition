import React, { useState } from 'react'
// import { ITEMS } from './WithDnd'
import { DialogModal, DialogModalForEditOrDelete, EventItemTypes, EventOptionsDropDown, ITEMS, localizer } from './WithoutDnd'
import { Calendar, SlotInfo } from 'react-big-calendar'
import { useForTruthToggle } from '@/hooks/forComponents'

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

import "react-big-calendar/lib/css/react-big-calendar.css";

import withDragAndDrop, { EventInteractionArgs, withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop';

const DragAndDropCalendar = withDragAndDrop(Calendar)

export const WithMostFunctionalities = () => {
    const [events, setEvents] = useState(ITEMS)

    const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

    const [slotData, setSlotData] = useState<SlotInfo>()

    const { handleFalsy: forDDFalsy, handleTruthy: forDDTruthy, isTrue: forDD } = useForTruthToggle()

    const [currnetlyViewingEventId, setCurrentlyViewingEventId] = useState(1)

    const updateCurrentlyViewingEventChanges = (title:string) => {
        const updatedEvents = events.map(item => item.id === currnetlyViewingEventId ? item.title = title : item)

        console.log("updated", updatedEvents)
    }

    const handleRemoveFromList = () => {
        const filtered = events.filter(item => item.id !== currnetlyViewingEventId)
        setEvents(filtered)
    }

    // const handleAddToList = (data: EventItemTypes) => setEvents(prev => [...prev, {...data, id: prev.length + 1}])
    const handleAddToList = (data: EventItemTypes) => setEvents(prev => [...prev, { ...data, id: prev.length + 1 }])

    const handleOnSelectEvent = (event: any) => {
        console.log(event.title, "!!", currnetlyViewingEventId)
        setCurrentlyViewingEventId(event.id)
        // forDDTruthy()
        // !currnetlyViewingEventId && forDDTruthy()
    }

    const handleOnSelectSlot = (event: SlotInfo) => {
        // console.log(event)
        setSlotData(event)

        handleTruthy()
    }

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

  return (
    <div>
        WithMostFunctionalities
        <DragAndDropCalendar
                localizer={localizer}
                events={events}
                selectable
                resizable
                onEventResize={handleResizeEvent}
                onEventDrop={handleMoveEvent}
                defaultView='month'
                defaultDate={new Date()}
                // defaultDate={new Date(2015, 3, 12)}
                // dragFromOutsideItem={handleDraggedFromOutside}
                // onDropFromOutside={handleDroppedFromOutside}
                onDropFromOutside={({ start, end, allDay }) => {console.log(start, end, "!!")}}

                components={{
                    event: props => (<EventOptionsDropDown remove={handleRemoveFromList} edit={forDDTruthy} {...props} />)
                  }}

                  step={2}
                // selectable={true}
                onSelectEvent={handleOnSelectEvent}
                onSelectSlot={handleOnSelectSlot}

                style={{
                    height: "40vh"
                }}
            />
        {/* <Calendar
                localizer={localizer}
                defaultView='month'
                defaultDate={new Date()}
                events={events}
                step={2}
                selectable={true}
                onSelectEvent={handleOnSelectEvent}
                onSelectSlot={handleOnSelectSlot}
                components={{
                    event: props => (<EventOptionsDropDown remove={handleRemoveFromList} edit={forDDTruthy} {...props} />)
                  }}
                style={{ height: "40vh" }}
            /> */}
            {
                isTrue
                    ? <DialogModal handleClose={handleFalsy} open={isTrue} slotData={slotData} handleAddToList={handleAddToList} />
                    : null
            }

            {
                forDD
                    ? <DialogModalForEditOrDelete handleClose={forDDFalsy} open={forDD} handleRemoveFromList={handleRemoveFromList} handleEdit={updateCurrentlyViewingEventChanges} />
                    : null
            }
    </div>
  )
}
