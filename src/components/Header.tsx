"use client"

import { TbBrandGoogleHome } from "react-icons/tb"
import { MdFoodBank, MdRestaurant, MdRestaurantMenu } from "react-icons/md"
import { IoIosColorFilter } from "react-icons/io"
import { useForInputTextChange } from '@/hooks/forComponents'
import { NavType, RecipeTypes } from '@/types'
import { searchRecipesByNameFromApi } from '@/utils/dataFetching'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import logo from "../../public/logo-why.png"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { ellipsedText } from "./forRecipe/FewNonRelatedRecipes"

export const Header = () => {
  const renderNavs = () => navs.map(item => <RenderNav key={item.name} icon={item.icon} name={item.name} path={item.path} />)

  const pathName = usePathname()

  return (
    <div className="flex flex-col justify-center items-center gap-y-6 bg-primary-content">
      <img src={logo.src} className="w-24 h-24 rounded-full" alt="what's cooking yo!! logo" height={logo.height} width={logo.width} />

      <div className='w-full text-2xl bg-primary-focus flex justify-between'>
        {/* <h1>Company Logo!!</h1> */}
        {/* <img src={logo.src} className="w-40 h-20" alt="what's cooking yo!! logo" height={logo.height} width={logo.width} /> */}

        <div className="flex justify-center gap-x-10 w-full">
          <nav className='flex gap-x-9 justify-end'>
            {renderNavs()}
          </nav>
          {
            pathName !== "/filter-recipes"
              ? <SearchRecipes />
              : null
          }
        </div>
      </div>
    </div>
  )
}

const SearchRecipes = () => {
  const { handleTextChange, text } = useForInputTextChange();

  return (
    <div className='relative w-1/4'>
      <input className="w-full" type="text" placeholder='seacrh recipes by name' value={text} onChange={handleTextChange} />
      <ShowAllFoundRecipes text={text} />
    </div>
  )
}

const ShowAllFoundRecipes = ({ text }: { text: string }) => {
  const [recipes, setRecipes] = useState<RecipeTypes[]>([])

  useEffect(() => {
    text && searchRecipesByNameFromApi(text).then(data => setRecipes(data.meals)).catch(err => console.log(err))
    !text && setRecipes([])
  }, [text])

  const renderRecipes = () => recipes.map(item => {
    return (
      <Button variant={"link"} key={item.idMeal} className='flex gap-x-2 outline-dotted text-primary-focus justify-between' title={item?.strMeal}>
        <span className="text-lg">{item?.strMeal.length > 11 ? ellipsedText(item?.strMeal, 11): item?.strMeal}</span>
        <Badge>{item.strArea}</Badge>
        <Badge>{item.strCategory}</Badge>
      </Button>
    )
  })

  return (
    <div className={`absolute flex flex-col gap-y-2 ${recipes?.length ? "h-40" : "h-0"} overflow-y-scroll z-40 bg-primary-content`}>
      {recipes?.length ? renderRecipes() : null}
    </div>
  )
}

const RenderNav = ({ ...item }: NavType) => {
  const { icon, name, path } = item

  return (
    <Link href={path} className="flex gap-1 items-center">
      <span>{icon}</span>
      <span>{name}</span>
    </Link>
  )
}

const navs = [
  { name: "Home", path: "/", icon: <MdFoodBank /> },
  { name: "Popular Recipes", path: "/popular-recipes", icon: <MdRestaurantMenu /> },
  { name: "Filter Recipes", path: "/filter-recipes", icon: <IoIosColorFilter /> }
]