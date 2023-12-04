import { RecipeMealType } from '@/types'
import React, { useRef } from 'react'
import { ReusableModal, extractRecipeId } from '../forFilters/RecipesView'
import { Badge } from '../ui/badge'
import Link from 'next/link'
import { ellipsedText } from '../forRecipe/FewNonRelatedRecipes'
import { useLocale } from 'next-intl'

export const RandomizedRecipesView = ({ recipes, handleClick, existingFilters }: { recipes: RecipeMealType[], handleClick: () => void, existingFilters: { cuisine: string, dish: string, health: string, diet: string, meal: string } }) => {

    const { cuisine, diet, dish, health, meal } = existingFilters

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
            <span className='xxs:text-lg md:text-xl lg:text-4xl font-bold text-muted-foreground'>Existing Filters</span>
            <span className='flex gap-2 flex-wrap xxs:text-sm sm:text-lg md:text-xl lg:text-2xl'>
                {filtersMarkup}
            </span>
        </span>
    )

    const ref = useRef<HTMLSpanElement | null>(null)

    const handleScrollTopTop = () => ref.current?.scrollIntoView( { behavior: 'smooth', block: 'start' } )

    const processRefetch = () => {
        // handleFalsy()
        handleClick()
        handleScrollTopTop()
    }

    const renderRecipes = () => recipes.map(item => <RenderRecipeItem key={item.uri} data={item} />)

    return (
        <div className='font-bold text-xl text-center'>
            <Badge
                className={`bg-accent hover:bg-accent-foreground text-primary my-2 `}>{recipes.length ? `Recipes Found - ${recipes.length}` : "Recipes will show here when ready, Click To Find Recipes...."}</Badge>
            {
                recipes.length
                    ? <ReusableModal title='Showing Randomly Chosen Recipes' triggerText='Click To View' changeWidth={true} handleTrigger={() => null}>
                        <span
                            ref={ref}
                            className='flex flex-col gap-y-4 xxs:h-[29rem] sm:h-[18rem] lg:h-[44rem]'
                        >
                            {existingFiltersMarkup}

                            <span className='grid xxs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-[45rem] justify-items-center place-items-center gap-6 overflow-y-scroll scroll-smooth no-scrollbar'>
                                {renderRecipes()}

                                {
                                    recipes.length
                                        ? <span className='w-96 min-h-[23.6rem] h-full rounded-sm bg-card text-muted-foreground flex justify-center items-center gap-x-4 text-xl'>Want To See More? <span className='py-2 text-lg text-secondary font-bold h-6 bg-primary hover:bg-special hover:text-muted cursor-pointer px-4 rounded-full flex items-center justify-center' onClick={processRefetch}>Click Here</span></span>
                                        : null
                                }
                            </span>
                        </span>
                    </ReusableModal>
                    : null
            }

            {/* {
                recipes.length && isTrue
                    ? <Badge className='bg-special hover:bg-special-foreground text-muted'>Want To See More? <Button className='my-0 py-0 text-sm h-4 bg-special-foreground hover:bg-special hover:text-muted' onClick={processRefetch}>Click Here</Button></Badge>
                    : null
            } */}
        </div>
    )
}

const FilterUsed = ({ ...item }: { title: string, val: string }) => {
    const { title, val } = item;

    return (
        <span className='flex gap-x-2'><span className='bg-card px-2'>{title}:</span><span className='font-semibold px-2 text-special-foreground'>{val || "N/A"}</span></span>
    )
}

const RenderRecipeItem = ({ data }: { data: RecipeMealType }) => {
    const { uri, label, calories, images, mealType, co2EmissionsClass } = data;
    const { LARGE, REGULAR, SMALL } = images;
    // const { height, url, width } = REGULAR
    // const { height: smHt, url: smUrl, width: smWd } = SMALL
    const locale = useLocale()
    return (
        <span className='flex flex-col gap-y-2 justify-center items-center xxs:w-96 md:w-80 lg:w-96 bg-card rounded-md'>
            <Link href={`/${locale}/recipe/${extractRecipeId(uri)}`} className='flex flex-col gap-y-2' title={label}>
                <span className='font-bold text-2xl text-primary text-center'>{label.length > 26 ? ellipsedText(label, 26) : label}</span>

                <img src={REGULAR?.url || SMALL?.url} height={REGULAR?.height || SMALL?.height} width={REGULAR?.width || SMALL?.width} alt={label} className='xxs:w-[23.6rem] md:w-[19.5rem] lg:w-[23.6rem] xxs:h-40 lg:h-64 rounded-sm duration-1000 transition-all hover:object-contain' placeholder='blur' loading='lazy' />

                {/* <Image
                    src={url} alt={label!} width={width} height={height}
                    className='w-56 h-48 rounded-sm'
                    blurDataURL={url} placeholder='blur' loading='lazy'
                /> */}
            </Link>

            <span className='flex flex-col gap-y-1.5'>
                <RenderReusableBadgeItem text={`${calories.toFixed(2)}`} title='Calories' />
                <RenderReusableBadgeItem title='Meal Type' text={mealType[0]} />
                <RenderReusableBadgeItem title='CO2 Emission Rating' text={co2EmissionsClass} />
            </span>
        </span>
    )
}

const RenderReusableBadgeItem = ({ title, text }: { title: string, text: string }) => {
    return (
        <span className='flex justify-between gap-x-10 text-muted-foreground w-full'>
            <span className='font-bold xxs:text-sm lg:text-xl'>{title}</span>
            <span className='xxs:text-sm lg:text-lg font-semibold text-special-foreground'>{text}</span>
        </span>
    )
}