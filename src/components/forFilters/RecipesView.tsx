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

export const RecipesView = ({ recipes }: { recipes: RecipeMealType[] }) => {
    const renderRecipes = () => recipes.map(item => <RenderRecipe key={item.label} {...item} />)
    return (
        <div>
            <h1>Recipes View</h1>
            <div className='grid xxs:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 xxs:gap-11 lg:gap-11 place-content-center place-items-center'>
                {renderRecipes()}
            </div>
        </div>
    )
}

const RenderRecipe = ({ ...items }: RecipeMealType) => {
    const { calories, co2EmissionsClass, cuisineType, dietLabels, digest, dishType, healthLabels, images, ingredients, label, mealType, source, tags, totalWeight, url, yield: servings, uri } = items

    const locale = useLocale()

    return (
        <div 
            className={`flex flex-col justify-center items-center ${styles.flipCard} h-[18.6rem] xxs:w-[18.9rem] sm:w-[20rem]`}
            >
            <p 
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

            </p>

            <div className={`${styles.whenNotFlipped}`}>
                <Link href={`/${locale}/recipe/${extractRecipeId(uri)}`} className='flex items-center justify-center flex-col gap-y-2'>
                    <h2 className='font-bold text-lg'>{label.length > 11 ? ellipsedText(label, 11) : label}</h2>
                    <img className='w-64' src={images.SMALL.url} alt={label} width={images.SMALL.width} height={images.SMALL.height} />
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
                <Link href={`/${locale}/recipe/${extractRecipeId(uri)}`}>
                    <h2 className='text-center font-bold xxs:text-lg lg:text-xl text-primary w-64' title={label}>{label.length > 18 ? ellipsedText(label, 18) : label}</h2>
                </Link>
                
                <div className='flex justify-center gap-2 my-1'>
                    <RenderBadge text={dishType[0]} />
                    <RenderBadge text={cuisineType[0]} />
                    <RenderBadge text={mealType[0]} />
                </div>
                
                <div className='grid grid-cols-2 gap-y-2 my-1'>
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
                    <Button variant={"destructive"} title={url} className='w-full'><a target='_blank' href={url}>Recipe Source Site</a></Button>
               </div>
            </div>
        </div>
    )
}

const RenderBadge = ({ text }: { text: string }) => {
    return (
        <Badge variant={"secondary"} title={text}>{text.length > 11 ? ellipsedText(text, 11) : text}</Badge>
    )
}

const RenderBasicTextInfo = ({ text, val }: { text: string, val: string | number }) => {
    return (
        <h3 className='flex justify-between px-2 gap-2 xxs:text-xs lg:text-sm text-primary-foreground'><span className='font-semibold'>{text}</span>{val}</h3>
    )
}

export const ReusableModal = ({ children, triggerText, title, changeWidth }: { children: any, triggerText: string, title: string, changeWidth?: boolean }) => {
    return (
        <Dialog>
            <DialogTrigger><Badge variant={'secondary'} className='w-full text-secondary bg-muted-foreground transition-colors duration-1000 hover:bg-primary'>{triggerText}</Badge></DialogTrigger>
            <DialogContent
                className='bg-accent border-ring'
                style={{ minWidth: changeWidth ? "80%" : "auto" }}
            >
                <DialogHeader>
                    <DialogTitle className='text-primary'>{title}</DialogTitle>

                    {children}
                </DialogHeader>
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
            <h3 key={item.foodId}>{item.text}</h3>
        )
    })
    return (
        <ReusableModal triggerText={"Recipe Ingredients"} title={"Ingredients And Measurements"}>
            <DialogDescription className='textarea-primary flex flex-col gap-y-4 h-[33rem]'>
                <div className='grid grid-cols-4 place-content-center place-items-center font-bold text-lg'>
                    <div>Name</div>
                    <div>Picture</div>
                    <div>Quantity</div>
                    <div>Weight</div>
                </div>
                <span className='flex flex-col gap-y-2 h-96 overflow-y-scroll no-scrollbar'>
                    {renderIngredientsAndMeasurements()}
                </span>
                <h2 className='font-bold text-lg text-primary'>Instructions</h2>
                <span className='flex flex-col gap-y-2 h-40 overflow-y-scroll no-scrollbar'>{renderInstructions()}</span>
            </DialogDescription>
        </ReusableModal>
    )
}

export const RenderIngredientAndMeasurement = ({ ...items }: IngredientItemType) => {
    const { food, foodCategory, measure, quantity, weight, image } = items;
    return (
        <div
            className='grid grid-cols-4 gap-4 place-content-center place-items-center'
        >
            <div className='capitalize'>{food}</div>
            <div className='flex flex-col justify-center items-center'>
                <div className='text-[11px] capitalize'>{foodCategory}</div>
                <img src={image} alt={food} width={60} height={39} />
            </div>
            <h2 className='font-semibold capitalize'>{quantity.toFixed(2)} {measure}</h2>
            <h2 className='font-semibold'>{weight.toFixed(2)}</h2>
        </div>
    )
}

const RenderRecipeDigestInfo = ({ digestLabels }: { digestLabels: DigestItemType[] }) => {
    const renderItems = () => digestLabels.map(item => {
        const { label, unit, total, tag, hasRDI } = item
        return (
            <Button key={label} variant={'ghost'} className='flex justify-between items-center text-left gap-x-2 mr-2 text-sm font-semibold'>
                <h2 className='w-2/3'>{label}</h2>
                <h2 className='w-1/4 flex gap-x-2 text-xs'><span>hasRDI</span> (<span>{hasRDI ? "true" : "false"}</span>)</h2>
                <h2 className='w-1/2 text-xs'>Total ({total.toFixed(2)} {unit})</h2>
            </Button>
        )
    })

    return (
        <ReusableModal triggerText={"Digest Info"} title={"Digest Info Details"}>
            <DialogDescription className='flex flex-col gap-2 h-[28.1rem] overflow-y-scroll no-scrollbar'>
                {renderItems()}
            </DialogDescription>
        </ReusableModal>
    )
}

const RenderDietLabels = ({ labels }: { labels: string[] }) => {
    const { renderLabels } = useForIngredientsLabels(labels)
    return (
        <ReusableModal triggerText={"Diet Labels"} title={"Recipe Diet Labels"}>
            <DialogDescription className='grid grid-cols-4 gap-2 px-4 text-sm'>
                {renderLabels()}
            </DialogDescription>
        </ReusableModal>
    )
}

const RenderHealthLabels = ({ labels }: { labels: string[] }) => {
    const { renderLabels } = useForIngredientsLabels(labels)
    return (
        <ReusableModal triggerText={"Health Labels"} title={"Recipe Meal Health Labels"}>
            <DialogDescription className='grid grid-cols-4 gap-2 px-4 text-sm'>
                {renderLabels()}
            </DialogDescription>
        </ReusableModal>
    )
}

const useForIngredientsLabels = (labels: string[]) => {
    const renderLabels = () => labels.map(txt => <Button key={txt} variant={'ghost'} className='text-muted-foreground'>{txt}</Button>)
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