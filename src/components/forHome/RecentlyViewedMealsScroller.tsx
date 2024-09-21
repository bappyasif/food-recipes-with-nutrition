"use client"

import { RecipeMealType } from '@/types'
import React, { useEffect } from 'react'
import { useForRecipeCarouselItems, useForTruthToggle } from '@/hooks/forComponents'
import styles from "@/app/[locale]/Home.module.css"
import { Badge } from '../ui/badge'
import { useAppDispatch, useAppSelector } from '@/hooks/forRedux'
import { ellipsedText } from '../forRecipe/FewNonRelatedRecipes'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { extractRecipeId, removeWrodRecipe } from '../forFilters/RecipesView'
import moment from 'moment'
import { sortByRecentlyViewed } from '@/redux/features/recipes/RecipesSlice'
import { useToGetAnImageUrl, useToGetRandomImageUrlIfFails } from '@/hooks/forPexels'
import { TbLoader2 } from 'react-icons/tb'

export const RecentlyViewedMealsScroller = () => {

  const recipesList = useAppSelector(state => state.recipes.list)

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(sortByRecentlyViewed())
  }, [])

  const { handleFalsy, onlyFour, handleTruthy } = useForRecipeCarouselItems(recipesList)

  const renderForCards = () => onlyFour?.map(item => <RenderMealCard key={item.uri} data={item} />)

  return (
    <div className=''>
      <h2 className='text-xl font-bold'>Some Recently Viewed Meals</h2>
      <h3 className='text-sm font-semibold text-content/80'>Real Recipe Image can be seen from Recipe Detail Page</h3>
      <div
        className='grid grid-rows-none xxs:grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-2 gap-x-4 place-content-center place-items-center overflow-clip mt-10'
        onMouseEnter={handleTruthy}
        onMouseLeave={handleFalsy}
      >
        {onlyFour!?.length ? renderForCards() : null}
      </div>
    </div>
  )
}

const RenderMealCard = ({ data }: { data: Partial<RecipeMealType> }) => {

  const { calories, cuisineType, co2EmissionsClass, label, uri, images, lastUpdated } = data;

  const { height, url, width } = images?.SMALL! || images

  const { imgSrc } = useToGetAnImageUrl(label!)

  const { failSafeUrl, handleFailsafe } = useToGetRandomImageUrlIfFails(imgSrc)

  const locale = useLocale()

  const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

  const checkIfDayOlder = () => moment().diff(moment(lastUpdated), 'hours') > 1

  const { handleFalsy: falsy, handleTruthy: truthy, isTrue: isLoading } = useForTruthToggle()

  if (!cuisineType) {
    return
  }

  return (
    <div
      className={`${styles.dissolvePhoto} h-80 overflow-clip w-full xl:w-96 2xl:w-[22.2rem] 3xl:w-96 flex flex-col`}
      onMouseEnter={handleTruthy}
      onMouseLeave={handleFalsy}
    >
      <Link
        onClick={isLoading ? falsy : truthy}
        href={`/${locale}/recipe/${extractRecipeId(uri!)}`}
        title={checkIfDayOlder() ? `You might be looking at a random picture, click here to view recipe detail page for real info: ${label}` : `Click to view details: ${label}`}
        className='relative text-center'
      >
        <p 
          className={`absolute top-0.5 text-center font-medium bg-primary/60 z-10 text-content-light/80 hover:text-quaternary hover:bg-primary transition-all duration-50 px-4 ${isTrue ? "text-lg" : "text-2xl"} w-full`}
        >
          {label!?.length > 40 ? ellipsedText(label!, 40) : label!}
        </p>

        <TbLoader2 size={80} className={`${isLoading ? "absolute animate-spin self-center w-full top-28 z-10" : "hidden"}`} />

        <img
          src={checkIfDayOlder() ? failSafeUrl : url}
          alt={label!} width={width} height={height}
          className={`w-full transition-all duration-500 h-80 object-cover hover:object-cover rounded-sm`}
          loading='lazy'
          onError={handleFailsafe}
        />
      </Link>

      <div
        className={`flex flex-col gap-y-2 items-center justify-center transition-all duration-500 ${isTrue ? "-translate-y-40" : "translate-y-0"}`}
      >
        <ReusableBadge text={co2EmissionsClass!} title='Carbon Emission' />

        <ReusableBadge text={calories?.toFixed(2)!} title='Calorie' />

        <ReusableBadge text={typeof cuisineType === "object" ? cuisineType[0] : cuisineType} title='Cuisine' />

        <Link href={`/${locale}/recipe/${extractRecipeId(uri!)}`} >
          <Badge className='flex gap-x-4 justify-between items-center bg-primary/60 text-content-light/90 hover:text-quaternary hover:bg-primary text-xl' title={label}>
            <span>Name:</span>
            <span className='block xl:hidden'>{removeWrodRecipe(label!)!?.length > 29 ? ellipsedText(removeWrodRecipe(label!)!, 29) : removeWrodRecipe(label!)!}</span>
            <span className='hidden xl:block'>{removeWrodRecipe(label!)!?.length > 15 ? ellipsedText(removeWrodRecipe(label!)!, 15) : removeWrodRecipe(label!)!}</span>
          </Badge>
        </Link>
      </div>
    </div>
  )
}

const ReusableBadge = ({ title, text }: { title: string, text: string | number }) => {
  return (
    <Badge className='flex gap-x-4 justify-between items-center bg-background/80 text-secondary hover:text-content-light/80 text-lg'>
      <span>{title}:</span>
      <span>{text}</span>
    </Badge>
  )
}