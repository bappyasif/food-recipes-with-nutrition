"use client"

import React, { useEffect, useRef, useState } from 'react'
import { MouseWheelBasedCarousel } from './MouseWheelBasedCarousel'
// import { categories, cuisines } from './DuoCarousels';
import { CategoriesCuisinesCarouselType, RecipeMealType } from '@/types';
import { cuisines, diets, dishes, health, meals } from '../forFilters/FiltersDashboard';
import { Button } from '../ui/button';
import { useForRanmoziedDataset, useForTruthToggle } from '@/hooks/forComponents';
import { searchRecipes } from '@/utils/dataFetching';
import { RandomizedRecipesView } from './RandomizedRecipesView';
import spewOffimg from "../../../public/blob-s2R2.svg"
import heroImg from "../../../public/heroImg.png"
// import newImg from "../../../public/blob-s1f1.svg"
// import newImg from "../../../public/blob-s3f1.svg"
import newImg from "../../../public/blob-s4f1.svg"

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

    }, [cuisinesRandomized, dishesRandomized])

    useEffect(() => {
        setRandomizedDataset({ forCuisines: cuisines, forDishes: dishes })
    }, [])

    // console.log(randomizedDataset, "radnmoised")

    return (
        <div
            className='w-full h-fit relative flex flex-col gap-y-6 text-muted-foreground'
        // style={{
        //     backgroundImage: `url(${heroImg.src})`,
        //     backgroundSize: "100% 100%",
        //     objectFit: "cover",
        //     backgroundRepeat: "no-repeat",
        //     backgroundColor: "rgba(17,17,17,0.6)",
        //     backgroundBlendMode: "darken",
        // }}    
        >
            {/* <h2>Lets Randomly Choose Recipe</h2> */}

            {/* <ShowRecipes rnds={rnds} rndNames={rndNames} /> */}

            <h2 className='text-2xl font-extrabold w-full text-center'>Lets Randomly Choose Recipe</h2>

            <div className='flex xxs:flex-col lg:flex-row justify-start h-full'>
                <div className='flex xxs:flex-col lg:flex-row gap-x-0 justify-between px-28 xxs:w-full lg:w-1/2'>
                    {/* <ReuseableWheelCarousel dataset={cuisinesRandomized || cuisines} title='Randomize Cuisine' updateRnds={updateRnds} /> */}
                    {/* <ReuseableWheelCarousel dataset={randomizedDataset.forCuisines} title='Randomize Cuisine' updateRnds={updateRnds} />

                    <ReuseableWheelCarousel dataset={randomizedDataset.forDishes} title='Randomize Dish Type' updateRnds={updateRnds} /> */}

                    {randomizedDataset.forCuisines.length === 8 ?
                    <ReuseableWheelCarousel dataset={randomizedDataset.forCuisines} title='Randomize Cuisine' updateRnds={updateRnds} />
                    : null
                    }

                    {
                        randomizedDataset.forDishes.length === 8
                        ? <ReuseableWheelCarousel dataset={randomizedDataset.forDishes} title='Randomize Dish Type' updateRnds={updateRnds} />
                        : null
                    }

                    {/* <ReuseableWheelCarousel dataset={dishesRandomized || dishes} title='Randomize Dish Type' updateRnds={updateRnds} /> */}
                </div>

                {/* <ShowRecipes rnds={rnds} rndNames={rndNames} /> */}
                <div className='xxs:w-full lg:w-1/2 flex gap-x-8 justify-evenly items-center'>
                    <GoingOffRandomizer updateRndNames={updateRndNames} />

                    <div className='flex flex-col gap-y-4 justify-between items-center w-56'>
                        <ReuseableBoxedRandomizer data={diets} title={"Randomize Diets"} updateRndNames={updateRndNames} />
                        <ReuseableBoxedRandomizer data={meals} title={"Randomize Meals"} updateRndNames={updateRndNames} />
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
        // updateRndNames("Intrim-spin", "health");

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

                if (rnd === -2) {
                    (divItm as HTMLDivElement).style.transform = `translateY(0px) translateX(0px)`;
                    // console.log("last item!!", divItm.textContent);
                    updateRndNames("", "health");
                    (divItm as HTMLDivElement).style.opacity = "1";
                    // (divItm as HTMLDivElement).textContent = "Intrim Spin"
                    return
                }

                // console.log(idx === rnd - 2, idx, rnd - 2);

                if (idx === rnd - 1) {
                    (divItm as HTMLDivElement).style.transform = `translateY(0px) translateX(0px)`;
                    console.log("last item!!", divItm.textContent);
                    updateRndNames(divItm.textContent!, "health");
                    (divItm as HTMLDivElement).style.opacity = "1";
                    // return
                } else {
                    const rndNum = Math.random();
                    (divItm as HTMLDivElement).style.transitionDuration = `${.6}s`;
                    // (divItm as HTMLDivElement).style.transform = `translateY(-${idx}px)`;
                    (divItm as HTMLDivElement).style.transform = rndNum < .2 ? `translateX(${36}px)` : rndNum < .4 ? `translateY(-${36}px)` : rndNum < .6 ? `translateY(${36}px)` : `translateX(-${36}px)`;
                    (divItm as HTMLDivElement).style.opacity = `0`;
                }
            })
        }
    }

    useEffect(() => {
        // chooseRnd()
        setRnd(-2)
    }, [])

    // const [showingOptions, setShowingOptions] = useState<string[]>([])

    // const renderOptions = () => {

    // }

    useEffect(() => {
        spewingOut()
        // renderDivs()
        rnd === -1 && updateRndNames("Intrim-spin", "health");
    }, [rnd])

    // console.log(spewOffimg.src, "svg!!")

    return (
        <div className='flex flex-col gap-y-9 w-60 relative'>
            <h2 className='text-center font-bold text-lg'>Randomize Health Labels</h2>
            <div>
                {/* <img src={spewOffimg.src} alt="" width={20} height={20} className='absolute h-20 w-60 bg-black bg-blend-darken top-14 object-cover rounded-xl' /> */}
                <img src={newImg.src} alt="" width={20} height={20} className='absolute h-20 w-full bg-black bg-blend-darken top-[3.9rem] object-cover rounded-xl' />
                <div
                    ref={ref}
                    className="viewport flex flex-col justify-center items-center h-20 font-extrabold"
                >
                    {/* {renderDivs().slice(0, rnd)} */}
                    {/* { rnd !== -1 ? renderDivs() : <span>"spin it!!"</span>} */}
                    {rnd > 0 ? renderDivs() : rnd === -2 ? <span>"Spin It!!"</span> : null}
                </div>
                <Button className='z-10 w-full bg-muted-foreground hover:bg-muted-foreground' variant={"secondary"} onClick={chooseRnd}><span className='transition-all duration-1000 hover:scale-150 w-full text-secondary hover:text-secondary'>Spin</span></Button>
            </div>
        </div>
    )
}

