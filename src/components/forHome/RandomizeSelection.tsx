"use client"

import React, { useEffect, useRef, useState } from 'react'
import { MouseWheelBasedCarousel } from './MouseWheelBasedCarousel'
// import { categories, cuisines } from './DuoCarousels';
import { CategoriesCuisinesCarouselType } from '@/types';
import { cuisines, diets, dishes, health, meals } from '../forFilters/FiltersDashboard';
import { Button } from '../ui/button';
import { useForTruthToggle } from '@/hooks/forComponents';

export const RandomizeSelection = () => {
    const [rnds, setRnds] = useState({ diet: -1, cuisine: -1, health: -1, meals: -1, dish: -1 })

    const updateRnds = (val: number, key: string) => {
        setRnds(prev => ({ ...prev, [key]: val }))
    }

    return (
        <div className='w-full h-96 bg-primary-content'>
            <h2>Lets Randomly Choose Recipe</h2>

            <div className='flex justify-start h-full'>
                <div className='flex gap-x-0 justify-between px-28 w-1/2'>
                    <ReuseableWheelCarousel dataset={cuisines} title='Choosing Cuisines' updateRnds={updateRnds} />

                    <ReuseableWheelCarousel dataset={dishes} title='Choosing Dishes' updateRnds={updateRnds} />
                </div>

                <ShowRecipes rnds={rnds} />

                <ReuseableBoxedRandomizer />

                {/* <div className='flex gap-x-0 justify-between px-28 w-1/2'>
                    <ReuseableWheelCarousel dataset={diets} title='Choosing Diets' updateRnds={updateRnds} />

                    <ReuseableWheelCarousel dataset={meals} title='Choosing Meals' updateRnds={updateRnds} />
                </div> */}
            </div>
        </div>
    )
}

const ReuseableBoxedRandomizer = () => {
    const withCloned = ([] as string[]).concat(diets[diets.length - 1], diets, diets[0])
    const renderDivs = () => withCloned.map((name, idx) => <div className='h-28 w-28 bg-primary-focus' key={name + idx}>{name}</div>)

    const ref = useRef<HTMLDivElement>(null)

    const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

    const [currCardNumber, setCurrCardNumber] = useState(1)

    // click based slides transform
    const runThis = () => {
        handleFalsy();

        if (ref.current !== null) {
            if (currCardNumber < withCloned.length - 1) {
                ref.current.style.transitionDuration = ".5s"
                ref.current.style.transform = `translateY(-${currCardNumber * 112}px)`
                setCurrCardNumber(prev => prev + 1)
                // console.log("transformed", currCardNumber, withCloned)
            }

            if (currCardNumber === withCloned.length - 1) {
                ref.current.style.transitionDuration = "0.0s"
                ref.current.style.transform = `translateY(0px)`
                setCurrCardNumber(1)
            }
        }
    }

    useEffect(() => {
        if (ref.current !== null) {
            ref.current.style.transitionDuration = ".0s"
            ref.current.style.transform = `translateY(-${currCardNumber * 112}px)`
        }
    }, [])

    const [count, setCount] = useState(0);

    const spinningEffect = () => {
        
            for(let i = 0; i < withCloned.length - 1; i++) {
                setCount(prev => {
                    if (ref.current !== null) { 
                        if (prev < (112 * withCloned.length)) {
                            ref.current.style.transitionDuration = ".5s"
                            ref.current.style.transform = `translateY(-${prev + 112}px)`
                            // setCount(prev => prev + 112)
                            // setCurrCardNumber(prev => prev + 1)
                            console.log("transformed", count, withCloned.length)
                            return prev + 112
                        }
            
                        if (count >= (withCloned.length * 112)) {
                            ref.current.style.transitionDuration = "0.0s"
                            ref.current.style.transform = `translateY(-112px)`
                            // setCount(112)
                            // setCurrCardNumber(1)
                            console.log("snapped", count, withCloned.length)

                            return 0
                        }
                    }

                    return prev
                })
            }
    }

    const runFourTimesForAnimation = () => {
        // for (let i = 0; i < withCloned.length - 1; i++) {
        //     // handleTruthy()
        //     spinningEffect()
        // }
        spinningEffect()

        handleFalsy()
    }

    useEffect(() => {
        // isTrue && runThis()  // per click
        isTrue && runFourTimesForAnimation()
    }, [isTrue])

    return (
        <div>
            <h2>Bees Tees</h2>
            <div className="viewport bg-secondary-content h-28 overflow-hidden">
                <div className="flex flex-col gap-y-0" ref={ref}>
                    {renderDivs()}
                </div>
            </div>
            {/* <Button variant={"secondary"} onClick={runFourTimesForAnimation}>Spin</Button> */}
            <Button variant={"secondary"} onClick={handleTruthy}>Spin</Button>
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