"use client"

import React, { useEffect, useRef, useState } from 'react'

export const MouseWheelBasedCarouselBasic = () => {
    const [cards, setCards] = useState<React.JSX.Element[]>([])

    // const [radius, setRadius] = useState(250);

    const radius = 200

    const wheelRef = useRef<HTMLDivElement>(document.querySelector("#wheel") as HTMLDivElement)

    const [centerOfWheel, setCenterOfWheel] = useState<{
        x: number;
        y: number;
    }>({ x: 0, y: 0 })

    // const centerOfWheel = {
    //     x: parseFloat(wheelRef.current.style.width) / 2.0,
    //     y: parseFloat(wheelRef.current.style.height) / 2.0,
    // }

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
            newCards.push(<MemoizedCard key={i} center={centerOfWheel} radius={radius} theta={(Math.PI / 4.0) * i} />)
            
            // newCards.push(<CarouselCard key={i} center={centerOfWheel} radius={radius} theta={(Math.PI / 4.0) * i} />)
        }

        setCards(newCards)
        // setCards([...newCards])
    }

    useEffect(() => {
        handleNewCardsOnWheel()
    }, [centerOfWheel])

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
        wheelRef.current.style.transform = `translate(-50%, -50%) rotate(${temp_theta * 0.6}deg)`
        // wheelRef.current.style.transform = `translate(-50%, -50%) rotate(${event.deltaY}deg)`
        
        const timer = setTimeout(() => {
            setThetaTracked(temp_theta)
            console.log("cleared timer", timerId)
        }, 200)
        
        setTimerId(timer);
        // setThetaTracked(temp_theta)
    }

    return (
        <div className='absolute top-[50%]'>
            <div
                onWheel={handleScroll}
                id='wheel'
                ref={wheelRef}
                className='absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] bg-primary-focus'
                style={{
                    width: "290px",
                    height: "290px",
                    borderRadius: "50%"
                }}
            >
                {/* {renderItems()} */}
                {/* {cards[0]} */}
                {cards}
            </div>
        </div>
    )
}


const CarouselCard = ({ ...item }: {
    theta: number, radius: number, center: {
        x: number;
        y: number;
    }
}) => {
    const { center, radius, theta } = item;

    const newCoords = {
        x: Math.cos(theta) * radius,
        y: Math.sin(theta) * radius
    }

    return (
        <div className='absolute -translate-x-[50%] -translate-y-[50%] bg-blue-800 rounded-full'
            style={{...styles.card, left: `${center.x + newCoords.x}px`, top: `${center.y + newCoords.y}px`}}
        >

        </div>
    )
}

const styles = {
    card: {
        left: "50%",
        top: "50%",
        height: "100px",
        width: "90px"
    }
}

const MemoizedCard = React.memo(CarouselCard)