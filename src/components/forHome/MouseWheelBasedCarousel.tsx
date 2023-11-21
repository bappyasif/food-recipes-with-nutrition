"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'

import { MouseWheelBasedCarouselType } from '@/types'
import { ellipsedText } from '../forRecipe/FewNonRelatedRecipes'
import {useTranslations} from "use-intl"

export const MouseWheelBasedCarousel= ({...item}: MouseWheelBasedCarouselType) => {
    const [cards, setCards] = useState<React.JSX.Element[]>([])

    const {rndNum, handleRandomNumber, handleResetRandomNumber, dataset} = item;

    const radius = 125

    // const wheelRef = useRef<HTMLDivElement>(window.document?.querySelector("#wheel") as HTMLDivElement)
    const wheelRef = useRef<HTMLDivElement>(null)

    const [centerOfWheel, setCenterOfWheel] = useState<{
        x: number;
        y: number;
    }>({ x: 0, y: 0 })

    const getCenterOfWheel = () => {
        if(!wheelRef.current) return
        const wheelCenter = {
            x: parseFloat(wheelRef.current.style.width) / 2.0,
            y: parseFloat(wheelRef.current.style.height) / 2.0,
        }

        setCenterOfWheel(wheelCenter)
    }

    const handleNewCardsOnWheel = () => {
        const newCards:React.JSX.Element[] = [];

        for(let i=0; i<8; i++) {
            newCards.push(<MemoizedCard key={i} center={centerOfWheel} radius={radius} theta={(Math.PI / 4.0) * i} title={dataset[i]} selected={dataset[i] === dataset[rndNum]} />)
        }

        setCards(newCards)
    }

    useEffect(() => {
        handleNewCardsOnWheel()
    }, [centerOfWheel, rndNum])

    useEffect(() => {
        getCenterOfWheel()
    }, [])

    const [thetaTracked, setThetaTracked] = useState(0.0)

    const [timerId, setTimerId] = useState<NodeJS.Timeout>()

    const handleScroll = (event:React.WheelEvent<HTMLDivElement>) => {
        clearTimeout(timerId)

        if(!wheelRef.current) return
        
        // console.log(event.deltaY, event);
        const temp_theta = thetaTracked + event.deltaY;

        wheelRef.current.style.transform = `translate(-50%, -50%) rotate(${temp_theta * 0.2}deg)`

        wheelRef.current.style.transition = "transform 1s ease-in-out"
        
        const timer = setTimeout(() => {
            setThetaTracked(temp_theta)
            // console.log(temp_theta, "cleared timer", timerId)
        }, 200)
        
        setTimerId(timer);
    }

    const handleSpin = () => {
        handleResetRandomNumber()

        if(!wheelRef.current) return

        wheelRef.current.style.transform = `translate(-50%, -50%) rotate(${Math.round(1500 + Math.round(Math.random() * 3600))}deg)`
        
        wheelRef.current.style.transition = "transform 2s ease-in-out"
        
        const timer = setTimeout(() => {
            if(!wheelRef.current) return
            
            wheelRef.current.style.transition = "transform 0s ease-in-out"
            wheelRef.current.style.transform = `translate(-50%, -50%) rotate(0deg)`
            handleRandomNumber();
        }, 2002)

        return () => clearTimeout(timer)
    }

    const t = useTranslations("default")

    return (
        <div className='absolute top-[58%] flex justify-center items-center'>
            <div
                onWheel={handleScroll}
                id='wheel'
                ref={wheelRef}
                className='absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] bg-muted-foreground'
                style={{
                    width: "110px",
                    height: "110px",
                    borderRadius: "50%",
                    // clipPath: "polygon(2% 1%, 90% 0, 56% 100%, 39% 100%)"
                }}
            >
                {cards}
            </div>
            <Button variant={'destructive'} 
            className='absolute transition-all duration-500 bg-transparent hover:bg-transparent hover:text-2xl text-secondary' 
            onClick={handleSpin}
            >{t("Spin")}</Button>
        </div>
    )
}


const CarouselCard = ({ ...item }: {
    selected: boolean, title: string, theta: number, radius: number, center: {
        x: number;
        y: number;
    }
}) => {
    const { center, radius, theta, title, selected } = item;

    const newCoords = {
        x: Math.cos(theta) * radius,
        y: Math.sin(theta) * radius
    }

    return (
        <div className={`absolute -translate-x-[50%] -translate-y-[50%] bg-muted text-muted-foreground rounded-full flex justify-center items-center ${selected ? "bg-primary z-20 text-primary-foreground" : ""} hover:scale-110 hover:z-20 hover:bg-muted-foreground hover:text-muted`}
            style={{...styles.card, left: `${center.x + newCoords.x}px`, top: `${center.y + newCoords.y}px`, 
            // clipPath: "polygon(2% 1%, 90% 0, 56% 100%, 39% 100%)"
        }}
        >
            <h2 title={title} className='' 
                // style={{transform: `rotate(${theta * 45}deg)`}}
            >
                {title?.length > 8 ? ellipsedText(title, 7 ) : title} 
                {/* {theta} */}
            </h2>
        </div>
    )
}

const styles = {
    card: {
        // left: "50%",
        // top: "50%",
        // height: "60px",
        height: "40px",
        width: "80px",
        // width: "170px",
        // height: "9rem",
        // width: "9rem",
        // borderRadius: "50%"
    }
}

const MemoizedCard = React.memo(CarouselCard)