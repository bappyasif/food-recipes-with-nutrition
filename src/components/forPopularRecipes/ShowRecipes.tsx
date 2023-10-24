import { useAppSelector } from '@/hooks/forRedux'
import { RecipeMealType } from '@/types'
import React from 'react'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import Link from 'next/link'
import { extractRecipeId } from '../forFilters/RecipesView'
import { ellipsedText } from '../forRecipe/FewNonRelatedRecipes'
import { useLocale } from 'next-intl'

export const ShowRecipes = () => {
  const recipesList = useAppSelector(state => state.recipes.list)

  const renderRecipes = () => recipesList?.map(item => <RenderRecipe key={item.uri} data={item} />)

  // console.log(recipesList, "ye")

  return (
    <div>
      {/* RecipesList */}
      <div className='grid xxs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {renderRecipes()}
      </div>
    </div>
  )
}

const RenderRecipe = ({ data }: { data: Partial<RecipeMealType> }) => {
  const { label, calories, co2EmissionsClass, cuisineType, images, uri } = data;
  const { height, url, width } = images?.SMALL!

  const locale = useLocale()

  if (!cuisineType) return

  return (
    <Card className='hover:ring-1 hover:ring-special-foreground outline-transparent border-0 flex flex-col justify-between'>
      <img src={url} height={height} width={width} alt={label} className='w-full h-48 object-fill rounded-sm transition-all duration-700 hover:object-cover mix-blend-lighten' />
      <CardHeader className='font-bold xxs:text-lg md:text-xl xl:text-2xl text-muted-foreground' title={label}>{label!?.length > 20 ? ellipsedText(label!, 19) : label}</CardHeader>
      <CardContent className='flex flex-col gap-y-4'>
        <ReuseableBadge txt='Calories' val={calories?.toFixed(2)} />
        <ReuseableBadge txt='Carbon Emission' val={co2EmissionsClass} />
        <ReuseableBadge txt='Cuisine' val={cuisineType[0]} />
      </CardContent>
      <CardFooter>
        <Link className='w-full bg-accent text-center font-bold xxs:text-lg md:text-xl xl:text-2xl text-muted-foreground hover:text-muted hover:bg-special-foreground rounded-lg' href={`/${locale}/recipe/${extractRecipeId(uri!)}`}>See Details</Link>
      </CardFooter>
    </Card>
  )
}

const ReuseableBadge = ({ txt, val }: { txt: string, val: string | number | undefined }) => {
  return (
    <Badge className='flex gap-x-4 w-fit bg-accent text-muted-foreground hover:text-muted xxs:text-xs md:text-sm xl:text-lg capitalize'>
      <span>{txt}</span>
      <span>{val}</span>
    </Badge>
  )
}