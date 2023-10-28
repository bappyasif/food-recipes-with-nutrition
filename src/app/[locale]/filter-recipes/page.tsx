import { ComponentsContainerFiltersPage } from '@/components/forFilters/ComponentsContainerFiltersPage'
import { Props } from '@/types'
import { Metadata, ResolvingMetadata } from 'next'
import React from 'react'

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || []

  const baseTitle = (await (parent)).title?.absolute

  return {
    // title: "Filters Page"
    // title: recipeData?.label,
    title: `${baseTitle} : Filters Page`,
    // openGraph: {
    //   images: [recipeData.images.REGULAR.url, ...previousImages],
    // },
  }
}

const FilterRecipesPage = async ({searchParams}: Props) => {

  return (
    <ComponentsContainerFiltersPage />
  )
}

export default FilterRecipesPage