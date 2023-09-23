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

export const FiltersDashboard = () => {
    const [filters, setFilters] = useState<{ category: string, cuisines: string[] }>({ category: "", cuisines: [] })

    const handleFiltersChange = (data: string, key: string) => {
        // console.log("cuisines!!", data)
        setFilters(prev => {
            if (key === "cuisines") {
                // console.log("cuisines!!", data)
                const found = prev.cuisines.findIndex(item => item === data);
                if (found !== -1) {
                    const filtered = prev.cuisines.filter(d => d !== data)
                    // console.log("cuisines!!", data, found)
                    return { ...prev, cuisines: filtered }
                } else {
                    const updatedList = prev.cuisines.concat(data)
                    return { ...prev, cuisines: updatedList }
                }
            } else {
                return { ...prev, category: data }
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

    const {mealsRecipes} = useForExtractingQueriesFromUrl()

    const handleSearchNow = () => {
        const params = {
            type: "public",
            q: "Beef",
            app_id: process.env.NEXT_PUBLIC_EDAMAM_APP_ID,
            app_key: process.env.NEXT_PUBLIC_EDAMAM_APP_KEY,
            health: "paleo",
            cuisineType: "American",
            mealType: "Lunch",
            dishType: "Main course"
        }

        // router.push(`?type=public&q=beef`)

        // router.replace(`?type=public&q=beef&health=paleo`)

        router.push(`?q=beefnot&health=paleo`, undefined)

        // router?.push(`type=public&q=beef`, undefined, {shallow: true})

        // console.log(params)

        searchRecipes(params).then(d => console.log(d)).catch(err => console.log(err))
    }

    return (
        <div>
            <h1>FiltersDashboard</h1>
            <h2>{filters.category} ---- {filters.cuisines} ---- {mealsRecipes?.length}</h2>
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
            <RenderCheckboxTypes propKey={"diet"}  data={diets} title='Diet Types' handleFiltersChange={handleFiltersChange} />
            <RenderCheckboxTypes propKey={"dishType"}  data={dishes} title='Dish Types' handleFiltersChange={handleFiltersChange} />
            <RenderCheckboxTypes propKey={"health"}  data={health} title='Health Labels' handleFiltersChange={handleFiltersChange} />
            <RenderCheckboxTypes propKey={"cuisineType"}  data={cuisines} title='Cuisines' handleFiltersChange={handleFiltersChange} />
        </div>
    )
}

type ReuseableCheckboxTypes = {
    data: string[], title: string, propKey: string, handleFiltersChange: (d: string, k: string) => void   
}

const RenderCheckboxTypes = ({...items}: ReuseableCheckboxTypes) => {
    const {data, handleFiltersChange, propKey, title} = items;

    const rendertypes = () => data.map(text => <RenderCheckbox key={text} name={text} handleFiltersChange={handleFiltersChange} propKey={propKey}  />)

    return (
        <div>
            <h2>{title}</h2>
            <div className='flex flex-wrap gap-4'>{rendertypes()}</div>
        </div>
    )

}

const RednerDietTypes = () => {
    const options = ["balanced", "high-fiber", "high-protein", "low-carb", "low-fat", "low-sodium"]
}

type FilterChangeTypes = {
    handleFiltersChange: (d: string, k: string) => void
}

const CuisinesCheckboxes = ({ handleFiltersChange }: FilterChangeTypes) => {
    const cuisines = useAppSelector(state => state.cuisines.list)
    const renderCheckboxes = () => cuisines.map(item => <RenderCheckbox name={item.strArea} key={item.strArea} handleFiltersChange={handleFiltersChange} propKey='' />)

    return (
        <div className='h-fit w-1/2'>
            <h2>Cuisines - to choose from</h2>
            <div className='flex flex-wrap gap-4'>
                {renderCheckboxes()}
            </div>
        </div>
    )
}

type CheckboxTypes = {
    name: string,
    handleFiltersChange: (d: string, k: string) => void,
    propKey: string
}

const RenderCheckbox = ({ name, handleFiltersChange, propKey }: CheckboxTypes) => {
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


const CategoriesRadioOptions = ({ handleFiltersChange }: FilterChangeTypes) => {
    const categories = useAppSelector(state => state.categories.list)
    const renderCategories = () => categories.map(item => <RenderRadioItem name={item.strCategory} key={item.strCategory} />)

    return (
        <div className='h-20 w-1/3'>
            <h2>Categories Options</h2>
            <RadioGroup className='flex flex-wrap' defaultValue='Beef' onValueChange={d => handleFiltersChange(d, "category")}>
                {renderCategories()}
            </RadioGroup>
        </div>
    )
}

const RenderRadioItem = ({ name }: { name: string }) => {
    return (
        <Badge variant={"secondary"} className="flex items-center space-x-2 px-4 py-1">
            <RadioGroupItem value={name} id={name} onChange={e => console.log(e.target)} />
            <Label htmlFor={name}>{name}</Label>
        </Badge>
    )
}

const diets = ["balanced", "high-fiber", "high-protein", "low-carb", "low-fat", "low-sodium"]

const health = ["alcohol-free", "alchohol-cocktail", "celery-free", "crustacean-free", "dairy-free", "DASH", "egg-free", "fish-free", "fodmap-free", "gluten-free", "immuno-supportive", "keto-friendly", "kidney-friendly", "kosher", "low-fat-abs", "low-potassium", "low-sugar", "lupine-free", "mediterranean", "mollusk-free", "mustard-free", "no-oil-added", "paleo", "peanut-free", "pescaterian", "pork-free", "red-meat-free", "sesame-free", "shellfish-free", "soy-free", "sugar-conscious", "sulfite-free", "tree-nut-free", "vegan", "vegetarian", "wheat-free"]

const cuisines = ["American", "Asian", "British", "Caribbean", "Central europe", "chinese", "eastern europe", "french", "indian", "italian", "japanese", "kosher", "mediterranean", "mexican", "middle eastern", "nordic", "south-american", "south east asian", "bengali"]

const meals = ["Breakfast", "dinner", "lunch", "snack", "teatime"]

const dishes = ["biscuits and cookies", "bread", "cereals", "condiments and sauces", "desserts", "drinks", "main course", "pan cake", "preps", "preserve", "salad", "sandwiches", "side dish", "soup", "starter", "sweets"]