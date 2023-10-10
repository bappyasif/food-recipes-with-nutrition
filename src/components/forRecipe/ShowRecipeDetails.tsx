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
import { Button } from '../ui/button'
import { ShowYoutubeVids } from './ShowYoutubeVids'

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
                <ShowFewRelatedRecipes diet={dietLabels[0]} dishType={dishType[0]} mealType={mealType[0].split("/")[0]} />
            </section>
            <section className='flex justify-between items-center gap-x-6 mx-6'>

                <RecipeImage {...data} />

                <div className='absolute right-0 w-3/5 flex flex-col justify-center gap-y-11 z-40 bg-accent'>

                    <RecipeIngredientsAndInstructions ingredients={ingredients} />

                    <RenderRecipeVariousLabels dietLabels={dietLabels} digest={digest} healthLabels={healthLabels} />

                    <Button variant={'destructive'} className='flex gap-2 text-xl text-muted-foreground'><span className='font-bold'>Source:</span> <a href={url} target='_blank'>{source}</a></Button>
                </div>
            </section>
            <section className='flex justify-around items-center'>
                <div className='w-2/3'>
                    <h2 className='text-xl mb-6 mt-2 font-bold'>Digest Labels</h2>
                    <div className='h-80 overflow-y-scroll scroll-smooth no-scrollbar'>
                        <RenderDigestTable heading='Digest' labels={digest} />
                    </div>
                </div>
                <ShowYoutubeVids recipeStr={label} />
                {/* <FewNonRelatedRecipes diet={dietLabels[0]} dishType={dishType[0]} mealType={mealType[0].split("/")[0]} /> */}
            </section>
            <FewNonRelatedRecipes diet={dietLabels[0]} dishType={dishType[0]} mealType={mealType[0].split("/")[0]} />
        </div>
    )
}

const RenderRecipeVariousLabels = ({ digest, healthLabels, dietLabels }: { digest: DigestItemType[], healthLabels: string[], dietLabels: string[] }) => {
    const renderAcordionItemsForHealthLabels = () => healthLabels.map(val => {
        return (
            <Badge key={val} className='bg-muted-foreground text-muted'>
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
                <AccordionTrigger className='font-bold text-xl'>Health Labels</AccordionTrigger>
                <AccordionContent>
                    {renderAcordionItemsForHealthLabels()}
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value={"diet"}>
                <AccordionTrigger className='font-bold text-xl'>Diet Labels</AccordionTrigger>
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
                <AccordionTrigger><h2 className='font-bold text-xl'>Ingredients And Measurements</h2></AccordionTrigger>
                <AccordionContent>
                    <div className='grid grid-cols-5 justify-items-center place-items-center font-bold text-lg'>
                        <div>Picture</div>
                        <div>Name</div>
                        <div>Category</div>
                        <div>Quantity</div>
                        <div>Weight</div>
                    </div>

                    <div className='flex flex-col gap-y-2 justify-center items-center'>
                        {renderIngredientsAndMeasurements()}
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value='instructions'>
                <AccordionTrigger className='font-bold text-xl'>Instructions</AccordionTrigger>
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

    const contents = (
        <div className='grid grid-cols-5 justify-items-center place-items-center w-full capitalize'>
            <img className='' src={image} alt={food} width={60} height={39} />

            <div className=''>{food}</div>

            <div className=''>{foodCategory}</div>

            <h2>
                {quantity} {measure}
            </h2>

            <h2>
                {weight.toFixed(2)}
            </h2>
        </div>
    )

    return contents
    // <div
    //     className='grid grid-cols-4 gap-x-2 w-full place-content-center place-items-center pl-9'
    // // className='flex justify-between items-center gap-x-4'
    // >
    //     <div className='w-96 flex items-center justify-around'>
    //         <img className='' src={image} alt={food} width={60} height={39} />

    //         <div className='w-36'>{food}</div>
    //     </div>

    //     <div className=''>{foodCategory}</div>

    //     <h2>
    //         <span className='font-semibold'>Quantity </span>
    //         <span>{quantity} {measure}</span>
    //     </h2>

    //     <h2>
    //         <span className='font-semibold'>Weight </span>
    //         <span>{weight.toFixed(2)}</span>
    //     </h2>
    // </div>

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
            <tr className='' key={tag}>
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
            <TableRow className='font-bold bg-primary sticky'>
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