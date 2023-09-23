import { RecipeMealType } from '@/types'
import React from 'react'

export const RecipesView = ({recipes}: {recipes: RecipeMealType[]}) => {
   const renderRecipes = () => recipes.map(item => <RenderRecipe key={item.label} {...item} />)
  return (
    <div>
        <h1>Recipes View</h1>
        <div className='grid grid-cols-4 gap-4'>
            {renderRecipes()}
        </div>
    </div>
  )
}

const RenderRecipe = ({...items}: RecipeMealType) => {
    const {calories, co2EmissionsClass, cuisineType, dietLabels, digest, dishType, healthLabels, images, ingredients, instructions, label, mealType, source, tags, totalWeight, url, yield:servings} = items

    return (
        <div>
            <h2>{label}</h2>
            <img src={images.SMALL.url} alt={label} width={images.SMALL.width} height={images.SMALL.height} />
            <div>
                <h3>{dishType[0]}</h3>
                <h3>{cuisineType[0]}</h3>
                <h3>{mealType[0]}</h3>
            </div>
            <div>
                <h3>{calories}</h3>
                <h3>{co2EmissionsClass}</h3>
                <h3>{servings}</h3>
                <h3>{totalWeight}</h3>
            </div>
            <div>{JSON.stringify(ingredients)}</div>
            <div>{JSON.stringify(instructions)}</div>
            <div>{JSON.stringify(healthLabels)}</div>
            <div>{JSON.stringify(dietLabels)}</div>
            <div>{JSON.stringify(digest)}</div>
            <div>{JSON.stringify(tags)}</div>
            <h4>{url}</h4>
            <h4>{source}</h4>
        </div>
    )
}