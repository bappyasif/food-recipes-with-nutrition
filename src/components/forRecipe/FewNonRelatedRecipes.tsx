import { useForRandomRecipesList, useForRecipeCarouselItems, useForTruthToggle } from '@/hooks/forComponents'
import React, { useEffect, useState } from 'react'
import { ForCarouselTypes } from './ShowFewRelatedRecipes'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import Link from 'next/link'
import { extractRecipeId } from '../forFilters/RecipesView'
import { diets, dishes, meals } from '../forFilters/FiltersDashboard'
import { useLocale } from 'next-intl'
import { useTranslations } from "use-intl"
import Image from 'next/image'

export const FewNonRelatedRecipes = ({ diet, dishType, mealType }: { diet: string, dishType: string, mealType: string }) => {
    
    const [randomizedFilters, setRandomizedFilters] = useState({ diet: "", dishType: "", mealType: "" })

    const randomlyChooseFromFilteredDataset = () => {
        const filteredDiet = diets.filter(name => name.toLocaleLowerCase() !== diet.toLocaleLowerCase())

        const filteredDishType = dishes.filter(name => name.toLocaleLowerCase() !== dishType.toLocaleLowerCase())

        const filteredMealType = meals.filter(name => name.toLocaleLowerCase() !== mealType.toLocaleLowerCase())

        const rndForDiet = Math.floor(Math.random() * filteredDiet.length)

        const rndForDishType = Math.floor(Math.random() * filteredDishType.length)

        const rndForMealType = Math.floor(Math.random() * filteredMealType.length)

        setRandomizedFilters({ diet: filteredDiet[rndForDiet], dishType: filteredDishType[rndForDishType], mealType: filteredMealType[rndForMealType] })
    }

    useEffect(() => {
        (mealType && diet && dishType) && setTimeout(() => randomlyChooseFromFilteredDataset(), 900)
    }, [diet, dishType, mealType])

    const { recipes } = useForRandomRecipesList(randomizedFilters.mealType, randomizedFilters.diet, randomizedFilters.dishType, undefined, true)

    const { handleFalsy, handleNext, handlePrev, handleTruthy, isTrue, onlyFour } = useForRecipeCarouselItems(recipes)

    useEffect(() => {
        handleNext()
    }, [recipes])

    const renderRecipes = () => onlyFour?.map((item, idx) => <RenderNonRelatedRecipe key={item.uri} rdata={item} lastCard={idx === 7} firstCard={idx === 0} />)

    const t = useTranslations("default")

    // console.log(randomizedFilters, "randomizedFilters - non-related recipes!!")

    return (
        recipes.length < 2
            ? "Not Enough Other Interesting Recipes Found To Show"
            :
            <div className='w-full flex flex-col gap-y-2 text-special-foreground'>
                <h2 className='xxs:text-xs sm:text-sm md:text-lg lg:text-xl font-bold'>{t("You Might Like")}</h2>

                <div className='flex gap-x-4 justify-between mx-4'>
                    <Button className='xxs:w-4 lg:w-20 self-center text-muted-foreground hover:text-primary-foreground font-bold bg-card' variant={'default'} onClick={handlePrev}>Prev</Button>

                    {/* very smaller screen */}
                    <div
                        className='capitalize xxs:grid md:hidden grid-flow-row grid-cols-2 gap-4 justify-items-center place-items-center'
                        onMouseEnter={handleTruthy} onMouseLeave={handleFalsy}
                    >
                        {renderRecipes()?.slice(0, 2)}
                    </div>

                    {/* smaller screen */}
                    <div
                        className='capitalize xxs:hidden md:flex lg:hidden gap-4 flex-nowrap overflow-hidden xxs:h-20 lg:h-40'
                        onMouseEnter={handleTruthy} onMouseLeave={handleFalsy}
                    >
                        {renderRecipes()?.slice(0, 5)}
                    </div>

                    {/* bigger screen */}
                    <div
                        className='capitalize xxs:hidden lg:grid grid-flow-row grid-cols-8 gap-4 justify-items-center place-items-center'
                        onMouseEnter={handleTruthy} onMouseLeave={handleFalsy}
                    >
                        {renderRecipes()}
                    </div>
                    <Button className='xxs:w-4 lg:w-20 self-center font-bold bg-card text-muted-foreground hover:text-primary-foreground' variant={'default'} onClick={handleNext}>Next</Button>
                </div>
            </div>
    )
}

const RenderNonRelatedRecipe = ({ rdata, firstCard, lastCard }: ForCarouselTypes) => {
    const { cuisineType, dishType, images, label, mealType, uri } = rdata;
    const { height, url, width } = images.SMALL;

    const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

    const recipeId = extractRecipeId(uri)

    const locale = useLocale()

    return (
        <div
            className='flex justify-center gap-x-4 relative'
            onMouseEnter={handleTruthy}
            onMouseLeave={handleFalsy}
        >
            <div
                className={`transition-transform duration-500 ${isTrue ? "scale-0" : "z-20 scale-100"} text-center`}
            >
                <Badge>{cuisineType[0]}</Badge>
                {/* <Image
                    src={url} alt={label} height={height} width={width}
                    className='w-36 h-32 object-cover rounded-sm'
                    blurDataURL={url} placeholder='blur' loading='lazy'
                /> */}
                <img
                    src={url} alt={label} height={height} width={width}
                    className='w-36 h-32 object-cover rounded-sm'
                    // blurDataURL={url} placeholder='blur' 
                    loading='lazy'
                />
            </div>
            <div
                className={`transition-transform duration-500 ${isTrue ? "scale-100" : "z-20 scale-0"} text-center absolute self-center flex flex-col gap-y-2`}
            >
                <Link className={`${isTrue ? "text-lg" : ""} hover:underline`} href={`/${locale}/recipe/${recipeId}`} title={label}>{label.length > 18 ? ellipsedText(label, 18) : label}</Link>

                <Badge className='w-fit'>{mealType[0]}</Badge>
                <Badge className='w-fit'>{dishType[0]}</Badge>
            </div>
        </div>
    )
}

export const ellipsedText = (text: string, highLen: number) => {
    let newStr = "";
    if (text.length > highLen) {
        newStr += text.slice(0, highLen) + "...."
    }

    return newStr
}