"use client"

import { DigestItemType, IngredientItemType, RecipeMealType } from '@/types'
import React, { ComponentProps } from 'react'
import { Button } from '../ui/button'
import { useForTruthToggle } from '@/hooks/forComponents'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Badge } from '../ui/badge'
import Link from 'next/link'
import styles from "./Filters.module.css"
import { ellipsedText } from '../forRecipe/FewNonRelatedRecipes'

export const RecipesView = ({ recipes }: { recipes: RecipeMealType[] }) => {
    const renderRecipes = () => recipes.map(item => <RenderRecipe key={item.label} {...item} />)
    return (
        <div>
            <h1>Recipes View</h1>
            <div className='grid grid-cols-4 gap-4'>
                {renderRecipes()}
            </div>
        </div>
    )
}

const RenderRecipe = ({ ...items }: RecipeMealType) => {
    const { calories, co2EmissionsClass, cuisineType, dietLabels, digest, dishType, healthLabels, images, ingredients, label, mealType, source, tags, totalWeight, url, yield: servings, uri } = items

    return (
        <div 
            className={`flex flex-col gap-y-4 justify-center items-center ${styles.flipCard} h-80`}
            >
            <p 
                className={`${styles.flipCardBack} h-80 w-[23.1rem] rounded-sm`}
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
                <Link href={`/recipe/${extractRecipeId(uri)}`} className='flex items-center justify-center flex-col gap-y-2'>
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
                className={`${styles.whenFlipped}`}
            >
                <Link href={`/recipe/${extractRecipeId(uri)}`}>
                    <h2 className='text-center font-bold text-xl'>{label}</h2>
                </Link>
                <div className='flex justify-center gap-2'>
                    <RenderBadge text={dishType[0]} />
                    <RenderBadge text={cuisineType[0]} />
                    <RenderBadge text={mealType[0]} />
                </div>
                <div className='grid grid-cols-2 gap-2'>
                    <RenderBasicTextInfo text="Calories" val={calories.toFixed(2)} />
                    <RenderBasicTextInfo text="carbon footprint" val={co2EmissionsClass} />
                    <RenderBasicTextInfo text="servings" val={servings} />
                    <RenderBasicTextInfo text="weight" val={totalWeight.toFixed(2)} />
                </div>
                <div className='grid grid-cols-2 gap-2'>
                    <RenderRecipeIngredients ingredients={ingredients} />
                    <RenderHealthLabels labels={healthLabels} />
                    <RenderDietLabels labels={dietLabels} />
                    <RenderRecipeDigestInfo digestLabels={digest} />
                </div>
                <Button variant={"destructive"} title={url}><a target='_blank' href={url}>Recipe Source Site</a></Button>
                <RenderBasicTextInfo text='Source' val={source} />
            </div>
            
            {/* <RenderRecipeTags /> */}
            {/* <h4 title={url}>{url}</h4> */}
            
            {/* <h4>{source}</h4> */}
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
        <h3 className='flex justify-between px-2 gap-2'><span className='font-semibold'>{text}</span>{val}</h3>
    )
}

export const ReusableModal = ({ children, triggerText, title, changeWidth }: { children: any, triggerText: string, title: string, changeWidth?: boolean }) => {
    return (
        <Dialog>
            {/* <DialogTitle>{props.title}</DialogTitle>
            <DialogHeader>{props.title}</DialogHeader> */}
            <DialogTrigger><Badge variant={'secondary'} className='w-full text-primary-foreground bg-muted-foreground hover:bg-primary'>{triggerText}</Badge></DialogTrigger>
            <DialogContent
                className='bg-primary-content'
                style={{ minWidth: changeWidth ? "80%" : "auto" }}
            >
                <DialogHeader>
                    <DialogTitle className='text-primary-focus'>{title}</DialogTitle>

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
                <div className='grid grid-cols-4 place-content-center place-items-center'>
                    <div>Name</div>
                    <div>Picture</div>
                    <div>Quantity</div>
                    <div>Weight</div>

                    {/* {renderIngredientsAndMeasurements()} */}
                </div>
                <span className='flex flex-col gap-y-2 h-96 overflow-y-scroll no-scrollbar'>
                    {renderIngredientsAndMeasurements()}
                </span>
                <h2 className='font-bold'>Instructions</h2>
                <span className='flex flex-col gap-y-2 h-40 overflow-y-scroll no-scrollbar'>{renderInstructions()}</span>
            </DialogDescription>
            
            {/* <DialogDescription className='textarea-primary flex flex-col gap-y-4'>
                <span className='flex flex-col gap-y-2 h-96 overflow-y-scroll no-scrollbar'>
                    {renderIngredientsAndMeasurements()}
                </span>
                <h2 className='font-bold'>Instructions</h2>
                <span className='flex flex-col gap-y-2'>{renderInstructions()}</span>
            </DialogDescription> */}
        </ReusableModal>
    )
}

