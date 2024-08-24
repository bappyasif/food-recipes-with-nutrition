import { RecipeMealType } from '@/types'
import React, { useEffect, useRef } from 'react'
import { ReusableModal, extractRecipeId, removeWrodRecipe } from '../forFilters/RecipesView'
import { Badge } from '../ui/badge'
import Link from 'next/link'
import { ellipsedText } from '../forRecipe/FewNonRelatedRecipes'
import { useLocale } from 'next-intl'
import { useForTruthToggle } from '@/hooks/forComponents'
import { TbLoader2 } from 'react-icons/tb'

export const RandomizedRecipesView = ({ recipes, handleClick, existingFilters, fetchText }: { recipes: RecipeMealType[], handleClick: () => void, existingFilters: { cuisine: string, dish: string, health: string, diet: string, meal: string }, fetchText: string }) => {

    const { cuisine, diet, dish, health, meal } = existingFilters

    const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

    const filtersMarkup = (
        <>
            <FilterUsed title={"Cuisine"} val={cuisine} />
            <FilterUsed title={"Dish"} val={dish} />
            <FilterUsed title={"Diet"} val={diet} />
            <FilterUsed title={"Health-Label"} val={health} />
            <FilterUsed title={"Meal"} val={meal} />
        </>
    )

    const existingFiltersMarkup = (
        <span className='flex flex-col gap-y-4 w-full justify-center items-center xxs:mb-4 lg:mb-8'>
            <span className='xxs:text-lg md:text-xl lg:text-4xl font-bold text-secondary'>Existing Filters</span>
            <span className='flex gap-x-10 gap-y-6 flex-wrap xxs:text-sm sm:text-lg md:text-xl lg:text-2xl'>
                {filtersMarkup}
            </span>
            <span className='xxs:text-sm md:text-lg lg:text-xl font-bold text-muted-foreground'>{isTrue ? "Fetching New Recipes" : ""}</span>
        </span>
    )

    const ref = useRef<HTMLSpanElement | null>(null)

    const handleScrollTopTop = () => {
        ref.current?.scrollTo({ top: 0, behavior: "smooth" })
    }

    const processRefetch = () => {
        handleTruthy()
        handleClick()
        handleScrollTopTop()
    }

    const renderRecipes = () => recipes.map(item => <RenderRecipeItem key={item.uri} data={item} />)

    useEffect(() => {
        recipes.length && handleFalsy()
    }, [recipes])

    return (
        <div className='font-bold text-xl text-center'>
            <Badge
                className={`bg-accent hover:bg-accent-foreground text-secondary my-2 xxs:text-sm lg:text-lg mr ${fetchText || recipes.length ? "visible" : "invisible"}`}
            >
                {recipes.length ? `Recipes Found - ${recipes.length}` : fetchText}
            </Badge>
            {
                recipes.length
                    ? <ReusableModal
                        title=''
                        triggerText='Click To View'
                        changeWidth={true} handleTrigger={() => null}
                    >
                        <span
                            className='flex flex-col gap-y-4 xxs:h-[29rem] sm:h-[18rem] lg:h-[44rem]'
                        >
                            {existingFiltersMarkup}

                            <span ref={ref} className='grid xxs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-[45rem] justify-items-center place-items-center gap-6 overflow-y-scroll scroll-smooth no-scrollbar'>
                                {renderRecipes()}

                                {
                                    recipes.length
                                        ? <span className='w-96 min-h-[23.6rem] h-full rounded-sm bg-quaternary text-secondary flex justify-center items-center gap-x-4 text-xl'>Want To See More? <span className='py-2 text-lg text-secondary font-bold h-6 bg-accent hover:bg-primary hover:text-content cursor-pointer px-4 rounded-full flex items-center justify-center' onClick={processRefetch}>Click Here</span></span>
                                        : null
                                }
                            </span>
                        </span>
                    </ReusableModal>
                    : null
            }
        </div>
    )
}

const FilterUsed = ({ ...item }: { title: string, val: string }) => {
    const { title, val } = item;

    return (
        <span className='flex gap-x-2 text-secondary'><span className='px-2'>{title}:</span><span className='font-light px-2 text-content'>{val || "N/A"}</span></span>
    )
}

const RenderRecipeItem = ({ data }: { data: RecipeMealType }) => {
    const { uri, label, calories, images, mealType, co2EmissionsClass } = data;
    const { LARGE, REGULAR, SMALL } = images;
    const locale = useLocale()

    const { handleFalsy: falsy, handleTruthy: truthy, isTrue: isLoading } = useForTruthToggle()

    return (
        <span className='flex flex-col gap-y-2 justify-center items-center xxs:w-96 md:w-80 lg:w-96 bg-background rounded-md hover:bg-background/40'>
            <Link
                href={`/${locale}/recipe/${extractRecipeId(uri)}`}
                className='flex flex-col gap-y-2 relative hover:bg-secondary text-primary hover:text-ternary rounded-sm'
                title={label}
                onClick={isLoading ? falsy : truthy}
            >
                <span className='font-bold text-2xl text-center'>{removeWrodRecipe(label).length > 26 ? ellipsedText(removeWrodRecipe(label), 26) : removeWrodRecipe(label)}</span>

                <img src={REGULAR?.url || SMALL?.url} height={REGULAR?.height || SMALL?.height} width={REGULAR?.width || SMALL?.width} alt={label} className='xxs:w-[23.6rem] md:w-[19.5rem] lg:w-[23.6rem] xxs:h-40 lg:h-64 rounded-sm object-cover duration-300 transition-all hover:object-center hover:rounded-md' placeholder='blur' loading='lazy' />

                <TbLoader2 size={110} className={`${isLoading ? "absolute animate-spin self-center top-24 z-10" : "hidden"}`} />
            </Link>

            <span className='flex flex-col gap-y-1.5 w-full px-2'>
                <RenderReusableBadgeItem text={`${calories.toFixed(2)}`} title='Calories' />
                <RenderReusableBadgeItem title='Meal Type' text={mealType[0]} />
                <RenderReusableBadgeItem title='CO2 Emission Rating' text={co2EmissionsClass} />
            </span>
        </span>
    )
}

const RenderReusableBadgeItem = ({ title, text }: { title: string, text: string }) => {
    return (
        <span className='flex justify-between gap-x-10 text-secondary w-full font-medium'>
            <span className='xxs:text-sm lg:text-xl'>{title}</span>
            <span className='xxs:text-sm lg:text-lg text-primary'>{text}</span>
        </span>
    )
}