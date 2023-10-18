"use client"

import { FiltersDashboard } from '@/components/forFilters/FiltersDashboard'
import { RecipesView } from '@/components/forFilters/RecipesView'
import { useForExtractingQueriesFromUrl } from '@/hooks/forComponents'
import { RecipeMealType } from '@/types'
import React, { useState } from 'react'

const FilterRecipesPage = () => {
  // const [recipesFound, setRecipesFound] = useState<RecipeMealType[]>([])
  const [recipesData, setRecipesData] = useState<{recipesFound: RecipeMealType[], nextHref: string | undefined}>({recipesFound: [], nextHref: undefined})
 
  // const handleRecipesFound = (data:RecipeMealType[]) => setRecipesFound(data)
  const handleRecipesFound = (data:RecipeMealType[], nextHref?: string) => setRecipesData({recipesFound: data, nextHref: nextHref})

  // const {mealsRecipes} = useForExtractingQueriesFromUrl(handleRecipesFound)
  useForExtractingQueriesFromUrl(handleRecipesFound)

  // console.log(recipesData.nextHref, "nexthref")

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