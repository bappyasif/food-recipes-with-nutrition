import { ShowRecipeDetails } from '@/components/forRecipe/ShowRecipeDetails'
import { searchRecipeById } from '@/utils/dataFetching'
import { Metadata, ResolvingMetadata } from 'next'
import React from 'react'

type Props = {
  params: { "slug-id": string }
  searchParams: { [key: string]: string | string[] | undefined },
}

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

  // console.log(recipeData, "recipeData")

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: recipeData?.label,
    openGraph: {
      images: [recipeData.images.REGULAR.url, ...previousImages],
    },
  }
}

const RecipeFullViewPage = async ({ params, searchParams }: Props) => {
  // const RecipeFullViewPage = ({
  //   repo,
  // }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const recipeData = await fetchRecipeData(params['slug-id'])

  return (
    <div className='bg-accent text-muted-foreground'>
      {/* <h1>RecipeFullViewPage {params['slug-id']} {recipeData?.label}</h1> */}
      <ShowRecipeDetails params={params} recipeData={recipeData} />
    </div>
  )
}

export default RecipeFullViewPage

/**
 * 
 * 
 export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params["slug-id"]
  console.log(id, searchParams, "what what!!", params)
 
  // fetch data
  const product = await fetch(`https://jsonplaceholder.typicode.com/posts/1`).then((res) => res.json())
 
  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: product?.title,
    openGraph: {
      images: ['/some-specific-page-image.jpg', ...previousImages],
    },
  }
}
 */