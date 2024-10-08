"use client"

import React, { useEffect, useRef, useState } from 'react'
import { MouseWheelBasedCarousel } from './MouseWheelBasedCarousel'
import { RecipeMealType } from '@/types';
import { cuisines, diets, dishes, health, meals } from '../forFilters/FiltersDashboard';
import { Button } from '../ui/button';
import { useForRanmoziedDataset, useForTruthToggle } from '@/hooks/forComponents';
import { searchRecipes } from '@/utils/dataFetching';
import { RandomizedRecipesView } from './RandomizedRecipesView';
import { useTranslations, useLocale } from 'use-intl';

export const RandomizeSelection = () => {
    const [rnds, setRnds] = useState({ cuisine: -1, dish: -1 })
    const [rndNames, setRndNames] = useState({ diet: "", meal: "", health: "" })

    const updateRnds = (val: number, key: string) => {
        setRnds(prev => ({ ...prev, [key]: val }))
        handleFalsy()
    }

    const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

    const resetAllFilters = () => {
        handleTruthy();

        setRnds({ cuisine: -1, dish: -1 })
        setRndNames({ diet: "", health: "", meal: "" })
    }

    const updateRndNames = (val: string, key: string) => {
        setRndNames(prev => ({ ...prev, [key]: val }))
        handleFalsy()
    }

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

        handleFalsy()

    }, [setRandomizedDataset, cuisinesRandomized, dishesRandomized])

    useEffect(() => {
        setRandomizedDataset({ forCuisines: cuisines, forDishes: dishes })
        console.log("!!!!")
    }, [cuisines, dishes])

    const t = useTranslations("default")

    return (
        <div
            className='w-full h-fit relative flex flex-col justify-center gap-y-20 text-secondary'
        >
            <h2 className='text-2xl font-extrabold text-center bg-primary text-content-light w-fit mx-auto p-4 px-10 rounded'>{t("Randomly Recipe Finding Game")}</h2>

            <div
                className='flex flex-col xxs:gap-y-20 lg:gap-y-20 justify-center h-full w-full'
            >
                <div
                    className='flex xxs:flex-col xxs:gap-y-20 lg:gap-y-10 lg:flex-row gap-x-10 justify-between px-10'
                >
                    {randomizedDataset.forCuisines.length <= 8 ?
                        <ReuseableWheelCarousel dataset={randomizedDataset.forCuisines} title='Randomize Cuisine' updateRnds={updateRnds} clearExisting={isTrue} />
                        : null
                    }

                    {
                        randomizedDataset.forDishes.length
                            ? <ReuseableWheelCarousel dataset={randomizedDataset.forDishes} title='Randomize Dish' updateRnds={updateRnds} clearExisting={isTrue} />
                            : null
                    }
                </div>

                <div
                    className='xxs:w-full flex xxs:flex-col xxs:gap-y-10 lg:flex-row lg:gap-x-20 justify-center xxs:items-center lg:items-baseline px-28'
                >
                    <GoingOffRandomizer updateRndNames={updateRndNames} clearExisting={isTrue} />

                    <ReuseableBoxedRandomizer data={diets} title={"Randomize Diet"} updateRndNames={updateRndNames} clearExisting={isTrue} />
                    <ReuseableBoxedRandomizer data={meals} title={"Randomize Meal"} updateRndNames={updateRndNames} clearExisting={isTrue} />
                </div>
            </div>

            <ShowRecipes rnds={rnds} rndNames={rndNames} wheelDataset={randomizedDataset} resetAllFilters={resetAllFilters} />
        </div>
    )
}

