import { useForRandomRecipesList, useForRecipeCarouselItems, useForTruthToggle } from '@/hooks/forComponents'
import { RecipeMealType } from '@/types'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import styles from "./Recipe.module.css"
import { Badge } from '../ui/badge'
import { extractRecipeId } from '../forFilters/RecipesView'
import { ellipsedText } from './FewNonRelatedRecipes'
import { useLocale } from 'next-intl'

export const ShowFewRelatedRecipes = ({ mealType, diet, dishType }: { mealType: string, diet: string, dishType: string }) => {
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

    useEffect(() => {
        handleNext()
    }, [data])

    const renderRecipes = () => onlyFour?.map((item, idx) => <RenderRecipeForCarousel key={item.uri} rdata={item} lastCard={idx === 7} firstCard={idx===0} />)

    return (
        <div className='flex gap-x-4 items-center justify-between xxs:h-28 lg:h-48 bg-slate-600'>
            <Button className='absolute left-0 bg-accent h-48 z-40 xxs:w-4 lg:w-20 text-primary font-extrabold bg-blend-multiply' onClick={handlePrev} variant={'secondary'}>Prev</Button>
            {/* smaller screen */}
            <div
                className='xxs:flex lg:hidden gap-4 flex-nowrap overflow-hidden xxs:h-20 lg:h-40' 
                onMouseEnter={handleTruthy} onMouseLeave={handleFalsy}
            >
                {renderRecipes()?.slice(0, 3)}
            </div>

            {/* bigger screen */}
            <div
                className='xxs:hidden lg:flex gap-4 flex-nowrap overflow-hidden h-40' 
                onMouseEnter={handleTruthy} onMouseLeave={handleFalsy}
            >
                {renderRecipes()}
            </div>
            <Button className='absolute right-0 bg-accent text-primary h-48 z-40 xxs:w-4 lg:w-20 font-extrabold' onClick={handleNext} variant={'secondary'}>Next</Button>
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

    return (
        <div
            className={`${styles.fadeOutCard} w-48 relative ${(lastCard || firstCard) ? "pointer-events-none": "pointer-events-auto"}`}
            onMouseEnter={handleTruthy}
            onMouseLeave={handleFalsy}
        >
            <div className={`absolute transition-transform duration-500 ${isTrue ? "-translate-y-48" : "z-20"} text-center`}>
                <Badge className='xxs:text-sm lg:text-lg'>{cuisineType[0]}</Badge>
                <img className='w-40 h-full' src={url} alt={label} height={height} width={width} />
            </div>
            <div className={`absolute top-0 transition-all duration-1000 ${isTrue ? "z-20 opacity-100" : "z-0 opacity-0"} flex flex-col gap-y-1`}>
                <Link className={`${isTrue ? "text-xl" : ""}`} href={`/${locale}/recipe/${recipeId}`} title={label}>{label.length > 11 ? ellipsedText(label, 11) : label}</Link>
                <Badge>{mealType[0]}</Badge>
                <Badge>{dishType[0]}</Badge>
            </div>
        </div>
    )
}