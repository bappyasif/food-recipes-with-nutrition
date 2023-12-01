import { useForRandomRecipesList, useForRecipeCarouselItems, useForTruthToggle } from '@/hooks/forComponents'
import { RecipeMealType } from '@/types'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import styles from "./Recipe.module.css"
import { Badge } from '../ui/badge'
import { extractRecipeId } from '../forFilters/RecipesView'
import { ellipsedText } from './FewNonRelatedRecipes'
import { useLocale } from 'next-intl'
import { useTranslations } from 'use-intl';
import Image from 'next/image'

export const ShowFewRelatedRecipes = ({ mealType, diet, dishType, uri }: { mealType: string, diet: string, dishType: string, uri?: string }) => {
    const {recipes} = useForRandomRecipesList(mealType, diet, dishType, uri)

    const t = useTranslations("default")

    return (
        <div className='flex flex-col gap-y-2 text-special-foreground'>
            <h2 className='xxs:text-xs sm:text-sm md:text-lg lg:text-xl font-bold'>{t("Similar Recipes")}</h2>
            <RenderRecipesListCarousel data={recipes.filter(item=>item.dishType.length)} />
        </div>
    )
}

export const RenderRecipesListCarousel = ({ data }: { data: RecipeMealType[] }) => {
    const {handleFalsy, handleNext, handlePrev, handleTruthy, isTrue, onlyFour} = useForRecipeCarouselItems(data)

    useEffect(() => {
        handleNext()
    }, [data])

    const renderRecipes = () => onlyFour?.map((item, idx) => <RenderRecipeForCarousel key={item.uri} rdata={item} lastCard={idx === 7} firstCard={idx===0} />)

    return (
        data.length < 2
        ? "Not Enough Similar Recipes found"
        :
        <div className='flex gap-x-4 items-center justify-center xxs:h-40 lg:h-48'>
            <Button className='absolute left-0 xxs:h-20 lg:h-48 z-40 xxs:w-4 lg:w-20 text-primary font-extrabold bg-blend-lighten hover:text-card-foreground bg-card' onClick={handlePrev} variant={'default'}>Prev</Button>
            
            {/* very smaller screen */}
            <div
                className='xxs:flex md:hidden gap-4 flex-nowrap overflow-hidden xxs:h-20 lg:h-40' 
                onMouseEnter={handleTruthy} onMouseLeave={handleFalsy}
            >
                {renderRecipes()?.slice(0, 3)}
            </div>

            {/* smaller screen */}
            <div
                className='xxs:hidden md:flex lg:hidden gap-4 flex-nowrap overflow-hidden xxs:h-20 lg:h-40' 
                onMouseEnter={handleTruthy} onMouseLeave={handleFalsy}
            >
                {renderRecipes()?.slice(0, 5)}
            </div>

            {/* bigger screen */}
            <div
                className='xxs:hidden lg:flex gap-4 flex-nowrap overflow-hidden h-48' 
                onMouseEnter={handleTruthy} onMouseLeave={handleFalsy}
            >
                {renderRecipes()}
            </div>

            <Button className='absolute right-0 bg-card text-primary xxs:h-20 lg:h-48 z-40 xxs:w-4 lg:w-20 font-extrabold hover:text-card-foreground' onClick={handleNext} variant={'default'}>Next</Button>
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

    const locale = useLocale()

    const [test, setTest] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            setTest(true)
        }, 1500)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div
            className={`${styles.fadeOutCard} xxs:w-44 lg:w-60 relative ${(lastCard || firstCard) ? "pointer-events-none": "pointer-events-auto"}`}
            onMouseEnter={handleTruthy}
            onMouseLeave={handleFalsy}
        >
            <div className={`absolute transition-transform duration-500 ${isTrue ? "-translate-y-48" : "z-20"} text-center`}>
                <Badge className={`xxs:text-xs sm:text-sm lg:text-lg capitalize ${test ? "visible" : "hidden"}`}>{cuisineType[0]}</Badge>
                {/* <Image
                    src={url} alt={label} height={height} width={width}
                    className='w-40 h-full rounded-md'
                    blurDataURL={url} placeholder='blur' loading='lazy'
                /> */}
                <img
                    src={url} alt={label} height={height} width={width}
                    className={`xxs:w-40 xxs:h-24 lg:w-56 lg:h-40 rounded-md ${test ? "visible" : "hidden"} object-cover`}
                    // blurDataURL={url} 
                    placeholder='blur' 
                    loading='lazy'
                />
            </div>
            <div className={`absolute top-0 capitalize transition-all duration-1000 ${isTrue ? "z-20 opacity-100" : "z-0 opacity-0"} flex flex-col gap-y-1`}>
                <Link className={`${isTrue ? "xxs:text-sm sm:text-lg lg:text-xl capitalize" : ""}`} href={`/${locale}/recipe/${recipeId}`} title={label}>{label.length > 11 ? ellipsedText(label, 11) : label}</Link>
                <Badge>{mealType[0]}</Badge>
                <Badge>{dishType[0]}</Badge>
            </div>
        </div>
    )
}