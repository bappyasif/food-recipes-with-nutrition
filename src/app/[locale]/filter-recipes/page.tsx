"use client"

import { FiltersDashboard } from '@/components/forFilters/FiltersDashboard'
import { RecipesView } from '@/components/forFilters/RecipesView'
import { useForExtractingQueriesFromUrl } from '@/hooks/forComponents'
import { useAppDispatch, useAppSelector } from '@/hooks/forRedux'
import { addRecipesToUntracked } from '@/redux/features/recipes/RecipesSlice'
import { RecipeMealType } from '@/types'
import React, { useEffect, useState } from 'react'

const FilterRecipesPage = () => {
  // const [recipesFound, setRecipesFound] = useState<RecipeMealType[]>([])
  const [recipesData, setRecipesData] = useState<{ recipesFound: RecipeMealType[], nextHref: string | undefined }>({ recipesFound: [], nextHref: undefined })

  // const handleRecipesFound = (data:RecipeMealType[]) => setRecipesFound(data)
  const handleRecipesFound = (data: RecipeMealType[], nextHref?: string) => setRecipesData({ recipesFound: data, nextHref: nextHref })

  // const {mealsRecipes} = useForExtractingQueriesFromUrl(handleRecipesFound)
  useForExtractingQueriesFromUrl(handleRecipesFound)

  // console.log(recipesData.nextHref, "nexthref")

  // keeping recipes in untracked list so that if needed user can simply reload and re render them without making a fetch request to api
  const [pageNumber, setPageNumber] = useState(1)

  // useEffect(() => {
  //   recipesData.nextHref && setPageNumber(prev => prev + 1)
  // }, [recipesData.nextHref])

  const appDispatch = useAppDispatch()

  const untrackedList = useAppSelector(state => state.recipes.untracked)

  const addToUntrackedRecipes = () => {
    appDispatch(addRecipesToUntracked({ pageNumber: untrackedList.length, recipesData: recipesData.recipesFound }))
    // appDispatch(addRecipesToUntracked({ pageNumber: pageNumber, recipesData: recipesData.recipesFound }))
    // console.log(recipesData.nextHref)
    // appDispatch(addRecipesToUntracked({ pageNumber: "Page"+pageNumber, recipesData: recipesData.recipesFound }))
  }

  // useEffect(() => {
  //   recipesData.recipesFound.length && pageNumber && addToUntrackedRecipes()
  // }, [recipesData])

  useEffect(() => {
    recipesData.nextHref && addToUntrackedRecipes()
  }, [recipesData.nextHref])

  const handlePreviousAndNext = (action: string) => {
    setPageNumber(prev => {
      if(action === "next") {
        const data = untrackedList.find(item => item.page === prev + 1)?.data
        // const data = untrackedList.find(item => item.page > pageNumber)?.data

        if(!data?.length) return prev

        setRecipesData(prev => ({recipesFound: data, nextHref: prev.nextHref}))

        // console.log("next", untrackedList.length, prev, data)

        // return untrackedList.length

        return prev + 1
      } else {
        if(prev > 0) {
          // console.log(untrackedList.find(item => item.page === prev - 1))
          // const data = untrackedList.find(item => item.page === prev - 1)?.data
          const data = untrackedList.find(item => item.page === prev)?.data

          // console.log("prev", untrackedList.length, prev, data)
          
          if(!data?.length) return prev
          
          setRecipesData(prev => ({recipesFound: data, nextHref: prev.nextHref}))
          
          // return prev
          return prev - 1 > 0 ? prev -1 : prev
        }

        return 1
      }
    })
  }

  // console.log(untrackedList, "untrackedList", pageNumber, untrackedList.findIndex(item => item.page > pageNumber), pageNumber < untrackedList.length, pageNumber < untrackedList[untrackedList.length - 1].page)

  // IFNEXTDATAALREADYEXIST
  // const CHECK = untrackedList.findIndex(item => item.page > pageNumber)
  const check = pageNumber < untrackedList[untrackedList.length - 1].page

  return (
    <div
      // className={`${(mealsRecipes.length || recipesFound?.length) ? "h-fit" : "min-h-[100vh]"} bg-secondary text-muted-foreground flex flex-col gap-y-4`}
      className={`${(recipesData.recipesFound?.length) ? "h-fit" : "min-h-[100vh]"} bg-secondary text-muted-foreground flex flex-col gap-y-4`}
    >
      {/* FilterRecipesPage {recipesData.recipesFound?.length} {mealsRecipes.length} */}
      <FiltersDashboard handleRecipesFound={handleRecipesFound} />
      {/* <RecipesView recipes={ recipesFound?.length ? recipesFound : mealsRecipes} /> */}
      <RecipesView recipes={recipesData.recipesFound?.length ? recipesData.recipesFound : []} nextHref={recipesData.nextHref} handleRecipesFound={handleRecipesFound} handlePreviousAndNext={handlePreviousAndNext} 
      // check={CHECK} 
      check={check}
      />
    </div>
  )
}

export default FilterRecipesPage