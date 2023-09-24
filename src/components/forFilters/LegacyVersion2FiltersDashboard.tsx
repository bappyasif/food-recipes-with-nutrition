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
import { searchRecipesFromMultipleFiltersSelection } from '@/utils/axiosInterceptor'

export const FiltersDashboard = () => {
    const [filters, setFilters] = useState<FiltersTypes>({cuisineType: [], diet: [], dishType: [], health: [], mealType: [], q: ""})

    // const handleFiltersChange = (data: string, key: string) => {
    //     // console.log("cuisines!!", data)
    //     setFilters(prev => {
    //         if (key === "cuisines") {
    //             // console.log("cuisines!!", data)
    //             const found = prev.cuisines.findIndex(item => item === data);
    //             if (found !== -1) {
    //                 const filtered = prev.cuisines.filter(d => d !== data)
    //                 // console.log("cuisines!!", data, found)
    //                 return { ...prev, cuisines: filtered }
    //             } else {
    //                 const updatedList = prev.cuisines.concat(data)
    //                 return { ...prev, cuisines: updatedList }
    //             }
    //         } else {
    //             return { ...prev, category: data }
    //         }
    //     })
    // }

    const getFiltered = (data: string, key: string) => {
        let filtered = null;

        if(key === "cuisineType") {
            filtered = filters.cuisineType?.filter(item => !item.includes(data));
        } else if(key === "dishType") {
            filtered = filters.dishType?.filter(item => !item.includes(data));
        } else if(key === "mealType") {
            filtered = filters.mealType?.filter(item => !item.includes(data));
        } else if(key === "health") {
            filtered = filters.health?.filter(item => !item.includes(data));
        } else if(key === "diet") {
            filtered = filters.diet?.filter(item => !item.includes(data));
        }

        // console.log(filtered, filters)
        return filtered
    }

    const checkIfFound = (data:string, key: string) => {
        let found = null;
        if(key === "cuisineType") {
            found = filters.cuisineType?.findIndex(item => item === data);
            // console.log("in scope!!")
        } else if(key === "dishType") {
            found = filters.dishType?.findIndex(item => item === data);
        } else if(key === "mealType") {
            found = filters.mealType?.findIndex(item => item === data);
        } else if(key === "health") {
            found = filters.health?.findIndex(item => item === data);
        } else if(key === "diet") {
            found = filters.diet?.findIndex(item => item === data);
        }
        // console.log(found, "found!!")
        return found
    }

    const handleFiltersChange = (data: string, key: string) => {
        // console.log("cuisines!!", data)
        setFilters(prev => {
            let found = checkIfFound(data, key)
            // const found = prev.cuisineType?.findIndex(item => item === data);
            // const found = prev[key as keyof FiltersTypes]?.findIndex(item => item);

            // console.log(found, "found", prev.cuisineType?.findIndex(item => item.includes(data)))
            // if(found === undefined) {
            //     console.log("HERE")
            //     const updatedList = prev.cuisineType?.concat(data)
            //     console.log({ ...prev, [key]: updatedList }, "FKFKFKF", data, prev.cuisineType?.concat("test"))
            //     return { ...prev, [key]: updatedList }
            // }

            // console.log(prev[key as keyof FiltersTypes]?.includes(data), "WHTHTHTHHTH")

            // const foundRevised = prev[key as keyof FiltersTypes]?.includes(data)
            // if(foundRevised) {
            //     const foundIdx = prev[key as keyof FiltersTypes]?.indexOf(data)
            //     if(foundIdx === 0) {
            //         const newList = prev[key as keyof FiltersTypes]?.slice(foundIdx+1)
            //         console.log(prev[key as keyof FiltersTypes]?.slice(foundIdx+1), "IF")
            //     } else {
            //         const newList = prev[key as keyof FiltersTypes]?.slice(0,foundIdx)
            //         console.log(foundIdx, prev[key as keyof FiltersTypes]?.slice(0,foundIdx), prev, "ELSE")
            //     }
            // }
            
            if (found !== -1) {
                // const filtered = prev.cuisineType?.filter(d => d !== data)
                // console.log("cuisines!!", data, found)

                const filtered = getFiltered(data, key)
                // console.log({ ...prev, [key]: filtered }, ">!>!>!")
                return { ...prev, [key]: filtered }
            } else {
                // const updatedList = prev.cuisineType?.concat(data)
                const updatedList = prev[key as keyof FiltersTypes]?.concat(data)
                // console.log({ ...prev, [key]: updatedList }, "FKFKFKF")
                return { ...prev, [key]: updatedList }
                // return { ...prev, [`${key}[${prev[key as keyof FiltersTypes]?.length}]`]: updatedList }
            }
        })
    }

    /**
     * feedback from alpox
     * 
     * 
    const getFiltered = (data: string, key: FiltersTypes) => {
        if (!(key in filters)) return null;
        return filters[key].filter(item => !item.includes(data));
    }

    const handleFiltersChange = (data: string, key: FiltersTypes) => {
        setFilters(prev => {
            const filtered = getFiltered(data, key);
            return {
                ...prev,
                [key]: filtered.length
                    ? filtered
                    : prev[key].concat(data)
            }
        })
    }
     */

    const router = useRouter()

    // const params = useParams()
    // console.log(params, "poarmas!!")

    // const pathname = usePathname()
    // console.log(pathname)

    // const searchParams = useSearchParams()
    // console.log(searchParams.entries(), searchParams.get("q"), searchParams.values)

    const { mealsRecipes } = useForExtractingQueriesFromUrl()

    const testBreakoff = (target:string[], key:string) => {
        const fo:any = {}
        // filters.health?.forEach((item, idx) => fo[`health[${idx}]`] = item)
        target?.forEach((item, idx) => fo[`${key}[${idx}]`] = item)
        console.log(fo, "FOFO")
        return fo
    }

    // const handleSearchNow = () => {
    //     // const params = {
    //     //     type: "public",
    //     //     q: filters.q || "Beef",
    //     //     app_id: process.env.NEXT_PUBLIC_EDAMAM_APP_ID,
    //     //     app_key: process.env.NEXT_PUBLIC_EDAMAM_APP_KEY,
    //     //     health: filters.health?.length ? filters.health : "paleo",
    //     //     cuisineType: filters.cuisineType?.length ? filters.cuisineType : "American",
    //     //     mealType: filters.mealType?.length ? filters.mealType : "Lunch",
    //     //     dishType: filters.dishType?.length ? filters.dishType : "Main course"
    //     // }

    //     // const params = {
    //     //     type: "public",
    //     //     q: filters.q || "Beef",
    //     //     app_id: process.env.NEXT_PUBLIC_EDAMAM_APP_ID,
    //     //     app_key: process.env.NEXT_PUBLIC_EDAMAM_APP_KEY,
    //     //     health: filters.health?.length ? filters.health.join(",") : "paleo",
    //     //     cuisineType: filters.cuisineType?.length ? filters.cuisineType.join(",") : "American",
    //     //     mealType: filters.mealType?.length ? filters.mealType.join(",") : "Lunch",
    //     //     dishType: filters.dishType?.length ? filters.dishType.join(",") : "Main course"
    //     // }

    //     // router.push(`?type=public&q=beef`)

    //     // router.replace(`?type=public&q=beef&health=paleo`)

    //     // router.push(`?q=beefnot&health=paleo`, undefined)

    //     // router?.push(`type=public&q=beef`, undefined, {shallow: true})

    //     // console.log(params)

    //     let params = {
    //         type: "public",
    //         q: filters.q || "Beef",
    //         app_id: process.env.NEXT_PUBLIC_EDAMAM_APP_ID,
    //         app_key: process.env.NEXT_PUBLIC_EDAMAM_APP_KEY,
    //         "health[0]": filters.health?.length ? filters.health.join(",") : null,
    //         "cuisineType[0]": filters.cuisineType?.length ? filters.cuisineType.join(",") : null,
    //         "mealType[0]": filters.mealType?.length ? filters.mealType.join(",") : null,
    //         "dishType[0]": filters.dishType?.length ? filters.dishType.join(",") : null,
    //         "diet[0]": filters.diet
    //     }

    //     // const forDiet = testBreakoff(filters.diet || [], "diet")
    //     // const forHealth = testBreakoff(filters.health || [], "health")
    //     // const forMealType = testBreakoff(filters.mealType || [], "mealType")
    //     // const forDishType = testBreakoff(filters.dishType || [], "dishType")
    //     // const forCuisineType = testBreakoff(filters.cuisineType || [], "cuisineType")
    //     // params = {...params, ...forHealth}
    //     // params = {...params, ...forDiet}
    //     // params = {...params, ...forMealType}
    //     // params = {...params, ...forDishType}
    //     // params = {...params, ...forCuisineType}

    //     // params = {...params, ...forHealth, ...forDiet, ...forMealType, ...forDishType, ...forCuisineType}

    //     // console.log(params, "PRAMS")

    //     searchRecipes(params).then(d => console.log(d)).catch(err => console.log(err))
    // }

    const formatFilter = (arrSrc: string[], key: string) => arrSrc.map(item => `${key}=${item}`).join("&")

    const handleSearchNow = () => {
        let params = {
            type: "public",
            q: filters.q || "Beef",
            app_id: process.env.NEXT_PUBLIC_EDAMAM_APP_ID,
            app_key: process.env.NEXT_PUBLIC_EDAMAM_APP_KEY,
            "health[0]": filters.health?.length ? filters.health.join(",") : null,
            "cuisineType[0]": filters.cuisineType?.length ? filters.cuisineType.join(",") : null,
            "mealType[0]": filters.mealType?.length ? filters.mealType.join(",") : null,
            "dishType[0]": filters.dishType?.length ? filters.dishType.join(",") : null,
            "diet[0]": filters.diet
        }

        const filterStr = `type=public&q=Beef&app_id${process.env.NEXT_PUBLIC_EDAMAM_APP_ID}&app_key=${process.env.NEXT_PUBLIC_EDAMAM_APP_KEY}&${formatFilter(filters.health || [], "health")}&${formatFilter(filters.diet || [], "diet")}&${formatFilter(filters.cuisineType || [], "cuisineType")}&${formatFilter(filters.mealType || [], "mealType")}&${formatFilter(filters.dishType || [], "dishType")}`

        // console.log(filterStr, "HAPPENING!!")

        searchRecipesFromMultipleFiltersSelection(filterStr).then(d => console.log(d)).catch(err => console.log(err))

        // searchRecipes(params).then(d => console.log(d)).catch(err => console.log(err))
    }

    // console.log(filters, "FILTYERS")

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

// const RednerDietTypes = () => {
//     const options = ["balanced", "high-fiber", "high-protein", "low-carb", "low-fat", "low-sodium"]
// }

type FilterChangeTypes = {
    handleFiltersChange: (d: string, k: string) => void
}

// const CuisinesCheckboxes = ({ handleFiltersChange }: FilterChangeTypes) => {
//     const cuisines = useAppSelector(state => state.cuisines.list)
//     const renderCheckboxes = () => cuisines.map(item => <RenderCheckbox name={item.strArea} key={item.strArea} handleFiltersChange={handleFiltersChange}  />)

//     return (
//         <div className='h-fit w-1/2'>
//             <h2>Cuisines - to choose from</h2>
//             <div className='flex flex-wrap gap-4'>
//                 {renderCheckboxes()}
//             </div>
//         </div>
//     )
// }

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


// const CategoriesRadioOptions = ({ handleFiltersChange }: FilterChangeTypes) => {
//     const categories = useAppSelector(state => state.categories.list)
//     const renderCategories = () => categories.map(item => <RenderRadioItem name={item.strCategory} key={item.strCategory} />)

//     return (
//         <div className='h-20 w-1/3'>
//             <h2>Categories Options</h2>
//             <RadioGroup className='flex flex-wrap' defaultValue='Beef' onValueChange={d => handleFiltersChange(d, "category")}>
//                 {renderCategories()}
//             </RadioGroup>
//         </div>
//     )
// }

// const RenderRadioItem = ({ name }: { name: string }) => {
//     return (
//         <Badge variant={"secondary"} className="flex items-center space-x-2 px-4 py-1">
//             <RadioGroupItem value={name} id={name} onChange={e => console.log(e.target)} />
//             <Label htmlFor={name}>{name}</Label>
//         </Badge>
//     )
// }

const diets = ["balanced", "high-fiber", "high-protein", "low-carb", "low-fat", "low-sodium"]

const health = ["alcohol-free", "alchohol-cocktail", "celery-free", "crustacean-free", "dairy-free", "DASH", "egg-free", "fish-free", "fodmap-free", "gluten-free", "immuno-supportive", "keto-friendly", "kidney-friendly", "kosher", "low-fat-abs", "low-potassium", "low-sugar", "lupine-free", "mediterranean", "mollusk-free", "mustard-free", "no-oil-added", "paleo", "peanut-free", "pescaterian", "pork-free", "red-meat-free", "sesame-free", "shellfish-free", "soy-free", "sugar-conscious", "sulfite-free", "tree-nut-free", "vegan", "vegetarian", "wheat-free"]

const cuisines = ["American", "Asian", "British", "Caribbean", "Central europe", "chinese", "eastern europe", "french", "indian", "italian", "japanese", "kosher", "mediterranean", "mexican", "middle eastern", "nordic", "south-american", "south east asian", "bengali"]

const meals = ["Breakfast", "dinner", "lunch", "snack", "teatime"]

const dishes = ["biscuits and cookies", "bread", "cereals", "condiments and sauces", "desserts", "drinks", "main course", "pan cake", "preps", "preserve", "salad", "sandwiches", "side dish", "soup", "starter", "sweets"]