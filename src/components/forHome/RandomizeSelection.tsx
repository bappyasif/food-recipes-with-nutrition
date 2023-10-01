"use client"

import React, { useEffect, useRef, useState } from 'react'
import { MouseWheelBasedCarousel } from './MouseWheelBasedCarousel'
// import { categories, cuisines } from './DuoCarousels';
import { CategoriesCuisinesCarouselType, RecipeMealType } from '@/types';
import { cuisines, diets, dishes, health, meals } from '../forFilters/FiltersDashboard';
import { Button } from '../ui/button';
import { useForTruthToggle } from '@/hooks/forComponents';
import { searchRecipes } from '@/utils/dataFetching';
import { RandomizedRecipesView } from './RandomizedRecipesView';

export const RandomizeSelection = () => {
    const [rnds, setRnds] = useState({ cuisine: -1, dish: -1 })
    const [rndNames, setRndNames] = useState({ diet: "", meal: "", health: "" })

    const updateRnds = (val: number, key: string) => {
        setRnds(prev => ({ ...prev, [key]: val }))
    }

    const updateRndNames = (val: string, key: string) => setRndNames(prev => ({ ...prev, [key]: val }))

    return (
        <div className='w-full h-fit bg-primary-content'>
            <h2>Lets Randomly Choose Recipe</h2>

            <div className='flex justify-start h-full'>
                <div className='flex gap-x-0 justify-between px-28 w-1/2'>
                    <ReuseableWheelCarousel dataset={cuisines} title='Choosing Cuisines' updateRnds={updateRnds} />

                    <ReuseableWheelCarousel dataset={dishes} title='Choosing Dishes' updateRnds={updateRnds} />
                </div>

                {/* <ShowRecipes rnds={rnds} rndNames={rndNames} /> */}
                <div className='w-1/2 flex gap-x-8 justify-evenly items-center'>
                    <GoingOffRandomizer updateRndNames={updateRndNames} />

                    <div className='flex flex-col gap-y-4 justify-between items-center w-56'>
                        <ReuseableBoxedRandomizer data={diets} title={"Choose Diets"} updateRndNames={updateRndNames} />
                        <ReuseableBoxedRandomizer data={meals} title={"Choose Meals"} updateRndNames={updateRndNames} />
                        {/* <ReuseableBoxedRandomizer data={health} /> */}
                    </div>
                </div>

                {/* <div className='flex gap-x-0 justify-between px-28 w-1/2'>
                    <ReuseableWheelCarousel dataset={diets} title='Choosing Diets' updateRnds={updateRnds} />

                    <ReuseableWheelCarousel dataset={meals} title='Choosing Meals' updateRnds={updateRnds} />
                </div> */}
            </div>

            <ShowRecipes rnds={rnds} rndNames={rndNames} />
        </div>
    )
}

