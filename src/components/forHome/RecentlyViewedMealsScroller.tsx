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

export const RecentlyViewedMealsScroller = () => {

  // useForGettingViewedRecipesDataFromBackend()

  const recipesList = useAppSelector(state => state.recipes.list)

  // console.log(recipesList, "sorted!!")
  const dispatch = useAppDispatch();

  useEffect(() => {
    // recipesList.length && dispatch(sortByRecentlyViewed())
    dispatch(sortByRecentlyViewed())
  }, [])

  const { handleFalsy, onlyFour, handleTruthy } = useForRecipeCarouselItems(recipesList)

  const renderForCards = () => onlyFour?.map(item => <RenderMealCard key={item.uri} data={item} />)

  return (
    <div className=''>
      <h2 className='text-xl font-bold'>Some Recently Viewed Meals</h2>
      <h3 className='text-sm font-semibold'>Real Recipe Image can be seen from Recipe Detail Page</h3>
      <div
        className='grid grid-rows-none xxs:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-4 place-content-center place-items-center max-h-[26rem] overflow-clip gap-2 mt-10'
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

  if (!cuisineType) {
    return
  }

  // const checkIfDayOlder = () => moment(lastUpdated).fromNow().includes("day")
  const checkIfDayOlder = () => moment().diff(moment(lastUpdated), 'days') > 0

  // console.log(moment(lastUpdated).fromNow(), moment(), moment(lastUpdated), moment().diff(moment(lastUpdated), 'days'))

  const addRandomUrl = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = `https://picsum.photos/200`
    // e.target.src = ""
    // e.currentTarget.src = `https://source.unsplash.com/random/200?recipe=${label}`
    // ref.current = `https://source.unsplash.com/random/200?recipe=${label}`
  }

  return (
    <div
      className={`${styles.dissolvePhoto} h-[13.2rem] overflow-clip`}
      onMouseEnter={handleTruthy}
      onMouseLeave={handleFalsy}
    >
      <Link
        href={`/${locale}/recipe/${extractRecipeId(uri!)}`}
        // title={label} 
        title={checkIfDayOlder() ? `You might be looking at a random picture, click here to view recipe detail page for real info: ${label}` : `Click to view details: ${label}`}
        className='relative'
      >
        {/* <Image 
          src={checkIfDayOlder() ? `https://source.unsplash.com/random/200?recipe=${label}` : url} 
          alt={label!} width={width} height={height} 
          className={`w-60 transition-all duration-1000 ${isTrue ? "h-24" : "h-[11.4rem]"} object-cover hover:object-cover rounded-sm`} 
          blurDataURL={url} placeholder='blur' loading='lazy' 
        /> */}

        <p className={`absolute top-0.5 left-0.5 text-center w-60 text-foreground/80 font-medium bg-accent/40 transition-all duration-500 ${isTrue ? "text-lg" : "text-2xl"}`}>
          {label!?.length > 40 ? ellipsedText(label!, 40) : label!}
          {/* {label} */}
        </p>

        <img
          src={checkIfDayOlder() ? failSafeUrl : url}
          // src={checkIfDayOlder() ? `https://picsum.photos/400` : url}
          // src={url}
          alt={label!} width={width} height={height}
          // className={`w-60 transition-all duration-1000 ${isTrue ? "h-24" : "h-[11.4rem]"} object-cover hover:object-cover rounded-sm`}
          className={`w-60 transition-all duration-500 h-[11.4rem] object-cover hover:object-cover rounded-sm`}
          // blurDataURL={url} placeholder='blur' 
          loading='lazy'
          // onError={addRandomUrl}
          onError={handleFailsafe}
        />

        {/* <p className={`w-60 transition-all duration-1000 ${isTrue ? "h-24" : "h-[11.4rem]"} aspect-square`}>
        {label}
        </p> */}

      </Link>
      <div
        // className='flex flex-col gap-y-2 items-center justify-center'
        className={`flex flex-col gap-y-2 items-center justify-center transition-all duration-500 ${isTrue ? "-translate-y-28" : "translate-y-0"}`}
      >
        <ReusableBadge text={co2EmissionsClass!} title='Carbon Emission' />

        <ReusableBadge text={calories?.toFixed(2)!} title='Calorie' />

        <ReusableBadge text={typeof cuisineType === "object" ? cuisineType[0] : cuisineType} title='Cuisine' />

        <Link href={`/${locale}/recipe/${extractRecipeId(uri!)}`} >
          <Badge className='flex gap-x-4 justify-between items-center bg-muted-foreground text-muted' title={label}>
            <span>Name:</span>
            <span>{removeWrodRecipe(label!)!?.length > 11 ? ellipsedText(removeWrodRecipe(label!)!, 11) : removeWrodRecipe(label!)!}</span>
            {/* <span>{label!?.length > 11 ? ellipsedText(label!, 11) : label!}</span> */}
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