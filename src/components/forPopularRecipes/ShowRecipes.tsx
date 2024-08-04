"use client"

import { useAppDispatch, useAppSelector } from '@/hooks/forRedux'
import { RecipeMealType } from '@/types'
import React, { useEffect, useState } from 'react'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import Link from 'next/link'
import { extractRecipeId, removeWrodRecipe } from '../forFilters/RecipesView'
import { ellipsedText } from '../forRecipe/FewNonRelatedRecipes'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import { sortByVisitCounts } from '@/redux/features/recipes/RecipesSlice'
import { useForTruthToggle } from '@/hooks/forComponents'
import { useToGetAnImageUrl, useToGetRandomImageUrlIfFails } from '@/hooks/forPexels'
import { RiLoader2Fill } from 'react-icons/ri'
import { TbLoader2 } from 'react-icons/tb'

type DataType = {
  page: number;
  data: RecipeMealType[];
}

export const ShowRecipes = ({ user }: { user: any }) => {
  const locale = useLocale();

  const { push, replace } = useRouter();

  // popular recipes page is now public
  // if (!user?.email) {
  //   replace(`/${locale}/prompt-user`)
  // }

  // const [sorted, setSorted] = useState<RecipeMealType[]>([])

  const recipesList = useAppSelector(state => state.recipes.list)
  // ?.sort((a, b) => a.count! > b.count! ? 1 : -1)

  // useEffect(() => {

  // }, [recipesList])

  const dispatch = useAppDispatch()

  const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

  // making sure that data is sorted based on counts
  useEffect(() => {
    dispatch(sortByVisitCounts())

    handleTruthy()
  }, [])

  const [showing, setShowing] = useState<DataType[]>([])
  const [pageNum, setPageNum] = useState(0)

  const handleOnce = () => {
    const firstEight = recipesList.slice(0, 8)
    setShowing(prev => [...prev, { data: firstEight, page: 1 }])
    setPageNum(1)

    handleFalsy()
  }

  useEffect(() => {
    isTrue && recipesList.length && handleOnce()
    // recipesList.length && handleOnce()
    // recipesList.length && dispatch(sortByVisitCounts())
  }, [recipesList, isTrue])

  const handleNext = () => {

    setPageNum(prev => {
      const howManyLeft = recipesList.length - (8 * prev)

      if (howManyLeft < 1) return prev

      const chunk = howManyLeft > 8 ? howManyLeft - 8 : howManyLeft

      let recipesSliced: any = []

      if (howManyLeft < 8) {
        recipesSliced = recipesList.slice(8 * prev, 8 * prev + (howManyLeft))
      } else {
        recipesSliced = recipesList.slice(8 * prev, 8 * prev + (howManyLeft - chunk))
      }

      setShowing(items => [...items, { data: recipesSliced, page: prev + 1 }])

      return prev + 1
    })
  }

  const handlePrev = () => {
    setPageNum(prev => {
      if (prev > 1) {
        return prev - 1
      }

      return 1
    })
  }

  const getRecipesForCurrentPage = () => showing.find(item => item.page === pageNum)?.data

  const renderRecipes = () => getRecipesForCurrentPage()?.map(item => <RenderRecipe key={item.uri} data={item} />)

  // keeping popular recipes page is public
  // if (!user?.email) {
  //   return
  // }

  // console.log(recipesList)

  return (
    <div className='flex flex-col gap-y-20 py-10 min-h-screen'>
      <div
        className='grid xxs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
        xl:grid-cols-4 gap-4 h-full'
      >
        {renderRecipes()}
      </div>

      <div className='flex gap-x-4 justify-center w-full'>
        <Button disabled={pageNum <= 1} onClick={handlePrev}>Prev</Button>
        <Button
          disabled={pageNum * 8 > recipesList.length}
          onClick={handleNext}>Next</Button>
      </div>
    </div>
  )
}

