"use client"

import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const RecipePage = () => {
  const { replace } = useRouter()
  const locale = useLocale()

  useEffect(() => {
    const timer = setTimeout(() => {
      replace(`/${locale}/filter-recipes`)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if(!locale) {
    return
  }

  return (
    <div className='flex justify-center text-secondary items-center gap-10'>
      <h2 className='font-bold'>You and I are both surprised to see you here!!</h2>
      <div className='space-y-6 font-medium'>
        <p>Momentarily you will be redirected to a place where you can search your preferred recipes using filters available there</p>
        <p>Happy browsing :)</p>
      </div>
    </div>
  )
}

export default RecipePage