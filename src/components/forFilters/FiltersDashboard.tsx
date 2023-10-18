"use client"

import React, { KeyboardEvent, useEffect, useState } from 'react'
import { Checkbox } from '../ui/checkbox'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { useForInputTextChange } from '@/hooks/forComponents'
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
                if (filters[k as keyof FiltersTypes]?.length) {
                    filtered = (filters[k as keyof FiltersTypes] as string[]).filter(item => !item.includes(data));
                }
            }
        }

        // console.log(filtered, "filtered!!")
        return filtered
    }

    const checkIfFound = (data: string, key: string) => {
        let found = null;

        for (let k in filters) {
            if (filters[k as keyof FiltersTypes] as FiltersTypes) {
                if (k === "q") { }

                if (k === key) {
                    found = (filters[k as keyof FiltersTypes] as string[])?.findIndex(item => item === data)
                }
            }
        }

        return found
    }

    const handleFiltersChange = (data: string, key: string) => {
        setFilters(prev => {
            if (key === "q" && data) {
                return { ...prev, q: data }
            } else {
                let found = checkIfFound(data, key)

                if (found !== -1) {
                    const filtered = getFiltered(data, key)
                    // console.log({ ...prev, [key]: filtered }, ">!>!>!")
                    return { ...prev, [key]: filtered }
                } else {
                    const updatedList = prev[key as keyof FiltersTypes]?.concat(data)
                    return { ...prev, [key]: updatedList }
                }
            }
        })
    }

    const router = useRouter()

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

        axios.get("https://api.edamam.com/api/recipes/v2", { params }).then(d => {
            const onlyRecipes = d.data?.hits.map((item: any) => item.recipe)
            
            const readyForRendering = onlyRecipes.map((item:any) => item.mealType.length && item.dishType.length && item.dietLabels.length && item).filter((item:any) => item).filter((v:any, idx:number, self:any) => idx === self.findIndex((t:any) => t.label === v.label))

            readyForRendering?.length && handleRecipesFound(readyForRendering)
        }).catch(err => console.log(err))

        querifyFilters();
    }

    const { handleTextChange, text } = useForInputTextChange()

    useEffect(() => {
        text && handleFiltersChange(text, "q")
    }, [text])

    // console.log(filters, text)

    const handleEnterKeyPressed = (e:KeyboardEvent<HTMLInputElement>) => {
        if(e.code === "Enter") {
            handleSearchNow()
        }
    }

    return (
        <div className='flex flex-col gap-y-4 justify-center items-center h-fit'>
            <h1 className='xxs:text-lg sm:text-xl md:text-2xl xl:text-4xl font-bold'>Refine Your Searches Using These Filters</h1>

            <div className='flex flex-col gap-y-4 justify-center items-center'>

                <input type="text" placeholder='search your recipe here by name....' className='w-full py-1 px-2 bg-transparent border-b-2' value={text} onChange={handleTextChange} onKeyDownCapture={handleEnterKeyPressed} />

                <Button className='bg-primary text-muted font-bold xxs:text-sm lg:text-lg hover:text-secondary' onClick={handleSearchNow}>Search Now</Button>
                
                <MultipleSelectableFilters handleFiltersChange={handleFiltersChange} />
            </div>
        </div>
    )
}

const ReusuableAccordionItem = ({ handleFiltersChange, trigText, propKey, data }: FilterChangeTypes & { trigText: string, propKey: string, data: string[] }) => {
    return (
        <AccordionItem value={propKey} className='min-w-[380px]'>
            <AccordionTrigger className='text-lg font-semibold'>{trigText}</AccordionTrigger>
            <AccordionContent>
                <RenderCheckboxTypes propKey={propKey as keyof FiltersTypes} data={data} title={trigText} handleFiltersChange={handleFiltersChange} />
            </AccordionContent>
        </AccordionItem>
    )
}

const MultipleSelectableFilters = ({ handleFiltersChange }: FilterChangeTypes) => {
    return (
        <Accordion type='multiple' className='xxs:columns-1 md:columns-2 xl:columns-3 gap-2 bg-popover'>
            <ReusuableAccordionItem handleFiltersChange={handleFiltersChange} propKey='mealType' trigText='Meal Types' data={meals} />

            <ReusuableAccordionItem handleFiltersChange={handleFiltersChange} propKey='diet' trigText='Diet Types' data={diets} />

            <ReusuableAccordionItem handleFiltersChange={handleFiltersChange} propKey='dishType' trigText='Dish Types' data={dishes} />

            <ReusuableAccordionItem handleFiltersChange={handleFiltersChange} propKey='health' trigText='Health Lables' data={health} />

            <ReusuableAccordionItem handleFiltersChange={handleFiltersChange} propKey='cuisineType' trigText='Cuisines Types' data={cuisines} />
        </Accordion>
    )
}

type ReuseableCheckboxTypes = {
    data: string[], title: string, propKey: keyof FiltersTypes, handleFiltersChange: (d: string, k: string) => void
}

const RenderCheckboxTypes = ({ ...items }: ReuseableCheckboxTypes) => {
    const { data, handleFiltersChange, propKey, title } = items;

    const rendertypes = () => data.map(text => <RenderCheckbox key={text} name={text} handleFiltersChange={handleFiltersChange} propKey={propKey} />)

    return (
        <div className='my-2'>
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
    return (
        <Badge variant={'secondary'} className="flex space-x-2 py-1 min-w-fit h-8">
            <Checkbox id={name} onClick={() => handleFiltersChange(name, propKey)} />
            <label
                htmlFor={name}
                className="text-sm w-full font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                {name}
            </label>
        </Badge>
    )
}

export const diets = ["balanced", "high-fiber", "high-protein", "low-carb", "low-fat", "low-sodium"]

export const health = ["alcohol-free", "alchohol-cocktail", "celery-free", "crustacean-free", "dairy-free", "DASH", "egg-free", "fish-free", "fodmap-free", "gluten-free", "immuno-supportive", "keto-friendly", "kidney-friendly", "kosher", "low-fat-abs", "low-potassium", "low-sugar", "lupine-free", "Mediterranean", "mollusk-free", "mustard-free", "no-oil-added", "paleo", "peanut-free", "pescaterian", "pork-free", "red-meat-free", "sesame-free", "shellfish-free", "soy-free", "sugar-conscious", "sulfite-free", "tree-nut-free", "vegan", "vegetarian", "wheat-free"]

export const cuisines = ["American", "Asian", "British", "Caribbean", "Central Europe", "Chinese", "Eastern Europe", "French", "Indian", "Italian", "Japanese", "Kosher", "Mediterranean", "Mexican", "Middle eastern", "Nordic", "South American", "South East Asian"]

export const meals = ["Breakfast", "Dinner", "Lunch", "Snack", "Teatime"]

export const dishes = ["Biscuits and Cookies", "Bread", "Cereals", "Condiments and Sauces", "Desserts", "Drinks", "Main Course", "Pancake", "Preps", "Preserve", "Salad", "Sandwiches", "Side Dish", "Soup", "Starter", "Sweets"]