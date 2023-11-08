import React, { useCallback, useEffect, useState } from 'react'
import { Calendar, Event, SlotInfo, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop, { EventInteractionArgs, withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop'
import "react-big-calendar/lib/css/react-big-calendar.css"
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import moment from 'moment'
import { useForTruthToggle } from '@/hooks/forComponents'
import { DialogModal, DialogModalForEditOrDelete, EventOptionsDropDown, ShowFullEventDetails } from './Utils'
import { v4 as uuidv4, v4 } from 'uuid';
import { useSession } from 'next-auth/react'
import { deleteUserEventDataInDb, fetchUserEventsDataFromDb, updateUserEventDataInDb } from '@/utils/dbRequests'
import { EventItemTypes } from '@/types'
import { useAppDispatch, useAppSelector } from '@/hooks/forRedux'
import { addToEventsData, initializeUserEventsData, updateSpecificEventData } from '@/redux/features/events/EventsSlice'


const DnDCalendar = withDragAndDrop(Calendar)

const localizer = momentLocalizer(moment)

// export type EventItemTypes = {
//     start: Date;
//     end: Date;
//     id: number | string;
//     title: string;
//     description: string;
//     recipes?: {
//         name: string,
//         imgSrc: string
//     }[],
//     user?: {
//         name: string,
//         email: string
//     }
// }

export const Scheduler = ({ open }: { open: boolean }) => {
    const [events, setEvents] = useState<EventItemTypes[]>([])

    const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

    const [slotData, setSlotData] = useState<SlotInfo>()

    const { handleFalsy: forDDFalsy, handleTruthy: forDDTruthy, isTrue: forDD } = useForTruthToggle()

    const { handleFalsy: handleForShowEventFalsy, handleTruthy: handleForShowEventTruthy, isTrue: forShowEvent } = useForTruthToggle()

    const [currentlyViewingEventId, setCurrentlyViewingEventId] = useState<string | number>(0)

    const dispatch = useAppDispatch()

    const eventsData = useAppSelector(state => state.events.list)

    // console.log(
    //     moment().toDate(), 
    //     eventsData[1]?.start, 
    //     moment(eventsData[1]?.start).toDate()
    // )

    const updateCurrentlyViewingEventChanges = (title: string, description: string) => {
        dispatch(updateSpecificEventData({id: currentlyViewingEventId, updatedData: {title, description}}))
        // const updatedEvents = events.map(item => {
        //     if (item.id === currentlyViewingEventId) {
        //         item.title = title ? title : item.title
        //         item.description = description ? description : item.description
        //     }
        //     return item
        // })
        // const foundItem = events.find(item => item.id === currentlyViewingEventId)
        // console.log("here!! update!!", title, description, currentlyViewingEventId, foundItem)
        // if((foundItem as EventItemTypes)?.user!.email) {
        //     if(!(foundItem?.title && foundItem?.description)) return
        //     foundItem.title = title
        //     foundItem.description = description
        //     console.log(foundItem, "updated found!!")
        //     updateUserEventDataInDb(foundItem as EventItemTypes)
        //     // updateUserEventDataInDb((event as EventItemTypes).user!.email, (event as EventItemTypes).user!.name)
        // }
        // setEvents(updatedEvents)
    }

    const handleRemoveFromList = () => {
        if (!events.length) return
        const filtered = events.filter(item => item.id !== currentlyViewingEventId)
        setEvents(filtered)
        deleteUserEventDataInDb(currentlyViewingEventId as string)
    }

    const handleAddToList = (data: EventItemTypes) => {
        setEvents(prev => [...prev, { ...data, id: v4() }])
        const eventItem = { ...data, id: v4() }
        dispatch(addToEventsData(eventItem))
    }

    const handleOnSelectEvent = (event: any | Event) => {
        setCurrentlyViewingEventId(event.id)

        handleForShowEventTruthy()
        // console.log(event.id)
    }

    const handleOnSelectSlot = (event: SlotInfo) => {
        setSlotData(event)

        handleTruthy()
    }

    const handleMoveEvent = (e: EventInteractionArgs<object>) => {
        const { end, event, start } = e;

        const foundIdx = events.findIndex(item => item === event)
        const updatedEvent: any = { ...event, end, start }

        const nextEvents: typeof events = [...events]
        nextEvents.splice(foundIdx, 1, updatedEvent)

        console.log(event, "event moved!!")
        if((event as EventItemTypes)?.user!.email) {
            dispatch(updateSpecificEventData({id: currentlyViewingEventId, updatedData: updatedEvent}))
            // updateUserEventDataInDb(updatedEvent as EventItemTypes)
            // updateUserEventDataInDb((event as EventItemTypes).user!.email, (event as EventItemTypes).user!.name)
        }

        setEvents(nextEvents)
    }

    const handleResizeEvent: withDragAndDropProps["onEventResize"] = (data) => {
        const { end, start, event } = data;

        const nextEvents: any = events.map(item => {
            return item.title === event.title ? { ...item, start, end } : item
        })

        if((event as EventItemTypes)?.user!.email) {
            const updatedEvent: any = { ...event, end, start }
            dispatch(updateSpecificEventData({id: currentlyViewingEventId}))
            updateUserEventDataInDb(updatedEvent as EventItemTypes)
            // updateUserEventDataInDb((event as EventItemTypes).user!.email, (event as EventItemTypes).user!.name)
        }

        console.log(event.title, event.resource, "event resized!!")

        setEvents(nextEvents)
    }

    const {status, data} = useSession()

    useEffect(() => {
        if(status === "authenticated") {
            fetchUserEventsDataFromDb(data.user?.email!, data.user?.name!).then(resp => {
            //    console.log(resp, "response!!")
               if(resp?.eventsData.length) {
                const modded = resp.eventsData.map((item:EventItemTypes) => {
                    if(item.end) {
                        item.end = moment(item.end).toDate()
                    }

                    if(item.start) {
                        item.start = moment(item.start).toDate()
                    }

                    return item
                })

                dispatch(initializeUserEventsData(modded))

                // dispatch(initializeUserEventsData(resp.eventsData))
               }
            })
        }
    }, [status])

    useEffect(() => {
        handleForShowEventFalsy()
    }, [forDD])

    // const eventsData = useAppSelector(state => state.events.list)
    useEffect(() => {
        // setEvents(prev => [...prev, eventsData])
        eventsData.length && setEvents(eventsData)
    }, [eventsData])

    // useEffect(() => {
    //     setEvents(ITEMS)
    // }, [])

    useEffect(() => {
        setEvents(ITEMS)
    }, [ITEMS])

    const getCurrentlyEditingItemIdx = () => {
        const foundItem = events.findIndex(item => item.id === currentlyViewingEventId)
        return foundItem
    }

    const eventPropGetter = useCallback(
        (event: any, start: any, end: any, isSelected: boolean) => ({
            ...(isSelected && {
                style: {
                    backgroundColor: '#000',
                },
            }),

            ...(event.title.includes('Cooking') && {
                style: {
                    backgroundColor: "green"
                }
            })
        }),
        []
    )

    const slotPropGetter = useCallback(
        (date: Date) => ({
            className: 'slotDefault',
            ...(moment(date).hour() < 8 && {
                style: {
                    backgroundColor: 'powderblue',
                    color: 'black',
                },
            }),
            ...(moment(date).hour() >= 8 && moment(date).hour() < 13 && {
                style: {
                    backgroundColor: 'darkcyan',
                    color: 'black',
                },
            }),
            ...(moment(date).hour() > 12 && {
                style: {
                    backgroundColor: 'cadetblue',
                    color: 'white',
                },
            }),
        }),
        []
    )

    const dayPropGetter = useCallback(
        (date: Date) => ({
            ...(moment(date).day() % 2 && {
                className: "oddDays"
            }),
            ...(moment(date).day() % 2 === 0 && {
                className: "evenDays"
            }),
            ...(((moment(date).day() === 5) || moment(date).day() === 6 || (moment(date).day() === 0)) && {
                style: {
                    backgroundColor: 'cadetblue',
                    color: 'red',
                },
            }),
        }),
        []
    )

    return (
        <div
            className={`transition-all duration-1000 ${open ? "h-[690px] xxs:w-64 sm:w-[26rem] md:w-[36rem] xl:w-[830px] scale-100" : "h-72 w-0 scale-0"}`}
        >
            <DnDCalendar
                localizer={localizer}
                events={events}
                // events={status === "authenticated" ? eventsData : events}
                // events={eventsData}
                selectable
                resizable
                onEventResize={handleResizeEvent}
                onEventDrop={handleMoveEvent}
                defaultView='month'
                defaultDate={new Date()}
                // showMultiDayTimes
                step={15}

                dayPropGetter={dayPropGetter}

                slotPropGetter={slotPropGetter}

                eventPropGetter={eventPropGetter}

                // onDropFromOutside={({ start, end, allDay }) => { console.log(start, end, "!!") }}

                components={{
                    event: props => (<EventOptionsDropDown remove={handleRemoveFromList} edit={forDDTruthy} {...props} />)
                }}

                onSelectEvent={handleOnSelectEvent}
                onSelectSlot={handleOnSelectSlot}
            />

            <DialogModal handleClose={handleFalsy} open={isTrue} slotData={slotData} handleAddToList={handleAddToList} />

            <DialogModalForEditOrDelete handleClose={forDDFalsy} open={forDD} handleRemoveFromList={handleRemoveFromList} handleEdit={updateCurrentlyViewingEventChanges} eventItem={events[getCurrentlyEditingItemIdx()]} />

            <ShowFullEventDetails isOpen={forShowEvent && !forDD} handleClose={handleForShowEventFalsy} eventItem={events[getCurrentlyEditingItemIdx()] || []} handleBeginEditing={forDDTruthy} handleRemoveFromList={handleRemoveFromList} />
        </div>
    )
}


export const ITEMS: EventItemTypes[] = [
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