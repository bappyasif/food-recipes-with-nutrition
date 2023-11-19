"use client"

import React, { useEffect, useState } from 'react'
import { RecipesView } from './RecipesView'
import { FiltersDashboard } from './FiltersDashboard'
import { addRecipesToUntracked } from '@/redux/features/recipes/RecipesSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/forRedux'
import { RecipeMealType } from '@/types'
import { useForExtractingQueriesFromUrl } from '@/hooks/forComponents'

export const ComponentsContainerFiltersPage = () => {
  const [recipesData, setRecipesData] = useState<{ recipesFound: RecipeMealType[], nextHref: string | undefined }>({ recipesFound: [], nextHref: undefined })

  const handleRecipesFound = (data: RecipeMealType[], nextHref?: string) => setRecipesData({ recipesFound: data, nextHref: nextHref })

  useForExtractingQueriesFromUrl(handleRecipesFound)

  // keeping recipes in untracked list so that if needed user can simply reload and re render them without making a fetch request to api
  const [pageNumber, setPageNumber] = useState(0)

  const appDispatch = useAppDispatch()

  const untrackedList = useAppSelector(state => state.recipes.untracked)

  const addToUntrackedRecipes = () => {
    appDispatch(addRecipesToUntracked({ pageNumber: untrackedList.length, recipesData: recipesData.recipesFound }))

    // updating pagecount when new recipes found after fetching
    setPageNumber(prev => prev + 1)
  }

  useEffect(() => {
    recipesData.nextHref && addToUntrackedRecipes()
  }, [recipesData.nextHref])

  const handlePreviousAndNext = (action: string) => {
    setPageNumber(prev => {
      if (action === "next") {
        const data = untrackedList.find(item => item.page === prev + 1)?.data

        if (!data?.length) return prev

        setRecipesData(prev => ({ recipesFound: data, nextHref: prev.nextHref }))

        return prev + 1

      } else {

        if(prev === 1) {
          setRecipesData(prev => ({nextHref: prev.nextHref, recipesFound: untrackedList[1].data}))

          // console.log("prev is equal 1", untrackedList[1])

          return prev
        }

        if (prev > 1) {
          const data = untrackedList.find(item => item.page === prev - 1)?.data

          data?.length && setRecipesData(prev => ({nextHref: prev.nextHref, recipesFound: data}))

          // console.log("prev more than 1", data)

          return prev - 1
        }

        return 1
      }
    })
  }

  // IFNEXTDATAALREADYEXIST
  const check = pageNumber < untrackedList[untrackedList.length - 1].page

  return (
    <div
      className={`${(recipesData.recipesFound?.length) ? "h-fit" : "min-h-[100vh]"} bg-secondary text-muted-foreground flex flex-col gap-y-4`}
    >
      <FiltersDashboard handleRecipesFound={handleRecipesFound} />

      <RecipesView
        recipes={recipesData.recipesFound?.length ? recipesData.recipesFound : []}
        nextHref={recipesData.nextHref}
        handleRecipesFound={handleRecipesFound}
        handlePreviousAndNext={handlePreviousAndNext}
        check={check}
      />

    </div>
  )
}
