"use client"

import { FiltersDashboard } from '@/components/forFilters/FiltersDashboard'
import { RecipesView } from '@/components/forFilters/RecipesView'
import { useForExtractingQueriesFromUrl } from '@/hooks/forComponents'
import { RecipeMealType } from '@/types'
import React, { useState } from 'react'

const FilterRecipesPage = () => {
  const [recipesFound, setRecipesFound] = useState<RecipeMealType[]>([])
 
  const handleRecipesFound = (data:any) => setRecipesFound(data)

  const {mealsRecipes} = useForExtractingQueriesFromUrl()

  return (
    <div 
      className={`${(mealsRecipes.length || recipesFound?.length) ? "h-fit" : "min-h-[100vh]"} bg-primary-content`}
    >
      FilterRecipesPage {recipesFound?.length}
      <FiltersDashboard handleRecipesFound={handleRecipesFound} />
      <RecipesView recipes={ recipesFound?.length ? recipesFound : mealsRecipes} />
    </div>
  )
}

export default FilterRecipesPage