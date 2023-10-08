import { useForRandomRecipesList, useForRecipeCarouselItems, useForTruthToggle } from '@/hooks/forComponents'
import { RecipeMealType } from '@/types'
import { searchRecipes } from '@/utils/dataFetching'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import styles from "./Recipe.module.css"
import { Badge } from '../ui/badge'
import { extractRecipeId } from '../forFilters/RecipesView'
import { ellipsedText } from './FewNonRelatedRecipes'

export const ShowFewRelatedRecipes = ({ mealType, diet, dishType }: { mealType: string, diet: string, dishType: string }) => {
    // const [recipes, setRecipes] = useState<RecipeMealType[]>([])

    // const readySimilarRcipesRequest = () => {
    //     const params = {
    //         mealType: mealType,
    //         diet: diet.toLocaleLowerCase(),
    //         dishyType: dishType,
    //         random: true,
    //         type: "public",
    //         app_id: process.env.NEXT_PUBLIC_EDAMAM_APP_ID,
    //         app_key: process.env.NEXT_PUBLIC_EDAMAM_APP_KEY
    //     }

    //     searchRecipes(params).then(d => {
    //         // console.log(d, "!!")
    //         const onlyRecipes = d?.hits.map((item: any) => item.recipe)
    //         onlyRecipes?.length && setRecipes(onlyRecipes)
    //     }).catch(err => console.log(err))

    // }

    // useEffect(() => {
    //     readySimilarRcipesRequest()
    // }, [mealType, diet, dishType])

    const {recipes} = useForRandomRecipesList(mealType, diet, dishType)

    return (
        <div className='h-fit'>
            ShowFewRelatedRecipes -- {recipes.length} -- {recipes.filter(item=>item.dishType.length).length} -- {mealType} -- {diet} -- {dishType}
            <h2 className='text-xl font-bold'>A Few Related Recipes</h2>
            <RenderRecipesListCarousel data={recipes.filter(item=>item.dishType.length)} />
        </div>
    )
}

