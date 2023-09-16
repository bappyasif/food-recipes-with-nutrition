"use client"

import React, { useState } from 'react'
import styles from "@/app/Home.module.css"
import { Button } from '../ui/button'
import cn from "classnames"
import Image from 'next/image'

export const VerticalCarouselAttemptOne = () => {
    const [activeIndex, setActiveIndex] = useState<number>(0)

    const data = ["een", "twee", "drie", "vier", "vijf", "zes", "zeven", "acht", "negen", "tien"]

    // Used to determine which items appear above the active item
    const HALFWAY_INDEX = Math.ceil(data.length / 2);

    // Used to determine the height/spacing of each item from each other
    const ITEM_HEIGHT = 101;

    // Used to determine at what point an item is moved from top half to bottom half in shuffle, so that it keeps repeating itself
    const SHUFFLE_THRESHOLD = HALFWAY_INDEX * ITEM_HEIGHT;

    // Used to determine which items should be visible. this prevents "ghosting" animations for items that are not currently visible on view
    const VISIBLE_STYLE_THRESHOLD = SHUFFLE_THRESHOLD / 2;

    // Positioning and Shuffling Slides

    // We can accomplish this by shuffling the translateY pixel values for each item when the activeIndex state value updates

    // Certain items will hit a threshold and are then moved to bottom of list, and vice versa

    // actual element ordering within the DOM does not change


const determinePlacement = (itemIndex:number) => {
	// Position item in the center of list
	if (activeIndex === itemIndex) return 0;

	// Targeting items in the second part of the list
	if (itemIndex >= HALFWAY_INDEX) {
		// If moving backwards from index 0 to the last item, move the value downwards
	  if (activeIndex > (itemIndex - HALFWAY_INDEX)) {
	    return (itemIndex - activeIndex) * ITEM_HEIGHT;
	  } else {
			// Negative value moves upwards towards the top of the list
	    return -((data.length + activeIndex) - itemIndex) * ITEM_HEIGHT;
	  }
	}

	// Spacing for items after the current index
	if (itemIndex > activeIndex) {
	  return (itemIndex - activeIndex) * ITEM_HEIGHT;
	}

	// Spacing for items before the current index
	if (itemIndex < activeIndex) {
		// If passing the negative threshold, move into a positive positioning
	  if ((activeIndex - itemIndex) * ITEM_HEIGHT >= SHUFFLE_THRESHOLD) {
	    return (data.length - (activeIndex - itemIndex)) * ITEM_HEIGHT;
	  }
		// Move into a negative positioning
	  return -(activeIndex - itemIndex) * ITEM_HEIGHT;
	}
}

    const handleClick = (direction: string) => {
        setActiveIndex(prevIdx => {
            if (direction === "next") {
                // If we are at end of  carousel, set index to 0
                if ((prevIdx + 1) > (data.length - 1)) {
                    return 0
                }

                // Otherwise increment the index by 1
                return prevIdx + 1

            } 
            // else if (direction === "prev") {
                
            // }

            // If we are on first slide and click previous, it will go to last slide
            if (prevIdx - 1 < 0) {
                return data.length - 1
            }

            // We are moving backwards in our carousel, decrement index by 1
            return prevIdx - 1
        })
    }

    // We want to add a class of "active" only if the item is currently active
    // For each carousel slide, we need to transform it by a certain amount depending on its location relative to currently active slide

    // We need to find some way to get around this so that only the currently visible items can transition
    // Any other items that aren't actually visible can then be shuffled around in a non-visual way
    // We actually solved part of this earlier when we added the visibleStyleThreshold constant
    // Now we just need to compare that constant to each carousel item position that is returned from the determinePlacement function and add a "visible" CSS class if it falls within that threshold
    const renderSlides = () => data.map((item, idx) => <Button type='button' onClick={() => setActiveIndex(idx)} className={cn(`${styles["carousel-item"]} flex gap-x-2 p-2 justify-center w-full h-16`, {active: activeIndex === idx, visible: Math.abs(determinePlacement(idx) as number) <= VISIBLE_STYLE_THRESHOLD})} key={idx} 
    style={{transform: `translateY(${determinePlacement(idx)}px)`}}
    >
        {item}
        <Image
                className='w-24 h-16 object-cover'
                // fill={true}
                placeholder='blur'
                blurDataURL={`https://source.unsplash.com/random/200?food=${idx}`}
                loading='lazy'
                width={80}
                height={50}
                alt={`${item}`}
                src={`https://source.unsplash.com/random/200?food=${idx}`}
            />
    </Button>)

    return (
        <section className={styles["outer-container"] + " w-60"}>
            <div className={styles["carousel-wrapper"]}>
                <button
                    type="button"
                    className={`${styles["carousel-button"]} prev`}
                    onClick={() => handleClick('prev')}
                >
                    {/* <Prev /> */}
                    "Prev"
                </button>

                {/* Carousel Markup and Styles */}
                <div className={styles["carousel"]}>
                    <div className={styles["slides"]}>
                    <div className={styles["carousel-inner2"]}>
                        {renderSlides()}    
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    className={`${styles["carousel-button"]} next`}
                    onClick={() => handleClick('next')}
                >
                    "Next"
                </button>
            </div>
        </section>
    )
}
