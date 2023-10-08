"use client"

import { useAppSelector } from '@/hooks/forRedux'
import React, { KeyboardEvent, KeyboardEventHandler, useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'
import { Checkbox } from '../ui/checkbox'
import { Button } from '../ui/button'
import { searchRecipes } from '@/utils/dataFetching'
// import { useRouter } from 'next/router'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useForExtractingQueriesFromUrl, useForInputTextChange } from '@/hooks/forComponents'
import { RecipesView } from './RecipesView'
import { Badge } from '../ui/badge'
import { FiltersTypes } from '@/types'
import axios from 'axios'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'

type FiltersDashboardPropsType = {
    handleRecipesFound: (d: any) => void
}

export const FiltersDashboard = ({ handleRecipesFound }: FiltersDashboardPropsType) => {
    const [filters, setFilters] = useState<FiltersTypes>({ cuisineType: [], diet: [], dishType: [], health: [], mealType: [], q: "" })

    const getFiltered = (data: string, key: string) => {
        let filtered = null;

        for (let k in filters) {
            if (k !== "q") {
                // console.log(k === "q")
                // return

                if (filters[k as keyof FiltersTypes]?.length) {
                    filtered = (filters[k as keyof FiltersTypes] as string[]).filter(item => !item.includes(data));
                }
            }
        }

        console.log(filtered, "filtered!!")

        // if (key === "cuisineType") {
        //     filtered = filters.cuisineType?.filter(item => !item.includes(data));
        // } else if (key === "dishType") {
        //     filtered = filters.dishType?.filter(item => !item.includes(data));
        // } else if (key === "mealType") {
        //     filtered = filters.mealType?.filter(item => !item.includes(data));
        // } else if (key === "health") {
        //     filtered = filters.health?.filter(item => !item.includes(data));
        // } else if (key === "diet") {
        //     filtered = filters.diet?.filter(item => !item.includes(data));
        // }

        // console.log(filtered, filters)
        return filtered
    }

    const checkIfFound = (data: string, key: string) => {
        let found = null;
        // posible solution in this
        for (let k in filters) {
            if (filters[k as keyof FiltersTypes] as FiltersTypes) {
                if (k === "q") { }

                if (k === key) {
                    found = (filters[k as keyof FiltersTypes] as string[])?.findIndex(item => item === data)
                }
            }
        }

        // trying bruteforce
        // if (key === "cuisineType") {
        //     found = filters.cuisineType?.findIndex(item => item === data);
        //     // console.log("in scope!!")
        // } else if (key === "dishType") {
        //     found = filters.dishType?.findIndex(item => item === data);
        // } else if (key === "mealType") {
        //     found = filters.mealType?.findIndex(item => item === data);
        // } else if (key === "health") {
        //     found = filters.health?.findIndex(item => item === data);
        // } else if (key === "diet") {
        //     found = filters.diet?.findIndex(item => item === data);
        // }
        // console.log(found, "found!!")
        return found
    }

    const handleFiltersChange = (data: string, key: string) => {
        // console.log("cuisines!!", data)
        // console.log(data, key, "<><>")
        setFilters(prev => {
            if (key === "q" && data) {
                // console.log("q bitch", { ...prev, q: data })
                // return prev
                return { ...prev, q: data }
            } else {
                let found = checkIfFound(data, key)

                if (found !== -1) {
                    // const filtered = prev.cuisineType?.filter(d => d !== data)
                    // console.log("cuisines!!", data, found)

                    const filtered = getFiltered(data, key)
                    console.log({ ...prev, [key]: filtered }, ">!>!>!")
                    return { ...prev, [key]: filtered }
                } else {
                    // const updatedList = prev.cuisineType?.concat(data)
                    const updatedList = prev[key as keyof FiltersTypes]?.concat(data)
                    // console.log({ ...prev, [key]: updatedList }, "FKFKFKF")
                    return { ...prev, [key]: updatedList }
                }
            }
        })
    }

    const router = useRouter()

    // const params = useParams()
    // console.log(params, "poarmas!!")

    // const pathname = usePathname()
    // console.log(pathname)

    // const searchParams = useSearchParams()
    // console.log(searchParams.entries(), searchParams.get("q"), searchParams.values)

    // const { mealsRecipes } = useForExtractingQueriesFromUrl()

    const appendParam = (params: URLSearchParams, arrSrc: string[], propKey: string) => {
        arrSrc.forEach(item => params.append(`${propKey}`, `${item}`))
    }

    const querifyFilters = () => {
        let str = "?type=public&";

        const querified = (items: string[], propKey: string) => items.forEach(item => str += `${propKey}=${item}&`)

        for (let k in filters) {
            if (filters[k as keyof FiltersTypes]?.length) {
                if (k !== "q") {
                    querified(filters[k as keyof FiltersTypes] as string[], k)
                } else {
                    str += `q=${filters.q}&`
                }
            }
        }
        // console.log(str, "STR!!", str.lastIndexOf("&"), str.slice(0, 143))
        router.push(str.slice(0, str.lastIndexOf("&")), undefined)
    }

    const handleSearchNow = () => {
        const params = new URLSearchParams();

        params.append("app_id", `${process.env.NEXT_PUBLIC_EDAMAM_APP_ID}`);
        params.append("app_key", `${process.env.NEXT_PUBLIC_EDAMAM_APP_KEY}`);
        params.append("type", "public");
        // params.append("q", "beef")

        for (let k in filters) {
            if (filters[k as keyof FiltersTypes]?.length) {
                if (k === "q" && filters?.q) {
                    params.append("q", filters.q!)
                } else {
                    appendParam(params, filters[k as keyof FiltersTypes] as string[], k)
                }
            }
        }

        // filters.health?.length && appendParam(params, filters.health!, "health")
        // filters.diet?.length && appendParam(params, filters.diet!, "diet")
        // filters.cuisineType?.length && appendParam(params, filters.cuisineType!, "cuisineType")
        // filters.mealType?.length && appendParam(params, filters.mealType!, "mealType")
        // filters.dishType?.length && appendParam(params, filters.dishType!, "dishType")

        // params.append("health", `${filters.health![0]}`)
        // params.append("health", `${filters.health![1]}`)

        axios.get("https://api.edamam.com/api/recipes/v2", { params }).then(d => {
            const onlyRecipes = d.data?.hits.map((item: any) => item.recipe)
            console.log(d.data, onlyRecipes)
            onlyRecipes?.length && handleRecipesFound(onlyRecipes)
        }).catch(err => console.log(err))

        querifyFilters();

        // router.push(`?q=beefnot&health=paleo`, undefined)

        // console.log(params.entries())

        // searchRecipes({params: params.entries()}).then(d => console.log(d)).catch(err => console.log(err))
    }

    const { handleTextChange, text } = useForInputTextChange()

    useEffect(() => {
        handleFiltersChange(text, "q")
    }, [text])

    // console.log(filters, text)

    const handleEnterKeyPressed = (e:KeyboardEvent<HTMLInputElement>) => {
        // console.log(e.code, "code!!")
        if(e.code === "Enter") {
            handleSearchNow()
        }
    }

    return (
        <div className='flex flex-col gap-y-4 justify-center items-center h-fit'>
            <h1 className='text-4xl'>Refine Your Searches Using These Filters</h1>
            {/* <h2>{filters.diet} ---- {filters.cuisineType} ----</h2> */}
            <div className='flex flex-col gap-y-4 justify-center items-center'>

                <input type="text" placeholder='search your recipe here by name....' className='w-full py-1 px-2 bg-transparent border-b-2' value={text} onChange={handleTextChange} onKeyDownCapture={handleEnterKeyPressed} />

                <Button className='bg-primary-focus text-primary hover:text-secondary' onClick={handleSearchNow}>Search Now</Button>
                
                <MultipleSelectableFilters handleFiltersChange={handleFiltersChange} />
                {/* <CategoriesRadioOptions handleFiltersChange={handleFiltersChange} />
                <CuisinesCheckboxes handleFiltersChange={handleFiltersChange} /> */}
            </div>
            {/* <Button onClick={handleSearchNow}>Search Now</Button> */}
            {/* <RecipesView recipes={mealsRecipes} /> */}
        </div>
    )
}

const ReusuableAccordionItem = ({ handleFiltersChange, trigText, propKey, data }: FilterChangeTypes & { trigText: string, propKey: string, data: string[] }) => {
    return (
        <AccordionItem value={propKey} className='min-w-[380px]'>
            <AccordionTrigger>{trigText}</AccordionTrigger>
            <AccordionContent>
                <RenderCheckboxTypes propKey={propKey as keyof FiltersTypes} data={data} title={trigText} handleFiltersChange={handleFiltersChange} />
            </AccordionContent>
        </AccordionItem>
    )
}

const MultipleSelectableFilters = ({ handleFiltersChange }: FilterChangeTypes) => {
    return (
        <Accordion type='multiple' className='columns-3 gap-2'>
            <ReusuableAccordionItem handleFiltersChange={handleFiltersChange} propKey='mealType' trigText='Meal Types' data={meals} />

            <ReusuableAccordionItem handleFiltersChange={handleFiltersChange} propKey='diet' trigText='Diet Types' data={diets} />

            <ReusuableAccordionItem handleFiltersChange={handleFiltersChange} propKey='dishType' trigText='Dish Types' data={dishes} />

            <ReusuableAccordionItem handleFiltersChange={handleFiltersChange} propKey='health' trigText='Health Lables' data={health} />

            <ReusuableAccordionItem handleFiltersChange={handleFiltersChange} propKey='cusineType' trigText='Cuisines Types' data={cuisines} />
        </Accordion>
    )
}

// const MultipleSelectableFilters = ({ handleFiltersChange }: FilterChangeTypes) => {
//     return (
//         <div
//         // className='grid grid-cols-2'
//         // className='columns-2xl gap-2'
//         >
//             <Accordion type='multiple' className='columns-2xl gap-2'>
//                 <ReusuableAccordionItem handleFiltersChange={handleFiltersChange} propKey='mealType' trigText='Meal Types' data={meals} />

//                 <ReusuableAccordionItem handleFiltersChange={handleFiltersChange} propKey='diet' trigText='Diet Types' data={diets} />

//                 <ReusuableAccordionItem handleFiltersChange={handleFiltersChange} propKey='dishType' trigText='Dish Types' data={dishes} />

//                 <ReusuableAccordionItem handleFiltersChange={handleFiltersChange} propKey='health' trigText='Health Lables' data={health} />

//                 <ReusuableAccordionItem handleFiltersChange={handleFiltersChange} propKey='cusineType' trigText='Cuisines Types' data={cuisines} />
//             </Accordion>

//             {/* <RenderCheckboxTypes propKey={"mealType"} data={meals} title='Meal Types' handleFiltersChange={handleFiltersChange} /> */}
//             {/* <RenderCheckboxTypes propKey={"diet"} data={diets} title='Diet Types' handleFiltersChange={handleFiltersChange} /> */}
//             {/* <RenderCheckboxTypes propKey={"dishType"} data={dishes} title='Dish Types' handleFiltersChange={handleFiltersChange} /> */}
//             {/* <RenderCheckboxTypes propKey={"health"} data={health} title='Health Labels' handleFiltersChange={handleFiltersChange} /> */}
//             {/* <RenderCheckboxTypes propKey={"cuisineType"} data={cuisines} title='Cuisines' handleFiltersChange={handleFiltersChange} /> */}
//         </div>
//     )
// }

type ReuseableCheckboxTypes = {
    data: string[], title: string, propKey: keyof FiltersTypes, handleFiltersChange: (d: string, k: string) => void
}

const RenderCheckboxTypes = ({ ...items }: ReuseableCheckboxTypes) => {
    const { data, handleFiltersChange, propKey, title } = items;

    const rendertypes = () => data.map(text => <RenderCheckbox key={text} name={text} handleFiltersChange={handleFiltersChange} propKey={propKey} />)

    return (
        <div className='my-2'>
            {/* <h2>{title}</h2> */}
            <div className='flex flex-wrap gap-4'>{rendertypes()}</div>
        </div>
    )

}

type FilterChangeTypes = {
    handleFiltersChange: (d: string, k: string) => void
}

type CheckboxTypes = {
    name: string,
    handleFiltersChange: (d: string, k: string) => void,
    propKey: keyof FiltersTypes
}

const RenderCheckbox = ({ name, handleFiltersChange, propKey }: CheckboxTypes) => {
    // console.log(name, propKey, "test!!")

    return (
        <Badge variant={'secondary'} className="flex space-x-2 px-4 py-1 min-w-fit h-8">
            {/* <Checkbox id={name} onClick={() => handleFiltersChange(name, "cuisines")} /> */}
            <Checkbox id={name} onClick={() => handleFiltersChange(name, propKey)} />

            {/* <Checkbox id={name} onClick={() => console.log("clicked")} /> */}
            {/* <input type="checkbox" id={name} onChange={e => console.log(e.target.value)} /> */}
            <label
                htmlFor={name}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                {name}
            </label>
        </Badge>
    )
}

export const diets = ["balanced", "high-fiber", "high-protein", "low-carb", "low-fat", "low-sodium"]

export const health = ["alcohol-free", "alchohol-cocktail", "celery-free", "crustacean-free", "dairy-free", "DASH", "egg-free", "fish-free", "fodmap-free", "gluten-free", "immuno-supportive", "keto-friendly", "kidney-friendly", "kosher", "low-fat-abs", "low-potassium", "low-sugar", "lupine-free", "Mediterranean", "mollusk-free", "mustard-free", "no-oil-added", "paleo", "peanut-free", "pescaterian", "pork-free", "red-meat-free", "sesame-free", "shellfish-free", "soy-free", "sugar-conscious", "sulfite-free", "tree-nut-free", "vegan", "vegetarian", "wheat-free"]

export const cuisines = ["American", "Asian", "British", "Caribbean", "Central europe", "chinese", "eastern europe", "french", "indian", "italian", "japanese", "kosher", "mediterranean", "mexican", "middle eastern", "nordic", "south-american", "south east asian"]

export const meals = ["Breakfast", "dinner", "lunch", "snack", "teatime"]

export const dishes = ["biscuits and cookies", "bread", "cereals", "condiments and sauces", "desserts", "drinks", "main course", "pan cake", "preps", "preserve", "salad", "sandwiches", "side dish", "soup", "starter", "sweets"]