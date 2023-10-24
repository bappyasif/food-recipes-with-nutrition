"use client"

import { MdFoodBank, MdRestaurantMenu } from "react-icons/md"
import { IoIosColorFilter } from "react-icons/io"
import { useForInputTextChange, useForOutsideClick, useForTruthToggle } from '@/hooks/forComponents'
import { NavType, RecipeMealType, RecipeTypes } from '@/types'
import { searchRecipes, searchRecipesByNameFromApi } from '@/utils/dataFetching'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import logo from "../../public/logo-why.png"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { ellipsedText } from "./forRecipe/FewNonRelatedRecipes"
import { useTranslations, useLocale } from "use-intl"
import { LocaleSwitcher } from "./LocaleSwitcher"

export const Header = () => {
  const renderNavs = () => navs.map(item => <RenderNav key={item.name} icon={item.icon} name={item.name} path={item.path} />)

  const pathName = usePathname()

  const locale = useLocale()

  return (
    <div className="flex flex-col justify-center items-center gap-y-6">
      <Link href={"/"} title="What's Cooking Yo!!">
        <img src={logo.src} className="w-24 h-24 rounded-full" alt="what's cooking yo!! logo" height={logo.height} width={logo.width} />
      </Link>

      <div className="bg-card flex justify-center gap-x-10 w-full py-2">
        <nav className='flex gap-x-9 justify-end xs:text-[.71rem] md:text-lg xl:text-2xl'>
          {renderNavs()}
        </nav>
        {
          pathName !== `/${locale}/filter-recipes`
            ? <SearchRecipes />
            : null
        }
        <LocaleSwitcher />
      </div>
    </div>
  )
}

const SearchRecipes = () => {
  const { handleTextChange, text } = useForInputTextChange();

  const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle();

  const {handleFalsy:handleFalsyForFocused, handleTruthy: handleTruthyForFocused, isTrue:forFocused} = useForTruthToggle()

  useEffect(() => {
    handleFalsy()
    // console.log(ref.current, "ref here!!")
  }, [text])

  const ref = useRef<HTMLDivElement>(null)

  useForOutsideClick(ref, handleFalsyForFocused)

  // console.log(forFocused, "is it")

  return (
    <div className='relative w-1/4 flex items-center xs:text-xs sm:text-sm lg:text-xl' ref={ref} onClick={handleTruthyForFocused}>
      <input className="w-full h-full rounded-sm pl-4 text-special-foreground bg-transparent border-0 border-b-2 border-b-special placeholder:text-special-foreground" type="text" placeholder='search recipes by name' value={text} onChange={handleTextChange} />
      <Button onClick={handleTruthy} variant={"ghost"} className="absolute right-0 h-6 bg-special-foreground text-muted hover:text-muted hover:bg-special font-semibold">Search</Button>
      <ShowAllFoundRecipes text={text} isTrue={isTrue} showDropdown={forFocused} />
    </div>
  )
}

const ShowAllFoundRecipes = ({ text, isTrue, showDropdown }: { text: string, isTrue: boolean, showDropdown: boolean }) => {
  // const [recipes, setRecipes] = useState<RecipeTypes[]>([])
  const [recipes, setRecipes] = useState<RecipeMealType[]>([])

  const fetchRecipesFromApi = () => {
    const params = {
      app_id: process.env.NEXT_PUBLIC_EDAMAM_APP_ID,
      app_key: process.env.NEXT_PUBLIC_EDAMAM_APP_KEY,
      q: text,
      random: true,
      type: "public",
    }

    fetchAndUpdateData(params, setRecipes)

    // const doThis = searchRecipes(params).then(d => console.log(d, "found!!")).catch(err => console.log(err))

    // const timer = setTimeout(() => text && doThis, 1899)

    // return () => clearTimeout(timer)
  }

  useEffect(() => {
    // if limit goes beyond acceptable range then use this instead, whch uses mealdb api which is not restricted limited requests
    // text && searchRecipesByNameFromApi(text).then(data => setRecipes(data.meals)).catch(err => console.log(err))
    !text && setRecipes([])

    isTrue && text.length >= 2 && fetchRecipesFromApi()
  }, [text, isTrue])

  // const renderRecipes = () => recipes.map(item => {
  //   return (
  //     <Button variant={"link"} key={item.idMeal} className='flex gap-x-2 outline-dotted text-primary justify-between' title={item?.strMeal}>
  //       <span className="text-lg">{item?.strMeal.length > 11 ? ellipsedText(item?.strMeal, 11) : item?.strMeal}</span>
  //       <Badge>{item.strArea}</Badge>
  //       <Badge>{item.strCategory}</Badge>
  //     </Button>
  //   )
  // })

  const renderRecipes = () => recipes.map(item => {
    const {label, uri, cuisineType, mealType} = item
    return (
      <Button variant={"link"} key={uri} className='flex gap-x-2 outline-dotted text-primary justify-between' title={label}>
        <span className="text-lg">{label.length > 11 ? ellipsedText(label, 11) : label}</span>
        <Badge>{cuisineType[0]}</Badge>
        <Badge>{mealType[0]}</Badge>
      </Button>
    )
  })

  // console.log(recipes, "recipes!!")

  return (
    <div className={`absolute w-full top-8 right-0 flex flex-col gap-y-2 ${recipes?.length && showDropdown ? "h-40" : "h-0"} overflow-y-scroll no-scrollbar z-40 bg-card`}>
      {recipes?.length && showDropdown ? renderRecipes() : null}
    </div>
  )
}

const RenderNav = ({ ...item }: NavType) => {
  const { icon, name, path } = item

  // when using with react-intl
  // const t = useTranslations()

  // when using with "next-intl"
  const t = useTranslations("default")

  const locale = useLocale().toString()

  return (
    <Link href={`/${locale}/${path}`} className="flex gap-1 items-center font-bold text-primary">
      <span>{icon}</span>
      <span className="xxs:hidden md:block">{t(`${name}`)}</span>
    </Link>
  )
}

export const fetchAndUpdateData = (params: any, setRecipes: any) => {
  searchRecipes(params).then(d => {
    // console.log(d, "!!")
    const onlyRecipes = d?.hits.map((item: any) => item.recipe)
    // onlyRecipes?.length && setRecipes(onlyRecipes)

    const readyForRendering = onlyRecipes?.map((item: any) => item.mealType.length && item.dishType.length && item.dietLabels.length && item).filter((item: any) => item).filter((v: any, idx: number, self: any) => idx === self.findIndex((t: any) => t.label === v.label)) || []

    readyForRendering?.length && setRecipes(readyForRendering)
    // console.log(readyForRendering.length, "readyForRendeing")

  }).catch(err => console.log(err))
}

const navs = [
  { name: "Home", path: "/", icon: <MdFoodBank /> },
  { name: "Popular Recipes", path: "/popular-recipes", icon: <MdRestaurantMenu /> },
  { name: "Filter Recipes", path: "/filter-recipes", icon: <IoIosColorFilter /> }
]