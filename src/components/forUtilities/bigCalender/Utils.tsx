import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useForInputTextChange } from "@/hooks/forComponents"
import { DialogClose } from "@radix-ui/react-dialog"
import { SlotInfo } from "react-big-calendar"
import { EventItemTypes } from "./Scheduler"
import { ChangeEvent } from "react"
import moment from "moment"
import Image from "next/image"

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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='text-accent-foreground'>Ready To Edit - {eventItem?.title} - Event Details?</DialogTitle>

                    <DialogClose className="absolute top-3 right-3 bg-accent z-20 px-2 hover:ring-1 ring-primary rounded-full" onClick={handleClose}>X</DialogClose>
                </DialogHeader>
                <DialogDescription className="flex flex-col gap-y-2 justify-between">
                    <RenderTitleAndDescription descText={descText || eventItem?.description} handleDesc={textChangeForDesc} handleTitle={handleTextChange} titleText={text || eventItem?.title} />

                    <DialogTrigger className='text-primary bg-accent font-bold' onClick={handleConfirmEdit}>Confirm Edit</DialogTrigger>

                    <RenderRecipesList hasCooking={eventItem?.recipes?.length ? true : false} items={eventItem?.recipes || []} />

                </DialogDescription>

                <DialogTitle className=''>Reday To Delete?</DialogTitle>

                <DialogFooter className="flex justify-between w-full">
                    <Button className="w-1/2" variant={"destructive"} onClick={handleDelete}>Yes, Delete</Button>
                    <DialogClose onClick={handleClose} className='w-1/2 bg-secondary-content font-bold px-4 rounded-sm text-secondary-focus bg-accent' title="Close Modal">Cancel [X]</DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const RenderRecipesList = ({ hasCooking, items }: { hasCooking: boolean, items: { name: string, imgSrc: string }[] }) => {

    const renderList = () => items.map(item => {
        const { imgSrc, name } = item;
        return (
            <span key={name} className="flex flex-col justify-center items-center outline outline-primary-content w-full rounded-md">
                <span>{name}</span>
                {/* <img src={item.imgSrc} alt={item.name} width={60} height={60} className='w-11 h-11 rounded-full' /> */}
                <Image
                    src={imgSrc} alt={name} width={60} height={60}
                    className='w-56 h-48 rounded-sm'
                    blurDataURL={imgSrc} placeholder='blur' loading='lazy'
                />
            </span>
        )
    })

    return (
        hasCooking
            ?
            <span className="text-muted-foreground w-full">
                <span className="my-1 mb-2.5 font-bold text-lg">Recipes Snapshot When Added</span>
                <span className="grid grid-cols-2 justify-items-center place-items-center gap-4">{renderList()}</span>
            </span>
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

            <DialogContent>
                <DialogClose className="absolute top-3 right-3 bg-accent z-20 px-2 hover:ring-1 ring-primary rounded-full" onClick={handleClose}>X</DialogClose>

                <DialogHeader className="relative">
                    <DialogTitle className='bg-primary-focus'>Add A New Event</DialogTitle>

                    {/* <DialogClose className="absolute top-3 right-3 bg-accent z-20 px-2 hover:ring-1 ring-primary rounded-full" onClick={handleClose}>X</DialogClose> */}

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

                <DialogDescription>
                    <RenderTitleAndDescription 
                        // descText={descText} 
                        handleDesc={textChangeForDesc} handleTitle={handleTextChange} 
                        // titleText={text} 
                        />
                </DialogDescription>

                <hr />
                <DialogFooter className="flex justify-evenly">
                    <Button className='w-40 bg-accent hover:bg-special-foreground' onClick={handleAdd}>Add</Button>
                    <Button onClick={handleClose} className='w-40 bg-accent text-primary-content p-2 rounded-sm hover:bg-primary'>Cancel</Button>
                    {/* <DialogClose onClick={handleClose} className='w-40 bg-secondary-focus text-primary-content p-2 rounded-sm'>Cancel</DialogClose> */}
                </DialogFooter>

            </DialogContent>
        </Dialog>

    )
}

