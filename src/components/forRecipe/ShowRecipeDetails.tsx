"use client"

import { DigestItemType, IngredientItemType, RecipeMealType } from '@/types'
import { searchRecipeById } from '@/utils/dataFetching'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Badge } from '../ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

export const ShowRecipeDetails = () => {
    const [recipeData, setRecipeData] = useState<RecipeMealType>()

    const dynamicParams = useParams()

    const prepareAndFetchData = () => {
        const params = {
            app_id: process.env.NEXT_PUBLIC_EDAMAM_APP_ID,
            app_key: process.env.NEXT_PUBLIC_EDAMAM_APP_KEY,
            // id: dynamicParams["slug-id"],
            type: "public"
        }

        searchRecipeById(params, dynamicParams["slug-id"] as string).then(d => {
            console.log(d)
            d.recipe && setRecipeData(d.recipe)
        }).catch(err => console.log(err))
        // searchRecipes(params).then(d=> console.log(d)).catch(err => console.log(err))
    }

    useEffect(() => {
        dynamicParams["slug-id"] && prepareAndFetchData()
    }, [dynamicParams["slug-id"]])

    return (
        <div>
            ShowRecipeDetails -- {dynamicParams["slug-id"]}
            {recipeData?.label ? <RenderRecipe {...recipeData} /> : null}
        </div>
    )
}

const RenderRecipe = ({ ...data }: RecipeMealType) => {
    const { calories, cautions, co2EmissionsClass, cuisineType, dietLabels, digest, dishType, healthLabels, images, ingredients, label, mealType, shareAs, source, tags, totalWeight, uri, url, yield: servings, count } = data;

    const renderIngredientsAndMeasurements = () => ingredients.map(item => <RednerIngredients key={item.foodId} {...item} />)

    const renderInstructions = () => ingredients.map(item => {
        return (
            <h3 key={item.foodId}>{item.text}</h3>
        )
    })

    const renderAcordionItemsForHealthLabels = () => healthLabels.map(val => {
        return (
            <Badge key={val}>
                {val}
            </Badge>
        )
    })

    const renderAcordionItemsForDietLabels = () => dietLabels.map(val => {
        return (
            <Badge key={val}>
                {val}
            </Badge>
        )
    })

    return (
        <div>
            <h1>{label}</h1>
            <img src={images.LARGE.url} height={images.LARGE.height} width={images.LARGE.width} alt={label} />
            <section>
                <div className='flex gap-x-6'>
                    <ReusableBadge text='Diet' val={dietLabels[0]} />
                    <ReusableBadge text='Cuisine' val={cuisineType[0]} />
                    <ReusableBadge text='Dish' val={dishType[0]} />
                </div>

                <div className='flex gap-x-6'>
                    <ReusableBadge text='Carbon Emission Rating' val={co2EmissionsClass} />
                    <ReusableBadge text='Caustions' val={cautions[0]} />
                    <ReusableBadge text='Meal' val={mealType[0]} />
                </div>
                <div className='flex gap-x-6'>
                    <ReusableBadge text='Yield' val={servings} />
                    <ReusableBadge text='Calories' val={calories.toFixed(2)} />
                    <ReusableBadge text='Weight' val={totalWeight.toFixed(2)} />
                </div>
            </section>
            <section className='flex flex-col gap-y-4'>
                <h2>Ingredients And Measurements</h2>

                <div className='flex flex-col gap-y-2 justify-center items-center'>
                    {renderIngredientsAndMeasurements()}
                </div>

                <h2>Instructions</h2>
                <div
                    // className='flex flex-col gap-y-2'
                    className='grid grid-flow-col grid-rows-2 gap-4'
                >
                    {renderInstructions()}
                </div>
            </section>
            <section>
                <h2>HERE!!</h2>
                <Accordion type='multiple'>
                    {/* <div>{renderAcordionItems()}</div> */}
                    <AccordionItem value={"health"}>
                        <AccordionTrigger>Health Labels</AccordionTrigger>
                        <AccordionContent>
                            {renderAcordionItemsForHealthLabels()}
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value={"diet"}>
                        <AccordionTrigger>Diet Labels</AccordionTrigger>
                        <AccordionContent>
                            {renderAcordionItemsForDietLabels()}
                            {/* "oos coos" */}
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value='digest'>
                    <AccordionTrigger>Digest Labels</AccordionTrigger>
                        <AccordionContent>
                            <RenderDigestTable heading='Digest' labels={digest} />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
        </div>
    )
}

