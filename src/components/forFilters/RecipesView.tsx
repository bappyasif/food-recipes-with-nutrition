"use client"

import { DigestItemType, IngredientItemType, RecipeMealType } from '@/types'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Badge } from '../ui/badge'
import Link from 'next/link'
import styles from "./Filters.module.css"
import { ellipsedText } from '../forRecipe/FewNonRelatedRecipes'
import { useLocale } from 'next-intl'
import axios from 'axios'
import { useForIfRecipesFoundWithExistingFilters, useForTruthToggle } from '@/hooks/forComponents'
import { TbLoader2 } from 'react-icons/tb'

export const RecipesView = ({ recipes, nextHref, handleRecipesFound, handlePreviousAndNext, check, isFirstPage }: { recipes: RecipeMealType[], nextHref?: string, handleRecipesFound: (d: RecipeMealType[], href?: string) => void, handlePreviousAndNext: (str: string) => void, check?: boolean, isFirstPage: boolean }) => {

    const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

    const renderRecipes = () => recipes.map(item => <RenderRecipe key={item.label} {...item} />)

    const fetchMore = () => {
        handleTruthy();

        if (nextHref) {
            axios
                .get(nextHref)
                .then(resp => {
                    const onlyRecipes = resp.data?.hits.map((item: any) => item.recipe)

                    const readyForRendering = onlyRecipes.map((item: any) => item.mealType?.length && item.dishType?.length && item.dietLabels?.length && item).filter((item: any) => item).filter((v: any, idx: number, self: any) => idx === self.findIndex((t: any) => t.label === v.label))

                    readyForRendering?.length && handleRecipesFound(readyForRendering, resp.data?._links?.next?.href)
                }).catch(err => console.log(err, "error!!"))
                .finally(() => handleFalsy())
        }
    }

    const { isTimed, filtersExist } = useForIfRecipesFoundWithExistingFilters()

    if (isTimed && recipes.length === 0 && filtersExist) {
        return (
            <h2 className='font-bold text-xl text-special-foreground'>Recipes Not Found!! Try using more Filters and search again, thank you :)</h2>
        )
    }

    if (!isTimed && recipes.length === 0 && filtersExist) {
        return (
            <h2 className='font-bold text-xl text-special-foreground'>Loading....</h2>
        )
    }

    return (
        <div className='py-10'>
            <div className='grid xxs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 xxs:gap-11 lg:gap-11 place-content-center place-items-center xxs:px-4 lg:px-10'>
                {recipes.length ? renderRecipes() : null}
            </div>

            <div className='flex gap-x-4 w-full justify-center mt-20'>
                <Button className={`${nextHref ? "block" : "hidden"} bg-secondary hover:bg-primary font-bold text-xl text-accent`} variant={'default'} onClick={() => handlePreviousAndNext("prev")} disabled={!nextHref || isFirstPage}>Prev</Button>

                <Button
                    className={`${nextHref ? "block" : "hidden"} bg-secondary hover:bg-primary font-bold text-xl text-accent`}
                    variant={'default'}
                    onClick={() => !check ? fetchMore() : handlePreviousAndNext("next")}
                    disabled={!nextHref || isTrue}
                >Next</Button>
            </div>
        </div>
    )
}

export const removeWrodRecipe = (text: string) => text.replace(/recipe[a-zA-Z]*/gi, "")

