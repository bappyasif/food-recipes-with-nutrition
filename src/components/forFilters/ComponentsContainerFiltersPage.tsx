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

  // console.log(recipesData.nextHref, "nexthref")

  // keeping recipes in untracked list so that if needed user can simply reload and re render them without making a fetch request to api
  const [pageNumber, setPageNumber] = useState(1)

  const appDispatch = useAppDispatch()

  const untrackedList = useAppSelector(state => state.recipes.untracked)

  const addToUntrackedRecipes = () => {
    appDispatch(addRecipesToUntracked({ pageNumber: untrackedList.length, recipesData: recipesData.recipesFound }))
  }

  useEffect(() => {
    recipesData.nextHref && addToUntrackedRecipes()
  }, [recipesData.nextHref])

  // useEffect(() => {
  //   foundHref && appDispatch(addRecipesToUntracked({ pageNumber: untrackedList.length, recipesData: foundRecipes }))
  // }, [])

  const handlePreviousAndNext = (action: string) => {
    setPageNumber(prev => {
      if (action === "next") {
        const data = untrackedList.find(item => item.page === prev + 1)?.data

        if (!data?.length) return prev

        setRecipesData(prev => ({ recipesFound: data, nextHref: prev.nextHref }))

        return prev + 1
      } else {
        if (prev > 0) {
          const data = untrackedList.find(item => item.page === prev)?.data

          if (!data?.length) return prev

          setRecipesData(prev => ({ recipesFound: data, nextHref: prev.nextHref }))

          return prev - 1 > 0 ? prev - 1 : prev
        }

        return 1
      }
    })
  }

  // useEffect(() => {
  //   foundRecipes?.length && setRecipesData(({nextHref: foundHref, recipesFound: foundRecipes!}))
  // }, [])

  // console.log(untrackedList, "untrackedList", pageNumber, untrackedList.findIndex(item => item.page > pageNumber), pageNumber < untrackedList.length, pageNumber < untrackedList[untrackedList.length - 1].page)

  // IFNEXTDATAALREADYEXIST
  const check = pageNumber < untrackedList[untrackedList.length - 1].page

  // console.log(check, untrackedList, pageNumber)

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
