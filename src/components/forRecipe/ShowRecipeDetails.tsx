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
import { useForTruthToggle } from '@/hooks/forComponents'
import { useToGetAnImageUrl, useToGetRandomImageUrlIfFails } from '@/hooks/forPexels'

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

    return recipeData?.label ? <RenderRecipe {...recipeData} /> : null
}

const RenderRecipe = ({ ...data }: RecipeMealType) => {
    const { cautions, co2EmissionsClass, dietLabels, digest, dishType, healthLabels, ingredients, label, mealType, source, tags, uri, url } = data;

    const t = useTranslations("default")

    const { handleTruthy, isTrue } = useForTruthToggle()

    return (
        <div className='flex flex-col xxs:gap-y-2 lg:gap-y-10 pt-10'>

            <section
                className='flex xxs:flex-col md:flex-row justify-between xxs:items-start md:items-baseline gap-x-20 mx-6 xxs:gap-y-4 sm:gap-y-11'
            >
                <div
                    className='relative xxs:w-full lg:w-[27.6%] rounded flex flex-col gap-y-6 items-center'
                    onClick={handleTruthy}
                >
                    <RecipeImage {...data} />

                    <div className={`${isTrue ? "xxs:relative xxs:top-0 md:top-0 right-0" : "relative"} flex flex-col justify-start gap-y-4 z-40 w-full xxs:h-[20rem] lg:max-h-[25.2rem] overflow-scroll scroll-smooth no-scrollbar`}>

                        <RenderRecipeVariousLabels dietLabels={dietLabels} digest={digest} healthLabels={healthLabels} cautions={cautions} tags={tags} co2={co2EmissionsClass} />

                        <Button variant={'destructive'} className='flex gap-2 xxs:text-sm sm:text-lg lg:text-xl'><span className='font-bold text-muted-foreground'>{t("Source")}:</span> <a href={url} target='_blank'>{source}</a></Button>
                    </div>
                </div>

                <section className='xxs:mb-4 md:mt-8 w-2/3'>
                    <h2 className='xxs:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-10'>Cooking Information</h2>
                    <RecipeIngredientsAndInstructions ingredients={ingredients} />
                </section>
            </section>

            <section className='xxs:my-4 lg:my-6'>
                <ShowFewRelatedRecipes diet={dietLabels[0]} dishType={dishType[0]} mealType={mealType[0].split("/")[0]} uri={uri} />
            </section>

            <section className='xxs:mb-4 lg:mb-6 flex flex-col xxs:gap-y-8 lg:gap-y-20'>
                <h2 className='xxs:text-2xl md:text-3xl lg:text-4xl font-bold text-center'>Some Related Information About This Recipe</h2>
                <div className='flex xxs:flex-col xxs:gap-y-11 xl:flex-row lg:gap-x-6 justify-around items-center px-10'>
                    <div className='xxs:w-full xl:w-2/4'>
                        <h2 className='xxs:text-2xl md:text-3xl xl:text-4xl mb-6 mt-2 font-bold text-center'><span>{t("Digest")}</span> <span>{t("Label")}</span></h2>
                        <div className='h-[27rem] overflow-y-scroll scroll-smooth no-scrollbar'>
                            <RenderDigestTable heading='Digest' labels={digest} />
                        </div>
                    </div>
                    <div className='xxs:w-full xl:w-2/4'>
                        <h2 className='xxs:text-2xl md:text-3xl xl:text-4xl font-bold mb-6 mt-2 text-center'>Popular Youtube Videos Found</h2>
                        <ShowYoutubeVids recipeStr={label} />
                    </div>
                </div>
            </section>

            <section className='xxs:my-4 lg:my-6'>
                <FewNonRelatedRecipes diet={dietLabels[0]} dishType={dishType[0]} mealType={mealType[0].split("/")[0]} />
            </section>
        </div>
    )
}

const CustomBadge = ({ val }: { val: string }) => {
    return (
        <Badge className='bg-quaternary text-muted hover:text-accent xs:text-sm lg:text-[1.01rem] m-1'>
            {val}
        </Badge>
    )
}

const RenderRecipeVariousLabels = ({ digest, healthLabels, dietLabels, cautions, tags, co2 }: { digest: DigestItemType[], healthLabels: string[], dietLabels: string[], cautions: string[], tags: string[], co2: string }) => {

    const renderAcordionItemsForHealthLabels = () => healthLabels.map(val => <CustomBadge key={val} val={val} />)

    const renderAcordionItemsForDietLabels = () => dietLabels.map(val => <CustomBadge key={val} val={val} />)

    const renderAccordionItemsForCautions = () => cautions.map(val => <CustomBadge key={val} val={val} />)

    const t = useTranslations("default")

    return (
        <Accordion type='single' collapsible={true}>
            <CustomAccordionItem content={healthLabels.length ? renderAcordionItemsForHealthLabels() : <span>Not found</span>} name='health' title={`${t("Health")} ${t("Label")}`} />

            <CustomAccordionItem content={dietLabels.length ? renderAcordionItemsForDietLabels() : <span>Not found</span>} name='diet' title={`${t("Diet")} ${t("Label")}`} />

            <CustomAccordionItem content={cautions.length ? renderAccordionItemsForCautions() : <span>Not found</span>} name='cautions' title={`${t("Cautions")} ${t("Label")}`} />
        </Accordion>
    )
}

