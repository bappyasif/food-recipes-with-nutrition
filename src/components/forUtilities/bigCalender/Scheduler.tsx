import React, { useCallback, useEffect, useState } from 'react'
import { Calendar, Event, SlotInfo, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop, { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop'
import "react-big-calendar/lib/css/react-big-calendar.css"
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import moment from 'moment'
import { useForTruthToggle } from '@/hooks/forComponents'
import { DialogModal, DialogModalForEditOrDelete, EventOptionsDropDown, ShowFullEventDetails } from './Utils'
import { v4 as uuidv4, v4 } from 'uuid';
import { useSession } from 'next-auth/react'
import { addToSchedulerEvents, deleteUserEventDataInDb, fetchUserEventsDataFromDb, updateUserEventDataInDb } from '@/utils/dbRequests'
import { EventItemTypes } from '@/types'


const DnDCalendar = withDragAndDrop(Calendar)

const localizer = momentLocalizer(moment)

export const Scheduler = ({ open }: { open: boolean }) => {
    const [events, setEvents] = useState<EventItemTypes[]>([])

    const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

    const [slotData, setSlotData] = useState<SlotInfo>()

    const { handleFalsy: forDDFalsy, handleTruthy: forDDTruthy, isTrue: forDD } = useForTruthToggle()

    const { handleFalsy: handleForShowEventFalsy, handleTruthy: handleForShowEventTruthy, isTrue: forShowEvent } = useForTruthToggle()

    const [currentlyViewingEventId, setCurrentlyViewingEventId] = useState<string | number>(0)

    const { data: userData, status } = useSession()

    const updateCurrentlyViewingEventChanges = (title: string, description: string) => {
        const updatedEvents = events.map(item => {
            if (item.id === currentlyViewingEventId) {
                item.title = title ? title : item.title
                item.description = description ? description : item.description

                status === "authenticated" && updateUserEventDataInDb({ ...item })
            }
            return item
        })

        setEvents(updatedEvents)
    }

    // const handleRemoveFromList = (id?: string) => {
    //     if (!events.length) return

    //     // forDDFalsy()

    //     const filtered = events.filter(item => item.id !== currentlyViewingEventId)

    //     // const filtered = events.filter(item => item.id !== (id ? id : currentlyViewingEventId))
    //     // console.log(filtered, currentlyViewingEventId, id)
    //     if (status === "authenticated") {
    //         // deleteUserEventDataInDb(id ? id : currentlyViewingEventId as string)
    //         deleteUserEventDataInDb(currentlyViewingEventId as string)
    //         // handleFalsyForCC()
    //         // setCurrentlyViewingEventId(0)
    //     }
    //     setEvents(filtered)
    // }

    const handleRemoveFromList = () => {
        if (!events.length) return

        currentlyViewingEventId && handleRemove()

        // const filtered = events.filter(item => item.id !== currentlyViewingEventId)

        // // console.log(filtered, currentlyViewingEventId, id)
        // if (status === "authenticated" && currentlyViewingEventId) {
        //     deleteUserEventDataInDb(currentlyViewingEventId as string)
        //     setCurrentlyViewingEventId(0)
        // }

        // currentlyViewingEventId && setEvents(filtered)
    }

    const { handleFalsy: handleFalsyForCC, handleTruthy: handleTruthyForCC, isTrue: showCC } = useForTruthToggle()

    const deleteFromDDModal = (id: string) => {
        // forDDFalsy()
        handleTruthyForCC()
        // handleFalsyForCC()
        // handleForShowEventFalsy()

        // handleRemoveFromList(id)

        setCurrentlyViewingEventId(id)

        handleRemoveFromList()

        // console.log(currentlyViewingEventId, "idddd", id)

        // const filtered = events.filter(item => item.id !== id)

        // console.log(filtered, currentlyViewingEventId, id, events)

        // if (status === "authenticated") {
        //     deleteUserEventDataInDb(id ? id : currentlyViewingEventId as string)
        //     // deleteUserEventDataInDb(currentlyViewingEventId as string)
        //     // handleFalsyForCC()
        //     // setCurrentlyViewingEventId(0)
        // }

        // setEvents(filtered)

        // const userPrompt = prompt("Last chance to withdraw from deleting!! To delete press Y")

        // const regStr = /[y|Y]/

        // console.log(regStr.test(userPrompt!), "prompt!!", currentlyViewingEventId)

        // if(regStr.test(userPrompt!)) {
        //     handleRemoveFromList()
        // }
        // console.log("delete!!", forDD, showCC)
    }

    const handleRemove = () => {
        const filtered = events.filter(item => item.id !== currentlyViewingEventId)

            console.log(filtered, currentlyViewingEventId, events)

            if (status === "authenticated") {
                // deleteUserEventDataInDb(id ? id : currentlyViewingEventId as string)
                deleteUserEventDataInDb(currentlyViewingEventId as string)
                // handleFalsyForCC()
                setCurrentlyViewingEventId(0)
            }

            setEvents(filtered)
    }

    useEffect(() => {
        if (showCC && currentlyViewingEventId) {

            const userPrompt = prompt("Last chance to withdraw from deleting!! To delete press Y")

            const regStr = /[y|Y]/

            if(regStr.test(userPrompt!)) {
                handleRemove()
            }

            // handleRemove()

            // const filtered = events.filter(item => item.id !== currentlyViewingEventId)

            // console.log(filtered, currentlyViewingEventId, events)

            // if (status === "authenticated") {
            //     // deleteUserEventDataInDb(id ? id : currentlyViewingEventId as string)
            //     deleteUserEventDataInDb(currentlyViewingEventId as string)
            //     // handleFalsyForCC()
            //     setCurrentlyViewingEventId(0)
            // }

            // setEvents(filtered)

        }
    }, [showCC, currentlyViewingEventId])

    // useEffect(() => {
    //     if (showCC && currentlyViewingEventId) {
    //         const userPrompt = prompt("Last chance to withdraw from deleting!! To delete press Y")

    //         const regStr = /[y|Y]/

    //         console.log(showCC, currentlyViewingEventId, "!!!!")

    //         // console.log(regStr.test(userPrompt!), "prompt!!", currentlyViewingEventId)

    //         if (regStr.test(userPrompt!)) {
    //             handleRemoveFromList()
    //         }
    //     }
    // }, [showCC])

    // const editFromDDModal = () => {
    //     forDDTruthy()
    //     // handleTruthyForCC()
    //     handleFalsyForCC()
    //     console.log("edit!!", forDD, showCC)
    // }

    // const ddAction = () => {
    //     // forDDFalsy();
    //     // handleForShowEventFalsy()
    //     console.log("dd open!!")
    // }

    // console.log("check!!", forDD, showCC, forShowEvent)

    const handleAddToList = (data: EventItemTypes) => {
        const newEvent = { ...data, id: v4() }

        if (status === "authenticated") {
            newEvent.user = { email: userData?.user?.email as string, name: userData?.user?.name as string }

            addToSchedulerEvents(newEvent).then((newEventData: any) => {
                setEvents(prev => [...prev, newEventData])
            })
        } else {
            setEvents(prev => [...prev, newEvent])
        }
    }

    const handleOnSelectEvent = (event: any | Event) => {
        setCurrentlyViewingEventId(event.id)

        !showCC && handleForShowEventTruthy()

        showCC && handleFalsyForCC()

        // console.log(event?.id, "eventID!!")

        // console.log("slot clicked!!", showCC)

        // handleFalsyForCC()

        // forDDFalsy()
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

    const updateDataInDb = (updatedData: EventItemTypes) => {
        if (status === "authenticated") {
            const modded = events.map(item => {
                if (item.id === updatedData?.id || item.id === currentlyViewingEventId) {
                    item = { ...item, ...updatedData }
                    item.user?.email && updateUserEventDataInDb(item)
                }
                return item
            })

            setEvents(modded)
        }
    }

    const handleResizeEvent = (e: EventInteractionArgs<object>) => {
        const { start, end, event } = e

        const mt: any = event

        if (mt.id) {
            updateDataInDb({ ...mt, start, end })
        }
    }

    const getUserEventsData = () => {
        if (status === "authenticated") {
            fetchUserEventsDataFromDb(userData.user?.email!, userData.user?.name!)
                .then(resp => {
                    if (resp?.eventsData.length) {
                        const modded = resp.eventsData.map((item: any) => {
                            if (item.end) {
                                item.end = moment(item.end).toDate()
                            }

                            if (item.start) {
                                item.start = moment(item.start).toDate()
                            }

                            item.recipes = item.recipes.data

                            return item
                        })

                        setEvents(modded)
                    }
                })
        }
    }

    useEffect(() => {
        status === "authenticated" && getUserEventsData()
    }, [status])

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
                    event: props => (<EventOptionsDropDown
                        // remove={handleRemoveFromList} 
                        remove={deleteFromDDModal}
                        edit={forDDTruthy}
                        // edit={editFromDDModal} 
                        {...props}
                    // closeED={ddAction} 
                    // afterOpen={forShowEvent}
                    />)
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