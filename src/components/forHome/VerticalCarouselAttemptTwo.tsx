"use client"

import React, { useState } from 'react'
import { Button } from '../ui/button'

export const VerticalCarouselAttemptTwo = () => {
    const data = ["een", "twee", "drie", "vier", "vijf", "zes", "zeven", "acht", "negen", "tien"]

    const HALFWAY_INDEX = Math.ceil(data.length / 2);

    const CARD_ITEM_HEIGHT = 80;

    // will be used to determine when an item moved from top half to bottom half of shuffle, so that it keeps repeating itself
    const SHUFFLE_THRESHOLD = HALFWAY_INDEX * CARD_ITEM_HEIGHT;

    const [activeIndex, setActiveIndex] = useState(0)

    const determineCardItemPlacement = (itemIndex: number) => {
        // positioned at list center
        if (activeIndex === itemIndex) {
            return 0;
        }

        // targeting list second half
        if (itemIndex >= HALFWAY_INDEX) {
            // if moving backwards from index 0 to last item, then moving value downwards so that it shows up closer to list center
            if (activeIndex > (itemIndex - HALFWAY_INDEX)) {
                console.log((itemIndex - activeIndex) * CARD_ITEM_HEIGHT, "from 0 to last item")
                return (itemIndex - activeIndex) * CARD_ITEM_HEIGHT
            } else {
                // negative value moves upwards towards list's top
                console.log(-((data.length - activeIndex) - itemIndex) * CARD_ITEM_HEIGHT, "from current to top")
                return -((data.length - activeIndex) - itemIndex) * CARD_ITEM_HEIGHT
            }
        }

        // spacing for item after current index
        if (itemIndex > activeIndex) {
            return (itemIndex - activeIndex) * CARD_ITEM_HEIGHT
        }

        // spacing for items before current index
        if (itemIndex < activeIndex) {
            // going beyond negative threshold, move into positive positioning
            if ((activeIndex - itemIndex) * CARD_ITEM_HEIGHT >= SHUFFLE_THRESHOLD) {
                return ((data.length - (activeIndex - itemIndex)) * CARD_ITEM_HEIGHT)
            } else {
                // move into negative positioning
                return -(activeIndex - itemIndex) * CARD_ITEM_HEIGHT
            }
        }
    }

    const renderData = () => data.map((item, idx) => {
        return (
            <Button variant={"secondary"} className={`absolute`}
                key={item}
                // style={{ transform: `translateY(-${idx * 53}px)` }}
                style={{ transform: `translateY(-${determineCardItemPlacement(idx)}px)` }}
                onClick={() => setActiveIndex(idx)}
            >{item}</Button>
        )
    })

    const handleClick = (direction: string) => {
        setActiveIndex(prevIdx => {
            if (direction === "next") {
                // whn we are end of carousel, then set index to 0
                if ((prevIdx + 1) > data.length - 1) {
                    return 0;
                }
                //  otherwise increment by 1
                return prevIdx + 1;

            } else if (direction === "prev") {
                // if we are last slide and hit prev, then it will go to last slide
                if (prevIdx - 1 < 0) {
                    return data.length - 1;
                }

                // else decrease by 1
                return prevIdx - 1;
            }

            return prevIdx
        })
    }

    return (
        <div>
            <h2 onClick={() => handleClick("prev")}>Prev</h2>
            <div className='flex flex-col items-center justify-end gap-y-4 h-72'>
                {renderData()}
            </div>
            <h2 onClick={() => handleClick("next")}>Next</h2>
        </div>
    )
}