const RenderRecipe = ({ ...items }: RecipeMealType) => {
    const { calories, co2EmissionsClass, cuisineType, dietLabels, digest, dishType, healthLabels, images, ingredients, label, mealType, source, tags, totalWeight, url, yield: servings, uri } = items

    const locale = useLocale()

    const { handleFalsy: falsy, handleTruthy: truthy, isTrue: isLoading } = useForTruthToggle()

    return (
        <div
            className={`flex flex-col justify-center items-center ${styles.flipCard} h-[20.6rem] xxs:w-[18.9rem] sm:w-[20.9rem] relative`}
        >
            <TbLoader2 size={110} className={`${isLoading ? "absolute animate-spin self-center top-24 z-10" : "hidden"}`} />

            <img
                alt={label}
                src={images?.SMALL?.url || images?.REGULAR?.url}
                className={`${styles.flipCardBack} h-[20.6rem] xxs:w-[19.5rem] sm:w-[19.44rem] rounded-sm`}
                width={images?.SMALL?.width || images?.REGULAR?.width}
                height={images?.SMALL?.height || images?.REGULAR?.height}
                style={{
                    backgroundSize: "100% 100%",
                    objectFit: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundColor: "rgba(17,17,17,0.6)",
                    backgroundBlendMode: "darken",
                }}
                loading='lazy'
            />

            {/* before card is flipped */}
            <div className={`${styles.whenNotFlipped}`}>
                <Link href={`/${locale}/recipe/${extractRecipeId(uri)}`} className='flex items-center justify-center flex-col gap-y-2'>
                    
                    <h2 className='font-bold text-lg text-primary'>{removeWrodRecipe(label).length > 25 ? ellipsedText(removeWrodRecipe(label), 25) : removeWrodRecipe(label)}</h2>
                    
                    <img
                        src={images?.SMALL?.url || images?.REGULAR?.url}
                        alt={label}
                        width={images?.SMALL?.width || images?.REGULAR?.width}
                        height={images?.SMALL?.height || images?.REGULAR?.height}
                        className='w-64 rounded-lg'
                        loading='lazy'
                    />
                </Link>
                <div className='flex justify-start gap-2'>
                    <RenderBadge text={dishType[0]} />
                    <RenderBadge text={cuisineType[0]} />
                    <RenderBadge text={mealType[0]} />
                </div>
            </div>

            {/* after card is flipped */}
            <div
                className={`${styles.whenFlipped} px-1.5 items-center justify-center h-[18.18rem] xxs:w-[19.3rem] sm:w-[18.4rem]`}
            >
                <Link
                    className='bg-background/60 hover:bg-background/90 opacity-80 w-full text-center rounded-t-md'
                    href={`/${locale}/recipe/${extractRecipeId(uri)}`}
                    onClick={isLoading ? falsy : truthy}
                >
                    <h2 className='text-center font-bold xxs:text-lg lg:text-xl text-content/90 hover:text-content/60' title={label}>{removeWrodRecipe(label).length > 22 ? ellipsedText(removeWrodRecipe(label), 22) : removeWrodRecipe(label)}</h2>
                </Link>

                <div className='flex justify-center gap-2 my-1'>
                    <RenderBadge text={dishType[0]} />
                    <RenderBadge text={cuisineType[0]} />
                    <RenderBadge text={mealType[0]} />
                </div>

                <div className='grid grid-cols-2 gap-y-2 bg-accent py-0.5 opacity-80 my-1'>
                    <RenderBasicTextInfo text="Calories" val={calories.toFixed(2)} />
                    <RenderBasicTextInfo text="carbon footprint" val={co2EmissionsClass} />
                    <RenderBasicTextInfo text="servings" val={servings} />
                    <RenderBasicTextInfo text="weight" val={totalWeight.toFixed(2)} />
                </div>

                <div className='grid grid-cols-2 gap-2 my-1'>
                    <RenderRecipeIngredients ingredients={ingredients} />
                    <RenderHealthLabels labels={healthLabels} />
                    <RenderDietLabels labels={dietLabels} />
                    <RenderRecipeDigestInfo digestLabels={digest} />
                </div>

                <div className='w-full my-1'>
                    <RenderBasicTextInfo text='Source' val={source} />
                    <Button variant={"destructive"} title={url} className='w-full duration-1000 transition-all'><a target='_blank' href={url}>Recipe Source Site</a></Button>
                </div>
            </div>
        </div>
    )
}

const RenderBadge = ({ text }: { text: string }) => {
    return (
        <Badge className='bg-background/80 text-secondary hover:text-content-light/80 capitalize' variant={"secondary"} title={text}>{text.length > 10 ? ellipsedText(text, 8) : text}</Badge>
    )
}

const RenderBasicTextInfo = ({ text, val }: { text: string, val: string | number }) => {
    return (
        <h3 className={`flex justify-between px-2 gap-2 xxs:text-xs lg:text-sm bg-accent text-secondary ${text === "Source" ? "py-0.5 opacity-80 rounded-b-md" : ""} capitalize`}><span className='font-semibold'>{text}</span><span className='text-content/80 font-semibold'>{val}</span></h3>
    )
}

export const ReusableModal = ({ children, triggerText, title, changeWidth, handleTrigger }: { children: React.ReactNode, triggerText: string, title: string, changeWidth?: boolean, handleTrigger?: () => void }) => {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        changeWidth ? setOpen(true) : null
    }, [])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger onClick={() => handleTrigger && handleTrigger()}><Badge variant={'secondary'} className='w-full text-secondary bg-background/80 transition-colors duration-1000 hover:bg-primary hover:text-content-light/80'>{triggerText}</Badge></DialogTrigger>
            <DialogContent
                // className='bg-background/80 border-ring landscape:h-[90%] max-w-full'
                // className='bg-background/80 border-ring max-w-full'
                className='bg-background/80 border-ring'
                style={{ 
                    minWidth: changeWidth ? "94%" : "auto", 
                    // minHeight: changeWidth ? "96%" : "auto" 
                }}
            >
                {
                    title
                    && (
                        <DialogHeader>
                            <DialogTitle
                                className='text-secondary text-center'
                            >{title}</DialogTitle>
                        </DialogHeader>
                    )
                }
                <DialogDescription 
                    // style={{
                    //     minHeight: changeWidth ? "96%" : "auto"
                    // }}
                >
                    {children}
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}

type IngredientsTypes = Pick<RecipeMealType, "ingredients">

