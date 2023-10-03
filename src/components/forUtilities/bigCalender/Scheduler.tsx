import React, { useMemo, useState } from 'react'
import { Calendar, SlotInfo, Views, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop, { EventInteractionArgs, withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop'
import "react-big-calendar/lib/css/react-big-calendar.css"
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import moment from 'moment'
// import events from './tryouts-I/events'
import { useForTruthToggle } from '@/hooks/forComponents'
import { DialogModal, DialogModalForEditOrDelete, EventOptionsDropDown } from './Utils'
// import events from './events'


const DnDCalendar = withDragAndDrop(Calendar)

const localizer = momentLocalizer(moment)

type ViewsType = { MONTH: "month"; WEEK: "week"; WORK_WEEK: "work_week"; DAY: "day"; AGENDA: "agenda"; }

type EventItemTypes = {
    start: Date;
    end: Date;
    id: number;
    title: string;
    description: string;
}

export const Scheduler = () => {
    const [events, setEvents] = useState(ITEMS)

    const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

    const [slotData, setSlotData] = useState<SlotInfo>()

    const { handleFalsy: forDDFalsy, handleTruthy: forDDTruthy, isTrue: forDD } = useForTruthToggle()

    const [currnetlyViewingEventId, setCurrentlyViewingEventId] = useState(1)

    const updateCurrentlyViewingEventChanges = (title: string) => {
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

    const handleMoveEvent = (e: EventInteractionArgs<object>) => {
        const { end, event, start } = e;

        const foundIdx = events.findIndex(item => item === event)
        const updatedEvent: any = { ...event, end, start }

        const nextEvents: typeof events = [...events]
        nextEvents.splice(foundIdx, 1, updatedEvent)

        setEvents(nextEvents)
        // console.log("moving event", foundIdx, events[foundIdx].title)
    }

    const handleResizeEvent: withDragAndDropProps["onEventResize"] = (data) => {
        const { end, start, event } = data;

        const nextEvents = events.map(item => {
            return item.id === event?.id ? { ...item, start, end } : item
        })

        setEvents(nextEvents)

        console.log(event?.id, "!!", event)
    }

    // const { defaultDate, views } = useMemo(
    //     () => ({
    //         //   components: {
    //         //     timeSlotWrapper: ColoredDateCellWrapper,
    //         //   },
    //         defaultDate: new Date(2015, 3, 1),
    //         //   max: dates.add(dates.endOf(new Date(2015, 17, 1), 'day'), -1, 'hours'),
    //         views: Object.keys(Views).map((k) => Views[k as keyof ViewsType]),
    //     }),
    //     []
    // )

    return (
        <div className='h-80 w-[560px]'>
            <DnDCalendar
                localizer={localizer}
                // startAccessor={() => moment()}
                // endAccessor="end"
                events={events}
                selectable
                resizable
                onEventResize={handleResizeEvent}
                onEventDrop={handleMoveEvent}
                defaultView='month'
                defaultDate={new Date()}
                showMultiDayTimes
                step={15}
                // views={views}
                // defaultDate={defaultDate}
                // defaultView='day'
                // views={Views.MONTH}
                onDropFromOutside={({ start, end, allDay }) => { console.log(start, end, "!!") }}

                components={{
                    event: props => (<EventOptionsDropDown remove={handleRemoveFromList} edit={forDDTruthy} {...props} />)
                }}
                onSelectEvent={handleOnSelectEvent}
                onSelectSlot={handleOnSelectSlot}
            />

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


const ITEMS = [
    {
        start: moment().toDate(),
        end: moment().add(1, "days").toDate(),
        id: 1,
        title: "bees bees",
        description: "go gogogogoogog"
    }
]