import { ComponentsContainerFiltersPage } from '@/components/forFilters/ComponentsContainerFiltersPage'
import { FiltersTypes, Props } from '@/types'
import axios from 'axios'
import { Metadata, ResolvingMetadata } from 'next'
import React from 'react'
import { URLSearchParams } from 'url'

type ItemsProps = {
  app_id: string,
  app_key: string,
  type: string
}

type FiltersTypesDynamic = {
  // q?: string,
  [key: string]: string | string[] | undefined
}

type ParamsItemsProps = ItemsProps & FiltersTypesDynamic

const getDataFromApi = async (searchParams: { [key: string]: string | string[] | undefined }) => {
  const paramsItems: ParamsItemsProps = {
    app_id: process.env.NEXT_PUBLIC_EDAMAM_APP_ID!,
    app_key: process.env.NEXT_PUBLIC_EDAMAM_APP_KEY!,
    type: "public"
  }

  for (let k in searchParams) {
    paramsItems[k as keyof ParamsItemsProps] = searchParams[k]
    // console.log(k)
  }

  let normalizedParams = new URLSearchParams()

  const updateNormalizedParams = (key: string, val: string) => {
    normalizedParams.append(key, val)
  }

  for (let k in paramsItems) {
    const typeIs = typeof paramsItems[k]
    if (typeIs === "object") {
      // console.log(paramsItems[k], "what to do", typeIs)
      (paramsItems[k] as string[])!.forEach(v => updateNormalizedParams(k, v))
    } else {
      updateNormalizedParams(k, paramsItems[k] as string)
    }
  }

  // console.log(normalizedParams, "normalized")

  const resp = await axios.get("https://api.edamam.com/api/recipes/v2", { params: normalizedParams })

  // console.log(resp?.data.hits.length, "data!!")

  return { data: resp?.data.hits.map((item:any) => item.recipe), nextHref: resp?.data?._links?.next?.href }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []

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
  const {data, nextHref} = await getDataFromApi(searchParams)
  // console.log(data.length, nextHref)
  
  if(!data?.length) {
    return <h2 className='font-bold text-xl text-special-foreground'>Loading....</h2>
  }

  return (
    <ComponentsContainerFiltersPage foundHref={nextHref} foundRecipes={data} />
  )
}

export default FilterRecipesPage