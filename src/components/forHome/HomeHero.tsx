"use client"

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { DragAndDrop } from '../forUtilities/dragAndDrop/DragAndDrop'
import { Scheduler } from '../forUtilities/bigCalender/Scheduler'

export const HomeHero = () => {
    return (
        <div className='relative mt-20 w-full'>
            <TwoExtensions />

            <div
                className='w-2/4 mt-4 mx-auto relative text-ring h-[16.01rem] flex items-center'
            >
                <img className='absolute h-full w-full object-cover -z-0' src="https://source.unsplash.com/random/200?food=1" alt="a rondom food recipe background image from unsplash" />

                <div className='w-full z-20 absolute text-special-foreground'>
                    <div className='grid grid-cols-3 place-items-center items-center h-[4rem]'>
                        <div className='h-full w-full rounded-s-xl rounded-xl bg-transparent flex justify-between'>
                            <span className='border border-primary-focus w-1/2'></span>
                            <span className='border border-primary-focus w-1/2'></span>
                        </div>
                        <h2 className='col-span-2 sm:text-xl md:text-2xl xl:text-4xl font-extrabold h-full bg-card flex items-center w-full text-center pl-[.38rem] opacity-90'>Make Cooking Adventurous</h2>
                    </div>

                    <div className='grid grid-cols-3 place-items-center items-center h-[4rem]'>
                        <h2 className='sm:text-xl md:text-2xl xl:text-4xl font-extrabold h-full w-full bg-card flex items-center justify-center opacity-90'>Fun</h2>
                        <div className='col-span-2 h-full w-full bg-transparent flex justify-between'>
                            <span className='border border-primary-focus border-b-0 w-1/4'></span>
                            <span className='border border-primary-focus border-b-0 w-1/4'></span>
                            <span className='border border-primary-focus w-1/4'></span>
                            <span className='border border-primary-focus w-1/4'></span>
                        </div>
                    </div>

                    <div className='grid grid-cols-3 place-items-center items-center h-[4rem]'>
                        <div className='col-span-2 h-full w-full bg-transparent flex justify-between'>
                            <span className='border border-x-primary-focus border-y-primary-focus w-1/4'></span>
                            <span className='border border-x-primary-focus border-y-primary-focus w-1/4'></span>
                            <span className='border border-x-primary-focus border-y-primary-focus w-1/4'></span>
                            <span className='border border-x-primary-focus border-y-primary-focus w-1/4'></span>
                        </div>
                        <h2 className='sm:text-xl md:text-2xl xl:text-4xl font-extrabold h-full w-full bg-card flex items-center justify-center opacity-90'>Healthy</h2>
                    </div>

                    <div className='grid grid-cols-3 place-items-center items-center h-[4rem]'>
                        <h2 className='sm:text-xl md:text-2xl xl:text-4xl font-extrabold h-full w-full bg-card flex items-center justify-center col-span-2 opacity-90'>And Really Delicious</h2>
                        <div className='h-full w-full rounded-l-box bg-transparent flex justify-between'>
                            <span className='border border-primary-focus w-1/2'></span>
                            <span className='border border-primary-focus w-1/2'></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const TwoExtensions = () => {
    const [extensionOpen, setExtensionOpen] = useState("");

    const handleExtensionsOpen = (name: string) => setExtensionOpen(name)

    return (
        <div className='relative flex justify-between w-full z-40 overflow-x-clip'>
            <LeftExtension extOpen={extensionOpen} handleExtensionsOpen={handleExtensionsOpen} />
            <RightExtension extOpen={extensionOpen} handleExtensionsOpen={handleExtensionsOpen} />
        </div>
    )
}

const RightExtension = ({ extOpen, handleExtensionsOpen }: ExtensionProps) => {
    const handleClicked = () => {
        extOpen !== "right" ? handleExtensionsOpen("right") : handleExtensionsOpen("")
    }

    return (
        <div
            // className={`absolute bg-secondary flex gap-4 items-center right-0 transition-all duration-1000 ${(extOpen === "right") ? "-translate-x-[6.3rem]" : "xxs:translate-x-[10rem] md:translate-x-[24rem]"} xxs:w-40 md:w-[24rem] z-20`}

            // className={`absolute bg-secondary flex gap-4 items-center right-0 transition-all duration-1000 ${(extOpen === "right") ? "-translate-x-4" : "translate-x-60"} xxs:w-fit md:w-[24rem] z-20`}

            className={`absolute bg-accent flex gap-4 items-center right-0 transition-all duration-1000 ${(extOpen === "right") ? "-translate-x-4" : "translate-x-0"} z-20`}
        >
            <Button onClick={handleClicked} variant={'secondary'} className='absolute -left-16 top-0 transition-all duration-1000 h-full bg-card hover:bg-muted-foreground hover:text-special-foreground text-7xl flex items-center rounded-r-none text-special'>[</Button>

            {/* <Button onClick={handleClicked} variant={'secondary'} className='absolute -left-16 top-0 h-full bg-card text-7xl flex items-center rounded-r-none text-muted-foreground'>[</Button> */}

            <DragAndDrop open={extOpen === "right"} />
        </div>
    )
}

type ExtensionProps = { extOpen: string, handleExtensionsOpen: (n: string) => void }

const LeftExtension = ({ extOpen, handleExtensionsOpen }: ExtensionProps) => {
    const handleClicked = () => {
        extOpen !== "left" ? handleExtensionsOpen("left") : handleExtensionsOpen("")
    }

    return (
        <div
            // className={`flex bg-secondary gap-4 justify-center items-center absolute left-0 transition-all duration-1000 ${(extOpen === "left") ? "translate-x-0" : "-translate-x-[41.6rem]"} ${extOpen === "left" ? "z-30" : "z-20"}`}
            className={`flex bg-secondary gap-4 justify-center items-center absolute left-0 transition-all duration-1000 ${(extOpen === "left") ? "translate-x-0" : "-translate-x-0"} ${extOpen === "left" ? "z-30" : "z-20"}`}
        >
            {/* {
                extOpen === "left"
                ?
                <Scheduler open={extOpen === "left"} />
                : null
            } */}

            <Scheduler open={extOpen === "left"} />
            
            <Button onClick={handleClicked} variant={'secondary'} className={`absolute bg-card -right-16 bottom-0 transition-all duration-1000 h-full hover:bg-muted-foreground hover:text-special-foreground text-7xl flex items-center rounded-l-none text-special`}>]</Button>
        </div>
    )
}
