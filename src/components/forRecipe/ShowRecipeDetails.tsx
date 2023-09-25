"use client"

import { RecipeMealType } from '@/types'
import { searchRecipeById, searchRecipes } from '@/utils/dataFetching'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Badge } from '../ui/badge'

export const ShowRecipeDetails = () => {
    const [recipeData, setRecipeData] = useState<RecipeMealType>()

    const dynamicParams = useParams()

    const prepareAndFetchData = () => {
        const params = {
            app_id: process.env.NEXT_PUBLIC_EDAMAM_APP_ID,
            app_key: process.env.NEXT_PUBLIC_EDAMAM_APP_KEY,
            // id: dynamicParams["slug-id"],
            type: "public"
        }

        searchRecipeById(params, dynamicParams["slug-id"] as string).then(d => {
            console.log(d)
            d.recipe && setRecipeData(d.recipe)
        }).catch(err => console.log(err))
        // searchRecipes(params).then(d=> console.log(d)).catch(err => console.log(err))
    }

    useEffect(() => {
        // dynamicParams["slug-id"] && prepareAndFetchData()
    }, [dynamicParams["slug-id"]])

    return (
        <div>
            ShowRecipeDetails -- {dynamicParams["slug-id"]}
            {recipeData?.label ? <RenderRecipe {...recipeData} /> : null}
        </div>
    )
}

const RenderRecipe = ({ ...data }: RecipeMealType) => {
    const { calories, cautions, co2EmissionsClass, cuisineType, dietLabels, digest, dishType, healthLabels, images, ingredients, label, mealType, shareAs, source, tags, totalWeight, uri, url, yield: servings, count } = data;

    return (
        <div>
            <h1>{label}</h1>
            <img src={images.LARGE.url} height={images.LARGE.height} width={images.LARGE.width} alt={label} />
            <section>
            <div className='flex gap-x-6'>
                    <ReusableBadge text='Diet' val={dietLabels[0]} />
                    <ReusableBadge text='Cuisine' val={cuisineType[0]} />
                    <ReusableBadge text='Dish' val={dishType[0]} />
                </div>

                <div className='flex gap-x-6'>
                    <ReusableBadge text='Carbon Emission Rating' val={co2EmissionsClass} />
                    <ReusableBadge text='Caustions' val={cautions[0]} />
                    <ReusableBadge text='Meal' val={mealType[0]} />
                </div>
                <div className='flex gap-x-6'>
                    <ReusableBadge text='Yield' val={servings} />
                    <ReusableBadge text='Calories' val={calories.toFixed(2)} />
                    <ReusableBadge text='Weight' val={totalWeight.toFixed(2)} />
                </div>
            </section>
        </div>
    )
}

const ReusableBadge = ({ text, val }: { text: string, val: string | number }) => {
    return (
        <Badge className='px-4 flex gap-x-4'><span>{text} </span>{val}</Badge>
    )
}