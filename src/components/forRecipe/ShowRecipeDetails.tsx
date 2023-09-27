"use client"

import { DigestItemType, IngredientItemType, RecipeMealType } from '@/types'
import { searchRecipeById } from '@/utils/dataFetching'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Badge } from '../ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { ShowFewRelatedRecipes } from './ShowFewRelatedRecipes'
import { RecipeImage } from './RecipeImage'
import { FewNonRelatedRecipes } from './FewNonRelatedRecipes'

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

    return (
        <div className='flex flex-col gap-y-20'>
            <section>
                <ShowFewRelatedRecipes diet={dietLabels[0]} dishType={dishType[0]} mealType={mealType[0]} />
            </section>
            <section className='flex justify-between gap-x-6 mx-6'>

                <RecipeImage {...data} />

                <div className='w-2/3 flex flex-col justify-center gap-y-11'>

                    <RecipeIngredientsAndInstructions ingredients={ingredients} />

                    <RenderRecipeVariousLabels dietLabels={dietLabels} digest={digest} healthLabels={healthLabels} />
                </div>
            </section>
            <section className='flex justify-between'>
                <div className='w-2/3'>
                    <h2 className='text-xl mb-6 mt-2'>Digest Labels</h2>
                    <div className='h-72 overflow-y-scroll scroll-smooth appearance-none'>
                        <RenderDigestTable heading='Digest' labels={digest} />
                    </div>
                </div>
                <FewNonRelatedRecipes />
            </section>
        </div>
    )
}

const RenderRecipeVariousLabels = ({ digest, healthLabels, dietLabels }: { digest: DigestItemType[], healthLabels: string[], dietLabels: string[] }) => {
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
        <Accordion type='single' collapsible={true}>
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

            {/* <AccordionItem value='digest'>
                <AccordionTrigger>Digest Labels</AccordionTrigger>
                <AccordionContent>
                    <RenderDigestTable heading='Digest' labels={digest} />
                </AccordionContent>
            </AccordionItem> */}
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

    return (
        <Accordion type='multiple'>
            <AccordionItem value='ingredients-and-measurements' className='relative'>
                <AccordionTrigger><h2>Ingredients And Measurements</h2></AccordionTrigger>
                <AccordionContent>
                    <div className='flex flex-col gap-y-2 justify-center items-center'>
                        {renderIngredientsAndMeasurements()}
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value='instructions'>
                <AccordionTrigger>Instructions</AccordionTrigger>
                <AccordionContent >
                    <div className='grid grid-flow-col grid-rows-2 gap-4'>{renderInstructions()}</div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

// const ReusableBadge = ({ text, val }: { text: string, val: string | number }) => {
//     return (
//         <Badge className='px-4 flex gap-x-4 w-64 justify-between text-xl'><span>{text} </span>{val}</Badge>
//     )
// }

const RednerIngredients = ({ ...items }: IngredientItemType) => {
    const { food, foodCategory, foodId, image, measure, quantity, text, weight } = items

    return (
        <div
            className='grid grid-cols-4 gap-x-2 w-full place-content-center place-items-center pl-9'
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

    // const renderTableRows = () => labels.map(item => {
    //     const { daily, hasRDI, label, schemaOrgTag, tag, total, unit } = item;

    //     // console.log(Object.values(item))

    //     return (
    //         <TableRow>
    //             {/* {renderRows()} */}

    //             {/* {dataCells()} */}
    //             <TableCell>{tag}</TableCell>
    //             <TableCell>{daily.toFixed(2)}</TableCell>
    //             <TableCell>{schemaOrgTag}</TableCell>
    //             <TableCell>{label}</TableCell>
    //             <TableCell>{hasRDI ? "True" : "False"}</TableCell>

    //             <TableCell>{total.toFixed(2)}</TableCell>
    //             <TableCell>{unit}</TableCell>
    //         </TableRow>
    //     )
    // })

    const renderTableRows = () => labels.map(item => {
        const { daily, hasRDI, label, schemaOrgTag, tag, total, unit } = item;

        // console.log(Object.values(item))

        return (
            <tr>
                {/* {renderRows()} */}

                {/* {dataCells()} */}
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

    const renderHeads = () => {
        return (
            <TableRow className=''>
                <TableHead className='sticky'>Tag</TableHead>
                <TableHead>Daily</TableHead>
                <TableHead>SchemaOrgTag</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>HasRDI</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Unit</TableHead>
            </TableRow>
        )
    }

    return (<table className="relative w-full border">
        <thead>
            <tr className='text-sm'>
                <th className="sticky top-0 px-6 py-3 text-red-900 bg-primary-content">Tag</th>
                <th className="sticky top-0 px-6 py-3 text-red-900 bg-primary-content">Daily</th>
                <th className="sticky top-0 px-6 py-3 text-red-900 bg-primary-content">SchemaOrgTag</th>
                <th className="sticky top-0 px-6 py-3 text-red-900 bg-primary-content">Label</th>
                <th className="sticky top-0 px-6 py-3 text-red-900 bg-primary-content">HasRDI</th>
                <th className="sticky top-0 px-6 py-3 text-red-900 bg-primary-content">Total</th>
                <th className="sticky top-0 px-6 py-3 text-red-900 bg-primary-content">Unit</th>
            </tr>
        </thead>
        <tbody className="divide-y bg-primary-focus text-center text-xs">
            {renderTableRows()}
        </tbody>
    </table>
        // <Table className=''>
        //     <TableHeader className='text-sm bg-white border-b sticky top-0'>
        //         <TableRow>
        //             {renderTableHeads()}
        //         </TableRow>
        //         {renderHeads()}
        //     </TableHeader>
        //     <TableBody className='text-xs'>
        //         {renderTableRows()}
        //     </TableBody>
        // </Table>
    )
}