const ReusableBadge = ({ text, val }: { text: string, val: string | number }) => {
    return (
        <Badge className='px-4 flex gap-x-4 w-60 justify-between'><span>{text} </span>{val}</Badge>
    )
}

const RednerIngredients = ({ ...items }: IngredientItemType) => {
    const { food, foodCategory, foodId, image, measure, quantity, text, weight } = items

    return (
        <div
            className='grid grid-cols-4 gap-x-2 w-full place-content-center place-items-center'
        // className='flex justify-between items-center gap-x-4'
        >
            <div className='w-96 flex items-center justify-around'>
                <img className='' src={image} alt={food} width={60} height={39} />

                <div className='w-36'>{food}</div>
            </div>

            <div className=''>{foodCategory}</div>

            <h2>
                <span className='font-semibold'>Quantity </span>
                <span>{quantity} {measure}</span>
            </h2>

            <h2>
                <span className='font-semibold'>Weight </span>
                <span>{weight.toFixed(2)}</span>
            </h2>
        </div>
    )
}

const RenderDigestTable = ({ labels, heading }: { labels: DigestItemType[], heading: string }) => {
    // const renderTableHeads = () => Object.keys(labels).map(item => {
    //     return (
    //         <TableHead>{item}</TableHead>
    //     )
    // })

    // console.log(Object.values(labels))

    const renderTableHeads = () => Object.keys(labels[0]).map(item => {
        // const renderHeads = () => Object.keys(item).map(val => <TableHead key={val}>{val}</TableHead>)
        if(item === "sub") return
        return (
            <TableHead key={item}>{item}</TableHead>
        )
    })

    const renderTableRows = () => labels.map(item => {
        const {daily, hasRDI, label, schemaOrgTag, tag, total, unit} = item;
        // const values = () => Object.values(item).map((val, idx) => <TableCell key={`${val}+ idx`}>{val }</TableCell>)
        // const dataCells = () => Object.values(item).map((val, idx) => <div key={idx}>{val as string | number | boolean}</div>)

        console.log(Object.values(item))

        // const renderRows = () => Object.values(item).map(item => {
        //     if(typeof item !== "boolean" && typeof item !== "number" && typeof item !== "string") return
        //     return (
        //         <TableCell>{item}</TableCell>
        //     )
        // })

        return (
            <TableRow>
                {/* {renderRows()} */}

                {/* {dataCells()} */}
                <TableCell>{tag}</TableCell>
                <TableCell>{daily.toFixed(2)}</TableCell>
                <TableCell>{schemaOrgTag}</TableCell>
                <TableCell>{label}</TableCell>
                <TableCell>{hasRDI ? "True" : "False"}</TableCell>

                <TableCell>{total.toFixed(2)}</TableCell>
                <TableCell>{unit}</TableCell>
            </TableRow>
        )
    })

    const renderHeads = () => {
        return (
            <TableRow>
            <TableHead>Tag</TableHead>
            <TableHead>Daily</TableHead>
            <TableHead>SchemaOrgTag</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>HasRDI</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Unit</TableHead>
        </TableRow>
        )
    }

    return (
        <Table>
            <TableHeader>
                {/* <TableRow>
                    {renderTableHeads()}
                </TableRow> */}
                {renderHeads()}
            </TableHeader>
            <TableBody>
                {renderTableRows()}
            </TableBody>
        </Table>
    )
}