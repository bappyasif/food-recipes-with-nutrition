"use client"

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { DragAndDrop } from '../forUtilities/dragAndDrop/DragAndDrop'
import { Scheduler } from '../forUtilities/bigCalender/Scheduler'
import Image from 'next/image'

export const HomeHero = () => {
    return (
        <div className='relative mt-20 w-full'>
            <TwoExtensions />

            <div
                // className='xxs:w-2/3 lg:w-2/4 mt-4 mx-auto relative text-ring h-[40.01rem] flex items-center'
                className='xxs:w-2/3 lg:w-5/6 mt-4 mx-auto relative text-ring h-[40.01rem] flex items-center'
            >
                <Image
                    src={"https://source.unsplash.com/random/200?food=1"} 
                    alt={"a random food picture from unsplash"} 
                    width={800} height={400}
                    className='absolute h-full w-full object-cover -z-0 mix-blend-normal rounded'
                    blurDataURL={"https://source.unsplash.com/random/200?food=1"} 
                    placeholder='blur' loading='lazy'
                />
                {/* <img
                    src={"https://source.unsplash.com/random/200?food=1"} 
                    alt={"a random food picture from unsplash"} 
                    width={800} height={400}
                    className='absolute h-full w-full object-cover -z-0 mix-blend-screen'
                    // blurDataURL={"https://source.unsplash.com/random/200?food=1"} placeholder='blur' 
                    loading='lazy'
                /> */}

                <div className='w-full z-20 absolute text-special-foreground border border-primary'>
                    <div className='grid grid-cols-3 place-items-center items-center h-[8rem]'>
                        <div className='h-full w-full rounded-s-xl rounded-xl bg-transparent flex justify-between'>
                            <span className='border-r-primary border border-t-0 border-b-primary border-l-0 w-1/2'></span>
                            <span className='border-r-primary border border-t-0 border-b-primary border-l-0 w-1/2'></span>
                        </div>
                        <h2 className='col-span-2 sm:text-xl md:text-2xl xl:text-6xl font-extrabold h-full bg-card flex items-center w-full text-center pl-[.38rem]  place-content-center'>Make Cooking</h2>
                    </div>

                    <div className='grid grid-cols-3 place-items-center items-center h-[8rem]'>
                        <h2 className='sm:text-xl md:text-2xl xl:text-6xl font-extrabold h-full w-full bg-card flex items-center justify-center '>Exciting</h2>
                        <div className='col-span-2 h-full w-full bg-transparent flex justify-between'>
                            <span className='border-r-primary border border-t-primary border-b-primary border-l-primary w-1/4'></span>
                            <span className='border-r-primary border border-t-primary border-b-primary border-l-0 w-1/4'></span>
                            <span className='border-r-primary border border-t-primary border-b-0 border-l-0 w-1/4'></span>
                            <span className='border-r-primary border border-t-primary border-b-0 border-l-0 border-r-0 w-1/4'></span>
                        </div>
                    </div>

                    <div className='grid grid-cols-3 place-items-center items-center h-[8rem]'>
                    <div className='h-full w-full bg-transparent flex justify-between'>
                            <span className='border border-primary border-l-0 border-b-0 w-1/2'></span>
                            <span className='border border-primary border-l-0 border-b-0 w-1/2'></span>
                        </div>
                        <h2 className='sm:text-xl md:text-2xl xl:text-6xl font-extrabold h-full w-full bg-card flex items-center justify-center '>Fun</h2>
                        <div className='h-full w-full bg-transparent flex justify-between'>
                            {/* <span className='border border-primary border-b-0 w-1/4'></span>
                            <span className='border border-primary border-b-0 w-1/4'></span> */}
                            <span className='border border-primary border-r-0 w-1/2'></span>
                            <span className='border border-primary border-r-0 w-1/2'></span>
                        </div>
                    </div>

                    <div className='grid grid-cols-3 place-items-center items-center h-[8rem]'>
                        <div className='col-span-2 h-full w-full bg-transparent flex justify-between'>
                            <span className='border border-primary border-y-primary-focus border-l-0 w-1/4'></span>
                            <span className='border border-primary border-y-primary-focus border-l-0 w-1/4'></span>
                            <span className='border border-primary border-y-primary-focus border-l-0 w-1/4'></span>
                            <span className='border border-primary border-y-primary-focus border-l-0 w-1/4'></span>
                        </div>
                        <h2 className='sm:text-xl md:text-2xl xl:text-6xl font-extrabold h-full w-full bg-card flex items-center justify-center opacity-90'>Healthy</h2>
                    </div>

                    <div className='grid grid-cols-3 place-items-center items-center h-[8rem]'>
                        <h2 className='sm:text-xl md:text-2xl xl:text-6xl font-extrabold h-full w-full bg-card flex items-center justify-center col-span-2 opacity-90'>And Delicious</h2>
                        <div className='h-full w-full rounded-l-box bg-transparent flex justify-between'>
                            <span className='border border-primary border-r-0 border-b-0 w-1/2'></span>
                            <span className='border border-primary border-r-0 border-b-0 w-1/2'></span>
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
            // className={`absolute bg-card flex gap-4 items-center right-0 transition-all duration-1000 ${(extOpen === "right") ? "-translate-x-1.5" : "xxs:translate-x-[18.4rem] md:translate-x-[36rem] lg:translate-x-[36rem]"} z-20`}

            className={`absolute bg-card flex gap-4 items-center right-0 transition-all duration-1000 ${(extOpen === "right") ? "-translate-x-1.5" : "xxs:translate-x-[18.4rem] md:translate-x-[36rem] lg:translate-x-[44.3rem]"} z-20`}
        >
            <Button onClick={handleClicked} variant={'secondary'} 

            className='absolute -left-16 top-0 transition-all duration-1000 h-full bg-card hover:bg-muted-foreground hover:text-special-foreground text-5xl flex items-center rounded-r-none text-special'
            >[</Button>

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
            className={`flex bg-card gap-4 justify-center items-center absolute left-0 transition-all duration-1000 ${(extOpen === "left") ? "translate-x-0" : "xxs:-translate-x-[19.33rem] sm:-translate-x-[26.3rem] md:-translate-x-[36rem] xl:-translate-x-[52rem]"} ${extOpen === "left" ? "z-30" : "z-20"}`}
        >
            <Scheduler open={extOpen === "left"} />

            <Button onClick={handleClicked} variant={'secondary'} className={`absolute bg-card -right-16 bottom-0 transition-all duration-1000 h-full hover:bg-muted-foreground hover:text-special-foreground text-5xl flex items-center rounded-l-none text-special`}>]</Button>
        </div>
    )
}
