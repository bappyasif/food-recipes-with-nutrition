import { useForRandomRecipesList, useForRecipeCarouselItems, useForTruthToggle } from '@/hooks/forComponents'
import React, { useEffect, useState } from 'react'
import { ForCarouselTypes, RenderRecipeForCarousel, RenderRecipesListCarousel } from './ShowFewRelatedRecipes'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import Link from 'next/link'
import { extractRecipeId } from '../forFilters/RecipesView'
import styles from "./Recipe.module.css"
import { diets, dishes, meals } from '../forFilters/FiltersDashboard'

export const FewNonRelatedRecipes = ({ diet, dishType, mealType }: { diet: string, dishType: string, mealType: string }) => {
    const [randomizedFilters, setRandomizedFilters] = useState({ diet: "", dishType: "", mealType: "" })

    const randomlyChooseFromFilteredDataset = () => {
        const filteredDiet = diets.filter(name => name.toLocaleLowerCase() !== diet.toLocaleLowerCase())
        const filteredDishType = dishes.filter(name => name.toLocaleLowerCase() !== dishType.toLocaleLowerCase())
        const filteredMealType = meals.filter(name => name.toLocaleLowerCase() !== mealType.toLocaleLowerCase())

        const rndForDiet = Math.floor(Math.random() * filteredDiet.length)
        const rndForDishType = Math.floor(Math.random() * filteredDishType.length)
        const rndForMealType = Math.floor(Math.random() * filteredMealType.length)

        console.log(filteredDiet, filteredDishType, filteredMealType, "filtered!!", diet, dishType, mealType, filteredDiet[rndForDiet], filteredDishType[rndForDishType], filteredMealType[rndForMealType])

        setRandomizedFilters({ diet: filteredDiet[rndForDiet], dishType: filteredDishType[rndForDishType], mealType: filteredMealType[rndForMealType] })
    }

    useEffect(() => {
        diet && dishType && mealType && randomlyChooseFromFilteredDataset()
    }, [diet, dishType, mealType])

    // const {recipes} = useForRandomRecipesList("lunch", "balanced", "side dish")
    // const {recipes} = useForRandomRecipesList(filteredMealType[rndForMealType], filteredDiet[rndForDiet], filteredDishType[rndForDishType])
    const { recipes } = useForRandomRecipesList(randomizedFilters.mealType, randomizedFilters.diet, randomizedFilters.dishType)

    const { handleFalsy, handleNext, handlePrev, handleTruthy, isTrue, onlyFour } = useForRecipeCarouselItems(recipes)

    useEffect(() => {
        handleNext()
    }, [recipes])

    const renderRecipes = () => onlyFour?.map((item, idx) => <RenderNonRelatedRecipe key={item.uri} rdata={item} lastCard={idx === 7} firstCard={idx === 0} />)

    return (
        <div className='w-full'>
            FewNonRelatedRecipes - {recipes.length} - {onlyFour?.length}
            <h2 className='text-xl font-bold'>Few Non Related Recipes</h2>
            <div className='flex gap-x-4 justify-between mx-4'>
                <Button className='self-center text-primary font-bold bg-card hover:bg-transparent' variant={'default'} onClick={handlePrev}>Prev</Button>
                <div
                    // className='flex gap-4 flex-nowrap overflow-hidden h-40' 
                    // className='grid auto-rows-max grid-flow-col gap-4 place-content-start place-items-start'
                    className='grid grid-flow-row grid-cols-8 gap-4 justify-items-center place-items-center'
                    // className='columns-3 gap-4'
                    onMouseEnter={handleTruthy} onMouseLeave={handleFalsy}
                >
                    {renderRecipes()}
                </div>
                <Button className='self-center text-primary font-bold bg-card hover:bg-transparent' variant={'default'} onClick={handleNext}>Next</Button>
            </div>
        </div>
    )
}

const RenderNonRelatedRecipe = ({ rdata, firstCard, lastCard }: ForCarouselTypes) => {
    const { cuisineType, dishType, images, label, mealType, uri } = rdata;
    const { height, url, width } = images.SMALL;

    const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

    const recipeId = extractRecipeId(uri)

    return (
        <div
            // ${isTrue ? styles.cardHovered : ""}
            // className={`${styles.fadeOutCard} relative ${(lastCard || firstCard) ? "pointer-events-none": "pointer-events-auto"}`}
            // className={`relative ${(lastCard || firstCard) ? "pointer-events-none": "pointer-events-auto"}`}
            className='flex justify-center gap-x-4 relative'
            onMouseEnter={handleTruthy}
            onMouseLeave={handleFalsy}
        >
            {/* <h2>{label}</h2> */}
            <div
                className={`transition-transform duration-500 ${isTrue ? "scale-0" : "z-20 scale-100"} text-center`}
            >
                <Badge>{cuisineType[0]} {firstCard ? "1" : null} {lastCard ? "8" : null}</Badge>
                <img className='w-36 h-32 object-cover rounded-sm' src={url} alt={label} height={height} width={width} />
            </div>
            <div
                // className={`absolute top-0 transition-all duration-1000 ${isTrue ? "z-20 opacity-100" : "z-0 opacity-100"} flex flex-col gap-y-1 text-primary-foreground`}
                className={`transition-transform duration-500 ${isTrue ? "scale-100" : "z-20 scale-0"} text-center absolute self-center flex flex-col gap-y-2`}
            >
                {/* <h2>{label}</h2> */}
                <Link className={`${isTrue ? "text-lg" : ""} hover:underline`} href={`/recipe/${recipeId}`} title={label}>{label.length > 18 ? ellipsedText(label, 18) : label}</Link>
                {/* <Badge>{label}</Badge> */}
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