const RenderRecipe = ({ data }: { data: Partial<RecipeMealType> }) => {
  const { label, calories, co2EmissionsClass, cuisineType, images, uri, lastUpdated } = data;
  const { height, url, width } = images?.SMALL! || images

  const { imgSrc } = useToGetAnImageUrl(label!)
  const { failSafeUrl, handleFailsafe } = useToGetRandomImageUrlIfFails(imgSrc)

  const locale = useLocale()

  const recipeLink = `/${locale}/recipe/${extractRecipeId(uri!)}`

  if (!cuisineType) return

  // const checkIfDayOlder = () => moment(lastUpdated).fromNow().includes("day")
  // const checkIfDayOlder = () => moment().diff(moment(lastUpdated), 'days') > 0
  const checkIfDayOlder = () => moment().diff(moment(lastUpdated), 'hours') > 1

  const addRandomPicture = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // e.currentTarget.src = `https://source.unsplash.com/random/200?recipe=${label}`
    e.currentTarget.src = `https://picsum.photos/200`
  }

  // console.log(checkIfDayOlder(), label, moment().diff(moment(lastUpdated), 'hours'))
  const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

  return (
    <Card className='hover:ring-1 hover:ring-special-foreground outline-transparent border-0 flex flex-col gap-y-4 justify-between xl:h-[39rem] relative items-center'>
      <img
        // src={url} 
        // src={checkIfDayOlder() ? `https://source.unsplash.com/random/200?recipe=${label}` : url}
        // src={checkIfDayOlder() ? `https://picsum.photos/400` : url}
        title={checkIfDayOlder() ? `You might be looking at a random relatable picture!!, Recipe: ${label}, Click "See Details" for full details` : `Recipe: ${label}, Click "See Details" for full details`}
        src={checkIfDayOlder() ? failSafeUrl : url}
        alt={label!} width={width} height={height}
        className='xxs:w-full h-72 aspect-square object-cover rounded-sm transition-all duration-700 mix-blend-lighten'
        // blurDataURL={url} 
        placeholder='blur'
        loading='lazy'
        // onError={addRandomPicture}
        onError={handleFailsafe}
      />

      <TbLoader2 size={80} className={`${isTrue ? "absolute animate-spin self-center h-72" : "hidden"}`} />

      <CardHeader
        className='font-bold xxs:text-lg md:text-2xl text-muted-foreground hover:text-primary text-center w-full'
        title={checkIfDayOlder() ? `You might be looking at a random relatable picture!!, Recipe: ${label}, Click To View details` : `Recipe: ${label}, Click To View details`}
      >
        {/* <Link href={recipeLink}>{removeWrodRecipe(label!)!?.length > 29 ? ellipsedText(removeWrodRecipe(label!)!, 26) : removeWrodRecipe(label!)}</Link> */}

        <Link className='w-full' onClick={isTrue ? handleFalsy : handleTruthy} href={recipeLink}>{removeWrodRecipe(label!)!?.length > 29 ? ellipsedText(removeWrodRecipe(label!)!, 26) : removeWrodRecipe(label!)}</Link>

        {/* <div onClick={isTrue ? handleFalsy : handleTruthy}>{removeWrodRecipe(label!)!?.length > 29 ? ellipsedText(removeWrodRecipe(label!)!, 26) : removeWrodRecipe(label!)}</div> */}
      </CardHeader>

      {/* <RiLoader2Fill size={80} className={`${isTrue ? "absolute animate-spin" : "hidden"}`} /> */}

      <CardContent className='flex flex-row gap-4 flex-wrap'>
        <ReuseableBadge txt='Calories' val={calories?.toFixed(2)} />
        <ReuseableBadge txt='Carbon Emission' val={co2EmissionsClass} />
        <ReuseableBadge txt='Cuisine' val={typeof cuisineType === "object" ? cuisineType[0] : cuisineType} />
      </CardContent>

      <CardFooter className='w-full'>
        <Link onClick={isTrue ? handleFalsy : handleTruthy} className='w-full py-2 bg-accent text-center font-bold xxs:text-lg md:text-xl xl:text-2xl text-muted-foreground hover:text-muted hover:bg-primary rounded-lg' href={`/${locale}/recipe/${extractRecipeId(uri!)}`}>See Details</Link>
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