import { RecipeMealType } from '@/types'
import { searchRecipes } from '@/utils/dataFetching'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export const ShowFewRelatedRecipes = ({ mealType, diet, dishType }: { mealType: string, diet: string, dishType: string }) => {
    const [recipes, setRecipes] = useState<RecipeMealType[]>([])

    const readySimilarRcipesRequest = () => {
        const params = {
            mealType: mealType,
            diet: diet.toLocaleLowerCase(),
            dishyType: dishType,
            random: true,
            type: "public",
            app_id: process.env.NEXT_PUBLIC_EDAMAM_APP_ID,
            app_key: process.env.NEXT_PUBLIC_EDAMAM_APP_KEY
        }

        searchRecipes(params).then(d => {
            // console.log(d, "!!")
            const onlyRecipes = d?.hits.map((item: any) => item.recipe)
            onlyRecipes?.length && setRecipes(onlyRecipes)
        }).catch(err => console.log(err))

    }
    
    useEffect(() => {
        readySimilarRcipesRequest()
    }, [mealType, diet, dishType])

    return (
        <div>
            ShowFewRelatedRecipes -- {recipes.length}
            <RenderRecipesListCarousel data={recipes} />
        </div>
    )
}

const RenderRecipesListCarousel = ({data}: {data: RecipeMealType[]}) => {
    const renderRecipes = () => data.map(item => <RenderRecipeForCarousel key={item.uri} {...item} />)
    return (
        <div className='flex flex-wrap gap-4'>
            {renderRecipes()}
        </div>
    )
}

const RenderRecipeForCarousel = ({...items}: RecipeMealType) => {
    const {cuisineType, dishType, images, label, mealType} = items;
    const {height, url, width} = images.SMALL;

    return (
        <div>
            <h2>{label}</h2>
            <img src={url} alt={label} height={height} width={width} />
            <div>
                <h2>{cuisineType[0]}</h2>
                <h2>{dishType[0]}</h2>
                <h2>{mealType[0]}</h2>
            </div>
        </div>
    )
}