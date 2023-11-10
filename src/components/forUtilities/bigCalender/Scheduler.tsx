import React, { useCallback, useEffect, useState } from 'react'
import { Calendar, Event, SlotInfo, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop, { EventInteractionArgs, OnDragStartArgs, withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop'
import "react-big-calendar/lib/css/react-big-calendar.css"
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import moment from 'moment'
import { useForTruthToggle } from '@/hooks/forComponents'
import { DialogModal, DialogModalForEditOrDelete, EventOptionsDropDown, ShowFullEventDetails } from './Utils'
import { v4 as uuidv4, v4 } from 'uuid';
import { useSession } from 'next-auth/react'
import { addToSchedulerEvents, deleteUserEventDataInDb, fetchUserEventsDataFromDb, updateUserEventDataInDb } from '@/utils/dbRequests'
import { EventItemTypes } from '@/types'
import { useAppDispatch, useAppSelector } from '@/hooks/forRedux'
import { addToEventsData, deleteFromEventsData, initializeUserEventsData, updateSpecificEventData } from '@/redux/features/events/EventsSlice'


const DnDCalendar = withDragAndDrop(Calendar)

const localizer = momentLocalizer(moment)

export const Scheduler = ({ open }: { open: boolean }) => {
    const [events, setEvents] = useState<EventItemTypes[]>([])

    const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

    const [slotData, setSlotData] = useState<SlotInfo>()

    const { handleFalsy: forDDFalsy, handleTruthy: forDDTruthy, isTrue: forDD } = useForTruthToggle()

    const { handleFalsy: handleForShowEventFalsy, handleTruthy: handleForShowEventTruthy, isTrue: forShowEvent } = useForTruthToggle()

    const [currentlyViewingEventId, setCurrentlyViewingEventId] = useState<string | number>(0)

    const eventsData = useAppSelector(state => state.events.list)

    const {data:userData, status} = useSession()

    const dispatch = useAppDispatch()
    
    const updateCurrentlyViewingEventChanges = (title: string, description: string) => {
        const updatedEvents = events.map(item => {
            if (item.id === currentlyViewingEventId) {
                item.title = title ? title : item.title
                item.description = description ? description : item.description

                status === "authenticated" && updateUserEventDataInDb({...item})
            }
            return item
        })

        setEvents(updatedEvents)
    }

    const handleRemoveFromList = () => {
        if (!events.length) return
        const filtered = events.filter(item => item.id !== currentlyViewingEventId)
        if(status === "authenticated") {
            deleteUserEventDataInDb(currentlyViewingEventId as string)
        }
        setEvents(filtered)
    }

    const handleAddToList = (data: EventItemTypes) => {
        const newEvent = { ...data, id: v4() }
        setEvents(prev => [...prev, newEvent])
        
        if(status === "authenticated") {
            newEvent.user = { email: userData?.user?.email as string, name: userData?.user?.name as string }

            addToSchedulerEvents(newEvent)
            console.log("data added!!", newEvent)
        }
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

        status === "authenticated" && updateUserEventDataInDb(updatedEvent)

        setEvents(nextEvents)
    }

    const updateDataInDb = (updatedData:EventItemTypes) => {
        if(status === "authenticated") {
            const modded = events.map(item => {
                if(item.id === updatedData?.id || item.id === currentlyViewingEventId) {
                    item = {...item, ...updatedData}
                    item.user?.email && updateUserEventDataInDb(item)
                }
                return item
            })

            setEvents(modded)
        }
    }

    const handleResizeEvent = (e: EventInteractionArgs<object>) => {
        const {start, end, event} = e
        const mt:any = event
        if(mt.id) {
            updateDataInDb({...mt, start, end}) 
        }
        // if(!event?.id) return
        // console.log(event, "event!!", currentlyViewingEventId, ...mt)
        // updateDataInDb({...event, start, end})
    }

    // const handleResizeEvent: withDragAndDropProps["onEventResize"] = (data) => {
    //     const { end, start, event } = data;

    //     console.log(data, "data!!", currentlyViewingEventId)

    //     // updateDataInDb(data)

    //     // const nextEvents: any = events.map(item => {
    //     //     return item.title === event.title ? { ...item, start, end } : item
    //     // })

    //     // setEvents(nextEvents)
    // }

    const getUserEventsData = () => {
        if (status === "authenticated") {
            fetchUserEventsDataFromDb(userData.user?.email!, userData.user?.name!).then(resp => {
                // console.log(resp, "response!!")
                if (resp?.eventsData.length) {
                    const modded = resp.eventsData.map((item: EventItemTypes) => {
                        if (item.end) {
                            item.end = moment(item.end).toDate()
                        }

                        if (item.start) {
                            item.start = moment(item.start).toDate()
                        }

                        return item
                    })

                    console.log(modded, "modded!! loading!!")

                    setEvents(modded)

                    // dispatch(initializeUserEventsData(modded))

                    // dispatch(initializeUserEventsData(resp.eventsData))
                }
            })
        }
    }

    useEffect(() => {
        status === "authenticated" && getUserEventsData()
    }, [status])
    
    // useEffect(() => {
    //     eventsData.length && setEvents(eventsData)
    // }, [eventsData])

    useEffect(() => {
        handleForShowEventFalsy()
    }, [forDD])

    useEffect(() => {
        setEvents(ITEMS)
    }, [])

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

            ...(event.title.includes('Meeting') && {
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
                // events={eventsData}
                selectable
                resizable
                onEventResize={handleResizeEvent}
                onEventDrop={handleMoveEvent}
                defaultView='month'
                defaultDate={new Date()}
                showMultiDayTimes
                step={15}

                dayPropGetter={dayPropGetter}

                slotPropGetter={slotPropGetter}

                eventPropGetter={eventPropGetter}

                onDropFromOutside={({ start, end, allDay }) => { console.log(start, end, "!!") }}

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

const ITEMS: EventItemTypes[] = [
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


// export const Scheduler = ({ open }: { open: boolean }) => {

//     const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

//     const [slotData, setSlotData] = useState<SlotInfo>()

//     const { handleFalsy: forDDFalsy, handleTruthy: forDDTruthy, isTrue: forDD } = useForTruthToggle()

//     const { handleFalsy: handleForShowEventFalsy, handleTruthy: handleForShowEventTruthy, isTrue: forShowEvent } = useForTruthToggle()

//     const [currentlyViewingEventId, setCurrentlyViewingEventId] = useState<string | number>(0)

//     const { status, data } = useSession()

//     const dispatch = useAppDispatch()

//     const eventsData = useAppSelector(state => state.events.list)

//     const updateCurrentlyViewingEventChanges = (title: string, description: string) => {
//         dispatch(updateSpecificEventData({ id: currentlyViewingEventId, updatedData: { title, description } }))
//     }

//     const handleRemoveFromList = () => {
//         if (!eventsData.length) return
//         dispatch(deleteFromEventsData({ id: currentlyViewingEventId }))
//     }

//     const handleAddToList = (eventData: EventItemTypes) => {
//         // so that when an event is created by authenticated user we're keeping a trail of it for db to update accordingly otherwise it wont be stored in db
//         if (data?.user?.email) {
//             eventData.user = {
//                 email: data?.user.email,
//                 name: data?.user.name!
//             }
//         }

//         const eventItem = { ...eventData, id: v4() }
//         // console.log(eventItem, "eventItem!!")
//         dispatch(addToEventsData(eventItem))
//     }

//     const handleOnSelectEvent = (event: any | Event) => {
//         setCurrentlyViewingEventId(event.id)

//         handleForShowEventTruthy()
//     }

//     const handleOnSelectSlot = (event: SlotInfo) => {
//         setSlotData(event)

//         handleTruthy()
//     }

//     const handleMoveEventStart = (e: OnDragStartArgs<object>) => console.log("here!!", e.event)

//     const handleMoveEvent = (e: EventInteractionArgs<object>) => {
//         const { end, event, start } = e;

//         const updatedEvent: any = { ...event, end, start }

//         dispatch(updateSpecificEventData({ id: currentlyViewingEventId, updatedData: updatedEvent }))
//     }

//     const handleResizeEvent: withDragAndDropProps["onEventResize"] = (data) => {
//         const { end, start, event } = data;

//         const updatedEvent: any = { ...event, end, start }
        
//         dispatch(updateSpecificEventData({ id: currentlyViewingEventId, updatedData: updatedEvent }))
//     }

//     useEffect(() => {
//         if (status === "authenticated") {
//             fetchUserEventsDataFromDb(data.user?.email!, data.user?.name!).then(resp => {
//                 //    console.log(resp, "response!!")
//                 if (resp?.eventsData.length) {
//                     const modded = resp.eventsData.map((item: EventItemTypes) => {
//                         if (item.end) {
//                             item.end = moment(item.end).toDate()
//                         }

//                         if (item.start) {
//                             item.start = moment(item.start).toDate()
//                         }

//                         return item
//                     })

//                     dispatch(initializeUserEventsData(modded))

//                     // dispatch(initializeUserEventsData(resp.eventsData))
//                 }
//             })
//         }
//     }, [status])

//     useEffect(() => {
//         handleForShowEventFalsy()
//     }, [forDD])

//     const getCurrentlyEditingItemIdx = () => {
//         const foundItem = eventsData.findIndex(item => item.id === currentlyViewingEventId)
//         return foundItem
//     }

//     const eventPropGetter = useCallback(
//         (event: any, start: any, end: any, isSelected: boolean) => ({
//             ...(isSelected && {
//                 style: {
//                     backgroundColor: '#000',
//                 },
//             }),

//             ...(event.title.includes('Cooking') && {
//                 style: {
//                     backgroundColor: "green"
//                 }
//             })
//         }),
//         []
//     )

//     const slotPropGetter = useCallback(
//         (date: Date) => ({
//             className: 'slotDefault',
//             ...(moment(date).hour() < 8 && {
//                 style: {
//                     backgroundColor: 'powderblue',
//                     color: 'black',
//                 },
//             }),
//             ...(moment(date).hour() >= 8 && moment(date).hour() < 13 && {
//                 style: {
//                     backgroundColor: 'darkcyan',
//                     color: 'black',
//                 },
//             }),
//             ...(moment(date).hour() > 12 && {
//                 style: {
//                     backgroundColor: 'cadetblue',
//                     color: 'white',
//                 },
//             }),
//         }),
//         []
//     )

//     const dayPropGetter = useCallback(
//         (date: Date) => ({
//             ...(moment(date).day() % 2 && {
//                 className: "oddDays"
//             }),
//             ...(moment(date).day() % 2 === 0 && {
//                 className: "evenDays"
//             }),
//             ...(((moment(date).day() === 5) || moment(date).day() === 6 || (moment(date).day() === 0)) && {
//                 style: {
//                     backgroundColor: 'cadetblue',
//                     color: 'red',
//                 },
//             }),
//         }),
//         []
//     )

//     console.log(eventsData, "events data!!")

//     return (
//         <div
//             className={`transition-all duration-1000 ${open ? "h-[690px] xxs:w-64 sm:w-[26rem] md:w-[36rem] xl:w-[830px] scale-100" : "h-72 w-0 scale-0"}`}
//         >
//             <DnDCalendar
//                 localizer={localizer}
//                 events={eventsData}
//                 selectable
//                 resizable
//                 onSelectEvent={handleOnSelectEvent}
//                 onSelectSlot={handleOnSelectSlot}
//                 onDragOver={() => console.log("drag over")}
//                 onEventResize={handleResizeEvent}
//                 onEventDrop={handleMoveEvent}
//                 // onDragStart={handleMoveEventStart}
//                 // handleDragStart={handleMoveEventStart}
//                 defaultView='month'
//                 defaultDate={new Date()}
//                 // showMultiDayTimes
//                 step={15}

//                 dayPropGetter={dayPropGetter}

//                 slotPropGetter={slotPropGetter}

//                 eventPropGetter={eventPropGetter}

//                 components={{
//                     event: props => (<EventOptionsDropDown remove={handleRemoveFromList} edit={forDDTruthy} {...props} />)
//                 }}
//             />

//             <DialogModal handleClose={handleFalsy} open={isTrue} slotData={slotData} handleAddToList={handleAddToList} />

//             <DialogModalForEditOrDelete handleClose={forDDFalsy} open={forDD} handleRemoveFromList={handleRemoveFromList} handleEdit={updateCurrentlyViewingEventChanges} eventItem={eventsData[getCurrentlyEditingItemIdx()]} />

//             <ShowFullEventDetails isOpen={forShowEvent && !forDD} handleClose={handleForShowEventFalsy} eventItem={eventsData[getCurrentlyEditingItemIdx()] || []} handleBeginEditing={forDDTruthy} handleRemoveFromList={handleRemoveFromList} />
//         </div>
//     )
// }