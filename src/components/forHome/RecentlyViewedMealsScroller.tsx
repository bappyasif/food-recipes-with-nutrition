"use client"

import { RecipeMealType } from '@/types'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { useForRecipeCarouselItems, useForTruthToggle } from '@/hooks/forComponents'
import styles from "@/app/[locale]/Home.module.css"
import { Badge } from '../ui/badge'
import { useAppSelector } from '@/hooks/forRedux'
import { ellipsedText } from '../forRecipe/FewNonRelatedRecipes'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { extractRecipeId } from '../forFilters/RecipesView'
import moment from 'moment'

export const RecentlyViewedMealsScroller = () => {

  // useForGettingViewedRecipesDataFromBackend()

  const recipesList = useAppSelector(state => state.recipes.list)

  // console.log(recipesList, "recipesList!!")

  const { handleFalsy: falsyForEight, onlyFour: onlyEight, handleTruthy: truthyForEight, isTrue: forEight, handleNext, beginFrom } = useForRecipeCarouselItems(recipesList)

  const renderForCards = () => onlyEight?.map(item => <RenderMealCard key={item.uri} data={item} />)

  useEffect(() => {
    let timer = setInterval(() => {

      // if (!isTrue) {
      if (!forEight) {
        handleNext()
      } else {
        clearInterval(timer)
        return
      }

    }, 26000)

    return () => clearInterval(timer)

  }, [beginFrom, forEight])

  return (
    <div>
      <h2 className='text-xl font-bold'>Some Recently Viewed Meals</h2>
      <div
        className='grid grid-rows-none xxs:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-4 place-content-center place-items-center max-h-[26rem] overflow-clip gap-2'
        onMouseEnter={truthyForEight}
        onMouseLeave={falsyForEight}
      >
        {onlyEight!?.length ? renderForCards() : null}
      </div>
    </div>
  )
}

const RenderMealCard = ({ data }: { data: Partial<RecipeMealType> }) => {

  const { calories, cuisineType, co2EmissionsClass, label, uri, images, lastUpdated } = data;

  const { height, url, width } = images?.SMALL! || images

  const locale = useLocale()

  const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

  if (!cuisineType) {
    return
  }

  const checkIfDayOlder = () => moment(lastUpdated).fromNow().includes("day")

  if(lastUpdated) {
    console.log(lastUpdated, "last updated", lastUpdated < new Date(), moment(lastUpdated).fromNow(), checkIfDayOlder())
  }

  return (
    <div
      className={`${styles.dissolvePhoto} h-[13.2rem] overflow-clip`}
      onMouseEnter={handleTruthy}
      onMouseLeave={handleFalsy}
    >
      <Link href={`/${locale}/recipe/${extractRecipeId(uri!)}`} title={label} >
        <Image 
          src={checkIfDayOlder() ? `https://source.unsplash.com/random/200?sig=${label} recipe` : url} 
          alt={label!} width={width} height={height} 
          className={`w-60 transition-all duration-1000 ${isTrue ? "h-24" : "h-[11.4rem]"} object-cover hover:object-cover rounded-sm`} 
          blurDataURL={url} placeholder='blur' loading='lazy' 
        />

      </Link>
      <div className='flex flex-col gap-y-2 items-center justify-center'>
        <ReusableBadge text={co2EmissionsClass!} title='Carbon Emission' />

        <ReusableBadge text={calories?.toFixed(2)!} title='Calorie' />

        <ReusableBadge text={typeof cuisineType === "object" ? cuisineType[0] : cuisineType} title='Cuisine' />

        <Link href={`/${locale}/recipe/${extractRecipeId(uri!)}`} >
          <Badge className='flex gap-x-4 justify-between items-center bg-muted-foreground text-muted' title={label}>
            <span>Name:</span>
            <span>{label!?.length > 11 ? ellipsedText(label!, 11) : label!}</span>
          </Badge>
        </Link>
      </div>
    </div>
  )
}

const ReusableBadge = ({ title, text }: { title: string, text: string | number }) => {
  return (
    <Badge className='flex gap-x-4 justify-between items-center bg-muted-foreground text-muted'>
      <span>{title}:</span>
      <span>{text}</span>
    </Badge>
  )
}