import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/route'
import { ShowRecipes } from '@/components/forPopularRecipes/ShowRecipes'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import React, { Suspense } from 'react'

export const metadata: Metadata = {
  title: `What's Cooking Yo!! - Popular Recipes List Page`,
  description: "List of Most Viewed Recipes List"
}

const PopularRecipesRoutePage = async () => {  
  const resp = await getServerSession(nextAuthOptions)
  // console.log(resp?.user, "!!user!!")

  // 
  // const locale = useLocale()

  // this would have posible if there was no locale involved
  // if(!resp?.user?.email) {
  //   // redirect(`${locale}/prompt-user`)
  //   redirect("/")
  // }

  return (
    <div className='min-h-[100vh] flex flex-col gap-y-10'>
      <h1 className='font-bold text-special-foreground xxs:text-xl sm:text-2xl md:text-3xl xl:text-4xl mt-10'>List Of Popular Recipes</h1>

      <Suspense fallback={<h1 className='font-bold text-special-foreground'>Loading....</h1>}>
        <ShowRecipes user={resp?.user} />
      </Suspense>
    </div>
  )
}

export default PopularRecipesRoutePage