const GoingOffRandomizer = ({ updateRndNames, clearExisting }: { updateRndNames: (v: string, k: string) => void, clearExisting: boolean }) => {
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

    const renderDivs = () => (rnd >= 0 ? clonedData.slice(0, rnd) : clonedData).map((name, idx) => <div key={name + idx} className='absolute -translate-y-15 translate-x-0 z-0 w-full text-center opacity-1'>{name}</div>)

    const spewingOut = () => {
        if (ref.current) {
            ref.current.childNodes.forEach((divItm, idx) => {

                if (rnd === -2) {
                    (divItm as HTMLDivElement).style.transitionDuration = `${.6}s`;
                    (divItm as HTMLDivElement).style.transform = `translateY(0) translateX(0)`;
                    updateRndNames("", "health");
                    (divItm as HTMLDivElement).style.opacity = "1";
                    return
                }

                if (idx === rnd - 1) {
                    (divItm as HTMLDivElement).style.transitionDuration = `${.9}s`;
                    (divItm as HTMLDivElement).style.transform = `translateY(0) translateX(0)`;
                    updateRndNames(divItm.textContent!, "health");
                    (divItm as HTMLDivElement).style.opacity = "1";
                } else {
                    const rndNum = Math.random();
                    (divItm as HTMLDivElement).style.transitionDuration = `${.6}s`;
                    (divItm as HTMLDivElement).style.transform = rndNum < .2 ? `translateX(${15}px)` : rndNum < .4 ? `translateY(-${15}px)` : rndNum < .6 ? `translateY(${15}px)` : `translateX(-${15}px)`;
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

    useEffect(() => {
        clearExisting && setRnd(-2)
    }, [clearExisting])

    const t = useTranslations("default")

    const locale = useLocale();

    const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

    return (
        <div className='flex flex-col xxs:gap-y-4 md:gap-y-10 w-80 relative'>
            <h2 className={`text-center font-bold ${locale === "bn" ? "text-lg" : "text-lg"} bg-quaternary rounded-md p-2 px-10`}>{t("Randomize")} {t("Health")} {t("Label")}</h2>
            <div>
                <div
                    ref={ref}
                    className="relative viewport flex flex-col justify-center items-center font-extrabold h-20 border-x-8 rounded-l-2xl rounded-r-2xl"
                >
                    {rnd > 0 ? renderDivs() : rnd === -2 ? <span className='absolute'>Spin It!!</span> : null}
                </div>
                <Button className='md:mt-2 z-10 w-full bg-muted-foreground hover:bg-muted-foreground' variant={"secondary"} onClick={chooseRnd} onMouseEnter={handleTruthy} onMouseLeave={handleFalsy}><span className={`transition-all duration-1000 hover:scale-150 w-full text-secondary ${isTrue ? "scale-150" : ""}`}>{t("Spin")}</span></Button>
            </div>
        </div>
    )
}

const ReuseableBoxedRandomizer = ({ data, title, updateRndNames, clearExisting }: { data: string[], title: string, updateRndNames: (v: string, t: string) => void, clearExisting: boolean }) => {
    const clonedData = data.concat(data, data, data, data, data, data)

    const renderDivs = () => clonedData.map((name, idx) => <div className={`h-8 w-full flex justify-center items-center text-muted-foreground ${idx === prevSlideShown ? "bg-primary font-bold z-20 text-muted-foreground" : "z-10 bg-accent text-secondary"} rounded-sm`} key={name + idx}>{name}</div>)

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

    useEffect(() => {
        clearExisting && setPrevSlideShown(-1)
    }, [clearExisting])

    const t = useTranslations("default")

    return (
        <div className='w-80 flex flex-col xxs:gap-y-4 lg:gap-y-10 relative h-full'>
            <h2 className='text-center font-bold text-lg bg-quaternary rounded-md p-2 px-10'>{title.split(" ").map(wd => t(`${wd}`)).join(" ")}</h2>
            <div>

                <div className="viewport h-20 overflow-hidden rounded-lg border-x-8 rounded-l-2xl rounded-r-2xl">
                    <div className="flex flex-col gap-y-1 items-center justify-center" ref={ref}>
                        {renderDivs()}
                    </div>
                </div>

                <Button className='mt-2 w-full z-10 bg-muted-foreground hover:bg-muted-foreground' variant={"secondary"} onClick={handleTruthy}><span className='transition-all duration-1000 hover:scale-150 w-full text-secondary hover:text-muted'>{t("Spin")}</span></Button>
            </div>
        </div>
    )
}

type RndNamesTypes = {
    diet: string;
    meal: string;
    health: string
}


const ShowRecipes = ({ rnds, rndNames, wheelDataset, resetAllFilters }: {
    rnds: {
        dish: number,
        cuisine: number
    },
    rndNames: RndNamesTypes,
    wheelDataset: {
        forCuisines: string[];
        forDishes: string[];
    },
    resetAllFilters: () => void
}) => {
    const { cuisine, dish } = rnds;
    const { diet, health, meal } = rndNames;

    const [recipes, setRecipes] = useState<RecipeMealType[]>([])

    const filtersCounts = () => {
        let count = 0;
        if (dishes[dish] && dish !== -1) count++
        if (cuisines[cuisine] && cuisine !== -1) count++
        if (dishes[dish] && dish !== -1) count++
        if (!health.includes("Intrim-spin") && health) count++
        if (!meal.includes("Spin it") && meal) count++
        if (!diet.includes("Spin it") && diet) count++
        return count
    }

    const [fetchText, setFetchText] = useState("")

    const handleClick = () => {
        // resetting previously existing recipes
        // going against it so that from modal we dont have to forcefully exit after brigning see more button within modal
        // setRecipes([]);

        const countFound = filtersCounts()

        if (countFound < 4) {
            alert(`add ${4 - countFound} more filter from randomizer!!`)
            return
        }

        setFetchText("Fetch Recipes In Progress....")

        const params = {
            mealType: !meal.includes("Spin it") ? meal : null,
            diet: !diet.includes("Spin it") ? diet.toLocaleLowerCase() : null,
            dishType: dishes[dish],
            cuisine: cuisines[cuisine],
            health: health || "immuno-supportive",
            random: true,
            type: "public",
            app_id: process.env.NEXT_PUBLIC_EDAMAM_APP_ID,
            app_key: process.env.NEXT_PUBLIC_EDAMAM_APP_KEY
        }

        searchRecipes(params).then(res => {
            const onlyRecipes = res?.hits.map((item: any) => item.recipe)

            const readyForRendering = onlyRecipes?.map((item: any) => item?.mealType?.length && item?.dishType?.length && item?.dietLabels?.length && item).filter((item: any) => item).filter((v: any, idx: number, self: any) => idx === self.findIndex((t: any) => t.label === v.label))

            readyForRendering?.length && setRecipes(readyForRendering)

            readyForRendering?.length && setFetchText("")

            !readyForRendering?.length && setFetchText("Sorry, Not Enough Recipes Found With This Combination!! Please Try Another Combination, Thank You :)")
        }).catch(err => {
            console.log(err)
            setFetchText("Fetch Failed!!")
        })
    }

    const t = useTranslations("default")

    const filterValues = () => {
        const temp: any = {}
        temp.cuisine = wheelDataset.forCuisines[rnds.cuisine]
        temp.dish = wheelDataset.forDishes[rnds.dish]
        temp.diet = rndNames.diet !== "Spint it" ? rndNames.diet : ""
        temp.health = rndNames.health !== "Spin it" ? rndNames.health : ""
        temp.meal = rndNames.meal !== "Spin it" ? rndNames.meal : ""
        return temp
    }

    const handleClickForSpinners = () => {
        setRecipes([])
        handleClick()
    }

    const handleResetFilters = () => {
        resetAllFilters()
        setRecipes([])
    }

    return (
        <>
            <div className='flex flex-col gap-y-10 items-center justify-center w-full self-end h-full'>
                <h2 className='text-2xl font-bold bg-primary text-content-light p-4 px-10 rounded-md'>{t("Existing Filters")}</h2>

                <div className='flex gap-4 justify-center flex-wrap'>
                    <ShowTitle rnds={rnds} wheelDataset={wheelDataset} />
                    <ShowRandomlySelectedOptions rndNames={rndNames} />
                </div>
                
                <div className='flex gap-x-4 justify-center'>
                    <Button disabled={fetchText === "Recipes Data Is Loading, In Progress...."} className='bg-muted-foreground font-bold w-fit hover:bg-primary' onClick={handleClickForSpinners} variant={'default'}><span className='transition-all duration-1000 hover:scale-110 w-full text-muted hover:text-accent'>{t("Find Recipes")}</span></Button>
                    <Button className='bg-muted-foreground font-bold w-fit hover:bg-destructive-foreground' onClick={handleResetFilters}><span className='transition-all duration-1000 hover:scale-110 w-full text-muted'>Clear Filters</span></Button>
                </div>
            </div>
            <RandomizedRecipesView recipes={recipes} handleClick={handleClick} existingFilters={filterValues()} fetchText={fetchText} />
        </>
    )
}

const ShowRandomlySelectedOptions = ({ rndNames }: {
    rndNames: RndNamesTypes
}) => {
    const { diet, meal, health } = rndNames
    return (
        <div className='flex gap-4 flex-wrap justify-center'>
            <ShowOptionSelected title='Diet' val={diet} />

            <ShowOptionSelected title='Meal' val={meal} />

            <ShowOptionSelected title='Health Label' val={health} />
        </div>
    )
}

const ShowOptionSelected = ({ title, val }: { title: string, val: string }) => {
    const t = useTranslations("default")
    return (
        <h2 className='flex flex-col gap-y-2 xxs:w-40 lg:w-44 text-center'>
            <span className='font-bold xxs:text-sm md:text-lg bg-quaternary rounded-md'>{title.split(" ").map(wd => t(`${wd}`)).join(" ")}</span>
            <span className='font-semibold xxs:text-xs md:text-sm text-secondary'>{val ? val : "intrim spin"}</span>
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
        <div className='flex gap-x-6'>
            <h2 className='flex flex-col gap-y-2 xxs:w-40 lg:w-44 text-center'>
                <span className='font-bold xxs:text-sm md:text-lg bg-quaternary rounded-md'>{t("Dish")}</span>
                <span className='font-semibold xxs:text-xs md:text-sm text-secondary'>{wheelDataset.forDishes[dish] ? wheelDataset.forDishes[dish] : "intrim spin"}</span>
            </h2>
            <h2 className='flex flex-col gap-y-2 xxs:w-40 lg:w-44 text-center'>
                <span className='font-bold xxs:text-sm md:text-lg bg-quaternary rounded-md'>{t("Cuisine")}</span>
                <span className='font-semibold xxs:text-xs md:text-sm text-secondary'>{wheelDataset.forCuisines[cuisine] ? wheelDataset.forCuisines[cuisine] : "intrim spin"}</span>
            </h2>
        </div>
    )
}


const ReuseableWheelCarousel = ({ dataset, title, updateRnds, clearExisting }: {
    dataset: string[],
    title: string,
    updateRnds: (v: number, t: string) => void,
    clearExisting: boolean
}) => {
    const [rndNum, setRndNum] = useState(-1);

    const handleRandomNumber = () => setRndNum(Math.round(Math.random() * 7))

    const handleResetRandomNumber = () => setRndNum(-1)

    const isItForDish = () => title.includes("Dish")

    useEffect(() => {
        updateRnds(rndNum, isItForDish() ? "dish" : "cuisine")
    }, [rndNum])

    useEffect(() => {
        clearExisting && setRndNum(-1)
    }, [clearExisting])

    const t = useTranslations("default")

    return (
        <div
            className={`flex justify-center relative z-20 h-[31rem] px-28`}
        >
            <h2 className='text-center font-bold text-lg bg-quaternary h-fit p-2 px-20 rounded-md'>{title.split(" ").map(wd => t(`${wd}`)).join(" ")}</h2>

            <MouseWheelBasedCarousel handleRandomNumber={handleRandomNumber} rndNum={rndNum} handleResetRandomNumber={handleResetRandomNumber} dataset={dataset} />
        </div>
    )
}