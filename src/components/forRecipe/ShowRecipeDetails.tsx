"use client"

import { DigestItemType, IngredientItemType, RecipeMealType } from '@/types'
import React, { useEffect } from 'react'
import { Badge } from '../ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { ShowFewRelatedRecipes } from './ShowFewRelatedRecipes'
import { RecipeImage } from './RecipeImage'
import { FewNonRelatedRecipes } from './FewNonRelatedRecipes'
import { Button } from '../ui/button'
import { ShowYoutubeVids } from './ShowYoutubeVids'
import { useTranslations } from "use-intl"
import { useAppDispatch, useAppSelector } from '@/hooks/forRedux'
import { addRecipeToList, updateRecipeCount } from '@/redux/features/recipes/RecipesSlice'
import Head from 'next/head'
import { useForTruthToggle } from '@/hooks/forComponents'

export const ShowRecipeDetails = ({ recipeData, params }: { recipeData: RecipeMealType, params: { "slug-id": string } }) => {
    const appDispatch = useAppDispatch()

    const trackedRecipes = useAppSelector(state => state.recipes.list)

    // using SSR fetched data
    const checkIfRecipeUriAlreadyExists = () => {
        const foundIdx = trackedRecipes.findIndex(item => item.uri.includes(params["slug-id"]))

        return foundIdx
    }

    const addOrUpdateDataIntoStore = () => {
        const recipeExists = checkIfRecipeUriAlreadyExists();

        recipeExists === -1 && recipeData?.uri && appDispatch(addRecipeToList(recipeData))

        recipeExists !== -1 && recipeData?.uri && appDispatch(updateRecipeCount({ recipeUri: recipeData?.uri, images: recipeData.images?.REGULAR || recipeData.images.SMALL }))
    }

    useEffect(() => {
        trackedRecipes.length && recipeData?.uri && addOrUpdateDataIntoStore()
    }, [recipeData, trackedRecipes.length])

    // console.log(trackedRecipes, "trackedRecipes!!")

    return recipeData?.label ? <RenderRecipe {...recipeData} /> : null
}

const RenderRecipe = ({ ...data }: RecipeMealType) => {
    const { calories, cautions, co2EmissionsClass, cuisineType, dietLabels, digest, dishType, healthLabels, images, ingredients, label, mealType, shareAs, source, tags, totalWeight, uri, url, yield: servings, count } = data;

    const t = useTranslations("default")

    const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

    return (
        <div className='flex flex-col xxs:gap-y-2 lg:gap-y-20 py-20'>

            <section className='flex xxs:flex-col md:flex-row justify-between xxs:items-start md:items-baseline gap-x-6 mx-6 gap-y-11'>

                <RecipeImage {...data} />

                <div
                    className='relative xxs:w-full md:w-2/3 lg:w-1/2 rounded flex flex-col gap-y-6 items-center'
                    onClick={handleTruthy}
                >
                    <h2 className='xxs:text-2xl md:text-3xl lg:text-4xl font-bold'>Additional Information</h2>
                    <div className={`${isTrue ? "xxs:relative md:absolute xxs:top-0 md:top-16 right-0" : "relative"} flex flex-col justify-start gap-y-4 z-40 bg-accent w-full h-[24rem] overflow-scroll scroll-smooth no-scrollbar`}>

                        {/* <RecipeIngredientsAndInstructions ingredients={ingredients} /> */}

                        <RenderRecipeVariousLabels dietLabels={dietLabels} digest={digest} healthLabels={healthLabels} />

                        <Button variant={'destructive'} className='flex gap-2 xxs:text-sm sm:text-lg lg:text-xl text-primary'><span className='font-bold text-muted-foreground'>{t("Source")}:</span> <a href={url} target='_blank'>{source}</a></Button>
                    </div>
                </div>
            </section>

            <section className='mb-11'>
                <h2 className='xxs:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-10'>Cooking Information</h2>
                <RecipeIngredientsAndInstructions ingredients={ingredients} />
            </section>

            <section className='my-11'>
                <ShowFewRelatedRecipes diet={dietLabels[0]} dishType={dishType[0]} mealType={mealType[0].split("/")[0]} uri={uri} />
            </section>

            <section className='flex xxs:flex-col xxs:gap-y-11 lg:flex-row justify-around items-center'>
                <div className='xxs:w-full lg:w-2/4'>
                    <h2 className='text-xl mb-6 mt-2 font-bold'><span>{t("Digest")}</span> <span>{t("Label")}</span></h2>
                    <div className='h-80 overflow-y-scroll scroll-smooth no-scrollbar'>
                        <RenderDigestTable heading='Digest' labels={digest} />
                    </div>
                </div>
                <ShowYoutubeVids recipeStr={label} />
            </section>

            <section className='my-11'>
                <FewNonRelatedRecipes diet={dietLabels[0]} dishType={dishType[0]} mealType={mealType[0].split("/")[0]} />
            </section>
        </div>
    )
}

