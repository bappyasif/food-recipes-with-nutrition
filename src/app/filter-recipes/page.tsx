"use client"

import { FiltersDashboard } from '@/components/forFilters/FiltersDashboard'
import { RecipesView } from '@/components/forFilters/RecipesView'
import { useForExtractingQueriesFromUrl } from '@/hooks/forComponents'
import React from 'react'

const FilterRecipesPage = () => {
  // const {mealsRecipes} = useForExtractingQueriesFromUrl()
  return (
    <div className='h-[100vh]'>
      FilterRecipesPage
      <FiltersDashboard />
      {/* <RecipesView recipes={mealsRecipes} /> */}
    </div>
  )
}

export default FilterRecipesPage