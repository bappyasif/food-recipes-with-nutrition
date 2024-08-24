import { ShowRecipes } from '@/components/forPopularRecipes/ShowRecipes'
import { nextAuthOptions } from '@/lib/auth'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import React, { Suspense } from 'react'

export const metadata: Metadata = {
  title: `What's Cooking Yo!! - Popular Recipes List Page`,
  description: "List of Most Viewed Recipes List"
}

const PopularRecipesRoutePage = async () => {
  const resp = await getServerSession(nextAuthOptions)

  return (
    <div className='min-h-[100vh] flex flex-col gap-y-10 mx-10'>
      <div className='space-y-4'>
        <h1 className='font-bold text-secondary xxs:text-xl sm:text-2xl md:text-3xl xl:text-4xl mt-10'>Popular Recipes</h1>
        <h3 className='text-sm font-semibold text-primary'>Real Recipe Image can be seen from Recipe Detail Page</h3>
      </div>

      <Suspense fallback={<h1 className='font-bold text-special-foreground'>Loading....</h1>}>
        <ShowRecipes user={resp?.user} />
      </Suspense>
    </div>
  )
}

export default PopularRecipesRoutePage