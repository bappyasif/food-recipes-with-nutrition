"use client"

import { DigestItemType, IngredientItemType, RecipeMealType } from '@/types'
import React from 'react'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Badge } from '../ui/badge'
import Link from 'next/link'
import styles from "./Filters.module.css"
import { ellipsedText } from '../forRecipe/FewNonRelatedRecipes'
import { useLocale } from 'next-intl'
import axios from 'axios'
import { useForIfRecipesFoundWithExistingFilters } from '@/hooks/forComponents'
import Image from 'next/image'

export const RecipesView = ({ recipes, nextHref, handleRecipesFound, handlePreviousAndNext, check }: { recipes: RecipeMealType[], nextHref?: string, handleRecipesFound: (d: RecipeMealType[], href?: string) => void, handlePreviousAndNext: (str: string) => void, check?: boolean }) => {

    const renderRecipes = () => recipes.map(item => <RenderRecipe key={item.label} {...item} />)

    const fetchMore = () => {
        // console.log(nextHref)
        if (nextHref) {
            axios
                .get(nextHref)
                .then(resp => {
                    // console.log(resp.data, "lets see!!")
                    const onlyRecipes = resp.data?.hits.map((item: any) => item.recipe)

                    const readyForRendering = onlyRecipes.map((item: any) => item.mealType?.length && item.dishType?.length && item.dietLabels?.length && item).filter((item: any) => item).filter((v: any, idx: number, self: any) => idx === self.findIndex((t: any) => t.label === v.label))

                    readyForRendering?.length && handleRecipesFound(readyForRendering, resp.data?._links?.next?.href)

                    handlePreviousAndNext("next")

                }).catch(err => console.log(err, "error!!"))
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

    if (recipes.length === 0) {
        return (
            <h2 className='font-bold text-xl text-special-foreground'>Try Using Filters To Find Recipes</h2>
        )
    }

    return (
        <div>
            {/* <h1>Recipes View</h1> */}
            <div className='grid xxs:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 xxs:gap-11 lg:gap-11 place-content-center place-items-center'>
                {renderRecipes()}
            </div>
            {/* <Button className={`${nextHref ? "block" : "hidden"}`} variant={'outline'} onClick={fetchMore} disabled={!nextHref}>Prev</Button> */}
            <div className='flex gap-x-4 w-full justify-center my-2'>
                <Button className={`${nextHref ? "block" : "hidden"} bg-card font-bold text-xl text-muted-foreground hover:text-muted`} variant={'default'} onClick={() => handlePreviousAndNext("prev")} disabled={!nextHref}>Prev</Button>

                <Button
                    className={`${nextHref ? "block" : "hidden"} bg-card font-bold text-xl text-muted-foreground hover:text-muted`}
                    variant={'default'}
                    // onClick={() => check === -1 ? fetchMore() : handlePreviousAndNext("next")} 
                    onClick={() => !check ? fetchMore() : handlePreviousAndNext("next")}
                    // onClick={fetchMore}
                    disabled={!nextHref}
                >Next</Button>

                {/* <Button className={`${nextHref ? "block" : "hidden"}`} variant={'outline'} onClick={fetchMore} disabled={!nextHref}>Show More New Data</Button> */}
            </div>
        </div>
    )
}

const RenderRecipe = ({ ...items }: RecipeMealType) => {
    const { calories, co2EmissionsClass, cuisineType, dietLabels, digest, dishType, healthLabels, images, ingredients, label, mealType, source, tags, totalWeight, url, yield: servings, uri } = items

    const locale = useLocale()

    return (
        <div
            className={`flex flex-col justify-center items-center ${styles.flipCard} h-[18.6rem] xxs:w-[18.9rem] sm:w-[20.9rem]`}
        >
            {/* <p
                className={`${styles.flipCardBack} h-full w-full rounded-sm`}
                style={{
                    backgroundImage: `url(${images.SMALL.url})`,
                    backgroundSize: "100% 100%",
                    objectFit: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundColor: "rgba(17,17,17,0.6)",
                    backgroundBlendMode: "darken",
                }}
            >

            </p> */}

            <Image
                alt={label}
                src={images.SMALL.url}
                className={`${styles.flipCardBack} h-full w-full rounded-sm`}
                width={images.SMALL.width}
                height={images.SMALL.height}
                style={{
                    // backgroundImage: `url(${images.SMALL.url})`,
                    backgroundSize: "100% 100%",
                    objectFit: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundColor: "rgba(17,17,17,0.6)",
                    backgroundBlendMode: "darken",
                }}
            />

            <div className={`${styles.whenNotFlipped}`}>
                <Link href={`/${locale}/recipe/${extractRecipeId(uri)}`} className='flex items-center justify-center flex-col gap-y-2'>
                    <h2 className='font-bold text-lg'>{label.length > 11 ? ellipsedText(label, 11) : label}</h2>
                    {/* <img className='w-64' src={images.SMALL.url} alt={label} width={images.SMALL.width} height={images.SMALL.height} /> */}
                    <Image src={images.SMALL.url} alt={label} width={images.SMALL.width} height={images.SMALL.height} className='w-64' blurDataURL={images.SMALL.url} placeholder='blur' loading='lazy' />
                </Link>
                <div className='flex justify-start gap-2'>
                    <RenderBadge text={dishType[0]} />
                    <RenderBadge text={cuisineType[0]} />
                    <RenderBadge text={mealType[0]} />
                </div>
            </div>

            <div
                className={`${styles.whenFlipped} px-1.5 items-center justify-center `}
            >
                <Link className='bg-card opacity-70 w-full text-center rounded-t-md' href={`/${locale}/recipe/${extractRecipeId(uri)}`}>
                    <h2 className='text-center font-bold xxs:text-lg lg:text-xl text-primary' title={label}>{label.length > 18 ? ellipsedText(label, 18) : label}</h2>
                </Link>

                <div className='flex justify-center gap-2 my-1'>
                    <RenderBadge text={dishType[0]} />
                    <RenderBadge text={cuisineType[0]} />
                    <RenderBadge text={mealType[0]} />
                </div>

                <div className='grid grid-cols-2 gap-y-2 bg-card py-0.5 opacity-70 my-1'>
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
                    <Button variant={"default"} title={url} className='w-full bg-special-foreground hover:bg-special hover:text-secondary'><a target='_blank' href={url}>Recipe Source Site</a></Button>
                </div>
            </div>
        </div>
    )
}

const RenderBadge = ({ text }: { text: string }) => {
    return (
        <Badge className='bg-muted-foreground text-muted hover:text-muted-foreground capitalize' variant={"secondary"} title={text}>{text.length > 9 ? ellipsedText(text, 9) : text}</Badge>
    )
}

const RenderBasicTextInfo = ({ text, val }: { text: string, val: string | number }) => {
    return (
        <h3 className={`flex justify-between px-2 gap-2 xxs:text-xs lg:text-sm text-muted-foreground ${text === "Source" ? "bg-card py-0.5 opacity-70 rounded-b-md" : ""} capitalize`}><span className='font-semibold'>{text}</span>{val}</h3>
    )
}

export const ReusableModal = ({ children, triggerText, title, changeWidth, handleTrigger }: { children: any, triggerText: string, title: string, changeWidth?: boolean, handleTrigger?: () => void }) => {
    return (
        <Dialog>
            <DialogTrigger onClick={() => handleTrigger && handleTrigger()}><Badge variant={'secondary'} className='w-full text-secondary bg-muted-foreground transition-colors duration-1000 hover:bg-primary'>{triggerText}</Badge></DialogTrigger>
            <DialogContent
                className='bg-accent border-ring'
                style={{ minWidth: changeWidth ? "80%" : "auto" }}
            >
                <DialogHeader>
                    <DialogTitle className='text-primary'>{title}</DialogTitle>
                </DialogHeader>

                <DialogDescription>
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

    const renderInstructions = () => ingredients.map(item => {
        return (
            <span key={item.foodId + item.weight}>{item.text}</span>
        )
    })

    return (
        <ReusableModal triggerText={"Recipe Ingredients"} title={"Ingredients And Measurements"}>
            <span className='textarea-primary flex flex-col gap-y-4 h-[33rem]'>
                <span className='grid grid-cols-4 place-content-center place-items-center font-bold text-lg'>
                    <span>Name</span>
                    <span>Picture</span>
                    <span>Quantity</span>
                    <span>Weight</span>
                </span>
                <span className='flex flex-col gap-y-2 h-96 overflow-y-scroll no-scrollbar'>
                    {renderIngredientsAndMeasurements()}
                </span>
                <span className='font-bold text-lg text-primary'>Instructions</span>
                <span className='flex flex-col gap-y-2 h-40 overflow-y-scroll no-scrollbar'>{renderInstructions()}</span>
            </span>
        </ReusableModal>
    )
}

export const RenderIngredientAndMeasurement = ({ ...items }: IngredientItemType) => {
    const { food, foodCategory, measure, quantity, weight, image } = items;
    return (
        <span
            className='grid grid-cols-4 gap-4 place-content-center place-items-center'
        >
            <span className='capitalize font-bold xxs:text-xs lg:text-sm'>{food}</span>
            <span className='flex flex-col justify-center items-center'>
                <span className='text-[11px] capitalize font-semibold'>{foodCategory}</span>
                <img className='w-36 h-28 rounded-xl' src={image} alt={food} width={60} height={39} />
            </span>
            <span className='font-semibold capitalize text-center'>{quantity.toFixed(2)} {measure}</span>
            <span className='font-semibold text-center'>{weight.toFixed(2)}</span>
        </span>
    )
}

const RenderRecipeDigestInfo = ({ digestLabels }: { digestLabels: DigestItemType[] }) => {
    const renderItems = () => digestLabels.map(item => {
        const { label, unit, total, tag, hasRDI } = item
        return (
            <Button key={label} variant={'ghost'} className='flex justify-between items-center text-left gap-x-2 mr-2 text-sm font-semibold cursor-auto'>
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
            <span className='grid grid-cols-4 gap-2 px-4 text-sm'>
                {renderLabels()}
            </span>
        </ReusableModal>
    )
}

const RenderHealthLabels = ({ labels }: { labels: string[] }) => {
    const { renderLabels } = useForIngredientsLabels(labels)
    return (
        <ReusableModal triggerText={"Health Labels"} title={"Recipe Meal Health Labels"}>
            <span className='grid grid-cols-4 gap-2 px-4 text-sm'>
                {renderLabels()}
            </span>
        </ReusableModal>
    )
}

const useForIngredientsLabels = (labels: string[]) => {
    const renderLabels = () => labels.map(txt => <Button key={txt} variant={'ghost'} className='text-muted-foreground cursor-auto'>{txt}</Button>)
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