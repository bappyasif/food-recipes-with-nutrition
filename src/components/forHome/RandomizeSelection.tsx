"use client"

import React, { useEffect, useRef, useState } from 'react'
import { MouseWheelBasedCarousel } from './MouseWheelBasedCarousel'
import { RecipeMealType } from '@/types';
import { cuisines, diets, dishes, health, meals } from '../forFilters/FiltersDashboard';
import { Button } from '../ui/button';
import { useForRanmoziedDataset, useForTruthToggle } from '@/hooks/forComponents';
import { searchRecipes } from '@/utils/dataFetching';
import { RandomizedRecipesView } from './RandomizedRecipesView';
import newImg from "../../../public/blob-s4f1.svg"
import { useTranslations } from 'use-intl';

export const RandomizeSelection = () => {
    const [rnds, setRnds] = useState({ cuisine: -1, dish: -1 })
    const [rndNames, setRndNames] = useState({ diet: "", meal: "", health: "" })

    const updateRnds = (val: number, key: string) => {
        setRnds(prev => ({ ...prev, [key]: val }))
    }

    const updateRndNames = (val: string, key: string) => setRndNames(prev => ({ ...prev, [key]: val }))

    const { dataset: cuisinesRandomized } = useForRanmoziedDataset(cuisines)

    const { dataset: dishesRandomized } = useForRanmoziedDataset(dishes)

    const [randomizedDataset, setRandomizedDataset] = useState<{
        forCuisines: string[];
        forDishes: string[];
    }>({ forCuisines: [], forDishes: [] })

    useEffect(() => {
        if (cuisinesRandomized.length === 8) {
            setRandomizedDataset(prev => ({ ...prev, forCuisines: cuisinesRandomized }))
        }

        if (dishesRandomized.length === 8) {
            setRandomizedDataset(prev => ({ ...prev, forDishes: dishesRandomized }))
        }

    }, [setRandomizedDataset, cuisinesRandomized, dishesRandomized])

    useEffect(() => {
        setRandomizedDataset({ forCuisines: cuisines, forDishes: dishes })
    }, [])

    // console.log(randomizedDataset, "radnmoised")

    const t = useTranslations("default")

    return (
        <div
            className='w-full h-fit relative flex flex-col gap-y-6 text-muted-foreground'
        >
            <h2 className='text-2xl font-extrabold w-full text-center'>{t("Randomly Recipe Finding Game")}</h2>

            <div className='flex xxs:flex-col lg:flex-row justify-start h-full'>
                <div className='flex xxs:flex-col lg:flex-row gap-x-0 justify-between px-28 xxs:w-full lg:w-1/2'>
                    {randomizedDataset.forCuisines.length <= 8 ?
                        <ReuseableWheelCarousel dataset={randomizedDataset.forCuisines} title='Randomize Cuisine' updateRnds={updateRnds} />
                        : null
                    }

                    {
                        randomizedDataset.forDishes.length
                            ? <ReuseableWheelCarousel dataset={randomizedDataset.forDishes} title='Randomize Dish' updateRnds={updateRnds} />
                            : null
                    }
                </div>

                <div className='xxs:w-full lg:w-1/2 flex gap-x-8 justify-evenly items-center px-2'>
                    <GoingOffRandomizer updateRndNames={updateRndNames} />

                    <div className='flex flex-col gap-y-9 justify-between items-center w-52'>
                        <ReuseableBoxedRandomizer data={diets} title={"Randomize Diet"} updateRndNames={updateRndNames} />
                        <ReuseableBoxedRandomizer data={meals} title={"Randomize Meal"} updateRndNames={updateRndNames} />
                    </div>
                </div>
            </div>

            <ShowRecipes rnds={rnds} rndNames={rndNames} wheelDataset={randomizedDataset} />
        </div>
    )
}

