import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useForInputTextChange, useForTruthToggle } from '@/hooks/forComponents'
import { DialogClose } from '@radix-ui/react-dialog'
import moment from 'moment'
import React, { useState } from 'react'
import { Calendar, SlotInfo, momentLocalizer } from "react-big-calendar"

const localizer = momentLocalizer(moment)

type EventItemTypes = {
    start: Date;
    end: Date;
    id: number;
    title: string;
    description: string;
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

export const WithoutDnd = () => {
    const [events, setEvents] = useState<EventItemTypes[]>(ITEMS)

    const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

    const [slotData, setSlotData] = useState<SlotInfo>()

    const { handleFalsy:forDDFalsy, handleTruthy:forDDTruthy, isTrue:forDD } = useForTruthToggle()

    const [currnetlyViewingEventId, setCurrentlyViewingEventId] = useState(1)

    const handleRemoveFromList = () => {
        const filtered = events.filter(item => item.id !== currnetlyViewingEventId)
        setEvents(filtered)
    }

    const handleAddToList = (data: EventItemTypes) => setEvents(prev => [...prev, {...data, id: prev.length + 1}])

    const handleOnSelectEvent = (event: EventItemTypes) => {
        // console.log(event.title, "!!")
        setCurrentlyViewingEventId(event.id)
        forDDTruthy()
    }

    const handleOnSelectSlot = (event: SlotInfo) => {
        // console.log(event)
        setSlotData(event)

        handleTruthy()
    }

    return (
        <div>
            WithoutDnd
            <Calendar
                localizer={localizer}
                defaultView='month'
                defaultDate={new Date()}
                events={events}
                step={2}
                selectable={true}
                onSelectEvent={handleOnSelectEvent}
                onSelectSlot={handleOnSelectSlot}

                // className='h-48'
                style={{ height: "40vh" }}
            />
            {
                isTrue
                ? <DialogModal handleClose={handleFalsy} open={isTrue} slotData={slotData} handleAddToList={handleAddToList} />
                : null
            }

            {
                forDD
                ? <DialogModalForEditOrDelete handleClose={forDDFalsy} open={forDD} handleRemoveFromList={handleRemoveFromList} />
                : null
            }
        </div>
    )
}

const DialogModalForEditOrDelete = ({open, handleClose, handleRemoveFromList}: {open: boolean, handleClose: () => void, handleRemoveFromList: () => void}) => {
    const handleDelete = () => {
        handleRemoveFromList()
        handleClose()
    }
    return (
        <Dialog open={open}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='bg-primary-focus'>Reday To Delete?</DialogTitle>
                    {/* <Button className='w-6 bg-secondary-focus'>X</Button> */}
                    <DialogClose onClick={handleClose} className='w-6 bg-secondary-focus'>X</DialogClose>
                    <DialogDescription> 
                       <Button onClick={handleDelete}>Delete</Button>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

const DialogModal = ({open, handleClose, slotData, handleAddToList}: {open: boolean, handleClose: () => void, slotData:  SlotInfo | undefined, handleAddToList: (d: any) => void}) => {
    const {handleTextChange, text} = useForInputTextChange()

    const handleAdd = () => {
        const data = {
            start: slotData?.start,
            end: slotData?.end,
            title: text,
            description: "bees"
        }
        handleAddToList(data)
        handleClose()
    }

    return (
        <Dialog open={open}>
            <DialogTrigger className='text-primary-content'>Open</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='bg-primary-focus'>Add A New Event</DialogTitle>
                    {/* <Button className='w-6 bg-secondary-focus'>X</Button> */}
                    <DialogClose onClick={handleClose} className='w-6 bg-secondary-focus'>X</DialogClose>
                    <DialogDescription>
                        <input className='bg-secondary-content' type="text" onChange={handleTextChange} />
                    </DialogDescription>
                    <hr />
                    <Button className='w-6 bg-secondary-focus' onClick={handleAdd}>Add</Button>
                </DialogHeader>
            </DialogContent>
        </Dialog>

    )
}