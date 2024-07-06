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

store.dispatch(getAllViewedRecipesFromDb())

// store.dispatch(getAllUserSpeceficEventsData())

export const Header = () => {
  const renderNavs = () => navs.map(item => <RenderNav key={item.name} icon={item.icon} name={item.name} path={item.path} />)

  // fetching user specific events data from db once per page load
  // reverting back a doing so scheduler events fails to use dnd addons properly
  // useForGetAllEventsDataForAuthenticatedUser()

  const pathName = usePathname()

  const locale = useLocale()

  return (
    <div className="flex flex-col justify-center items-center gap-y-1">
      {/* <Link href={"/"} title="What's Cooking Yo!!" className="self-start">
        <img
          src={logo.src}
          // className="xxs:w-36 xxs:h-36 sm:w-40 sm:h-40 xl:w-52 xl:h-52 rounded-full"
          className="w-20 rounded-full"
          alt="what's cooking yo!! logo"
          height={logo.height} width={logo.width}
        />
      </Link> */}

      {/* <div className="flex gap-x-4 items-center self-end">
        <LocaleSwitcher />
        <UserAuth />
      </div> */}

      <div
        // className="bg-card flex xxs:justify-around lg:justify-center xxs:gap-x-2 lg:gap-x-10 w-full py-2 px-1"
        className="bg-card flex items-end xxs:justify-around lg:justify-between xxs:gap-x-2 lg:gap-x-10 w-full py-0.5 pl-2 pr-6"
      >
        <Link href={"/"} title="What's Cooking Yo!!" className="self-start w-[6%]">
          <img
            src={logo.src}
            // className="xxs:w-36 xxs:h-36 sm:w-40 sm:h-40 xl:w-52 xl:h-52 rounded-full"
            className="w-20 rounded-full"
            alt="what's cooking yo!! logo"
            height={logo.height} width={logo.width}
          />
        </Link>

        <div className="flex flex-col w-full gap-y-2">
          <div className="flex gap-x-10 items-center justify-end">
            <LocaleSwitcher />
            <UserAuth />
          </div>
          
          <div className="flex justify-start gap-x-20 w-fit">
            <nav
              // className='flex xxs:gap-x-2 xs:gap-x-6 lg:gap-x-10 justify-end xs:text-[.71rem] lg:text-sm xl:text-2xl 2xl:text-3xl'
              className='flex justify-start items-end xxs:gap-x-2 xs:gap-x-6 lg:gap-x-16 w-2/3'
            >
              {renderNavs()}
            </nav>

            {
              pathName !== `/${locale}/filter-recipes`
                ? <SearchRecipes />
                : null
            }
          </div>
        </div>


        {/* <nav
          // className='flex xxs:gap-x-2 xs:gap-x-6 lg:gap-x-10 justify-end xs:text-[.71rem] lg:text-sm xl:text-2xl 2xl:text-3xl'
          className='flex items-end xxs:gap-x-2 xs:gap-x-6 lg:gap-x-14'
        >
          {renderNavs()}
        </nav>

        {
          pathName !== `/${locale}/filter-recipes`
            ? <SearchRecipes />
            : null
        }

        <div className="flex gap-x-4 items-center">
          <LocaleSwitcher />
          <UserAuth />
        </div> */}
      </div>
    </div>
  )
}

const UserAuth = () => {
  const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

  return (
    <div className="text-special-foreground flex items-center relative cursor-pointer">

      <span onClick={isTrue ? handleFalsy : handleTruthy} className="xxs:text-xl xs:text-2xl sm:text-3xl lg:text-3xl relative duration-1000 transition-all hover:text-special" title="User Auth">
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
        ? <Link className="pointer-events-none bg-accent px-2 rounded-md" href={""}>Wait..</Link>
        : <>
          <UserAuthLinkView href={`/${locale}/signup`} text="Signup" icon={<TiUserAdd />} />
          <UserAuthLinkView href={`/api/auth/signin`} text="Sign-In" icon={<GoSignIn />} />
        </>
  )

  return (
    <div ref={ref} onClick={handleFalsy} className="absolute flex flex-col gap-y-2 top-9 right-0 bg-card py-2 px-1 z-50 xxs:w-28 lg:w-36">
      <div className="xxs:text-sm sm:text-lg lg:text-xl text-center text-muted-foreground">User Auth</div>
      {options}
    </div>
  )
}