const GoingOffRandomizer = ({ updateRndNames }: { updateRndNames: (v: string, k: string) => void }) => {
    const [rnd, setRnd] = useState<number>(-1);

    const ref = useRef<HTMLDivElement>(null)

    const clonedData = health.concat(health, health);

    const chooseRnd = () => {
        setRnd(-1)

        const timer = setTimeout(() => {
            let calc = () => Math.round((Math.random() + .01) * clonedData.length)
            while (rnd === calc()) {
                calc()
            }

            setRnd(calc())
        }, 600)

        return () => clearTimeout(timer)
    }

    const renderDivs = () => (rnd >= 0 ? clonedData.slice(0, rnd) : clonedData).map((name, idx) => <div key={name + idx} className='absolute translate-y-5 z-0'>{name}</div>)

    const spewingOut = () => {
        if (ref.current) {
            ref.current.childNodes.forEach((divItm, idx) => {

                if (rnd === -2) {
                    (divItm as HTMLDivElement).style.transform = `translateY(18px) translateX(0px)`;
                    updateRndNames("", "health");
                    (divItm as HTMLDivElement).style.opacity = "1";
                    return
                }

                if (idx === rnd - 1) {
                    (divItm as HTMLDivElement).style.transform = `translateY(18px) translateX(0px)`;
                    // console.log("last item!!", divItm.textContent);
                    updateRndNames(divItm.textContent!, "health");
                    (divItm as HTMLDivElement).style.opacity = "1";
                } else {
                    const rndNum = Math.random();
                    (divItm as HTMLDivElement).style.transitionDuration = `${.6}s`;
                    (divItm as HTMLDivElement).style.transform = rndNum < .2 ? `translateX(${36}px)` : rndNum < .4 ? `translateY(-${36}px)` : rndNum < .6 ? `translateY(${36}px)` : `translateX(-${36}px)`;
                    (divItm as HTMLDivElement).style.opacity = `0`;
                }
            })
        }
    }

    useEffect(() => {
        setRnd(-2)
    }, [])

    useEffect(() => {
        spewingOut()
        rnd === -1 && updateRndNames("Intrim-spin", "health");
    }, [rnd])

    const t = useTranslations("default")

    return (
        <div className='flex flex-col xxs:gap-y-0 md:gap-y-1 w-60 relative'>
            <h2 className='text-center font-bold text-lg'>{t("Randomize")} {t("Health")} {t("Label")}</h2>
            <>
                <img src={newImg.src} alt="" width={20} height={20} className='absolute xxs:h-[4rem] sm:h-[4.7rem] md:h-[5.1rem] w-full bg-black bg-blend-darken top-[3.9rem] object-cover rounded-xl' />
                <div
                    ref={ref}
                    className="viewport flex flex-col justify-center items-center xxs:mt-2 md:mt-0 xxs:h-[5.6rem] sm:h-[6.7rem] lg:h-28 font-extrabold"
                >
                    {rnd > 0 ? renderDivs() : rnd === -2 ? <span>Spin It!!</span> : null}
                </div>
                <Button className='z-10 w-full bg-muted-foreground hover:bg-muted-foreground' variant={"secondary"} onClick={chooseRnd}><span className='transition-all duration-1000 hover:scale-150 w-full text-secondary hover:text-secondary'>{t("Spin")}</span></Button>
            </>
        </div>
    )
}

const ReuseableBoxedRandomizer = ({ data, title, updateRndNames }: { data: string[], title: string, updateRndNames: (v: string, t: string) => void }) => {
    const clonedData = data.concat(data, data, data, data, data, data)

    const renderDivs = () => clonedData.map((name, idx) => <div className={`h-8 w-full flex justify-center items-center text-muted-foreground ${idx === prevSlideShown ? "bg-primary font-bold text-secondary" : "bg-secondary"}`} key={name + idx}>{name}</div>)

    const ref = useRef<HTMLDivElement>(null)

    const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

    const [prevSlideShown, setPrevSlideShown] = useState(-1);

    const decideKey = () => title.includes("Diet") ? "diet" : "meal"

    const spinningEffectRandomAmount = () => {
        updateRndNames("intrim spin!!", decideKey())

        const chooseSlide = () => Math.floor(Math.random() * clonedData.length)


        if (ref.current !== null) {
            let calc = (Math.round(Math.random() * (diets.length * 33)))
            for (let i = 0; i < calc; i++) {
                ref.current!.style.transitionDuration = ".6s"
                ref.current!.style.transform = `translateY(-${i}px)`
            }

            handleFalsy()
        }

        let slide = chooseSlide()

        let keepingTracks = 0

        while (Math.abs(prevSlideShown - slide) < 10 && keepingTracks < 9) {
            const safeRange = Math.abs(clonedData.length - prevSlideShown)
            slide = keepingTracks === 8 ? safeRange : chooseSlide()
            keepingTracks++
        }

        ref.current!.style.transitionDuration = ".6s"

        ref.current!.style.transform = `translateY(-${slide * 2.22}rem)`

        setPrevSlideShown(slide)

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

    const t = useTranslations("default")

    return (
        <div className='w-full flex flex-col xxs:gap-y-0 lg:gap-y-4 relative h-full'>
            <h2 className='text-center font-bold text-lg'>{title.split(" ").map(wd => t(`${wd}`)).join(" ")}</h2>
            <>
                <img src={newImg.src} alt="" width={20} height={20} className='absolute top-8 h-20 w-56 bg-black bg-blend-darken -z-0 object-cover rounded-lg' />

                <div className="viewport bg-secondary xxs:h-[5.1rem] sm:h-[5.6rem] lg:h-14 overflow-hidden mix-blend-lighten rounded-lg">
                    <div className="flex flex-col gap-y-1 items-center justify-center" ref={ref}>
                        {renderDivs()}
                    </div>
                </div>

                <Button className='md:mt-0 w-full z-10 bg-muted-foreground hover:bg-muted-foreground' variant={"secondary"} onClick={handleTruthy}><span className='transition-all duration-1000 hover:scale-150 w-full text-secondary hover:text-muted'>{t("Spin")}</span></Button>
            </>
        </div>
    )
}

type RndNamesTypes = {
    diet: string;
    meal: string;
    health: string
}


const ShowRecipes = ({ rnds, rndNames, wheelDataset }: {
    rnds: {
        dish: number,
        cuisine: number
    },
    rndNames: RndNamesTypes,
    wheelDataset: {
        forCuisines: string[];
        forDishes: string[];
    }
}) => {
    const { cuisine, dish } = rnds;
    const { diet, health, meal } = rndNames;

    const [recipes, setRecipes] = useState<RecipeMealType[]>([])

    const handleClick = () => {
        // console.log(diet, health, meal)
        // resetting previously existing recipes
        setRecipes([]);

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
            // console.log(res, "response!!")
            const onlyRecipes = res?.hits.map((item: any) => item.recipe)

            const readyForRendering = onlyRecipes.map((item: any) => item.mealType.length && item.dishType.length && item.dietLabels.length && item).filter((item: any) => item).filter((v: any, idx: number, self: any) => idx === self.findIndex((t: any) => t.label === v.label))

            readyForRendering?.length && setRecipes(readyForRendering)
        })
    }

    const t = useTranslations("default")

    return (
        <>
            <div className='flex flex-col gap-y-4 items-center justify-center w-full self-end h-full'>
                <h2 className='text-2xl font-bold'>{t("Existing Filters")}</h2>

                <div className='flex gap-x-4'>
                    <ShowTitle rnds={rnds} wheelDataset={wheelDataset} />
                    <ShowRandomlySelectedOptions rndNames={rndNames} />
                </div>

                <Button className='bg-muted-foreground font-bold w-fit hover:bg-primary' onClick={handleClick} variant={'default'}><span className='transition-all duration-1000 hover:scale-110 w-full text-muted'>{t("Find Recipes")}</span></Button>
            </div>
            <RandomizedRecipesView recipes={recipes} handleClick={handleClick} />
        </>
    )
}