const RenderRecipeVariousLabels = ({ digest, healthLabels, dietLabels }: { digest: DigestItemType[], healthLabels: string[], dietLabels: string[] }) => {
    const renderAcordionItemsForHealthLabels = () => healthLabels.map(val => {
        return (
            <Badge key={val} className='bg-muted-foreground text-muted xs:text-sm lg:text-[1.01rem] m-1'>
                {val}
            </Badge>
        )
    })

    const renderAcordionItemsForDietLabels = () => dietLabels.map(val => {
        return (
            <Badge key={val} className='bg-muted-foreground text-muted xs:text-sm lg:text-[1.01rem] m-1'>
                {val}
            </Badge>
        )
    })

    const t = useTranslations("default")

    return (
        <Accordion type='single' collapsible={true}>
            <AccordionItem value={"health"}>
                <AccordionTrigger className='font-bold xxs:text-sm sm:text-lg lg:text-xl text-special-foreground'>{t("Health")} {t("Label")}</AccordionTrigger>
                <AccordionContent>
                    {renderAcordionItemsForHealthLabels()}
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value={"diet"}>
                <AccordionTrigger className='font-bold xxs:text-sm sm:text-lg lg:text-xl text-special-foreground'>{t("Diet")} {t("Label")}</AccordionTrigger>
                <AccordionContent>
                    {renderAcordionItemsForDietLabels()}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

const RecipeIngredientsAndInstructions = ({ ingredients }: { ingredients: IngredientItemType[] }) => {
    const renderIngredientsAndMeasurements = () => ingredients.map(item => <RednerIngredients key={item.foodId} {...item} />)

    const renderInstructions = () => ingredients.map(item => {
        return (
            <h3 key={item.foodId}>{item.text}</h3>
        )
    })

    const t = useTranslations("default")

    const headingsMarkup = (
        <div className='grid grid-cols-5 justify-items-center place-items-center font-bold xxs:text-[.62rem] sm:text-sm lg:text-xl'>
            <div className='bg-card px-4 rounded-md'>Picture</div>
            <div className='bg-card px-4 rounded-md'>Name</div>
            <div className='bg-card px-4 rounded-md'>Category</div>
            <div className='bg-card px-4 rounded-md'>Quantity</div>
            <div className='bg-card px-4 rounded-md'>Weight</div>
        </div>
    )

    const ingredientsMarkup = (
        <div className='flex flex-col gap-y-6 w-4/5'>
            <h2 className='font-bold xxs:text-sm sm:text-lg lg:text-3xl text-special-foreground pl-10'><span>{t("Ingredients")}</span> <span>{t("And")}</span> <span>{t("Measurements")}</span></h2>

            {headingsMarkup}

            <div className='flex flex-col gap-y-2 justify-center items-center'>
                {renderIngredientsAndMeasurements()}
            </div>
        </div>
    )

    const instructionsMarkup = (
        <div className='flex flex-col gap-y-6 w-3/6'>
            <h2 className='font-bold xxs:text-sm sm:text-lg lg:text-3xl text-special-foreground'><span>{t("Ingredients")}</span> <span>{t("And")}</span> <span>{t("Instructions")}</span></h2>
            <div 
            // className='grid grid-flow-col grid-rows-2 gap-4 xs:text-sm lg:text-lg'
            className='grid grid-cols-2 gap-10 xs:text-sm lg:text-xl font-semibold'
            >{renderInstructions()}</div>
        </div>
    )

    return (
        <div className='flex gap-x-4'>
            {ingredientsMarkup}
            <p className='h-80 w-1 bg-card self-center mr-20'></p>
            {instructionsMarkup}
        </div>
    )
}

const RednerIngredients = ({ ...items }: IngredientItemType) => {
    const { food, foodCategory, foodId, image, measure, quantity, text, weight } = items

    const contents = (
        <div className='grid grid-cols-5 justify-items-center place-items-center w-full capitalize xs:text-sm lg:text-xl'>

            <img
                src={image} alt={food}
                width={60} height={39}
                className='w-36 h-20 rounded-xl object-cover'
                placeholder='blur' loading='lazy'
            />

            <div className='font-semibold'>{food}</div>

            <div className=''>{foodCategory}</div>

            <h2 className='flex gap-x-1 font-semibold'><span>{quantity.toFixed(2)}</span> <span>{measure}</span></h2>

            <h2>
                {weight.toFixed(2)}
            </h2>
        </div>
    )

    return contents
}

const RenderDigestTable = ({ labels, heading }: { labels: DigestItemType[], heading: string }) => {
    const renderTableRows = () => labels.map(item => {
        const { daily, hasRDI, label, schemaOrgTag, tag, total, unit } = item;

        return (
            <tr className='' key={tag}>
                <td>{tag}</td>
                <td>{daily.toFixed(2)}</td>
                <td>{schemaOrgTag}</td>
                <td>{label}</td>
                <td>{hasRDI ? "True" : "False"}</td>

                <td>{total.toFixed(2)}</td>
                <td>{unit}</td>
            </tr>
        )
    })

    return (<table className="relative w-full border border-ring">
        <thead>
            <tr className='text-lg bg-card sticky'>
                <th className="top-0 px-6 py-3 bg-card sticky">Tag</th>
                <th className="top-0 px-6 py-3 bg-card sticky">Daily</th>
                <th className="top-0 px-6 py-3 bg-card sticky">SchemaOrgTag</th>
                <th className="top-0 px-6 py-3 bg-card sticky">Label</th>
                <th className="top-0 px-6 py-3 bg-card sticky">HasRDI</th>
                <th className="top-0 px-6 py-3 bg-card sticky">Total</th>
                <th className="top-0 px-6 py-3 bg-card sticky">Unit</th>
            </tr>
        </thead>
        <tbody className="divide-y bg-accent text-center text-xs font-semibold">
            {renderTableRows()}
        </tbody>
    </table>
    )
}