const GoingOffRandomizer = ({ updateRndNames }: { updateRndNames: (v: string, k: string) => void }) => {
    const [rnd, setRnd] = useState<number>(-1);

    const ref = useRef<HTMLDivElement>(null)

    const clonedData = health.concat(health, health);

    // const chooseRnd = () => setRnd(Math.round((Math.random() + .01) * clonedData.length))
    const chooseRnd = () => {
        setRnd(-1)
        updateRndNames("Intrim-spin", "health");

        const timer = setTimeout(() => {
            let calc = () => Math.round((Math.random() + .01) * clonedData.length)
            while (rnd === calc()) {
                calc()
            }

            setRnd(calc())
        }, 600)

        return () => clearTimeout(timer)
    }

    const renderDivs = () => (rnd >= 0 ? clonedData.slice(0, rnd) : clonedData).map((name, idx) => <div key={name + idx} className='absolute z-0'>{name}</div>)

    // const spewingOut = () => {
    //     for(let i=0; i<rnd; i++) {
    //         console.log(rnd, i, "?!?!")
    //     }
    // }

    const spewingOut = () => {
        if (ref.current) {
            // console.log(ref.current.childNodes.length, ">!>!")
            ref.current.childNodes.forEach((divItm, idx) => {

                // console.log(idx === rnd - 2, idx, rnd - 2);
                if (idx === rnd - 1) {
                    (divItm as HTMLDivElement).style.transform = `translateY(0px) translateX(0px)`;
                    // console.log("last item!!", divItm.textContent);
                    updateRndNames(divItm.textContent!, "health");
                    (divItm as HTMLDivElement).style.opacity = "1";
                    return
                }

                const rndNum = Math.random();
                (divItm as HTMLDivElement).style.transitionDuration = `${1}s`;
                // (divItm as HTMLDivElement).style.transform = `translateY(-${idx}px)`;
                (divItm as HTMLDivElement).style.transform = rndNum < .2 ? `translateX(${29}px)` : rndNum < .4 ? `translateY(-${29}px)` : rndNum < .6 ? `translateY(${29}px)` : `translateX(-${29}px)`;
                (divItm as HTMLDivElement).style.opacity = `0`;
            })
        }
    }

    useEffect(() => {
        chooseRnd()
    }, [])

    // const [showingOptions, setShowingOptions] = useState<string[]>([])

    // const renderOptions = () => {

    // }

    useEffect(() => {
        spewingOut()
        // renderDivs()
    }, [rnd])

    return (
        <div className='flex flex-col gap-y-2 w-48'>
            Choosing Health Labels
            <div ref={ref} className="viewport flex flex-col justify-center items-center h-20 bg-yellow-800 rounded-full">
                {/* {renderDivs().slice(0, rnd)} */}
                {/* { rnd !== -1 ? renderDivs() : <span>"spin it!!"</span>} */}
                {rnd !== -1 ? renderDivs() : null}
            </div>
            <Button className='z-10' variant={"secondary"} onClick={chooseRnd}>Spin</Button>
        </div>
    )
}

const ReuseableBoxedRandomizer = ({ data, title, updateRndNames }: { data: string[], title: string, updateRndNames: (v: string, t: string) => void }) => {
    // const withCloned = ([] as string[]).concat(diets[diets.length - 1], diets, diets[0])
    const clonedData = data.concat(data, data, data, data, data, data)
    const renderDivs = () => clonedData.map((name, idx) => <div className={`h-8 w-full flex justify-center items-center text-primary ${idx === prevSlideShown ? "bg-red-400" : "bg-sky-800"}`} key={name + idx}>{name}</div>)

    const ref = useRef<HTMLDivElement>(null)

    const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

    const [prevSlideShown, setPrevSlideShown] = useState(0);

    const decideKey = () => title.includes("Diets") ? "diet" : "meal"

    const spinningEffectRandomAmount = () => {
        updateRndNames("intrim spin!!", decideKey())

        const chooseSlide = () => Math.floor(Math.random() * clonedData.length)


        if (ref.current !== null) {
            let calc = (Math.round(Math.random() * (diets.length * 33)))
            for (let i = 0; i < calc; i++) {
                // if(calc > 800) calc = (Math.round(Math.random() * 720))
                ref.current!.style.transitionDuration = ".6s"
                ref.current!.style.transform = `translateY(-${i}px)`

                // console.log(calc, i)
            }

            handleFalsy()
        }

        let slide = chooseSlide()

        let keepingTracks = 0

        while (Math.abs(prevSlideShown - slide) < 10 && keepingTracks < 9) {
            const safeRange = Math.abs(clonedData.length - prevSlideShown)
            slide = keepingTracks === 8 ? safeRange : chooseSlide()
            // console.log("while", slide, prevSlideShown, keepingTracks, safeRange)
            keepingTracks++
        }

        ref.current!.style.transitionDuration = ".6s"
        // ref.current!.style.transform = `translateY(-${slide * 36}px)`
        ref.current!.style.transform = `translateY(-${slide * 2.22}rem)`

        setPrevSlideShown(slide)

        // console.log(slide, "slide!!", clonedData[slide], clonedData.length, clonedData)
        const timer = setTimeout(() => {
            updateRndNames(clonedData[slide], decideKey())
        }, 600)

        return () => clearTimeout(timer)
    }

    useEffect(() => {
        updateRndNames("Spin it", decideKey())
    }, [])

    useEffect(() => {
        isTrue && spinningEffectRandomAmount()
    }, [isTrue])

    return (
        <div className='w-full flex flex-col gap-y-1'>
            <h2>{title} </h2>
            <div className="viewport bg-secondary-content h-14 overflow-hidden border border-primary-foreground">
                <div className="flex flex-col gap-y-1 items-center justify-center" ref={ref}>
                    {renderDivs()}
                </div>
            </div>
            {/* <Button variant={"secondary"} onClick={runFourTimesForAnimation}>Spin</Button> */}
            <Button className='w-full' variant={"secondary"} onClick={handleTruthy}>Spin</Button>
        </div>
    )
}

