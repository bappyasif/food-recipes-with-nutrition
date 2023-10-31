import { ShowRecipes } from '@/components/forPopularRecipes/ShowRecipes'
import store from '@/redux/store'
import { getAllViewedRecipesFromDb } from '@/redux/thunks'
import { assembleReqStr } from '@/utils/dbRequests'
import axios from 'axios'
import { Metadata, ResolvingMetadata } from 'next'
import React, { Suspense } from 'react'

// import { revalidatePath } from 'next/cache'

// import { cache } from 'react'
 
// export const revalidate = 0 // revalidate the data at most every second

export const metadata: Metadata = {
  title: `What's Cooking Yo!! - Popular Recipes List Page`,
  description: "List of Most Viewed Recipes List"
}

// export async function generateMetadata(parent: ResolvingMetadata):Promise<Metadata> {
//   // const prevTitle = (await parent).title?.absolute
//   const baseTitle = (await (parent)).title?.absolute

//   return {
//     title: `${baseTitle} - Popular Recipes List Page`,
//     description: "List of Most Viewed Recipes List"
//   }
// }

const getAllViewedRecipes = async () => {
  const resp = await axios.get(assembleReqStr())
  // console.log(resp.data, "ready!!")
  return resp.data?.recipes
}

// store.dispatch(getAllViewedRecipesFromDb())

const PopularRecipesRoutePage = async () => {
  // revalidatePath("/popular-recipes")

  // const recipes = await getAllViewedRecipes()
  
  return (
    <div className='min-h-[100vh] flex flex-col gap-y-10'>
      {/* PopularRecipesRoutePage - {recipes?.length} */}
      <h1 className='font-bold text-special-foreground xxs:text-xl sm:text-2xl md:text-3xl xl:text-4xl mt-10'>List Of Popular Recipes</h1>

      {/* <ShowRecipes recipes={recipes} /> */}

      <ShowRecipes />

      {/* <Suspense fallback={<h1 className='font-bold text-special-foreground'>Loading....</h1>}>
        <ShowRecipes recipes={recipes} />
      </Suspense> */}
    </div>
  )
}

export default PopularRecipesRoutePage