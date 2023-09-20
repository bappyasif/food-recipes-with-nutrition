import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useForInputTextChange, useForTruthToggle } from '@/hooks/forComponents'
import { DialogClose } from '@radix-ui/react-dialog'
import moment from 'moment'
import React, { useState } from 'react'
import { Calendar, SlotInfo, momentLocalizer } from "react-big-calendar"

export const localizer = momentLocalizer(moment)

export type EventItemTypes = {
    start: Date;
    end: Date;
    id: number;
    title: string;
    description: string;
}

export const ITEMS = [
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

    const handleOnSelectEvent = (event: EventItemTypes) => {
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
                // components={{ event: EventOptionsDropDown }}
                components={{
                    event: props => (<EventOptionsDropDown remove={handleRemoveFromList} edit={forDDTruthy} {...props} />)
                  }}
                // components={{ event: () => <EventOptionsDropDown event remove={handleRemoveFromList} />}}
                // components={{ event: EventOptionsDropDown({event: event, remove: handleRemoveFromList}) }}
                // components={{ event: (event:EventItemTypes) => EventOptionsDropDown({event: event, remove: handleRemoveFromList}) }}
                // components={{event: (event: EventItemTypes) => <EventOptionsDropDown event={event} remove={handleRemoveFromList}/>}}

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
                    ? <DialogModalForEditOrDelete handleClose={forDDFalsy} open={forDD} handleRemoveFromList={handleRemoveFromList} handleEdit={updateCurrentlyViewingEventChanges} />
                    : null
            }
        </div>
    )
}

// const EventOptionsDropDown = ({event, remove}: {event: EventItemTypes, remove: () => void}) => {
// const EventOptionsDropDown = ({ event }: { event: EventItemTypes}) => {
export const EventOptionsDropDown = (props:any) => {
    return (
        <div className='flex justify-between'>
            {/* <h2>{event.title}</h2> */}
            <h2>!! {props.title} !!</h2>
            {/* <Button>Open</Button> */}
            <DropdownMenu>
                <DropdownMenuTrigger>Open</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Choose To</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={props.edit}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={props.remove}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* <Popover>
                <PopoverTrigger className='w-4'>Open</PopoverTrigger>
                <PopoverContent>Place content for the popover here.</PopoverContent>
            </Popover> */}
        </div>
        //         <Popover>
        //   <PopoverTrigger className='w-4'>Open</PopoverTrigger>
        //   <PopoverContent>Place content for the popover here.</PopoverContent>
        // </Popover>

    )
}

export const DialogModalForEditOrDelete = ({ open, handleClose, handleRemoveFromList, handleEdit }: { open: boolean, handleClose: () => void, handleRemoveFromList: () => void, handleEdit: (t:string) => void }) => {
    
    const handleDelete = () => {
        handleRemoveFromList()
        handleClose()
    }

    const {handleTextChange, text} = useForInputTextChange()

    const handleConfirmEdit = () => {
        handleEdit(text)
        handleClose()
    }

    return (
        <Dialog open={open}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='text-accent-focus'>Ready To Edit?</DialogTitle>
                    <DialogDescription>
                        <input type="text" value={text || "test!!"} onChange={handleTextChange} className='bg-primary-focus' />
                    </DialogDescription>
                    <DialogTrigger className='text-primary-content' onClick={handleConfirmEdit}>Confirm Edit</DialogTrigger>
                    <hr />
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

export const DialogModal = ({ open, handleClose, slotData, handleAddToList }: { open: boolean, handleClose: () => void, slotData: SlotInfo | undefined, handleAddToList: (d: any) => void }) => {
    const { handleTextChange, text } = useForInputTextChange()

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