export const RenderRecipesListCarousel = ({ data }: { data: RecipeMealType[] }) => {
    const {handleFalsy, handleNext, handlePrev, handleTruthy, isTrue, onlyFour} = useForRecipeCarouselItems(data)
    
    // const [beginFrom, setBeginFrom] = useState(0);
    // const [onlyFour, setOnlyFour] = useState<RecipeMealType[]>();

    // const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

    // const handleNext = () => {
    //     // if(isTrue) {
    //     //   // console.log("PAUSE from next")
    //     //   return
    //     // }
    //     if (beginFrom > data.length) {
    //         setBeginFrom(0)
    //     } else {
    //         // console.log("Now PAUSE from next, elseblck", isTrue)
    //         !isTrue && setBeginFrom(prev => prev + 1)
    //     }
    // }

    // const handlePrev = () => {
    //     if (beginFrom === 0) {
    //         setBeginFrom(data.length)
    //     } else {
    //         setBeginFrom(prev => prev - 1)
    //     }
    // }

    // const handleOnlyFour = () => {
    //     let temp: number[] = [];
    //     Array.from(Array(8).keys()).forEach((v => {
    //         if (v + beginFrom >= 20) {
    //             // console.log(v, beginFrom, v + beginFrom, "adjusted", (v + beginFrom) - 6)
    //             temp.push((v + beginFrom) - 20)
    //         } else {
    //             // console.log(v, beginFrom, v + beginFrom)
    //             temp.push(v + beginFrom)
    //         }
    //     }))

    //     let fourCards: RecipeMealType[] = []

    //     temp.forEach(v => {
    //         data.forEach((item, idx) => {
    //             // console.log(idx, v, "check")
    //             if (idx === v) {
    //                 fourCards.push(item)
    //                 //   fourCards.push({category: item.category, name: item.name, nutrition: item.nuttrition, picture: item.picture})
    //             }
    //         })
    //     })

    //     console.log(temp, fourCards)
    //     setOnlyFour(fourCards)
    // }

    // useEffect(() => {
    //     !isTrue && handleOnlyFour()
    // }, [beginFrom])

    // const renderRecipes = () => data.map(item => <RenderRecipeForCarousel key={item.uri} {...item} />)

    // useEffect(() => {
    //     let timer = setInterval(() => {

    //         console.log(isTrue, "istryue!!", timer)
    //         !isTrue ? handleNext() : clearInterval(timer)

    //         if (!isTrue) {
    //             handleNext()
    //             // console.log(beginFrom, "play from timer", !isTrue)
    //         } else {
    //             clearInterval(timer)
    //             // console.log(beginFrom, "pause from timer else block!!", !isTrue, timer)
    //             return
    //         }

    //         // console.log(beginFrom, "PAUSE from timer", isTrue)
    //     }, 200000)

    //     // !isTrue ? handleNext() : clearInterval(timer)

    //     // setTimerRunning(timer)
    //     return () => clearInterval(timer)

    // }, [beginFrom, isTrue])

    useEffect(() => {
        handleNext()
    }, [data])

    const renderRecipes = () => onlyFour?.map((item, idx) => <RenderRecipeForCarousel key={item.uri} rdata={item} lastCard={idx === 7} firstCard={idx===0} />)

    return (
        <div className='flex gap-x-4 items-center justify-between h-48 bg-slate-600'>
            <Button className='absolute left-0 bg-primary-content h-48 z-40 w-20 text-primary-focus font-extrabold bg-blend-multiply' onClick={handlePrev} variant={'secondary'}>Prev</Button>
            <div
                className='flex gap-4 flex-nowrap overflow-hidden h-40' 
                // className='grid grid-rows-1 grid-flow-col gap-4 place-content-start place-items-start'
                onMouseEnter={handleTruthy} onMouseLeave={handleFalsy}
            >
                {renderRecipes()}
            </div>
            <Button className='absolute right-0 bg-primary-content h-48 z-40 w-20 text-primary-focus font-extrabold' onClick={handleNext} variant={'secondary'}>Next</Button>
        </div>
    )
}

export type ForCarouselTypes = {
    rdata: RecipeMealType,
    firstCard: boolean,
    lastCard: boolean
}

export const RenderRecipeForCarousel = ({ rdata, firstCard, lastCard }: ForCarouselTypes) => {
    const { cuisineType, dishType, images, label, mealType, uri } = rdata;
    const { height, url, width } = images.SMALL;

    const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

    const recipeId = extractRecipeId(uri)

    return (
        <div
            // ${isTrue ? styles.cardHovered : ""}
            className={`${styles.fadeOutCard} w-48 relative ${(lastCard || firstCard) ? "pointer-events-none": "pointer-events-auto"}`}
            onMouseEnter={handleTruthy}
            onMouseLeave={handleFalsy}
        >
            {/* <h2>{label}</h2> */}
            <div className={`absolute transition-transform duration-500 ${isTrue ? "-translate-y-48" : "z-20"} text-center`}>
                <Badge>{cuisineType[0]} {firstCard ? "1" : null} {lastCard  ? "8" : null}</Badge>
                <img className='w-40 h-full' src={url} alt={label} height={height} width={width} />
            </div>
            <div className={`absolute top-0 transition-all duration-1000 ${isTrue ? "z-20 opacity-100" : "z-0 opacity-0"} flex flex-col gap-y-1`}>
                {/* <h2>{label}</h2> */}
                <Link className={`${isTrue ? "text-xl" : ""}`} href={`/recipe/${recipeId}`} title={label}>{label.length > 11 ? ellipsedText(label, 11) : label}</Link>
                {/* <Badge>{label}</Badge> */}
                <Badge>{mealType[0]}</Badge>
                <Badge>{dishType[0]}</Badge>
            </div>
        </div>
    )
}