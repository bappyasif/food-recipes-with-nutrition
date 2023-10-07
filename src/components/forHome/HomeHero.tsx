"use client"

import React, { useEffect, useState } from 'react'
import { WithMostFunctionalities } from '../forUtilities/bigCalender/tryouts-II/WithMostFunctionalities'
import { Button } from '../ui/button'
import { useForTruthToggle } from '@/hooks/forComponents'
import { DragAndDrop } from '../forUtilities/dragAndDrop/DragAndDrop'
import { Scheduler } from '../forUtilities/bigCalender/Scheduler'

// export const HomeHero = () => {
//     return (
//         <div 
//         className='w-2/4 mx-auto relative text-primary-foreground'
//         style={{
//             backgroundImage: "url('https://source.unsplash.com/random/200?food=1')",
//             backgroundSize: "cover",
//             height: "240px"
//         }}
//         >
//             {/* <img className='absolute h-[9rem] w-full rounded-xl object-cover -z-0' src="https://source.unsplash.com/random/200?food=1" alt="" /> */}
//             <div className="bg-white text-primary text-6xl font-bold w-full mix-blend-screen">NATURE</div>
            
//         </div>
//     )
// }


export const HomeHero = () => {
    return (
        <>
         <TwoExtensions />
        
        <div 
            className='w-2/4 mt-8 mx-auto relative text-primary-foreground h-[16.01rem] flex items-center'
            // style={{
            //     backgroundImage: "url('https://source.unsplash.com/random/200?food=1')",
            //     backgroundSize: "cover",
            //     // height: "240px"
            // }}
        >
            <img className='absolute h-full w-full object-cover -z-0' src="https://source.unsplash.com/random/200?food=1" alt="" />
           
            <div className='w-full z-20 absolute'>
                <div className='grid grid-cols-3 place-items-center items-center h-[4rem]'>
                    <div className='h-full w-full rounded-s-xl rounded-xl bg-transparent flex justify-between'>
                        <span className='border border-primary-focus border-b-0 w-1/2'></span>
                        <span className='border border-primary-focus border-b-0 w-1/2'></span>
                    </div>
                    <h2 className='col-span-2 text-4xl font-extrabold h-full bg-primary-focus flex items-center w-full text-center pl-[.38rem] opacity-90'>Make Cooking Adventurous</h2>
                </div>
                
                <div className='grid grid-cols-3 place-items-center items-center h-[4rem]'>
                    <h2 className='text-4xl font-extrabold h-full w-full bg-primary-focus flex items-center justify-center opacity-90'>Healthy</h2>
                    <div className='col-span-2 h-full w-full bg-transparent flex justify-between'>
                        <span className='border border-x-primary-focus border-y-0 w-1/4'></span>
                        <span className='border border-x-primary-focus border-y-0 w-1/4'></span>
                        <span className='border border-x-primary-focus border-y-0 w-1/4'></span>
                        <span className='border border-x-primary-focus border-y-0 w-1/4'></span>
                    </div>
                </div>

                <div className='grid grid-cols-3 place-items-center items-center h-[4rem]'>
                    <div className='col-span-2 h-full w-full bg-transparent flex justify-between'>
                        <span className='border border-x-primary-focus border-y-primary-focus w-1/4'></span>
                        <span className='border border-x-primary-focus border-y-primary-focus w-1/4'></span>
                        <span className='border border-x-primary-focus border-y-primary-focus w-1/4'></span>
                        <span className='border border-x-primary-focus border-y-primary-focus w-1/4'></span>
                    </div>
                    <h2 className='text-4xl font-extrabold h-full w-full bg-primary-focus flex items-center justify-center opacity-90'>Fun</h2>
                </div>

                <div className='grid grid-cols-3 place-items-center items-center h-[4rem]'>
                    <h2 className='text-4xl font-extrabold h-full w-full bg-primary-focus flex items-center justify-center col-span-2 opacity-90'>And Really Delicious</h2>
                    <div className='h-full w-full rounded-l-box bg-transparent flex justify-between'>
                        <span className='border border-primary-focus w-1/2'></span>
                        <span className='border border-primary-focus w-1/2'></span>
                    </div>
                </div>
            </div>
        </div>
        </>
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

const RightExtension = ({extOpen, handleExtensionsOpen}: ExtensionProps) => {
    // const {handleFalsy, handleTruthy, isTrue} = useForTruthToggle()
    const handleClicked = () => {
        // isTrue ? handleFalsy() : handleTruthy()
        // isTrue ? handleExtensionsOpen("right")
        // !isTrue ? handleExtensionsOpen("right") : handleExtensionsOpen("")
        // extOpen !== "right" && handleExtensionsOpen("right")
        // handleExtensionsOpen("right")
        extOpen !== "right" ? handleExtensionsOpen("right") : handleExtensionsOpen("")
    }

    // useEffect(() => {
    //     isTrue ? handleExtensionsOpen("right") : handleExtensionsOpen("")
    //     // console.log(isTrue, extOpen, "from right")
    // }, [isTrue])
    return (
        <div 
            // className='absolute bg-primary-content z-40'
            // className={`absolute bg-primary-content z-40 transition-all duration-1000 ${isTrue ? "translate-x-0" : "translate-x-[29rem]"}`}
            // className={`absolute flex gap-4 items-center right-0 transition-all duration-1000 ${isTrue ? "-translate-x-4" : "translate-x-[28rem]"}`}
            // className={`absolute flex gap-4 items-center right-0 transition-all duration-1000 ${(isTrue && extOpen === "right") ? "-translate-x-[6.3rem]" : "translate-x-[22rem]"} w-[22rem]`}
            className={`absolute bg-primary-content flex gap-4 items-center right-0 transition-all duration-1000 ${(extOpen === "right") ? "-translate-x-[6.3rem]" : "translate-x-[24rem]"} w-[24rem]`}
        >
            <Button onClick={handleClicked} variant={'secondary'} className='absolute -left-16 top-0 h-full bg-primary-focus text-7xl flex items-center rounded-r-none'>[</Button>
            
            <DragAndDrop open={extOpen === "right"} />
            {/* <WithMostFunctionalities /> */}
        </div>
    )
}

type ExtensionProps = {extOpen: string, handleExtensionsOpen: (n:string) => void}

const LeftExtension = ({extOpen, handleExtensionsOpen}: ExtensionProps) => {
    // const {handleFalsy, handleTruthy, isTrue} = useForTruthToggle()
    const handleClicked = () => {
        // isTrue ? handleFalsy() : handleTruthy()
        // !isTrue ? handleExtensionsOpen("left") : handleExtensionsOpen("")
        // extOpen !== "left" && handleExtensionsOpen("left")
        // handleExtensionsOpen("left")
        extOpen !== "left" ? handleExtensionsOpen("left") : handleExtensionsOpen("")
    }
    // useEffect(() => {
    //     isTrue ? handleExtensionsOpen("left") : handleExtensionsOpen("")
    //     // isTrue && extOpen !== "left" ? handleExtensionsOpen("left") : handleExtensionsOpen("")
    // }, [isTrue])
    return (
        <div 
            // className='absolute bg-primary-content z-40'
            // className={`absolute bg-primary-content z-40 transition-all duration-1000 ${isTrue ? "translate-x-16" : "-translate-x-[29rem]"}`}
            // className={`flex gap-4 justify-center items-center absolute left-0 transition-all duration-1000 ${(isTrue && extOpen === "left") ? "translate-x-4" : "-translate-x-[42rem]"}`}
            className={`flex bg-primary-content gap-4 justify-center items-center absolute left-0 transition-all duration-1000 ${(extOpen === "left") ? "translate-x-4" : "-translate-x-[42rem]"}`}
            // className={`flex gap-4 justify-center items-center absolute left-0 transition-all duration-1000 ${((extOpen === "left") || (isTrue)) ? "translate-x-4" : "-translate-x-[42rem]"}`}
        >
                {/* <WithMostFunctionalities /> */}
                <Scheduler open={extOpen === "left"} />
                <Button onClick={handleClicked} variant={'secondary'} className={`absolute -right-16 top-0 transition-all duration-1000 h-full bg-primary-focus text-7xl flex items-center rounded-l-none`}>]</Button>
        </div>
    )
}

// export const HomeHero = () => {
//     return (
//         <div className='grid grid-rows-3 grid-cols-1 gap-0 w-2/4 mx-auto justify-items-center place-items-center relative text-primary-foreground'>
//             <img className='absolute h-[9rem] w-full rounded-xl object-cover z-0' src="https://source.unsplash.com/random/200?food=1" alt="" />
            
//             <div className='grid grid-cols-3 place-items-center items-center z-10 h-full'>
//                 {/* <img className='h-[110px] w-full rounded-xl object-cover' src="https://source.unsplash.com/random/200?food=1" alt="" /> */}
//                 <div className='h-full w-60 rounded-s-xl rounded-xl bg-transparent border'></div>
//                 <h2 className='col-span-2 text-4xl font-extrabold bg-primary h-full'>Make Cooking Adventurous</h2>
//             </div>
//             <div className='grid grid-cols-3 place-items-center items-center z-10 h-full'>
//                 <h2 className='col-span-2 text-4xl font-extrabold bg-primary h-full w-full'>Healthy Fun And</h2>
//                 <div className='h-full w-full rounded-s-xl rounded-r-2xl bg-transparent border'></div>
//                 {/* <img className='col-span-2 h-[110px] w-full rounded-s-xl rounded-r-2xl object-cover' src="https://source.unsplash.com/random/200?food=2" alt="" /> */}
//             </div>
//             <div className='grid grid-cols-3 place-items-center items-center z-10 h-full'>
//                 {/* <img className='col-span-2 h-[110px] w-full rounded-e-full object-cover' src="https://source.unsplash.com/random/200?food=3" alt="" /> */}
//                 <div className='col-span-2 h-full w-full rounded-e-full bg-transparent border'></div>
//                 <h2 className='text-4xl font-extrabold h-full bg-primary w-full'>Nutritious</h2>
//             </div>
//             {/* <img src="https://source.unsplash.com/random/200?food=1" alt="" />
//             <h2 className='col-span-2 text-6xl font-extrabold'>Get Cooking</h2> */}
//         </div>
//     )
// }
