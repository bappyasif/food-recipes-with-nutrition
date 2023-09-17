"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'

export const CarouselVertical = () => {
    const data = ["een", "twee", "drie", "vier", "vijf", "zes", "zeven", "acht", "negen", "tien"]

    const [activeIdx, setActiveIdx] = useState(0)

    const [currentlyViewing, setCurrentlyViewing] = useState<string[]>([])

    // const renderData = () => data.map(item => <Button variant={'secondary'} className='w-60'>{item}</Button>)

    const renderData = () => currentlyViewing.map(item => <Button variant={'secondary'} className='w-60'>{item}</Button>)

    const handleCarousel = (direction:string) => {
        setActiveIdx(prevIdx => {
            if(direction === "prev") {
                if(prevIdx === 0) return data.length - 1

                return prevIdx - 1
            }
            
            // for next
            if(prevIdx === data.length - 1) {
                return 0
            }

            return prevIdx + 1
        })
    }

    const handleDataRendering = () => {
        setCurrentlyViewing(prevElms => {
            let temp:string[] = []

            if(activeIdx === 0) {
                temp = data.slice(data.length - 2).concat(data.slice(0, 3))
            } else if(activeIdx === data.length - 1) {
                temp = temp.concat(data.slice(data.length - 3), data.slice(0, 3))
            } else if(activeIdx === 1) {
                temp = temp.concat(data.slice(data.length - 1), data[0], data.slice(activeIdx, activeIdx + 3))
            } else if (activeIdx === 8) {
                temp = temp.concat(data.slice(activeIdx - 2, activeIdx), data.slice(activeIdx), data[0])
            } else {
                temp = temp.concat(data.slice(activeIdx - 2, activeIdx), data.slice(activeIdx, activeIdx + 3))
            }

            return prevElms = temp
        })
    }

    useEffect(() => {
        handleDataRendering()
    }, [activeIdx])
    
  return (
    <div>
        <Button variant={'destructive'} onClick={() => handleCarousel("prev")}>Prev</Button>
        <div className='flex flex-col flex-nowrap overflow-y-scroll gap-y-4 h-60'>{renderData()}</div>
        <Button variant={'destructive'} onClick={() => handleCarousel("next")}>Next</Button>
    </div>
  )
}
