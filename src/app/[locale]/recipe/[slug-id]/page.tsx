import { ShowRecipeDetails } from '@/components/forRecipe/ShowRecipeDetails'
import { Props } from '@/types'
import { searchRecipeById } from '@/utils/dataFetching'
import { Metadata, ResolvingMetadata } from 'next'
import React from 'react'

const fetchRecipeData = async (slugId: string) => {
  const params = {
    app_id: process.env.NEXT_PUBLIC_EDAMAM_APP_ID,
    app_key: process.env.NEXT_PUBLIC_EDAMAM_APP_KEY,
    type: "public"
  }

  return searchRecipeById(params, slugId).then(d => {
    // console.log(d.recipe)
    return d?.recipe
  }).catch(err => console.log(err))
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const slugId = params["slug-id"]

  const recipeData = await fetchRecipeData(slugId)

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []

  const baseTitle = (await (parent)).title?.absolute

  return {
    title: `${baseTitle} : Details for ${recipeData?.label}`,
    description: `Details for ${recipeData?.label} and this was sourced from EDAMAM api`,
    openGraph: {
      type: "website",
      url: `${process.env.NEXT_PUBLIC_API_HOSTED || "https://food-recipes-with-nutrition.vercel.app"}`,
      title: `Recipe Detail for ${recipeData?.label}`,
      description: `Details for ${recipeData?.label} and this was sourced from EDAMAM api`,
      images: [recipeData?.images?.REGULAR?.url || recipeData?.images?.THUMBNAIL?.url || recipeData?.images?.SMALL?.url, ...previousImages]
    },
    twitter: {
      card: "summary_large_image",
      title: `Recipe Detail for ${recipeData?.label}`,
      description: `Details for ${recipeData?.label} and this was sourced from EDAMAM api`,
      images: [recipeData?.images?.REGULAR?.url || recipeData?.images?.THUMBNAIL?.url || recipeData?.images?.SMALL?.url, ...previousImages],
    }
  }
}

const RecipeFullViewPage = async ({ params, searchParams }: Props) => {

  const recipeData = await fetchRecipeData(params['slug-id'])

  return (
    <div className='text-secondary'>
      {/* <h1>RecipeFullViewPage {params['slug-id']} {recipeData?.label}</h1> */}
      <ShowRecipeDetails params={params} recipeData={recipeData} />
    </div>
  )
}

export default RecipeFullViewPage