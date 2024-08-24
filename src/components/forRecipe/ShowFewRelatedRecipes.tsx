import { useForRandomRecipesList, useForRecipeCarouselItems, useForTruthToggle } from '@/hooks/forComponents'
import { RecipeMealType } from '@/types'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import styles from "./Recipe.module.css"
import { Badge } from '../ui/badge'
import { extractRecipeId, removeWrodRecipe } from '../forFilters/RecipesView'
import { ellipsedText } from './FewNonRelatedRecipes'
import { useLocale } from 'next-intl'
import { useTranslations } from 'use-intl';
import { TbLoader2 } from 'react-icons/tb'

export const ShowFewRelatedRecipes = ({ mealType, diet, dishType, uri }: { mealType: string, diet: string, dishType: string, uri?: string }) => {
    const { recipes } = useForRandomRecipesList(mealType, diet, dishType, uri)

    const t = useTranslations("default")

    if (recipes.length < 2) return

    return (
        <div className='flex flex-col xxs:gap-y-4 md:gap-y-10'>
            <h2 className='xxs:text-xs sm:text-sm md:text-lg lg:text-xl font-bold'>{t("Similar Recipes")}</h2>
            <RenderRecipesListCarousel data={recipes.filter(item => item.dishType.length)} />
        </div>
    )
}

export const RenderRecipesListCarousel = ({ data }: { data: RecipeMealType[] }) => {
    const { handleFalsy, handleNext, handlePrev, handleTruthy, isTrue, onlyFour } = useForRecipeCarouselItems(data)

    useEffect(() => {
        handleNext()
    }, [data])

    const renderRecipes = () => onlyFour?.map((item, idx) => <RenderRecipeForCarousel key={item.uri} rdata={item} lastCard={idx === 7} firstCard={idx === 0} />)

    return (
        <div className='flex gap-x-4 items-center justify-center'>
            <Button className='absolute left-0 xxs:h-20 lg:h-56 z-40 xxs:w-4 lg:w-20 text-accent font-extrabold bg-secondary hover:bg-primary' onClick={handlePrev} variant={'default'}>Prev</Button>

            {/* very smaller screen */}
            <div
                className='xxs:flex sm:hidden gap-4 flex-nowrap overflow-hidden mx-10'
                onMouseEnter={handleTruthy} onMouseLeave={handleFalsy}
            >
                {renderRecipes()?.slice(0, 2)}
            </div>

            {/* smaller screen */}
            <div
                className='xxs:hidden sm:flex md:hidden gap-4 flex-nowrap overflow-hidden mx-10'
                onMouseEnter={handleTruthy} onMouseLeave={handleFalsy}
            >
                {renderRecipes()?.slice(0, 3)}
            </div>

            {/* medium screen */}
            <div
                className='xxs:hidden md:flex lg:hidden gap-4 flex-nowrap overflow-hidden mx-14'
                onMouseEnter={handleTruthy} onMouseLeave={handleFalsy}
            >
                {renderRecipes()?.slice(0, 5)}
            </div>

            {/* bigger screen */}
            <div
                className='xxs:hidden lg:flex gap-4 flex-nowrap overflow-hidden'
                onMouseEnter={handleTruthy} onMouseLeave={handleFalsy}
            >
                {renderRecipes()}
            </div>

            <Button className='absolute right-0 bg-secondary hover:bg-primary text-accent xxs:h-20 lg:h-56 z-40 xxs:w-4 lg:w-20 font-extrabold' onClick={handleNext} variant={'default'}>Next</Button>
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

    const { handleFalsy: falsy, handleTruthy: truthy, isTrue: isLoading } = useForTruthToggle()


    return (
        <div
            className={`${styles.fadeOutCard} xxs:w-44 lg:w-60 relative ${(lastCard || firstCard) ? "lg:pointer-events-none" : "pointer-events-auto"} xxs:h-36 lg:w-56 lg:h-52`}
            onMouseEnter={handleTruthy}
            onMouseLeave={handleFalsy}
        >
            <div className={`absolute transition-transform duration-500 ${isTrue ? "-translate-y-56" : "z-20"} text-center`}>
                <Badge className={`xxs:text-xs sm:text-sm lg:text-lg capitalize ${test ? "visible" : "hidden"}`}>{cuisineType[0]}</Badge>
                
                <img
                    src={url} alt={label} height={height} width={width}
                    className={`xxs:w-40 sm:w-44 md:w-48 xxs:h-24 sm:h-28 md:h-32 lg:w-56 lg:h-52 rounded-md ${test ? "visible" : "hidden"} object-cover ${firstCard || lastCard ? "lg:opacity-60" : "lg:opacity-100"}`}
                    placeholder='blur'
                    loading='lazy'
                />

                <TbLoader2 size={80} className={`${isLoading ? "absolute animate-spin self-center xxs:w-40 sm:w-44 md:w-48 xxs:h-24 sm:h-28 md:h-32 lg:w-56 top-14 z-10" : "hidden"}`} />
            </div>
            <div className={`absolute top-[20%] left-[6%] capitalize transition-all duration-1000 ${isTrue ? "z-20 opacity-100" : "z-0 opacity-0"} flex flex-col gap-y-1`}>
                {/* smaller screen */}
                <Link
                    className={`${isTrue ? "xl:hidden xxs:text-sm sm:text-lg lg:text-xl capitalize" : ""} hover:text-muted-foreground hover:bg-secondary px-4`}
                    href={`/${locale}/recipe/${recipeId}`}
                    title={label}
                    onClick={isLoading ? falsy : truthy}
                >
                    {removeWrodRecipe(label).length > 20 ? ellipsedText(removeWrodRecipe(label), 20) : removeWrodRecipe(label)}
                </Link>

                {/* bigger screen */}
                <Link
                    className={`${isTrue ? "xxs:hidden xl:block xxs:text-sm sm:text-lg lg:text-xl capitalize" : ""} hover:text-muted-foreground hover:bg-secondary px-4`}
                    href={`/${locale}/recipe/${recipeId}`}
                    title={label}
                    onClick={isLoading ? falsy : truthy}
                >
                    {removeWrodRecipe(label).length > 36 ? ellipsedText(removeWrodRecipe(label), 36) : removeWrodRecipe(label)}
                </Link>
                <Badge>{mealType[0]}</Badge>
                <Badge>{dishType[0]}</Badge>
                <TbLoader2 size={40} className={`${isLoading ? "animate-spin self-start" : "hidden"}`} />
            </div>
        </div>
    )
}