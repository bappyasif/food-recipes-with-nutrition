"use client"

import { useForInputTextChange } from '@/hooks/forComponents'
import { NavType, RecipeTypes } from '@/types'
import { searchRecipesByNameFromApi } from '@/utils/dataFetching'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export const Header = () => {
  const renderNavs = () => navs.map(item => <RenderNav key={item.name} icon={item.icon} name={item.name} path={item.path} />)

  const pathName = usePathname()
  
  return (
    <div className='w-full text-2xl flex justify-between bg-primary-focus'>
      <h1>Company Logo!!</h1>
      <nav className='flex gap-x-4 h-20'>
        {renderNavs()}
      </nav>
      {
        pathName !== "/filter-recipes"
        ? <SearchRecipes />
        : null
      }
    </div>
  )
}

const SearchRecipes = () => {
  const {handleTextChange, text} = useForInputTextChange();

  return  (
    <div className='relative'>
      <input type="text" placeholder='seacrh recipes by name' value={text} onChange={handleTextChange} />
      <ShowAllFoundRecipes text={text} />
    </div>
  )
}

const ShowAllFoundRecipes = ({text}: {text: string}) => {
  const [recipes, setRecipes] = useState<RecipeTypes[]>([])

  useEffect(() => {
    text && searchRecipesByNameFromApi(text).then(data => setRecipes(data.meals)).catch(err => console.log(err))
    !text && setRecipes([])
  }, [text])

  const renderRecipes = () => recipes.map(item => {
    return (
      <div key={item.idMeal} className='flex gap-x-2'>
        <span>{item?.strMeal}</span>
        <span>{item.strArea}</span>
        <span>{item.strCategory}</span>
      </div>
    )
  })

  return (
    <div className={`absolute flex flex-col gap-y-2 ${recipes?.length ? "h-40" : "h-0"} overflow-y-scroll`}>
      { recipes?.length ? renderRecipes() : null}
    </div>
  )
}

const RenderNav = ({...item}: NavType) => {
  const {icon, name, path} = item

  return (
    <Link href={path}>
      <span>( {icon} )</span>
      <span>{name}</span>
    </Link>
  )
}

const navs = [
  {name: "Home", path: "/", icon: "HH"},
  {name: "Popular Recipes", path: "/popular-recipes", icon: "PR"},
  {name: "Filter Recipes", path: "/filter-recipes", icon: "FR"}
]