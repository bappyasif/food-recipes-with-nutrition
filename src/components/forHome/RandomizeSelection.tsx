"use client"

import React, { useEffect, useState } from 'react'
import { MouseWheelBasedCarousel } from './MouseWheelBasedCarousel'
// import { categories, cuisines } from './DuoCarousels';
import { CategoriesCuisinesCarouselType } from '@/types';
import { cuisines, diets, dishes } from '../forFilters/FiltersDashboard';

export const RandomizeSelection = () => {
    const [rnds, setRnds] = useState({ diet: -1, cuisine: -1, health: -1, meals: -1, dish: -1 })

    const updateRnds = (val: number, key: string) => {
        setRnds(prev => ({ ...prev, [key]: val }))
    }

    return (
        <div className='w-full h-96 bg-primary-content'>
            <h2>Lets Randomly Choose Recipe</h2>

            <div className='flex justify-start h-full'>
                <div className='flex gap-x-48 justify-between px-28 w-1/2'>
                    <ReuseableWheelCarousel dataset={cuisines} title='Choosing Cuisines' updateRnds={updateRnds} />

                    <ReuseableWheelCarousel dataset={dishes} title='Choosing Dishes' updateRnds={updateRnds} />
                </div>

                <ShowRecipes rnds={rnds} />
            </div>
        </div>
    )
}

const ShowRecipes = ({ rnds }: {
    rnds: {
        dish: number,
        cuisine: number
    }
}) => {
    // const {category, cuisine} = rnds

    return (
        <div className='flex flex-col gap-y-4 items-center justify-center w-1/2 self-end h-full'>
            Lets find Recipes From These Types
            {/* {rnds["category"]} {rnds["cuisine"]} */}
            <ShowTitle rnds={rnds} />
        </div>
    )
}

const ShowTitle = ({ rnds }: {
    rnds: {
        dish: number,
        cuisine: number
    }
}) => {
    const { dish, cuisine } = rnds

    return (
        <div className='flex gap-x-4'>
            <h2 className='flex flex-col gap-y-2'>
                <span>Dish</span>
                {/* <span>{categories[diet]?.name ? categories[diet].name : "intrim spin"}</span> */}
                <span>{dishes[dish] ? dishes[dish] : "intrim spin"}</span>
            </h2>
            <h2 className='flex flex-col gap-y-2'>
                <span>Cuisine</span>
                <span>{cuisines[cuisine] ? cuisines[cuisine] : "intrim spin"}</span>
                {/* <span>{cuisines[cuisine]?.name ? cuisines[cuisine].name : "intrim spin"}</span> */}
            </h2>
        </div>
    )
}


const ReuseableWheelCarousel = ({ dataset, title, updateRnds }: {
    // dataset: CategoriesCuisinesCarouselType[],
    dataset: string[],
    title: string,
    updateRnds: (v: number, t: string) => void
}) => {
    const [rndNum, setRndNum] = useState(0);

    const handleRandomNumber = () => setRndNum(Math.round(Math.random() * 7))

    const handleResetRandomNumber = () => setRndNum(-1)

    const isItForCategory = () => title.includes("Dish")

    useEffect(() => {
        console.log(isItForCategory())
        updateRnds(rndNum, isItForCategory() ? "dish" : "cuisine")
    }, [rndNum])

    // ${title.includes("Category") ? "justify-start" : "justify-end"}
    return (
        <div className={`flex justify-center relative z-20 h-96`}>
            <h2 className='text-center'>{title}</h2>
            <MouseWheelBasedCarousel handleRandomNumber={handleRandomNumber} rndNum={rndNum} handleResetRandomNumber={handleResetRandomNumber} dataset={dataset} />
        </div>
    )
}