const RenderRecipeIngredients = ({ ...items }: IngredientsTypes) => {
    const { ingredients } = items

    const renderIngredientsAndMeasurements = () => ingredients.map(item => <RenderIngredientAndMeasurement key={item.foodId} {...item} />)

    const renderInstructions = () => ingredients.map((item, idx) => {
        return (
            <span key={item.foodId + item.weight + idx} className='font-semibold text-content/60'>{item.text}</span>
        )
    })

    return (
        <ReusableModal
            triggerText={"Recipe Ingredients"}
            title={""}
        >
            <span
                className='flex flex-col gap-y-4 xxs:h-[29rem] sm:h-[18rem] lg:h-[44rem] text-secondary'
            >
                <span className='font-bold text-lg text-secondary'>Ingredients And Measurements</span>

                <span className='grid grid-cols-4 place-content-center place-items-center xxs:gap-2 lg:gap-4 font-normal text-lg xxs:text-sm md:text-lg lg:text-xl text-content'>
                    <span className='bg-card/20 xxs:px-2 lg:px-4'>Category</span>
                    <span className='bg-card/20 xxs:px-2 lg:px-4'>Picture</span>
                    <span className='bg-card/20 xxs:px-2 lg:px-4'>Name</span>
                    <span className='bg-card/20 xxs:px-2 lg:px-4'>Quantity</span>
                </span>
                <span className='flex flex-col gap-y-2 xxs:h-56 lg:h-[40rem] overflow-y-scroll no-scrollbar'>
                    {renderIngredientsAndMeasurements()}
                </span>
                <span className='font-bold text-lg text-secondary'>Instructions</span>
                <span className='flex flex-col gap-y-2 xxs:h-40 lg:h-96 overflow-y-scroll no-scrollbar'>{renderInstructions()}</span>
            </span>
        </ReusableModal>
    )
}

export const RenderIngredientAndMeasurement = ({ ...items }: IngredientItemType) => {
    const { food, foodCategory, measure, quantity, weight, image } = items;
    return (
        <span
            className='grid grid-cols-4 gap-4 place-content-center place-items-center xxs:text-xs lg:text-sm text-content/80'
        >
            <span className='capitalize font-normal text-center'>{foodCategory}</span>
            <img
                className='xxs:w-24 xxs:h-11 lg:w-20 lg:h-12 rounded-xl object-cover'
                src={image} alt={food} width={60} height={39} placeholder='blur' loading='lazy' />
            <span className='capitalize font-normal text-center'>{food}</span>
            <span className='font-normal capitalize text-center'>{quantity.toFixed(2)} {measure}</span>
        </span>
    )
}

const RenderRecipeDigestInfo = ({ digestLabels }: { digestLabels: DigestItemType[] }) => {
    const renderItems = () => digestLabels.map(item => {
        const { label, unit, total, tag, hasRDI } = item
        return (
            <Button key={label} variant={'ghost'} className='flex justify-between items-center text-left gap-x-2 mr-2 text-sm font-semibold cursor-auto text-content/80 hover:text-content-light/90 hover:bg-secondary'>
                <span className='w-2/3'>{label}</span>
                <span className='w-1/4 flex gap-x-2 text-xs'><span>hasRDI</span> (<span>{hasRDI ? "true" : "false"}</span>)</span>
                <span className='w-1/2 text-xs'>Total ({total.toFixed(2)} {unit})</span>
            </Button>
        )
    })

    return (
        <ReusableModal triggerText={"Digest Info"} title={"Digest Info Details"}>
            <span className='flex flex-col gap-2 h-[28.1rem] overflow-y-scroll no-scrollbar'>
                {renderItems()}
            </span>
        </ReusableModal>
    )
}

const RenderDietLabels = ({ labels }: { labels: string[] }) => {
    const { renderLabels } = useForIngredientsLabels(labels)
    return (
        <ReusableModal triggerText={"Diet Labels"} title={"Recipe Diet Labels"}>
            <span className='grid grid-cols-3 gap-2 px-4 text-sm'>
                {renderLabels()}
            </span>
        </ReusableModal>
    )
}

const RenderHealthLabels = ({ labels }: { labels: string[] }) => {
    const { renderLabels } = useForIngredientsLabels(labels)
    return (
        <ReusableModal triggerText={"Health Labels"} title={"Recipe Meal Health Labels"}>
            <span 
                className='grid grid-cols-3 gap-2 px-4 text-sm'
            >
                {renderLabels()}
            </span>
        </ReusableModal>
    )
}

const useForIngredientsLabels = (labels: string[]) => {
    const renderLabels = () => labels.map(txt => <Button key={txt} variant={'ghost'} className='text-content/80 hover:text-content-light/90 hover:bg-secondary cursor-auto min-w-64 w-fit text-left'>{txt}</Button>)
    return { renderLabels }
}

export const extractRecipeId = (uri: string) => {
    let id = null
    if (uri) {
        const tokenize = uri.split("#")
        const tokenizeNext = tokenize[1].split("e_")
        id = tokenizeNext[1]
    }

    return id
}