import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useForInputTextChange } from "@/hooks/forComponents"
import { DialogClose } from "@radix-ui/react-dialog"
import { SlotInfo } from "react-big-calendar"

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