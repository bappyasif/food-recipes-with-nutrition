"use client"

import { FiltersDashboard } from '@/components/forFilters/FiltersDashboard'
import { RecipesView } from '@/components/forFilters/RecipesView'
import { useForExtractingQueriesFromUrl } from '@/hooks/forComponents'
import { useAppDispatch } from '@/hooks/forRedux'
import { addRecipesToUntracked } from '@/redux/features/recipes/RecipesSlice'
import { RecipeMealType } from '@/types'
import React, { useEffect, useState } from 'react'

const FilterRecipesPage = () => {
  // const [recipesFound, setRecipesFound] = useState<RecipeMealType[]>([])
  const [recipesData, setRecipesData] = useState<{recipesFound: RecipeMealType[], nextHref: string | undefined}>({recipesFound: [], nextHref: undefined})
 
  // const handleRecipesFound = (data:RecipeMealType[]) => setRecipesFound(data)
  const handleRecipesFound = (data:RecipeMealType[], nextHref?: string) => setRecipesData({recipesFound: data, nextHref: nextHref})

  // const {mealsRecipes} = useForExtractingQueriesFromUrl(handleRecipesFound)
  useForExtractingQueriesFromUrl(handleRecipesFound)

  // console.log(recipesData.nextHref, "nexthref")

  // keeping recipes in untracked list so that if needed user can simply reload and re render them without making a fetch request to api
  // const appDispatch = useAppDispatch()

  // const addToUntrackedRecipes = () => {
  //   appDispatch(addRecipesToUntracked({pageNumber: 1, recipesData: recipesData.recipesFound}))
  //   console.log(recipesData.nextHref)
  // }

  // useEffect(() => {
  //   recipesData.recipesFound.length && recipesData.nextHref && addToUntrackedRecipes()
  // }, [recipesData])

  return (
    <div 
      // className={`${(mealsRecipes.length || recipesFound?.length) ? "h-fit" : "min-h-[100vh]"} bg-secondary text-muted-foreground flex flex-col gap-y-4`}
      className={`${(recipesData.recipesFound?.length) ? "h-fit" : "min-h-[100vh]"} bg-secondary text-muted-foreground flex flex-col gap-y-4`}
    >
      {/* FilterRecipesPage {recipesData.recipesFound?.length} {mealsRecipes.length} */}
      <FiltersDashboard handleRecipesFound={handleRecipesFound} />
      {/* <RecipesView recipes={ recipesFound?.length ? recipesFound : mealsRecipes} /> */}
      <RecipesView recipes={ recipesData.recipesFound?.length ? recipesData.recipesFound : []} nextHref={recipesData.nextHref} handleRecipesFound={handleRecipesFound} />
    </div>
  )
}

export default FilterRecipesPage