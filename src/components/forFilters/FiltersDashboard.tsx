"use client"

import { useAppSelector } from '@/hooks/forRedux'
import React, { useState } from 'react'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'
import { Checkbox } from '../ui/checkbox'
import { Button } from '../ui/button'
import { searchRecipes } from '@/utils/dataFetching'
// import { useRouter } from 'next/router'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useForExtractingQueriesFromUrl } from '@/hooks/forComponents'
import { RecipesView } from './RecipesView'
import { Badge } from '../ui/badge'
import { FiltersTypes } from '@/types'
import axios from 'axios'

type FiltersDashboardPropsType = {
    handleRecipesFound: (d: any) => void
}

export const FiltersDashboard = ({ handleRecipesFound }: FiltersDashboardPropsType) => {
    const [filters, setFilters] = useState<FiltersTypes>({ cuisineType: [], diet: [], dishType: [], health: [], mealType: [], q: "" })

    const getFiltered = (data: string, key: string) => {
        let filtered = null;

        // for(let k in filters) {
        //     if(k === "q") return
            
        //     if(filters[k as keyof FiltersTypes]?.length) {
                
        //     }
        // }

        if (key === "cuisineType") {
            filtered = filters.cuisineType?.filter(item => !item.includes(data));
        } else if (key === "dishType") {
            filtered = filters.dishType?.filter(item => !item.includes(data));
        } else if (key === "mealType") {
            filtered = filters.mealType?.filter(item => !item.includes(data));
        } else if (key === "health") {
            filtered = filters.health?.filter(item => !item.includes(data));
        } else if (key === "diet") {
            filtered = filters.diet?.filter(item => !item.includes(data));
        }

        // console.log(filtered, filters)
        return filtered
    }

    const checkIfFound = (data: string, key: string) => {
        let found = null;
        // posible solution in this
        // for (let k in filters) {
        //     if (filters[k as keyof FiltersTypes] as FiltersTypes) {
        //         if (k === "q") return

        //         if (k === key) {
        //             found = (filters[k as keyof FiltersTypes] as string[]).findIndex(item => item === data)
        //         }
        //     }
        // }

        // trying bruteforce
        if (key === "cuisineType") {
            found = filters.cuisineType?.findIndex(item => item === data);
            // console.log("in scope!!")
        } else if (key === "dishType") {
            found = filters.dishType?.findIndex(item => item === data);
        } else if (key === "mealType") {
            found = filters.mealType?.findIndex(item => item === data);
        } else if (key === "health") {
            found = filters.health?.findIndex(item => item === data);
        } else if (key === "diet") {
            found = filters.diet?.findIndex(item => item === data);
        }
        // console.log(found, "found!!")
        return found
    }

    const handleFiltersChange = (data: string, key: string) => {
        // console.log("cuisines!!", data)
        setFilters(prev => {
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
        })
    }

    const router = useRouter()

    // const params = useParams()
    // console.log(params, "poarmas!!")

    // const pathname = usePathname()
    // console.log(pathname)

    // const searchParams = useSearchParams()
    // console.log(searchParams.entries(), searchParams.get("q"), searchParams.values)

    const { mealsRecipes } = useForExtractingQueriesFromUrl()

    const appendParam = (params: URLSearchParams, arrSrc: string[], propKey: string) => {
        arrSrc.forEach(item => params.append(`${propKey}`, `${item}`))
    }

    const querifyFilters = () => {
        let str = "?";
        const querified = (items: string[], propKey: string) => items.forEach(item => str += `${propKey}=${item}&`)
        for (let k in filters) {
            if (filters[k as keyof FiltersTypes]?.length) {
                querified(filters[k as keyof FiltersTypes] as string[], k)
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
        filters.health?.length && appendParam(params, filters.health!, "health")
        filters.diet?.length && appendParam(params, filters.diet!, "diet")
        filters.cuisineType?.length && appendParam(params, filters.cuisineType!, "cuisineType")
        filters.mealType?.length && appendParam(params, filters.mealType!, "mealType")
        filters.dishType?.length && appendParam(params, filters.dishType!, "dishType")
        params.append("q", "beef")
        // params.append("health", `${filters.health![0]}`)
        // params.append("health", `${filters.health![1]}`)
        axios.get("https://api.edamam.com/api/recipes/v2", { params }).then(d => {
            console.log(d.data)
            const onlyRecipes = d.data?.hits.map((item: any) => item.recipe)
            onlyRecipes?.length && handleRecipesFound(onlyRecipes)
        }).catch(err => console.log(err))

        querifyFilters();

        // router.push(`?q=beefnot&health=paleo`, undefined)

        // console.log(params.entries())

        // searchRecipes({params: params.entries()}).then(d => console.log(d)).catch(err => console.log(err))
    }

    console.log(filters)

    return (
        <div>
            <h1>FiltersDashboard</h1>
            <h2>{filters.diet} ---- {filters.cuisineType} ---- {mealsRecipes?.length}</h2>
            <div className='flex justify-center gap-x-6'>
                <MultipleSelectableFilters handleFiltersChange={handleFiltersChange} />
                {/* <CategoriesRadioOptions handleFiltersChange={handleFiltersChange} />
                <CuisinesCheckboxes handleFiltersChange={handleFiltersChange} /> */}
            </div>
            <Button onClick={handleSearchNow}>Search Now</Button>
            {/* <RecipesView recipes={mealsRecipes} /> */}
        </div>
    )
}

const MultipleSelectableFilters = ({ handleFiltersChange }: FilterChangeTypes) => {
    return (
        <div className='grid grid-cols-2'>
            <RenderCheckboxTypes propKey={"mealType"} data={meals} title='Meal Types' handleFiltersChange={handleFiltersChange} />
            <RenderCheckboxTypes propKey={"diet"} data={diets} title='Diet Types' handleFiltersChange={handleFiltersChange} />
            <RenderCheckboxTypes propKey={"dishType"} data={dishes} title='Dish Types' handleFiltersChange={handleFiltersChange} />
            <RenderCheckboxTypes propKey={"health"} data={health} title='Health Labels' handleFiltersChange={handleFiltersChange} />
            <RenderCheckboxTypes propKey={"cuisineType"} data={cuisines} title='Cuisines' handleFiltersChange={handleFiltersChange} />
        </div>
    )
}

type ReuseableCheckboxTypes = {
    data: string[], title: string, propKey: keyof FiltersTypes, handleFiltersChange: (d: string, k: string) => void
}

const RenderCheckboxTypes = ({ ...items }: ReuseableCheckboxTypes) => {
    const { data, handleFiltersChange, propKey, title } = items;

    const rendertypes = () => data.map(text => <RenderCheckbox key={text} name={text} handleFiltersChange={handleFiltersChange} propKey={propKey} />)

    return (
        <div>
            <h2>{title}</h2>
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
        <Badge variant={'secondary'} className="flex space-x-2 px-4 py-1">
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

const diets = ["balanced", "high-fiber", "high-protein", "low-carb", "low-fat", "low-sodium"]

const health = ["alcohol-free", "alchohol-cocktail", "celery-free", "crustacean-free", "dairy-free", "DASH", "egg-free", "fish-free", "fodmap-free", "gluten-free", "immuno-supportive", "keto-friendly", "kidney-friendly", "kosher", "low-fat-abs", "low-potassium", "low-sugar", "lupine-free", "mediterranean", "mollusk-free", "mustard-free", "no-oil-added", "paleo", "peanut-free", "pescaterian", "pork-free", "red-meat-free", "sesame-free", "shellfish-free", "soy-free", "sugar-conscious", "sulfite-free", "tree-nut-free", "vegan", "vegetarian", "wheat-free"]

const cuisines = ["American", "Asian", "British", "Caribbean", "Central europe", "chinese", "eastern europe", "french", "indian", "italian", "japanese", "kosher", "mediterranean", "mexican", "middle eastern", "nordic", "south-american", "south east asian", "bengali"]

const meals = ["Breakfast", "dinner", "lunch", "snack", "teatime"]

const dishes = ["biscuits and cookies", "bread", "cereals", "condiments and sauces", "desserts", "drinks", "main course", "pan cake", "preps", "preserve", "salad", "sandwiches", "side dish", "soup", "starter", "sweets"]