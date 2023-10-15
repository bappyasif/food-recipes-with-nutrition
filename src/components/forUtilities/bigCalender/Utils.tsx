import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useForInputTextChange, useForTruthToggle } from "@/hooks/forComponents"
import { DialogClose } from "@radix-ui/react-dialog"
import { SlotInfo } from "react-big-calendar"
import { EventItemTypes } from "./Scheduler"
import { ChangeEvent } from "react"

export const DialogModalForEditOrDelete = ({ open, handleClose, handleRemoveFromList, handleEdit, eventItem }: { open: boolean, handleClose: () => void, handleRemoveFromList: () => void, handleEdit: (t: string, d: string) => void, eventItem: EventItemTypes }) => {

    const handleDelete = () => {
        handleRemoveFromList()
        handleClose()
    }

    const { handleTextChange, text } = useForInputTextChange()

    const { handleTextChange: textChangeForDesc, text: descText } = useForInputTextChange()

    const handleConfirmEdit = () => {
        handleEdit(text, descText)
        handleClose()
    }

    return (
        <Dialog open={open}>
            <DialogContent className="fo">
                <DialogHeader>
                    <DialogTitle className='text-accent-foreground'>Ready To Edit? - {eventItem?.title}</DialogTitle>
                    {/* <DialogDescription className="flex flex-col gap-y-2">
                        <span>
                            <span>Title</span>
                            <input type="text" value={text || eventItem?.title || "test!!"} onChange={handleTextChange} className='bg-secondary w-full' />
                        </span>
                        <span>
                            <span>Descriptions</span>
                            <textarea name="description" id="description" className="w-full bg-secondary" rows={6} value={descText || eventItem?.description} onChange={textChangeForDesc}></textarea>
                        </span>
                    </DialogDescription> */}
                    <RenderTitleAndDescription descText={descText || eventItem?.description} handleDesc={textChangeForDesc} handleTitle={handleTextChange} titleText={text || eventItem?.title} />

                    {/* <h2>Recipes Snapshot When Added</h2> */}
                    {/* <RenderRecipesList hasCooking={eventItem?.cooking?.recipes.length ? true : false} items={eventItem?.cooking?.recipes || []} /> */}
                    <RenderRecipesList hasCooking={eventItem?.recipes?.length ? true : false} items={eventItem?.recipes || []} />

                    <DialogTrigger className='text-primary bg-accent font-bold' onClick={handleConfirmEdit}>Confirm Edit</DialogTrigger>

                    <hr />
                    <DialogTitle className='bg-accent text-primary'>Reday To Delete?</DialogTitle>
                    {/* <Button className='w-6 bg-secondary-focus'>X</Button> */}
                    {/* <DialogClose onClick={handleClose} className='w-6 bg-secondary-focus' title="Close Modal">X</DialogClose> */}
                    <DialogDescription className="flex justify-between">
                        <Button variant={"destructive"} onClick={handleDelete}>Yes, Delete</Button>
                        <DialogClose onClick={handleClose} className='w-fit bg-secondary-content font-bold px-4 rounded-sm text-secondary-focus' title="Close Modal">Cancel [X]</DialogClose>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

const RenderRecipesList = ({ hasCooking, items }: { hasCooking: boolean, items: { name: string, imgSrc: string }[] }) => {

    const renderList = () => items.map(item => {
        return (
            <span key={item.name} className="flex flex-col justify-center items-center outline outline-primary-content w-full rounded-md">
                <span>{item.name}</span>
                <img src={item.imgSrc} alt={item.name} width={60} height={60} className='w-11 h-11 rounded-full' />
            </span>
        )
    })

    return (
        hasCooking
            ?
            <div className="bg-accent text-primary">
                <h2>Recipes Snapshot When Added</h2>
                <div className="grid grid-cols-2 justify-items-center place-items-center gap-4">{renderList()}</div>
            </div>
            : null
    )
}

export const DialogModal = ({ open, handleClose, slotData, handleAddToList }: { open: boolean, handleClose: () => void, slotData: SlotInfo | undefined, handleAddToList: (d: any) => void }) => {
    const { handleTextChange, text } = useForInputTextChange()
    const { handleTextChange: textChangeForDesc, text: descText } = useForInputTextChange()

    const handleAdd = () => {
        const data = {
            start: slotData?.start,
            end: slotData?.end,
            title: text,
            description: descText || "No description is noted"
        }
        if (!text) {
            alert("Title cant be missing!!")
        } else {
            handleAddToList(data)
            handleClose()
        }
    }

    return (
        <Dialog open={open}>
            {/* <DialogTrigger className='text-primary-content'>Open</DialogTrigger> */}
            <DialogContent className="fo">
                <DialogHeader className="relative">
                    <DialogTitle className='bg-primary-focus'>Add A New Event</DialogTitle>
                    {/* <Button onClick={handleClose} className='w-6 bg-secondary-focus absolute -right-3 -top-6'></Button> */}
                    {/* <DialogTrigger>
                    <Button onClick={handleClose} className='w-6 bg-secondary-focus'>X</Button>
                    </DialogTrigger> */}
                    {/* <Button className='w-6 bg-secondary-focus'>X</Button> */}
                    {/* <DialogClose onClick={handleClose} className='w-6 bg-secondary-focus absolute right-4 -top-6 text-primary-content p-4'></DialogClose> */}
                    {/* <DialogDescription>
                        <input className='bg-secondary-content' type="text" onChange={handleTextChange} />
                    </DialogDescription> */}
                </DialogHeader>

                <RenderTitleAndDescription descText={descText} handleDesc={textChangeForDesc} handleTitle={handleTextChange} titleText={text} />

                <hr />
                <DialogTrigger className="flex justify-evenly">
                    <Button className='w-40 bg-secondary-focus' onClick={handleAdd}>Add</Button>
                    <DialogClose onClick={handleClose} className='w-40 bg-secondary-focus text-primary-content p-2 rounded-sm'>Cancel</DialogClose>
                </DialogTrigger>

            </DialogContent>
        </Dialog>

    )
}

const RenderTitleAndDescription = ({ titleText, descText, handleTitle, handleDesc }: { titleText: string, descText: string, handleTitle: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void, handleDesc: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void }) => {
    return (
        <DialogDescription>
            <span>
                <span>Title</span>
                <input type="text" value={titleText} onChange={handleTitle} className='bg-secondary w-full' required />
            </span>

            <span>
                <span>Descriptions</span>
                <textarea name="description" id="description" className="w-full bg-secondary" rows={6} value={descText} onChange={handleDesc}></textarea>
            </span>
        </DialogDescription>
    )
}

export const EventOptionsDropDown = (props: any) => {
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

export const ShowFullEventDetails = ({isOpen, handleClose}: {isOpen: boolean, handleClose: () => void}) => {
    // const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()
    return (
        <Dialog open={isOpen}>
            {/* <DialogTrigger>Open</DialogTrigger> */}
            <DialogContent className="fo">
                <DialogHeader>
                    <DialogClose className="absolute top-3 right-3 bg-accent z-20 px-2 hover:ring-1 ring-primary rounded-full" onClick={handleClose}>X</DialogClose>
                    <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
        // <Dialog open={true}>
        //     <DialogContent>
        //         content here
        //     </DialogContent>
        //     <DialogFooter>
        //         user actions
        //     </DialogFooter>
        // </Dialog>
    )
}