"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'

import { MouseWheelBasedCarouselType } from '@/types'
import { useForTruthToggle } from '@/hooks/forComponents'
import { ellipsedText } from '../forRecipe/FewNonRelatedRecipes'

export const MouseWheelBasedCarousel= ({...item}: MouseWheelBasedCarouselType) => {
    const [cards, setCards] = useState<React.JSX.Element[]>([])

    const {rndNum, handleRandomNumber, handleResetRandomNumber, dataset} = item;

    const radius = 125

    const wheelRef = useRef<HTMLDivElement>(window.document?.querySelector("#wheel") as HTMLDivElement)
    // const wheelRef = useRef<HTMLDivElement>(null)

    const [centerOfWheel, setCenterOfWheel] = useState<{
        x: number;
        y: number;
    }>({ x: 0, y: 0 })

    const getCenterOfWheel = () => {
        const wheelCenter = {
            x: parseFloat(wheelRef.current.style.width) / 2.0,
            y: parseFloat(wheelRef.current.style.height) / 2.0,
        }

        setCenterOfWheel(wheelCenter)
    }

    const handleNewCardsOnWheel = () => {
        const newCards:React.JSX.Element[] = [];

        for(let i=0; i<8; i++) {
            // newCards.push(<MemoizedCard key={i} center={centerOfWheel} radius={radius} theta={(Math.PI / 4.0) * i} title={dataset[i].name} selected={dataset[i].name === dataset[rndNum]?.name} />)

            newCards.push(<MemoizedCard key={i} center={centerOfWheel} radius={radius} theta={(Math.PI / 4.0) * i} title={dataset[i]} selected={dataset[i] === dataset[rndNum]} />)
            
            // newCards.push(<CarouselCard key={i} center={centerOfWheel} radius={radius} theta={(Math.PI / 4.0) * i} title={categories[i].name} selected={categories[i].name === categories[rndNum].name} />)
        }

        setCards(newCards)
        // setCards([...newCards])
    }

    useEffect(() => {
        // categories[rndNum]?.name && handleNewCardsOnWheel()
        handleNewCardsOnWheel()
    }, [centerOfWheel, rndNum])

    useEffect(() => {
        getCenterOfWheel()
    }, [])

    const [thetaTracked, setThetaTracked] = useState(0.0)

    // let timerId:NodeJS.Timeout;
    const [timerId, setTimerId] = useState<NodeJS.Timeout>()

    const handleScroll = (event:React.WheelEvent<HTMLDivElement>) => {
        clearTimeout(timerId)
        
        // console.log(event.deltaY, event);
        const temp_theta = thetaTracked + event.deltaY;
        wheelRef.current.style.transform = `translate(-50%, -50%) rotate(${temp_theta * 0.2}deg)`
        // wheelRef.current.style.transform = `translate(-50%, -50%) rotate(${event.deltaY}deg)`

        wheelRef.current.style.transition = "transform 1s ease-in-out"
        
        const timer = setTimeout(() => {
            setThetaTracked(temp_theta)
            console.log(temp_theta, "cleared timer", timerId)
        }, 200)
        
        setTimerId(timer);
        // setThetaTracked(temp_theta)
    }

    const handleSpin = () => {
        handleResetRandomNumber()

        // wheelRef.current.style.transform = `translate(-50%, -50%) rotate(${Math.round(Math.random() * 3600)}deg)`

        wheelRef.current.style.transform = `translate(-50%, -50%) rotate(${Math.round(1500 + Math.round(Math.random() * 3600))}deg)`
        
        wheelRef.current.style.transition = "transform 2s ease-in-out"
        
        const timer = setTimeout(() => {
            wheelRef.current.style.transition = "transform 0s ease-in-out"
            wheelRef.current.style.transform = `translate(-50%, -50%) rotate(0deg)`
            handleRandomNumber();
        }, 2002)

        return () => clearTimeout(timer)
    }

    return (
        <div className='absolute top-[50%] flex justify-center items-center'>
            <div
                onWheel={handleScroll}
                id='wheel'
                ref={wheelRef}
                className='absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] bg-primary-focus'
                // className={`absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] bg-primary-focus transition-all duration-1000 ${isTrue ? "rotate-[270deg]" : "rotate-0"}`}
                // className={`absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] bg-primary-focus transition-all duration-1000 ${isTrue ? "animate-pulse" : ""}`}
                // className='absolute top-[50%] -translate-y-[50%] bg-primary-focus'
                style={{
                    width: "110px",
                    height: "110px",
                    borderRadius: "50%",
                    // clipPath: "polygon(2% 1%, 90% 0, 56% 100%, 39% 100%)"
                }}
            >
                {/* {renderItems()} */}
                {/* {cards[0]} */}
                {cards}
            </div>
            {/* <WheelParts /> */}
            <Button variant={'destructive'} 
            className='absolute transition-all duration-500 bg-transparent hover:bg-transparent hover:text-2xl' 
            onClick={handleSpin}
            >Spin</Button>
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
        <div className={`absolute -translate-x-[50%] -translate-y-[50%] bg-primary-content rounded-full flex justify-center items-center ${selected ? "bg-yellow-600 z-20" : ""} hover:scale-110 hover:z-20 hover:bg-slate-400`}
            style={{...styles.card, left: `${center.x + newCoords.x}px`, top: `${center.y + newCoords.y}px`, 
            // clipPath: "polygon(2% 1%, 90% 0, 56% 100%, 39% 100%)"
        }}
        >
            <h2 title={title} className='' 
                // style={{transform: `rotate(${theta * 45}deg)`}}
            >
                {title?.length > 9 ? ellipsedText(title, 9) : title} 
                {/* {theta} */}
            </h2>
        </div>
    )
}

const styles = {
    card: {
        // left: "50%",
        // top: "50%",
        height: "60px",
        width: "170px",
        // height: "9rem",
        // width: "9rem",
        // borderRadius: "50%"
    }
}

const WheelParts = () => {
    const options = [1, 2, 3, 4, 5, 6, 7, 8];
    
    const renderOptions = () => options.map(num => <span key={num} className={` absolute w-1/3 h-1/3 inline-block`}>{num}</span>)

    return (
        <div className="circle w-60 h-60 rounded-full bg-gray-600">
            {renderOptions()}
        </div>
    )
}

const MemoizedCard = React.memo(CarouselCard)