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
    <div className="flex flex-col justify-center items-center gap-y-6">
      <Link href={"/"} title="What's Cooking Yo!!">
        <img src={logo.src} className="w-24 h-24 rounded-full" alt="what's cooking yo!! logo" height={logo.height} width={logo.width} />
      </Link>

      {/* <div className='w-full flex justify-between'> */}
      {/* <h1>Company Logo!!</h1> */}
      {/* <img src={logo.src} className="w-40 h-20" alt="what's cooking yo!! logo" height={logo.height} width={logo.width} /> */}

      <div className="bg-card flex justify-center gap-x-10 w-full py-2">
        <nav className='flex gap-x-9 justify-end xs:text-[.71rem] md:text-lg xl:text-2xl'>
          {renderNavs()}
        </nav>
        {
          pathName !== "/filter-recipes"
            ? <SearchRecipes />
            : null
        }
      </div>
      {/* </div> */}
    </div>
  )
}

const SearchRecipes = () => {
  const { handleTextChange, text } = useForInputTextChange();

  return (
    <div className='relative w-1/4 flex items-center xs:text-xs sm:text-sm lg:text-xl'>
      <input className="w-full h-full rounded-sm pl-4 text-primary bg-transparent border-0 border-b-2 border-b-primary" type="text" placeholder='search recipes by name' value={text} onChange={handleTextChange} />
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
      <Button variant={"link"} key={item.idMeal} className='flex gap-x-2 outline-dotted text-primary justify-between' title={item?.strMeal}>
        <span className="text-lg">{item?.strMeal.length > 11 ? ellipsedText(item?.strMeal, 11) : item?.strMeal}</span>
        <Badge>{item.strArea}</Badge>
        <Badge>{item.strCategory}</Badge>
      </Button>
    )
  })

  return (
    <div className={`absolute w-full top-8 right-0 flex flex-col gap-y-2 ${recipes?.length ? "h-40" : "h-0"} overflow-y-scroll no-scrollbar z-40 bg-card`}>
      {recipes?.length ? renderRecipes() : null}
    </div>
  )
}

const RenderNav = ({ ...item }: NavType) => {
  const { icon, name, path } = item

  return (
    <Link href={path} className="flex gap-1 items-center font-bold text-primary">
      <span>{icon}</span>
      <span className="xxs:hidden md:block">{name}</span>
    </Link>
  )
}

const navs = [
  { name: "Home", path: "/", icon: <MdFoodBank /> },
  { name: "Popular Recipes", path: "/popular-recipes", icon: <MdRestaurantMenu /> },
  { name: "Filter Recipes", path: "/filter-recipes", icon: <IoIosColorFilter /> }
]