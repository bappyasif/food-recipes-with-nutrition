import { RecipeMealType } from '@/types'
import React from 'react'
import { ReusableModal, extractRecipeId } from '../forFilters/RecipesView'
import { Badge } from '../ui/badge'
import Link from 'next/link'
import { ellipsedText } from '../forRecipe/FewNonRelatedRecipes'
import { useLocale } from 'next-intl'
import { Button } from '../ui/button'
import { useForTruthToggle } from '@/hooks/forComponents'

export const RandomizedRecipesView = ({ recipes, handleClick }: { recipes: RecipeMealType[], handleClick: () => void }) => {
    const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

    const processRefetch = () => {
        handleFalsy()
        handleClick()
    }

    const afterOneSecond = () => {
        const timer = setTimeout(() => handleTruthy(), 1000)

        return () => clearTimeout(timer)
    }

    const renderRecipes = () => recipes.map(item => <RenderRecipeItem key={item.uri} data={item} />)



    return (
        <div className='font-bold text-xl'>
            <Badge
                // onClick={recipes.length ? handleTruthy : () => null} 
                // onClick={handleTruthy} 
                className={`bg-accent hover:bg-accent-foreground text-primary my-2 `}>{recipes.length ? `Recipes Found - ${recipes.length}` : "Recipes will show here when ready, Click To Find Recipes...."}</Badge>
            {
                recipes.length
                    ? <ReusableModal title='Randomly Chosen Recipes Based On Chosen Filters' triggerText='Click To View' changeWidth={true} handleTrigger={afterOneSecond}>
                        <span className='grid xxs:grid-cols-1 md:grid-cols-3 h-[650px] justify-items-center place-items-center gap-4 overflow-y-scroll scroll-smooth no-scrollbar'>
                            {renderRecipes()}
                        </span>
                    </ReusableModal>
                    : null
            }

            {
                recipes.length && isTrue
                    ? <Badge className='bg-special hover:bg-special-foreground text-muted'>Want To See More? <Button className='my-0 py-0 text-sm h-4 bg-special-foreground hover:bg-special hover:text-muted' onClick={processRefetch}>Click Here</Button></Badge>
                    : null
            }
        </div>
    )
}

const RenderRecipeItem = ({ data }: { data: RecipeMealType }) => {
    const { uri, label, calories, images, mealType, co2EmissionsClass } = data;
    const { LARGE, REGULAR, SMALL } = images;
    const locale = useLocale()
    return (
        <span className='flex flex-col gap-y-2 justify-center items-center w-56'>
            <Link href={`/${locale}/recipe/${extractRecipeId(uri)}`} className='flex flex-col gap-y-2' title={label}>
                <span className='font-bold text-lg'>{label.length > 13 ? ellipsedText(label, 13) : label}</span>
                <img src={REGULAR.url} height={REGULAR.height} width={REGULAR.width} alt={label} className='w-56 h-48 rounded-sm' />
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
        <span className='flex justify-around gap-x-4 bg-muted text-muted-foreground'>
            <span>{title}</span>
            <span>{text}</span>
        </span>
    )
}