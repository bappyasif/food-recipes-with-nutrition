"use client"

import { MdFoodBank, MdRestaurantMenu } from "react-icons/md"
import { IoIosColorFilter } from "react-icons/io"
import { getAllEventsDataForAuthenticatedUser, useForInputTextChange, useForOutsideClick, useForTruthToggle } from '@/hooks/forComponents'
import { NavType, RecipeMealType } from '@/types'
import { searchRecipes } from '@/utils/dataFetching'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import logo from "../../public/logo-why.png"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { ellipsedText } from "./forRecipe/FewNonRelatedRecipes"
import { useTranslations, useLocale } from "use-intl"
import { LocaleSwitcher } from "./LocaleSwitcher"
import { getAllViewedRecipesFromDb } from "@/redux/thunks"
import store from "@/redux/store"
import { useSession } from "next-auth/react"

store.dispatch(getAllViewedRecipesFromDb())

// store.dispatch(getAllUserSpeceficEventsData())

export const Header = () => {
  const renderNavs = () => navs.map(item => <RenderNav key={item.name} icon={item.icon} name={item.name} path={item.path} />)

  // fetching user specific events data from db once per page load
  getAllEventsDataForAuthenticatedUser()

  const pathName = usePathname()

  const locale = useLocale()

  return (
    <div className="flex flex-col justify-center items-center gap-y-6">
      <Link href={"/"} title="What's Cooking Yo!!">
        <img
          src={logo.src}
          className="w-24 h-24 rounded-full"
          alt="what's cooking yo!! logo"
          height={logo.height} width={logo.width}
        />
      </Link>

      <div className="bg-card flex justify-around gap-x-2 w-full py-2">
        <nav className='flex gap-x-2 justify-end xs:text-[.71rem] lg:text-lg xl:text-2xl'>
          {renderNavs()}
        </nav>

        {
          pathName !== `/${locale}/filter-recipes`
            ? <SearchRecipes />
            : null
        }

        <LocaleSwitcher />

        <UserAuth />
      </div>
    </div>
  )
}

const UserAuth = () => {
  const { status } = useSession()

  return (
    <div className="text-special flex items-center">
      {
        status === "authenticated"
        ? <Link href={"/api/auth/signout"}>Logout</Link>
        : status === "loading"
        ? <Link className="pointer-events-none" href={""}>Wait..</Link>
        : <Link href={"/api/auth/signin"}>Login</Link>
      }
    </div>
  )
}

const SearchRecipes = () => {
  const { handleTextChange, text } = useForInputTextChange();

  const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle();

  const { handleFalsy: handleFalsyForFocused, handleTruthy: handleTruthyForFocused, isTrue: forFocused } = useForTruthToggle()

  useEffect(() => {
    handleFalsy()
  }, [text])

  const ref = useRef<HTMLDivElement>(null)

  useForOutsideClick(ref, handleFalsyForFocused)

  return (
    <div className='relative xxs:w-fit flex items-center xs:text-xs sm:text-sm lg:text-xl' ref={ref} onClick={handleTruthyForFocused}>
      <input
        className="xxs:w-44 sm:w-64 md:w-72 lg:w-[22rem] h-full rounded-sm xxs:pl-0 lg:pl-4 text-special-foreground bg-transparent border-0 border-b-2 border-b-special placeholder:text-special-foreground xxs:text-[0.62rem] sm:text-sm md:text-lg lg:text-xl" type="text" placeholder='search recipes by name'
        value={text} onChange={handleTextChange}
      />
      <Button onClick={handleTruthy} variant={"ghost"} className="absolute right-0 xxs:h-5 lg:h-6 bg-special-foreground text-muted hover:text-muted hover:bg-special font-semibold xxs:text-[.51rem] md:text-sm lg:text-lg">Search</Button>
      <ShowAllFoundRecipes text={text} isTrue={isTrue} showDropdown={forFocused} />
    </div>
  )
}

const ShowAllFoundRecipes = ({ text, isTrue, showDropdown }: { text: string, isTrue: boolean, showDropdown: boolean }) => {
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
  }

  useEffect(() => {
    !text && setRecipes([])

    isTrue && text.length >= 2 && fetchRecipesFromApi()
  }, [text, isTrue])

  const renderRecipes = () => recipes.map(item => {
    const { label, uri, cuisineType, mealType } = item
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

  // when using with "next-intl"
  const t = useTranslations("default")

  const locale = useLocale().toString()

  return (
    <Link href={`/${locale}/${path}`} className="flex gap-1 items-center font-bold text-primary">
      <span className="xxs:text-2xl sm:text-3xl lg:text-2xl">{icon}</span>
      <span className="xxs:hidden md:block">{t(`${name}`)}</span>
    </Link>
  )
}

export const fetchAndUpdateData = (params: any, setRecipes: any) => {
  searchRecipes(params).then(d => {
    const onlyRecipes = d?.hits.map((item: any) => item.recipe)

    const readyForRendering = onlyRecipes?.map((item: any) => item.mealType.length && item.dishType.length && item.dietLabels.length && item).filter((item: any) => item).filter((v: any, idx: number, self: any) => idx === self.findIndex((t: any) => t.label === v.label)) || []

    readyForRendering?.length && setRecipes(readyForRendering)

  }).catch(err => console.log(err))
}

const navs = [
  { name: "Home", path: "/", icon: <MdFoodBank /> },
  { name: "Popular Recipes", path: "/popular-recipes", icon: <MdRestaurantMenu /> },
  { name: "Filter Recipes", path: "/filter-recipes", icon: <IoIosColorFilter /> }
]