const CustomAccordionItem = ({ name, title, content }: { name: string, title: string, content: React.JSX.Element | React.JSX.Element[] }) => {
    return (
        <AccordionItem value={name}>
            <AccordionTrigger className='font-bold xxs:text-sm sm:text-lg lg:text-xl text-secondary duration-1000 transition-all hover:text-secondary/80'>{title}</AccordionTrigger>
            <AccordionContent>
                {content}
            </AccordionContent>
        </AccordionItem>
    )
}

const RecipeIngredientsAndInstructions = ({ ingredients }: { ingredients: IngredientItemType[] }) => {
    const renderIngredientsAndMeasurements = () => ingredients.map(item => <RednerIngredients key={item.foodId + item.food} {...item} />)

    const renderInstructions = () => ingredients.map(item => {
        return (
            <li className='list-none' key={item.foodId + item.text}>{item.text}</li>
        )
    })

    const t = useTranslations("default")

    // const headingsMarkup = (
    //     <div 
    //         className='grid xxs:grid-cols-3 justify-items-center place-items-center font-normal xxs:text-[.62rem] sm:text-sm md:text-lg lg:text-xl'
    //     >
    //         {/* <div className='bg-card px-4 rounded-md xxs:hidden md:block lg:hidden 2xl:block'>Category</div> */}
    //         <div className='bg-card px-4 rounded-md'>Picture</div>
    //         <div className='bg-card px-4 rounded-md'>Name</div>
    //         <div className='bg-card px-4 rounded-md'>Quantity</div>
    //     </div>
    // )

    const ingredientsMarkup = (
        <div className='flex flex-col gap-y-6 xxs:w-full lg:w-[45%] pb-2 px-1.5'>
            <h2 className='font-medium text-left xxs:text-sm sm:text-lg md:text-2xl lg:text-3xl text-primary'><span>{t("Ingredients")}</span> <span>{t("And")}</span> <span>{t("Measurements")}</span></h2>

            {/* {headingsMarkup} */}

            <ol 
                className='flex flex-col gap-y-4 list-inside'>
                {renderIngredientsAndMeasurements()}
            </ol>
        </div>
    )

    const instructionsMarkup = (
        <div className='flex flex-col gap-y-6 xxs:w-full lg:w-1/2 pb-2 px-1.5'>
            <h2 className='font-medium text-left xxs:text-sm sm:text-lg lg:text-3xl text-primary'><span>{t("Ingredients")}</span> <span>{t("And")}</span> <span>{t("Instructions")}</span></h2>
            <div
                className='grid grid-cols-1 xxs:gap-6 lg:gap-4 capitalize xxs:text-xs xs:text-sm md:text-lg lg:text-xl'
            >{renderInstructions()}</div>
        </div>
    )

    return (
        <div className='flex lg:justify-between xxs:flex-col xxs:gap-y-6 lg:flex-row lg:gap-x-10 mx-6 w-full'>
            {ingredientsMarkup}
            {instructionsMarkup}
        </div>
    )
}

const RednerIngredients = ({ ...items }: IngredientItemType) => {
    const { food, foodCategory, foodId, image, measure, quantity, text, weight } = items

    const { imgSrc } = useToGetAnImageUrl(food)
    const { failSafeUrl, handleFailsafe } = useToGetRandomImageUrlIfFails(imgSrc)

    const contents = (
        <div className='grid xxs:grid-cols-3 justify-items-center place-items-center gap-x-10 w-full capitalize xxs:text-xs xs:text-sm md:text-lg lg:text-xl'>
            <div 
                className='text-left w-full flex gap-x-6 items-center col-span-2'
            >
            <img
                src={failSafeUrl}
                alt={food}
                width={60} height={39}
                className='xxs:w-14 xxs:h-16 sm:w-24 lg:w-16 lg:h-9 rounded-xl object-cover'
                placeholder='blur' loading='lazy'
                onError={handleFailsafe}
            />
                {food}
            </div>

            <h2 className='flex gap-x-1 text-left w-full'><span>{quantity.toFixed(2)}</span> <span>{measure}</span></h2>
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