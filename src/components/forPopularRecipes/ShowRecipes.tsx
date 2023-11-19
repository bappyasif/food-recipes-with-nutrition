"use client"

import { useAppSelector } from '@/hooks/forRedux'
import { RecipeMealType } from '@/types'
import React, { useEffect, useState } from 'react'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import Link from 'next/link'
import { extractRecipeId } from '../forFilters/RecipesView'
import { ellipsedText } from '../forRecipe/FewNonRelatedRecipes'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'

type data = {
  page: number;
  data: RecipeMealType[];
}

export const ShowRecipes = ({ user }: { user: any }) => {
  const locale = useLocale();

  const { push, replace } = useRouter();

  if (!user?.email) {
    // push(`${locale}/prompt-user`)
    // push(`prompt-user`)
    replace(`/${locale}/prompt-user`)
    // replace(`prompt-user`)
  }

  const recipesList = useAppSelector(state => state.recipes.list)

  const [showing, setShowing] = useState<data>({page: 0, data: []})

  const handleOnce = () => {
    const firstEight = recipesList.slice(0, 8)
    setShowing({data: firstEight, page: 1})
  }

  useEffect(() => {
    recipesList.length && handleOnce()
  }, [recipesList])

  const handleNext = () => {
    console.log("handle next!!")
  }

  const handlePrev = () => {
    console.log("handle prev!!")
  }

  const renderRecipes = () => showing?.data?.map(item => <RenderRecipe key={item.uri} data={item} />)

  // const renderRecipes = () => recipesList?.map(item => <RenderRecipe key={item.uri} data={item} />)

  if (!user?.email) {
    return
  }

  return (
    <div className='flex flex-col gap-y-4'>
      <div 
        className='grid xxs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
        xl:grid-cols-4 gap-4'
      >
        {renderRecipes()}
      </div>

      <div className='flex gap-x-4 justify-center w-full'>
        <Button onClick={handlePrev}>Prev</Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  )
}

const RenderRecipe = ({ data }: { data: Partial<RecipeMealType> }) => {
  const { label, calories, co2EmissionsClass, cuisineType, images, uri, lastUpdated } = data;
  const { height, url, width } = images?.SMALL! || images

  const locale = useLocale()

  const recipeLink = `/${locale}/recipe/${extractRecipeId(uri!)}`

  if (!cuisineType) return

  const checkIfDayOlder = () => moment(lastUpdated).fromNow().includes("day")

  return (
    <Card className='hover:ring-1 hover:ring-special-foreground outline-transparent border-0 flex flex-col justify-between'>
      {/* <Image
        // src={url} 
        src={checkIfDayOlder() ? `https://source.unsplash.com/random/200?recipe=${label}` : url} 
        alt={label!} width={width} height={height}
        className='xxs:w-full h-48 object-fill rounded-sm transition-all duration-700 hover:object-cover mix-blend-lighten'
        blurDataURL={url} placeholder='blur' loading='lazy'
      /> */}

      <img
        // src={url} 
        src={checkIfDayOlder() ? `https://source.unsplash.com/random/200?recipe=${label}` : url}
        alt={label!} width={width} height={height}
        className='xxs:w-full h-48 object-fill rounded-sm transition-all duration-700 hover:object-cover mix-blend-lighten'
        // blurDataURL={url} placeholder='blur' 
        loading='lazy'
      />

      <CardHeader
        className='font-bold xxs:text-lg md:text-xl xl:text-2xl text-muted-foreground hover:text-primary'
        title={`Recipe: ${label}, Click To View details`}
      >
        <Link href={recipeLink}>{label!?.length > 20 ? ellipsedText(label!, 19) : label}</Link>
      </CardHeader>

      <CardContent className='flex flex-col gap-y-4'>
        <ReuseableBadge txt='Calories' val={calories?.toFixed(2)} />
        <ReuseableBadge txt='Carbon Emission' val={co2EmissionsClass} />
        <ReuseableBadge txt='Cuisine' val={typeof cuisineType === "object" ? cuisineType[0] : cuisineType} />
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
      {/* <span>{typeof val === "string" ? val?.length ? ellipsedText(val, 14) : val : val}</span> */}
      <span>{val}</span>
    </Badge>
  )
}