const UserAuthLinkView = ({ href, text, icon }: { href: string, text: string, icon: ReactNode }) => {
  return (
    <Link className="bg-accent xxs:p-1 lg:px-2 rounded-md flex gap-2 items-center justify-center duration-1000 transition-all hover:bg-special-foreground hover:text-secondary font-bold xxs:text-sm xs:text-lg sm:text-xl" href={`${href}`} title={text}>
      <span className="xxs:hidden xs:block">{text}</span>
      <span className="">{icon}</span>
    </Link>
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

  const handleEnterPressed = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      text.length >= 2 && fetchRecipesFromApi()

      if (text.length < 2) {
        alert("at least use two or more letters")
      }
    }
  }

  return (
    <div
      className='relative xxs:w-fit flex items-end xs:text-xs sm:text-sm lg:text-xl h-fit self-end pb-0.5'
      ref={ref}
    >
      <input
        // className="xxs:w-44 sm:w-64 md:w-72 lg:w-[22rem] h-full rounded-sm xxs:pl-1.5 lg:pl-4 text-muted-foreground bg-transparent border-0 border-b-2 border-b-primary placeholder:text-accent xxs:text-[0.62rem] sm:text-sm md:text-lg lg:text-xl focus:outline-none"
        className="xxs:w-44 sm:w-64 md:w-72 lg:w-96 2xl:w-[29rem] h-full rounded-sm xxs:pl-1.5 lg:pl-2.5 text-muted-foreground bg-transparent border-0 border-b-2 border-b-primary placeholder:text-accent xxs:text-[0.62rem] sm:text-sm md:text-lg lg:text-xl focus:outline-none pb-0.5"
        type="text" placeholder='search recipes by name'
        value={text} onChange={handleTextChange} onFocus={handleTruthyForFocused}
        onKeyUp={handleEnterPressed}
      />
      <Button onClick={handleTruthy} variant={"ghost"} title="Click To Search Now" className="absolute right-0.5 bottom-1.5 xxs:h-5 lg:h-6 bg-special-foreground text-muted hover:text-muted hover:bg-special font-semibold xxs:text-sm md:text-lg lg:text-xl"><RiSearchLine /></Button>
      <ShowAllFoundRecipes
        showDropdown={forFocused} handleFalsyForFocused={handleFalsyForFocused} recipes={recipes} />
    </div>
  )
}

const ShowAllFoundRecipes = ({ showDropdown, handleFalsyForFocused, recipes }: { showDropdown: boolean, handleFalsyForFocused: () => void, recipes: RecipeMealType[] }) => {
  const locale = useLocale()

  const renderRecipes = () => recipes.map(item => {
    const { label, uri, cuisineType, mealType } = item
    return (
      <Link
        href={`/${locale}/recipe/${extractRecipeId(uri)}`}
        key={uri}
        // className='flex gap-x-2 outline-dotted text-primary justify-between' 
        className='grid grid-cols-3 gap-1 text-primary justify-between p-1 xxs:px-1.5 lg:px-2.5 hover:bg-accent'
        title={`Click to see in detail: ${label}`}
        onClick={handleFalsyForFocused}
      >
        {/* <span className="text-lg col-span-2">{label.length > 11 ? ellipsedText(label, 11) : label}</span> */}
        <span className="text-lg col-span-2">{label.length > 27 ? ellipsedText(label, 27) : label}</span>
        {/* <span className="text-lg col-span-2">{label}</span> */}
        <span className="capitalize text-right">{cuisineType[0]}</span>
        {/* <span className="capitalize">{cuisineType[0]}</span>
        <span className="capitalize">{mealType[0]}</span> */}
        {/* <Badge>{cuisineType[0]}</Badge>
        <Badge>{mealType[0]}</Badge> */}
      </Link>
    )
  })

  return (
    <div className={`absolute w-full top-8 right-0 flex flex-col gap-y-0 ${recipes?.length && showDropdown ? "max-h-[11rem]" : "h-0"} overflow-y-scroll no-scrollbar z-50 bg-card rounded-b-xl`}>
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
    <Link
      href={`/${locale}/${path}`}
      className="flex gap-1 items-center justify-center font-bold text-primary transition-all duration-500 hover:text-special h-fit">
      <span
        // className="xxs:text-3xl xs:text-4xl sm:text-5xl lg:text-4xl"
        className="xxs:text-lg xs:text-xl sm:text-2xl lg:text-4xl"
      >{icon}</span>
      <span className="xxs:hidden lg:block xs:text-[.71rem] lg:text-lg xl:text-xl 2xl:text-2xl self-end">{t(`${name}`)}</span>
    </Link>
  )
}

export const fetchAndUpdateData = (params: any, setRecipes: any) => {
  searchRecipes(params).then(d => {
    const onlyRecipes = d?.hits.map((item: any) => item.recipe)

    const readyForRendering = onlyRecipes?.map((item: any) => item?.mealType?.length && item?.dishType?.length && item?.dietLabels?.length && item).filter((item: any) => item).filter((v: any, idx: number, self: any) => idx === self.findIndex((t: any) => t.label === v.label)) || []

    readyForRendering?.length && setRecipes(readyForRendering)

    !readyForRendering?.length && alert("Sorry, nothing is found to display for this search term, please try again, thank you :)")

  }).catch(err => console.log(err))
}

const navs = [
  { name: "Home", path: "/", icon: <MdFoodBank /> },
  { name: "Popular Recipes", path: "/popular-recipes", icon: <MdRestaurantMenu /> },
  { name: "Filter Recipes", path: "/filter-recipes", icon: <IoIosColorFilter /> }
]