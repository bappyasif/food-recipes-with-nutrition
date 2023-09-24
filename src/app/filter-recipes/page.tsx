"use client"

import { FiltersDashboard } from '@/components/forFilters/FiltersDashboard'
import { RecipesView } from '@/components/forFilters/RecipesView'
import { useForExtractingQueriesFromUrl } from '@/hooks/forComponents'
import { RecipeMealType } from '@/types'
import React, { useState } from 'react'

const FilterRecipesPage = () => {
  const [recipesFound, setRecipesFound] = useState<RecipeMealType[]>([])
  const {mealsRecipes} = useForExtractingQueriesFromUrl()

  const handleRecipesFound = (data:any) => setRecipesFound(data)
  return (
    <div className='h-[100vh]'>
      FilterRecipesPage
      <FiltersDashboard handleRecipesFound={handleRecipesFound} />
      <RecipesView recipes={ recipesFound?.length ? recipesFound : mealsRecipes} />
    </div>
  )
}

export default FilterRecipesPage