const ShowRandomlySelectedOptions = ({ rndNames }: {
    rndNames: RndNamesTypes
}) => {
    const { diet, meal, health } = rndNames
    return (
        <div className='flex gap-x-4'>
            <ShowOptionSelected title='Diet' val={diet} />

            <ShowOptionSelected title='Meal' val={meal} />

            <ShowOptionSelected title='Health Label' val={health} />
        </div>
    )
}

const ShowOptionSelected = ({ title, val }: { title: string, val: string }) => {
    const t = useTranslations("default")
    return (
        <h2 className='flex flex-col gap-y-2'>
            {/* <span className='font-bold text-lg'>{t(`${title}`)}</span> */}
            <span className='font-bold text-lg'>{title.split(" ").map(wd => t(`${wd}`)).join(" ")}</span>
            <span className='font-semibold text-sm'>{val ? val : "intrim spin"}</span>
        </h2>
    )
}

const ShowTitle = ({ rnds, wheelDataset }: {
    rnds: {
        dish: number,
        cuisine: number,
    },
    wheelDataset: {
        forCuisines: string[];
        forDishes: string[];
    }
}) => {
    const { dish, cuisine } = rnds

    const t = useTranslations("default")

    return (
        <div className='flex gap-x-4'>
            <h2 className='flex flex-col gap-y-2'>
                <span className='font-bold text-lg'>{t("Dish")}</span>
                {/* <span className='font-semibold text-sm'>{dishes[dish] ? dishes[dish] : "intrim spin"}</span> */}
                <span className='font-semibold text-sm'>{wheelDataset.forDishes[dish] ? wheelDataset.forDishes[dish] : "intrim spin"}</span>
            </h2>
            <h2 className='flex flex-col gap-y-2'>
                <span className='font-bold text-lg'>{t("Cuisine")}</span>
                {/* <span className='font-semibold text-sm'>{cuisines[cuisine] ? cuisines[cuisine] : "intrim spin"}</span> */}
                <span className='font-semibold text-sm'>{wheelDataset.forCuisines[cuisine] ? wheelDataset.forCuisines[cuisine] : "intrim spin"}</span>
            </h2>
        </div>
    )
}


const ReuseableWheelCarousel = ({ dataset, title, updateRnds }: {
    dataset: string[],
    title: string,
    updateRnds: (v: number, t: string) => void
}) => {
    const [rndNum, setRndNum] = useState(0);

    const handleRandomNumber = () => setRndNum(Math.round(Math.random() * 7))

    const handleResetRandomNumber = () => setRndNum(-1)

    const isItForDish = () => title.includes("Dish")

    useEffect(() => {
        updateRnds(rndNum, isItForDish() ? "dish" : "cuisine")
    }, [rndNum])

    const t = useTranslations("default")

    return (
        <div className={`flex justify-center relative z-20 h-96`}>
            <h2 className='text-center font-bold text-lg'>{title.split(" ").map(wd => t(`${wd}`)).join(" ")}</h2>
            <MouseWheelBasedCarousel handleRandomNumber={handleRandomNumber} rndNum={rndNum} handleResetRandomNumber={handleResetRandomNumber} dataset={dataset} />
        </div>
    )
}