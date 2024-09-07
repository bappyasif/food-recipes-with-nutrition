"use client"

import { MdFoodBank, MdRestaurantMenu } from "react-icons/md"
import { IoIosColorFilter } from "react-icons/io"
import { useForInputTextChange, useForOutsideClick, useForTruthToggle } from '@/hooks/forComponents'
import { NavType, RecipeMealType } from '@/types'
import { searchRecipes } from '@/utils/dataFetching'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import logo from "../../public/logo-why.png"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { ellipsedText } from "./forRecipe/FewNonRelatedRecipes"
import { useTranslations, useLocale } from "use-intl"
import { LocaleSwitcher } from "./LocaleSwitcher"
import { getAllViewedRecipesFromDb } from "@/redux/thunks"
import store from "@/redux/store"
import { useSession } from "next-auth/react"
import { GoSignIn, GoSignOut } from "react-icons/go"
import { TiUserAdd } from "react-icons/ti"
import { RiUserSettingsFill, RiSearchLine } from "react-icons/ri"
import { extractRecipeId } from "./forFilters/RecipesView"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { SearchModal } from "./forHeader/SearchModal"
import { Search } from "./forHeader/Search"

store.dispatch(getAllViewedRecipesFromDb())

// store.dispatch(getAllUserSpeceficEventsData())

export const Header = () => {
  const renderNavs = () => navs.map(item => <RenderNav key={item.name} icon={item.icon} name={item.name} path={item.path} />)

  // fetching user specific events data from db once per page load
  // reverting back a doing so scheduler events fails to use dnd addons properly
  // useForGetAllEventsDataForAuthenticatedUser()

  const pathName = usePathname()

  const locale = useLocale()

  const check = pathName !== `/${locale}/filter-recipes`

  return (
    <div className="flex flex-col justify-center items-center gap-y-1">
      <div
        className="bg-primary flex items-end xxs:justify-around lg:justify-between xxs:gap-x-2 lg:gap-x-10 w-full py-0.5 pl-2 pr-6"
      >
        <Link href={"/"} title="What's Cooking Yo!!" className="self-start xl:w-[6%]">
          <img
            src={logo.src}
            className="w-28 md:w-20 rounded-full"
            alt="what's cooking yo!! logo"
            height={logo.height} width={logo.width}
          />
        </Link>

        <div className="flex flex-col w-full gap-y-2">
          <div className="flex gap-x-2 md:gap-x-16 items-center justify-end">
            {
              check
                ? <SearchRecipes />
                : null
            }
            <div className="flex gap-x-2 md:gap-x-16 items-end self-end">
              <LocaleSwitcher />
              <UserAuth />
            </div>
          </div>

          <nav
            className={`flex justify-start items-end xxs:gap-x-2 xs:gap-x-6 lg:gap-x-16 ${check ? "w-4/5" : "w-full"}`}
          >
            {renderNavs()}
          </nav>
        </div>
      </div>
    </div>
  )
}

const UserAuth = () => {
  const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

  return (
    <div className="text-content/80 flex items-center relative cursor-pointer">

      <span onClick={isTrue ? handleFalsy : handleTruthy} className="xxs:text-xl xs:text-2xl sm:text-3xl lg:text-3xl relative duration-1000 transition-all hover:text-content-light/80" title="User Auth">
        <RiUserSettingsFill />
      </span>

      {
        isTrue
          ? <ShowDropdown handleFalsy={handleFalsy} />
          : null
      }
    </div>
  )
}

const ShowDropdown = ({ handleFalsy }: { handleFalsy: () => void }) => {
  const { status } = useSession();
  const locale = useLocale()

  const ref = useRef(null)

  useForOutsideClick(ref, handleFalsy)

  const options = (
    status === "authenticated"
      ? <UserAuthLinkView href={`/api/auth/signout`} text="Logout" icon={<GoSignOut />} />
      : status === "loading"
        ? <Link className="pointer-events-none px-2 rounded-md" href={""}>Wait..</Link>
        : <>
          <UserAuthLinkView href={`/${locale}/signup`} text="Signup" icon={<TiUserAdd />} />
          <UserAuthLinkView href={`/api/auth/signin`} text="Sign-In" icon={<GoSignIn />} />
        </>
  )

  return (
    <div ref={ref} onClick={handleFalsy} className="absolute flex flex-col gap-y-2 top-9 right-0 bg-ternary py-2 px-1 z-50 xxs:w-28 lg:w-36 rounded-sm">
      <div className="xxs:text-sm sm:text-lg lg:text-xl text-center text-content-light/80 bg-primary/60">User Auth</div>
      {options}
    </div>
  )
}

const UserAuthLinkView = ({ href, text, icon }: { href: string, text: string, icon: ReactNode }) => {
  return (
    <Link className="xxs:p-1 lg:px-2 rounded-md flex gap-2 items-center justify-center duration-1000 transition-all bg-primary hover:bg-primary/80 hover:text-content-light/80 font-bold xxs:text-sm xs:text-lg sm:text-xl" href={`${href}`} title={text}>
      <span className="xxs:hidden xs:block">{text}</span>
      <span className="">{icon}</span>
    </Link>
  )
}

const SearchRecipes = () => {
  const { handleFalsy: clickedFalsy, handleTruthy: clickedTruthy, isTrue: clicked } = useForTruthToggle()

  return (
    <div
      className='relative xxs:w-fit flex items-end xs:text-xs sm:text-sm lg:text-xl h-fit self-end pb-0.5'
    >
      {/* for regular */}
      <Search clicked={clicked} />

      {/* for very small screens */}
      <SearchModal 
        ButtonElem={<Button variant={"default"} className="xxs:inline-flex xs:hidden text-accent xxs:text-sm items-end" size={"icon"}><RiSearchLine size={20} onClick={clickedTruthy} /></Button>} 
        clickedFalsy={clickedFalsy}
      />

    </div>
  )
}

const RenderNav = ({ ...item }: NavType) => {
  const { icon, name, path } = item

  // when using with "next-intl"
  const t = useTranslations("default")

  const locale = useLocale().toString()

  return (
    <Link
      href={`/${locale}/${path}`}
      className="flex gap-1 items-center justify-center font-bold text-content-light/80 transition-all duration-500 hover:text-quaternary h-fit">
      <span
        className="xxs:text-4xl"
      >{icon}</span>
      <span className="xxs:hidden lg:block xs:text-[.71rem] lg:text-lg xl:text-xl 2xl:text-2xl self-end">{t(`${name}`)}</span>
    </Link>
  )
}

export const fetchAndUpdateData = (params: any, setRecipes: any, reset: () => void) => {
  searchRecipes(params).then(d => {
    const onlyRecipes = d?.hits.map((item: any) => item.recipe)

    const readyForRendering = onlyRecipes?.map((item: any) => item?.mealType?.length && item?.dishType?.length && item?.dietLabels?.length && item).filter((item: any) => item).filter((v: any, idx: number, self: any) => idx === self.findIndex((t: any) => t.label === v.label)) || []

    readyForRendering?.length && setRecipes(readyForRendering)

    !readyForRendering?.length && alert("Sorry, nothing is found to display for this search term, please try again, thank you :)")

  }).catch(err => console.log(err))
    .finally(reset)
}

const navs = [
  { name: "Home", path: "/", icon: <MdFoodBank /> },
  { name: "Popular Recipes", path: "/popular-recipes", icon: <MdRestaurantMenu /> },
  { name: "Filter Recipes", path: "/filter-recipes", icon: <IoIosColorFilter /> }
]