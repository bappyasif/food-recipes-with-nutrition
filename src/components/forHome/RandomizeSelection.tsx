"use client"

import React, { useState } from 'react'
import { MouseWheelBasedCarouselBasic } from './MouseWheelBasedCarouselBasic'

export const RandomizeSelection = () => {
    const [rndNum, setRndNum] = useState(0);

    const handleRandomNumber = () => setRndNum(Math.round(Math.random() * 8))

    const handleResetRandomNumber = () => setRndNum(-1)

    return (
        <div className=''>
            <h2>Lets Randomly Choose Recipe - {rndNum}</h2>
            <div className="flex justify-center relative z-20 h-96">
                <MouseWheelBasedCarouselBasic handleRandomNumber={handleRandomNumber} rndNum={rndNum} handleResetRandomNumber={handleResetRandomNumber} />
            </div>
        </div>
    )
}
