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
import { useTranslations } from 'use-intl';
import Image from 'next/image'

export const ShowFewRelatedRecipes = ({ mealType, diet, dishType, uri }: { mealType: string, diet: string, dishType: string, uri?: string }) => {
    const {recipes} = useForRandomRecipesList(mealType, diet, dishType, uri)

    const t = useTranslations("default")

    return (
        <div className='h-fit'>
            ShowFewRelatedRecipes -- {recipes.length} -- {recipes.filter(item=>item.dishType.length).length} -- {mealType} -- {diet} -- {dishType}
            <h2 className='text-xl font-bold'>{t("Similar Recipes")}</h2>
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
        <div className='flex gap-x-4 items-center justify-between xxs:h-28 lg:h-48'>
            <Button className='absolute left-0 h-48 z-40 xxs:w-4 lg:w-20 text-primary font-extrabold bg-blend-lighten hover:text-card-foreground bg-card' onClick={handlePrev} variant={'default'}>Prev</Button>
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
            <Button className='absolute right-0 bg-card text-primary h-48 z-40 xxs:w-4 lg:w-20 font-extrabold hover:text-card-foreground' onClick={handleNext} variant={'default'}>Next</Button>
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
                <Badge className='xxs:text-sm lg:text-lg capitalize'>{cuisineType[0]}</Badge>
                {/* <img className='w-40 h-full rounded-md' src={url} alt={label} height={height} width={width} /> */}
                <Image
                    src={url} alt={label} height={height} width={width}
                    className='w-40 h-full rounded-md'
                    blurDataURL={url} placeholder='blur' loading='lazy'
                />
            </div>
            <div className={`absolute top-0 capitalize transition-all duration-1000 ${isTrue ? "z-20 opacity-100" : "z-0 opacity-0"} flex flex-col gap-y-1`}>
                <Link className={`${isTrue ? "text-xl" : ""}`} href={`/${locale}/recipe/${recipeId}`} title={label}>{label.length > 11 ? ellipsedText(label, 11) : label}</Link>
                <Badge>{mealType[0]}</Badge>
                <Badge>{dishType[0]}</Badge>
            </div>
        </div>
    )
}