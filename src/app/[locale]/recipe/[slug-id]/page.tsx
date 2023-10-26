import { ShowRecipeDetails } from '@/components/forRecipe/ShowRecipeDetails'
import { RecipeMealType } from '@/types'
import { searchRecipeById } from '@/utils/dataFetching'
import { GetServerSideProps, InferGetServerSidePropsType, Metadata, ResolvingMetadata } from 'next'
import React from 'react'

type Props = {
  params: { "slug-id": string }
  searchParams: { [key: string]: string | string[] | undefined },
  recipeData?: RecipeMealType
}

type Repo = {
  name: string
  stargazers_count: number
}

// export async function getServerSideProps({params}: Props) {
//   // Fetch data from external API
//   const slugId = params["slug-id"]

//   const prepareAndFetchData = () => {
//     const params = {
//         app_id: process.env.NEXT_PUBLIC_EDAMAM_APP_ID,
//         app_key: process.env.NEXT_PUBLIC_EDAMAM_APP_KEY,
//         // id: dynamicParams["slug-id"],
//         type: "public"
//     }

//     return searchRecipeById(params, slugId).then(d => {
//         // console.log(d.recipe)
//         return d?.recipe

//     }).catch(err => console.log(err))
//   }

//   const resp = await prepareAndFetchData()

//   console.log(resp?.recipe.label, "ssr!!")

//   // Pass data to the page via props
//   return { props: { data: resp.recipe } }
// }

// export const getServerSideProps = (async (context) => {
//   const res = await fetch('https://api.github.com/repos/vercel/next.js')
//   const repo = await res.json()
//   return { props: { repo } }
// }) satisfies GetServerSideProps<{
//   repo: Repo
// }>

// export async function getServerSideProps({params, searchParams, recipeData}: Props) {
//   const slugId = params["slug-id"]

//   const prepareAndFetchData = () => {
//     const params = {
//         app_id: process.env.NEXT_PUBLIC_EDAMAM_APP_ID,
//         app_key: process.env.NEXT_PUBLIC_EDAMAM_APP_KEY,
//         // id: dynamicParams["slug-id"],
//         type: "public"
//     }

//     return searchRecipeById(params, slugId).then(d => {
//         // console.log(d.recipe)
//         return d?.recipe

//     }).catch(err => console.log(err))
//   }

//   const resp = await prepareAndFetchData()

//   console.log(resp?.recipe.label, "ssr!!")

//   return { props: { recipeData: resp?.recipe } }
// }

const fetchRecipeData = async (slugId: string) => {
  const params = {
    app_id: process.env.NEXT_PUBLIC_EDAMAM_APP_ID,
    app_key: process.env.NEXT_PUBLIC_EDAMAM_APP_KEY,
    // id: dynamicParams["slug-id"],
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
  // console.log(slugId, searchParams, "what what!!", params)

  // fetch data
  // const prepareAndFetchData = () => {
  //   const params = {
  //     app_id: process.env.NEXT_PUBLIC_EDAMAM_APP_ID,
  //     app_key: process.env.NEXT_PUBLIC_EDAMAM_APP_KEY,
  //     // id: dynamicParams["slug-id"],
  //     type: "public"
  //   }

  //   return searchRecipeById(params, slugId).then(d => {
  //     // console.log(d.recipe)
  //     return d?.recipe
  //   }).catch(err => console.log(err))
  // }

  // const recipeData = await prepareAndFetchData()

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
      <h1>RecipeFullViewPage {params['slug-id']} {recipeData?.label}</h1>
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