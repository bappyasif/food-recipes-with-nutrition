"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import styles from "@/app/Home.module.css"
import { CategoriesCuisinesCarouselType, ReuseableCarouselType } from '@/types'
import { ReusableCarouselCard } from './DuoCarousels'

type VerticalType = Pick<ReuseableCarouselType, "items">

// export const CarouselVertical = ({items:data}: VerticalType) => {
export const CarouselVertical = ({...items}: ReuseableCarouselType) => {
    // const data = ["een", "twee", "drie", "vier", "vijf", "zes", "zeven", "acht", "negen", "tien"]

    const {items:data, title} = items

    const [activeIdx, setActiveIdx] = useState(0)

    const [currentlyViewing, setCurrentlyViewing] = useState<CategoriesCuisinesCarouselType[]>([])

    // const renderData = () => data.map(item => <Button variant={'secondary'} className='w-60'>{item}</Button>)

    // const renderData = () => currentlyViewing.map(item => <Button variant={'secondary'} className={`w-60 ${styles["carousel-vertical-card-item"]}`} key={item.name}>{item.name}</Button>)

    const renderData = () => currentlyViewing.map(item => <ReusableCarouselCard name={item.name} picture={item.picture} key={item.name} carouselType={title}  />)

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
            let temp:CategoriesCuisinesCarouselType[] = []

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
        setCurrentlyViewing([])
        data?.length && handleDataRendering()
    }, [activeIdx])
    
  return (
    <div className='w-48 relative flex flex-col items-center'>
        {/* {activeIdx} */}
        <Button variant={'destructive'} onClick={() => handleCarousel("prev")}>Prev</Button>
        <div 
            className='flex flex-col items-center flex-nowrap overflow-y-hidden gap-y-4 h-80 bg-primary-focus

            before:content-[""] before:h-8 before:absolute before:text-red-600 before:w-44 before:bg-gradient-to-b before:from-slate-400 before:to-slate-200 before:opacity-80 before:z-40

            after:content-[""] after:h-8 after:absolute after:bottom-10 after:text-red-600 after:w-44 after:bg-gradient-to-b after:from-slate-400 after:to-slate-200 after:opacity-80 after:z-40
            '>{renderData()}</div>
        <Button variant={'destructive'} onClick={() => handleCarousel("next")}>Next</Button>
    </div>
  )
}
