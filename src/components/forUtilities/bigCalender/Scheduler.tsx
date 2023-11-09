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
import { fetchUserEventsDataFromDb } from '@/utils/dbRequests'
import { EventItemTypes } from '@/types'
import { useAppDispatch, useAppSelector } from '@/hooks/forRedux'
import { ITEMS, addToEventsData, deleteFromEventsData, initializeUserEventsData, updateSpecificEventData } from '@/redux/features/events/EventsSlice'


// const DnDCalendar = withDragAndDrop(Calendar)
const DnDCalendar = withDragAndDrop<EventItemTypes>(Calendar)
// withDragAndDrop<EventItem>(BigCalendar)

const localizer = momentLocalizer(moment)


export const Scheduler = ({ open }: { open: boolean }) => {

    const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

    const [slotData, setSlotData] = useState<SlotInfo>()

    const { handleFalsy: forDDFalsy, handleTruthy: forDDTruthy, isTrue: forDD } = useForTruthToggle()

    const { handleFalsy: handleForShowEventFalsy, handleTruthy: handleForShowEventTruthy, isTrue: forShowEvent } = useForTruthToggle()

    const [currentlyViewingEventId, setCurrentlyViewingEventId] = useState<string | number>(0)

    const { data } = useSession()

    const dispatch = useAppDispatch()

    const eventsData = useAppSelector(state => state.events.list)

    const updateCurrentlyViewingEventChanges = (title: string, description: string) => {
        dispatch(updateSpecificEventData({ id: currentlyViewingEventId, updatedData: { title, description } }))
    }

    const handleRemoveFromList = () => {
        if (!eventsData.length) return
        dispatch(deleteFromEventsData({ id: currentlyViewingEventId }))
    }

    const handleAddToList = (eventData: EventItemTypes) => {
        // so that when an event is created by authenticated user we're keeping a trail of it for db to update accordingly otherwise it wont be stored in db
        if (data?.user?.email) {
            eventData.user = {
                email: data?.user.email,
                name: data?.user.name!
            }
        }

        const eventItem = { ...eventData, id: v4() }
        // console.log(eventItem, "eventItem!!")
        dispatch(addToEventsData(eventItem))
    }

    const handleOnSelectEvent = (event: any | Event) => {
        setCurrentlyViewingEventId(event.id)

        handleForShowEventTruthy()
    }

    const handleOnSelectSlot = (event: SlotInfo) => {
        setSlotData(event)

        handleTruthy()
    }

    const handleMoveEventStart = (e: OnDragStartArgs<object>) => console.log("here!!", e.event)

    // const handleMoveEvent = (e: EventInteractionArgs<object>) => {
    //     const { end, event, start } = e;

    //     const updatedEvent: any = { ...event, end, start }

    //     dispatch(updateSpecificEventData({ id: currentlyViewingEventId, updatedData: updatedEvent }))
    // }

    const handleEventMove: withDragAndDropProps["onEventDrop"] = data => {
        const { end, event, start } = data;

        console.log(event, "event!!")

        // const updatedEvent: any = { ...event., end, start }

        // dispatch(updateSpecificEventData({ id: currentlyViewingEventId, updatedData: updatedEvent }))
    }

    const handleResizeEvent: withDragAndDropProps["onEventResize"] = (data) => {
        const { end, start, event } = data;

        const updatedEvent: any = { ...event, end, start }

        dispatch(updateSpecificEventData({ id: currentlyViewingEventId, updatedData: updatedEvent }))
    }

    useEffect(() => {
        handleForShowEventFalsy()
    }, [forDD])

    const getCurrentlyEditingItemIdx = () => {
        const foundItem = eventsData.findIndex(item => item.id === currentlyViewingEventId)
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

    console.log(eventsData, "events data!!")

    return (
        <div
            className={`transition-all duration-1000 ${open ? "h-[690px] xxs:w-64 sm:w-[26rem] md:w-[36rem] xl:w-[830px] scale-100" : "h-72 w-0 scale-0"}`}
        >
            <DnDCalendar
                localizer={localizer}
                // events={eventsData}
                events={ITEMS}
                selectable
                resizable
                onSelectEvent={handleOnSelectEvent}
                onSelectSlot={handleOnSelectSlot}
                onEventResize={handleResizeEvent}
                onEventDrop={handleEventMove}
                defaultView='month'
                defaultDate={new Date()}
                showMultiDayTimes
                step={15}

                dayPropGetter={dayPropGetter}

                slotPropGetter={slotPropGetter}

                eventPropGetter={eventPropGetter}

                components={{
                    event: props => (<EventOptionsDropDown remove={handleRemoveFromList} edit={forDDTruthy} {...props} />)
                }}
            />

            <DialogModal handleClose={handleFalsy} open={isTrue} slotData={slotData} handleAddToList={handleAddToList} />

            <DialogModalForEditOrDelete handleClose={forDDFalsy} open={forDD} handleRemoveFromList={handleRemoveFromList} handleEdit={updateCurrentlyViewingEventChanges} eventItem={eventsData[getCurrentlyEditingItemIdx()]} />

            <ShowFullEventDetails isOpen={forShowEvent && !forDD} handleClose={handleForShowEventFalsy} eventItem={eventsData[getCurrentlyEditingItemIdx()] || []} handleBeginEditing={forDDTruthy} handleRemoveFromList={handleRemoveFromList} />
        </div>
    )
}