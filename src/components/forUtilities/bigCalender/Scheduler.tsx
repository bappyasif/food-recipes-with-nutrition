import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Calendar, Event, SlotInfo, Views, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop, { EventInteractionArgs, withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop'
import "react-big-calendar/lib/css/react-big-calendar.css"
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import moment from 'moment'
// import events from './tryouts-I/events'
import { useForTruthToggle } from '@/hooks/forComponents'
import { DialogModal, DialogModalForEditOrDelete, EventOptionsDropDown } from './Utils'
// import events from './events'
import { v4 as uuidv4, v4 } from 'uuid';


const DnDCalendar = withDragAndDrop(Calendar)

const localizer = momentLocalizer(moment)

type ViewsType = { MONTH: "month"; WEEK: "week"; WORK_WEEK: "work_week"; DAY: "day"; AGENDA: "agenda"; }

const allViews = Object.keys(Views).map(k => k);

export type EventItemTypes = {
    start: Date;
    end: Date;
    id: number | string;
    title: string;
    description: string;
    recipes?: {
        name: string,
        imgSrc: string
    }[]
    // cooking?: {
    //     name: string,
    //     recipes: string[]
    // }
}

export const Scheduler = ({open}: {open: boolean}) => {
    // const [events, setEvents] = useState<typeof ITEMS>([])
    const [events, setEvents] = useState<EventItemTypes[]>([])

    const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

    const [slotData, setSlotData] = useState<SlotInfo>()

    const { handleFalsy: forDDFalsy, handleTruthy: forDDTruthy, isTrue: forDD } = useForTruthToggle()

    const [currentlyViewingEventId, setCurrentlyViewingEventId] = useState<string | number>(0)

    const updateCurrentlyViewingEventChanges = (title: string, description: string) => {
        // const updatedEvents = events.map(item => item.id === currentlyViewingEventId ? item.title = title : item)

        const updatedEvents = events.map(item => {
            if(item.id === currentlyViewingEventId) {
                item.title = title ? title : item.title
                item.description = description ? description : item.description
            }
            return item
        })

        // console.log("updated", updatedEvents)
    }

    const handleRemoveFromList = () => {
        if (!events.length) return
        const filtered = events.filter(item => item.id !== currentlyViewingEventId)
        // console.log(filtered, "filtered", events, currentlyViewingEventId, slotData)
        setEvents(filtered)
    }

    // const handleAddToList = (data: EventItemTypes) => setEvents(prev => [...prev, {...data, id: prev.length + 1}])
    const handleAddToList = (data: EventItemTypes) => {
        setEvents(prev => [...prev, { ...data, id: v4() }])
        // setEvents(prev => [...prev, { ...data, id: prev.length + 1 }])
        // console.log(events, "added!!")
    }

    const handleOnSelectEvent = (event: any | Event) => {
        // if(ref.current) {
        //     console.log(ref.current.defaultView, "!!")
        // }
        // console.log(event.title, "!!", currentlyViewingEventId, event.id, events)
        setCurrentlyViewingEventId(event.id)
        // forDDTruthy()
        // console.log(forDD, "dd")
        console.log(event.id)
        // !forDD && currentlyViewingEventId && forDDTruthy()
    }

    const handleOnSelectSlot = (event: SlotInfo) => {
        // console.log(event, "from select!!")
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

        const nextEvents: any = events.map(item => {
            return item.title === event.title ? { ...item, start, end } : item
            // return item.id === event.id ? { ...item, start, end } : item
        })

        setEvents(nextEvents)

        // console.log(event?.id, "!!", event)
    }

    useEffect(() => {
        setEvents(ITEMS)
    }, [])

    useEffect(() => {
        setEvents(ITEMS)
    }, [ITEMS])

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
    // const ref = useRef<typeof DnDCalendar | undefined>(null)

    // console.log(allViews, "allViews!!")

    const getCurrentlyEditingItemIdx = () => {
        const foundItem = events.findIndex(item => item.id === currentlyViewingEventId)
        return foundItem
    }

    // console.log(events, "events!!")

    return (
        <div 
            // className={`transition-all duration-1000 ${open ? "h-[690px] xxs:w-64 sm:w-[26rem] md:w-[36rem] xl:w-[830px]" : "h-72 w-[830px]"}`}
            className={`transition-all duration-1000 ${open ? "h-[690px] xxs:w-64 sm:w-[26rem] md:w-[36rem] xl:w-[830px] scale-100" : "h-72 w-0 scale-0"}`}
        >
            <DnDCalendar
                // ref={ref}
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
                // view='week'
                // views={allViews}
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
                    ? <DialogModalForEditOrDelete handleClose={forDDFalsy} open={forDD} handleRemoveFromList={handleRemoveFromList} handleEdit={updateCurrentlyViewingEventChanges} eventItem={events[getCurrentlyEditingItemIdx()]} />
                    : null
            }
        </div>
    )
}


export const ITEMS:EventItemTypes[] = [
    {
        start: moment().toDate(),
        end: moment().add(1, "days").toDate(),
        id: 1,
        // id: v4(),
        title: "bees bees",
        description: "go gogogogoogog"
    },
    {
        start: moment().toDate(),
        end: moment().add(1, "days").toDate(),
        id: 2,
        // id: v4(),
        title: "bees bees- II",
        description: "go gogogogoogog"
    },
    {
        start: moment().toDate(),
        end: moment().add(1, "hour").toDate(),
        id: 3,
        // id: v4(),
        title: "bees bees - III",
        description: "go gogogogoogog"
    },
    {
        start: moment().toDate(),
        end: moment().add(2, "hour").toDate(),
        id: 4,
        // id: v4(),
        title: "bees bees - IV",
        description: "go gogogogoogog"
    }
]