const ReuseableBoxedRandomizer = ({ data, title, updateRndNames }: { data: string[], title: string, updateRndNames: (v: string, t: string) => void }) => {
    // const withCloned = ([] as string[]).concat(diets[diets.length - 1], diets, diets[0])
    const clonedData = data.concat(data, data, data, data, data, data)
    const renderDivs = () => clonedData.map((name, idx) => <div className={`h-8 w-full flex justify-center items-center text-primary-foreground ${idx === prevSlideShown ? "bg-primary font-bold" : "bg-secondary"}`} key={name + idx}>{name}</div>)

    const ref = useRef<HTMLDivElement>(null)

    const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

    const [prevSlideShown, setPrevSlideShown] = useState(-1);

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
        <div className='w-full flex flex-col gap-y-4 relative'>
            <h2 className='text-center font-bold text-lg'>{title} </h2>
            <div className='my-0'>
                {/* <img src={spewOffimg.src} alt="" width={20} height={20} className='absolute top-8 h-14 w-56 bg-black bg-blend-darken -z-0 object-cover rounded-lg' /> */}

                <img src={newImg.src} alt="" width={20} height={20} className='absolute top-8 h-20 w-56 bg-black bg-blend-darken -z-0 object-cover rounded-lg' />

                <div className="viewport bg-secondary h-14 overflow-hidden mix-blend-lighten rounded-lg">
                    <div className="flex flex-col gap-y-1 items-center justify-center" ref={ref}>
                        {renderDivs()}
                    </div>
                </div>
                {/* <Button variant={"secondary"} onClick={runFourTimesForAnimation}>Spin</Button> */}
                <Button className='mt-3 w-full z-10 bg-muted-foreground hover:bg-muted-foreground' variant={"secondary"} onClick={handleTruthy}><span className='transition-all duration-1000 hover:scale-150 w-full text-secondary hover:text-muted'>Spin</span></Button>
            </div>
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
                <h2 className='text-2xl font-bold'>Lets find Recipes From These Types</h2>
                {/* {rnds["category"]} {rnds["cuisine"]} */}
                <div className='flex gap-x-4'>
                    <ShowTitle rnds={rnds} />
                    <ShowRandomlySelectedOptions rndNames={rndNames} />
                </div>
                <Button className='bg-primary font-bold w-fit hover:bg-card-foreground' onClick={handleClick} variant={'secondary'}><span className='transition-all duration-1000 hover:scale-110 w-full text-secondary hover:text-primary'>Click To Find Recipes</span></Button>
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
            <span className='font-bold text-lg'>{title}</span>
            <span className='font-semibold text-sm'>{val ? val : "intrim spin"}</span>
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
                <span className='font-bold text-lg'>Dish</span>
                {/* <span>{categories[diet]?.name ? categories[diet].name : "intrim spin"}</span> */}
                <span className='font-semibold text-sm'>{dishes[dish] ? dishes[dish] : "intrim spin"}</span>
            </h2>
            <h2 className='flex flex-col gap-y-2'>
                <span className='font-bold text-lg'>Cuisine</span>
                <span className='font-semibold text-sm'>{cuisines[cuisine] ? cuisines[cuisine] : "intrim spin"}</span>
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

    const isItForDish = () => title.includes("Dish")

    useEffect(() => {
        // console.log(isItForDish())
        updateRnds(rndNum, isItForDish() ? "dish" : "cuisine")
    }, [rndNum])

    // ${title.includes("Category") ? "justify-start" : "justify-end"}
    return (
        <div className={`flex justify-center relative z-20 h-96`}>
            <h2 className='text-center font-bold text-lg'>{title}</h2>
            <MouseWheelBasedCarousel handleRandomNumber={handleRandomNumber} rndNum={rndNum} handleResetRandomNumber={handleResetRandomNumber} dataset={dataset} />
        </div>
    )
}