type RndNamesTypes = {
    diet: string;
    meal: string;
    health: string
}


const ShowRecipes = ({ rnds, rndNames }: {
    rnds: {
        dish: number,
        cuisine: number,
    },
    rndNames: RndNamesTypes
}) => {
    // const {category, cuisine} = rnds
    const { cuisine, dish } = rnds;
    const { diet, health, meal } = rndNames;

    const [recipes, setRecipes] = useState<RecipeMealType[]>([])

    const handleClick = () => {
        console.log(diet, health, meal)
        const params = {
            mealType: !meal.includes("Spin it") ? meal : null,
            diet: !diet.includes("Spin it") ? diet.toLocaleLowerCase() : null,
            dishType: dishes[dish],
            cuisine: cuisines[cuisine],
            health: health,
            random: true,
            type: "public",
            app_id: process.env.NEXT_PUBLIC_EDAMAM_APP_ID,
            app_key: process.env.NEXT_PUBLIC_EDAMAM_APP_KEY
        }

        searchRecipes(params).then(res => {
            console.log(res, "response!!")
            const onlyRecipes = res?.hits.map((item: any) => item.recipe)
            onlyRecipes?.length && setRecipes(onlyRecipes)
        })
    }

    return (
        <>
            <div className='flex flex-col gap-y-4 items-center justify-center w-full self-end h-full'>
                Lets find Recipes From These Types
                {/* {rnds["category"]} {rnds["cuisine"]} */}
                <div className='flex gap-x-4'>
                    <ShowTitle rnds={rnds} />
                    <ShowRandomlySelectedOptions rndNames={rndNames} />
                </div>
                <Button onClick={handleClick} variant={'secondary'}>Click To See Recipes</Button>
            </div>
            <RandomizedRecipesView recipes={recipes} />
        </>
    )
}

const ShowRandomlySelectedOptions = ({ rndNames }: {
    rndNames: RndNamesTypes
}) => {
    const { diet, meal, health } = rndNames
    return (
        <div className='flex gap-x-4'>
            {/* <h2 className='flex flex-col gap-y-2'>
                <span>Diet</span>
                <span>{diet}</span>
            </h2>

            <h2 className='flex flex-col gap-y-2'>
                <span>Meal</span>
                <span>{meal ? meal : "intrim spin"}</span>
            </h2> */}
            <ShowOptionSelected title='Diet' val={diet} />

            <ShowOptionSelected title='Meal' val={meal} />

            <ShowOptionSelected title='Health' val={health} />
        </div>
    )
}

const ShowOptionSelected = ({ title, val }: { title: string, val: string }) => {
    return (
        <h2 className='flex flex-col gap-y-2'>
            <span>{title}</span>
            <span>{val ? val : "intrim spin"}</span>
        </h2>
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