const RenderTitleAndDescription = ({ titleText, descText, handleTitle, handleDesc }: { titleText?: string, descText?: string, handleTitle: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void, handleDesc: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void }) => {
    return (
        <>
            <span>
                <span className="font-bold text-lg">Title</span>
                <input type="text" defaultValue={titleText} onChange={handleTitle} className='bg-secondary w-full text-sm' required />
            </span>

            <span>
                <span className="font-bold text-lg">Descriptions</span>
                <textarea name="description" id="description" className="w-full bg-secondary text-sm" rows={6} value={descText} onChange={handleDesc}></textarea>
            </span>
        </>
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

export const ShowFullEventDetails = ({ isOpen, handleClose, eventItem, handleBeginEditing, handleRemoveFromList }: { isOpen: boolean, handleClose: () => void, eventItem: EventItemTypes, handleRemoveFromList: () => void, handleBeginEditing: () => void }) => {
    // const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()
    const { description, end, start, title, recipes } = eventItem;

    const handleDelete = () => {
        const userPrompt = prompt("Irreversible Action, are you sure you want to delete? Press Y for Delete or N for Cancel")

        if (userPrompt?.match(/[y|Y]/)) {
            handleRemoveFromList()
            handleClose()
        }
    }

    const handleEdit = () => {
        handleBeginEditing()
        handleClose()
    }

    return (
        <Dialog open={isOpen}>
            {/* <DialogTrigger>Open</DialogTrigger> */}
            <DialogContent className="border-ring">
                <DialogHeader>
                    <DialogClose className="absolute top-3 right-3 bg-accent z-20 px-2 hover:ring-1 ring-primary rounded-full" onClick={handleClose}>X</DialogClose>

                    <DialogTitle>Showing Event Full Details</DialogTitle>
                </DialogHeader>
                <DialogDescription className="flex flex-col gap-y-4">
                    <ReusableModalTextContents heading="Title" text={title} />

                    <ReusableModalTextContents heading="Description" text={description} />

                    <span className="flex gap-2 justify-between">
                        <ReusableModalTextContents heading="Starts" text={moment(start).format("MMMM-DD-yyyy    hh:mm A")} />

                        <ReusableModalTextContents heading="Ends" text={moment(end).fromNow()} />
                    </span>

                    <span className="w-fit flex justify-center">
                        <RenderRecipesList hasCooking={recipes?.length ? true : false} items={recipes || []} />
                    </span>
                </DialogDescription>

                <DialogFooter className="flex justify-between w-full">
                    <Button className="w-1/2" variant={"destructive"} onClick={handleDelete}>Delete</Button>
                    <Button className="w-1/2" variant={"secondary"} onClick={handleEdit}>Edit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const ReusableModalTextContents = ({ heading, text }: { heading: string, text: string }) => {
    return (
        <span className="flex flex-col gap-y-0">
            <span className="font-bold text-lg text-primary">{heading}</span>
            <span className="text-sm">{text}</span>
        </span>
    )
}

/**
 * 
 * 
 return (
        <Dialog open={open}>
            <DialogContent>
            {/* <DialogTitle className='text-accent-foreground'>Ready To Edit? - {eventItem?.title}</DialogTitle> /}
            <DialogHeader>
            {/* <span className='text-accent-foreground'>Ready To Edit? - {eventItem?.title}</span> /}
                {/* <DialogTitle className='text-accent-foreground'>Ready To Edit? - {eventItem?.title}</DialogTitle> /}
                {/* <DialogDescription className="flex flex-col gap-y-2">
                    <span>
                        <span>Title</span>
                        <input type="text" value={text || eventItem?.title || "test!!"} onChange={handleTextChange} className='bg-secondary w-full' />
                    </span>
                    <span>
                        <span>Descriptions</span>
                        <textarea name="description" id="description" className="w-full bg-secondary" rows={6} value={descText || eventItem?.description} onChange={textChangeForDesc}></textarea>
                    </span>
                </DialogDescription> /}
                {/* <RenderTitleAndDescription descText={descText || eventItem?.description} handleDesc={textChangeForDesc} handleTitle={handleTextChange} titleText={text || eventItem?.title} /> /}

                {/* <h2>Recipes Snapshot When Added</h2> /}
                {/* <RenderRecipesList hasCooking={eventItem?.cooking?.recipes.length ? true : false} items={eventItem?.cooking?.recipes || []} /> /}

                {/* <RenderRecipesList hasCooking={eventItem?.recipes?.length ? true : false} items={eventItem?.recipes || []} />

                <DialogTrigger className='text-primary bg-accent font-bold' onClick={handleConfirmEdit}>Confirm Edit</DialogTrigger>

                <hr />
                <DialogTitle className='bg-accent text-primary'>Reday To Delete?</DialogTitle> /}

                {/* <Button className='w-6 bg-secondary-focus'>X</Button> /}
                {/* <DialogClose onClick={handleClose} className='w-6 bg-secondary-focus' title="Close Modal">X</DialogClose> /}
                {/* <DialogDescription className="flex justify-between">
                    <Button variant={"destructive"} onClick={handleDelete}>Yes, Delete</Button>
                    <DialogClose onClick={handleClose} className='w-fit bg-secondary-content font-bold px-4 rounded-sm text-secondary-focus' title="Close Modal">Cancel [X]</DialogClose>
                </DialogDescription> /}
            </DialogHeader>
            <DialogDescription className="flex flex-col gap-y-2 justify-between">
                    <RenderTitleAndDescription descText={descText || eventItem?.description} handleDesc={textChangeForDesc} handleTitle={handleTextChange} titleText={text || eventItem?.title} />

                    <DialogTrigger className='text-primary bg-accent font-bold' onClick={handleConfirmEdit}>Confirm Edit</DialogTrigger>

                    <RenderRecipesList hasCooking={eventItem?.recipes?.length ? true : false} items={eventItem?.recipes || []} />

                    <DialogTitle className=''>Reday To Delete?</DialogTitle>
                </DialogDescription>

                <DialogFooter className="flex justify-between w-full">
                    <Button className="w-1/2" variant={"destructive"} onClick={handleDelete}>Yes, Delete</Button>
                    <DialogClose onClick={handleClose} className='w-1/2 bg-secondary-content font-bold px-4 rounded-sm text-secondary-focus bg-accent' title="Close Modal">Cancel [X]</DialogClose>
                </DialogFooter>
        </DialogContent>
    </Dialog>
)
 */