// export const RenderIngredientAndMeasurement = ({ ...items }: IngredientItemType) => {
//     const { food, foodCategory, measure, quantity, weight, image } = items;
//     return (
//         <div
//             // className='grid grid-flow-col col-span-3 gap-x-2 justify-items-center place-items-center'
//             className='flex justify-between items-center gap-x-4'
//         >
//             <div className='w-36'>{food}</div>
//             <div className='w-40 flex flex-col justify-center items-center'>
//                 <div className='text-[11px]'>{foodCategory}</div>
//                 <img src={image} alt={food} width={60} height={39} />
//             </div>
//             <div className='flex gap-x-2 w-full'>
//                 <h2><span className='font-semibold'>Quantity </span>{quantity.toFixed(2)} {measure}</h2>
//                 <h2></h2>
//                 <h2><span className='font-semibold'>Weight </span>{weight.toFixed(2)}</h2>
//             </div>
//         </div>
//     )
// }

export const RenderIngredientAndMeasurement = ({ ...items }: IngredientItemType) => {
    const { food, foodCategory, measure, quantity, weight, image } = items;
    return (
        <div
            // className='grid grid-flow-col col-span-3 gap-x-2 justify-items-center place-items-center'
            // className='flex justify-between items-center gap-x-4'
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

// export const RenderIngredientAndMeasurement = ({ ...items }: IngredientItemType) => {
//     const { food, foodCategory, measure, quantity, weight, image } = items;
//     return (
//         <div
//             // className='grid grid-flow-col col-span-3 gap-x-2 justify-items-center place-items-center'
//             className='flex justify-between items-center gap-x-4'
//         >
//             <div className='w-36'>{food}</div>
//             <div className='w-40 flex flex-col justify-center items-center'>
//                 <div className='text-[11px]'>{foodCategory}</div>
//                 <img src={image} alt={food} width={60} height={39} />
//             </div>
//             <div className='flex gap-x-2 w-full'>
//                 <h2><span className='font-semibold'>Quantity </span>{quantity} {measure}</h2>
//                 <h2></h2>
//                 <h2><span className='font-semibold'>Weight </span>{weight.toFixed(2)}</h2>
//             </div>
//         </div>
//     )
// }

const RenderRecipeTags = () => {
    return (
        <ReusableModal triggerText={"Recipe Tags22"} title={"Recipe Meal Tags"}>
            <DialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
            </DialogDescription>
        </ReusableModal>
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
    // const renderLabels = () => labels.map(txt => <Button key={txt} variant={'ghost'}>{txt}</Button>)
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
    const renderLabels = () => labels.map(txt => <Button key={txt} variant={'ghost'} className='textarea-primary'>{txt}</Button>)
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

// const RenderRecipe = ({ ...items }: RecipeMealType) => {
//     const { calories, co2EmissionsClass, cuisineType, dietLabels, digest, dishType, healthLabels, images, ingredients, label, mealType, source, tags, totalWeight, url, yield: servings, uri } = items

//     return (
//         <div className={`flex flex-col gap-y-4 justify-center items-center ${styles.flipCard}`}>
//             {/* <p className={`${styles.flipCardBack}`}></p> */}

//             <div className={`${styles.whenNotFlipped}`}>
//                 <Link href={`/recipe/${extractRecipeId(uri)}`} className='flex items-center justify-center flex-col gap-y-2'>
//                     <h2>{ellipsedText(label, 11)}</h2>
//                     <img className='w-64' src={images.SMALL.url} alt={label} width={images.SMALL.width} height={images.SMALL.height} />
//                 </Link>    
//                 <div className='flex justify-start gap-2'>
//                     <RenderBadge text={dishType[0]} />
//                     <RenderBadge text={cuisineType[0]} />
//                     <RenderBadge text={mealType[0]} />
//                 </div>
//             </div>

//             <div 
//                 className={`${styles.whenFlipped}`}
//                 style={{
//                     backgroundImage: `url(${images.SMALL.url})`,
//                     backgroundSize: "100% 100%",
//                     objectFit: "cover",
//                     backgroundRepeat: "no-repeat",
//                     backgroundColor: "rgba(17,17,17,0.6)",
//                     backgroundBlendMode: "darken",
//                 }}
//             >
//                 <Link href={`/recipe/${extractRecipeId(uri)}`}>
//                     <h2 className='text-center'>{label}</h2>
//                     {/* <div 
//                         className={`${styles.backImg} absolute -z-10`}
//                         style={{
//                             backgroundImage: `url(${images.SMALL.url})`,
//                             backgroundSize: "100% 100%",
//                             objectFit: "cover",
//                             backgroundRepeat: "no-repeat",
//                             backgroundColor: "rgba(17,17,17,0.6)",
//                             backgroundBlendMode: "darken",
//                             width: "100%",
//                             height: "100%"
//                         }}
//                     ></div> */}
//                     {/* <img className='w-64' src={images.SMALL.url} alt={label} width={images.SMALL.width} height={images.SMALL.height} /> */}
//                 </Link>
//                 <div className='flex justify-center gap-2'>
//                     <RenderBadge text={dishType[0]} />
//                     <RenderBadge text={cuisineType[0]} />
//                     <RenderBadge text={mealType[0]} />
//                 </div>
//                 <div className='grid grid-cols-2 gap-2'>
//                     <RenderBasicTextInfo text="Calories" val={calories.toFixed(2)} />
//                     <RenderBasicTextInfo text="carbon footprint" val={co2EmissionsClass} />
//                     <RenderBasicTextInfo text="servings" val={servings} />
//                     <RenderBasicTextInfo text="weight" val={totalWeight.toFixed(2)} />
//                 </div>
//                 <div className='grid grid-cols-2 gap-2'>
//                     <RenderRecipeIngredients ingredients={ingredients} />
//                     <RenderHealthLabels labels={healthLabels} />
//                     <RenderDietLabels labels={dietLabels} />
//                     <RenderRecipeDigestInfo digestLabels={digest} />
//                 </div>
//                 <Button variant={"destructive"} title={url}><a target='_blank' href={url}>Recipe Source Site</a></Button>
//                 <RenderBasicTextInfo text='Source' val={source} />
//             </div>
            
//             {/* <RenderRecipeTags /> */}
//             {/* <h4 title={url}>{url}</h4> */}
            
//             {/* <h4>{source}</h4> */}
//         </div>
//     )
// }


// const RenderRecipe = ({ ...items }: RecipeMealType) => {
//     const { calories, co2EmissionsClass, cuisineType, dietLabels, digest, dishType, healthLabels, images, ingredients, label, mealType, source, tags, totalWeight, url, yield: servings, uri } = items

//     return (
//         <div className={`flex flex-col gap-y-4 justify-center items-center ${styles.flipCard}`}>
//             <p className={`${styles.flipCardBack}`}></p>

//             <Link href={`/recipe/${extractRecipeId(uri)}`}>
//                 <h2>{label}</h2>
//                 <img className='w-64' src={images.SMALL.url} alt={label} width={images.SMALL.width} height={images.SMALL.height} />
//             </Link>
//             <div className='flex justify-start gap-2'>
//                 {/* <h3>{dishType[0]}</h3>
//                 <h3>{cuisineType[0]}</h3>
//                 <h3>{mealType[0]}</h3> */}
//                 <RenderBadge text={dishType[0]} />
//                 <RenderBadge text={cuisineType[0]} />
//                 <RenderBadge text={mealType[0]} />
//             </div>
            
//             <div className='grid grid-cols-2 gap-2'>
//                 {/* <h3><span>{"Calories"}</span>{calories.toFixed(2)}</h3>
//                 <h3><span>Carbon footprint</span>{co2EmissionsClass}</h3>
//                 <h3><span>servings</span>{servings}</h3>
//                 <h3><span>weight</span>{totalWeight}</h3> */}
//                 <RenderBasicTextInfo text="Calories" val={calories.toFixed(2)} />
//                 <RenderBasicTextInfo text="carbon footprint" val={co2EmissionsClass} />
//                 <RenderBasicTextInfo text="servings" val={servings} />
//                 <RenderBasicTextInfo text="weight" val={totalWeight.toFixed(2)} />
//             </div>
//             {/* <div>{JSON.stringify(ingredients)}</div>
//             <div>{JSON.stringify(healthLabels)}</div>
//             <div>{JSON.stringify(dietLabels)}</div>
//             <div>{JSON.stringify(digest)}</div>
//             <div>{JSON.stringify(tags)}</div> */}
//             <div className='grid grid-cols-2 gap-2'>
//                 <RenderRecipeIngredients ingredients={ingredients} />
//                 <RenderHealthLabels labels={healthLabels} />
//                 <RenderDietLabels labels={dietLabels} />
//                 <RenderRecipeDigestInfo digestLabels={digest} />
//             </div>
//             {/* <RenderRecipeTags /> */}
//             {/* <h4 title={url}>{url}</h4> */}
//             <Button variant={"destructive"} title={url}><a target='_blank' href={url}>Recipe Source Site</a></Button>
//             {/* <h4>{source}</h4> */}
//             <RenderBasicTextInfo text='Source' val={source} />
//         </div>
//     )
// }