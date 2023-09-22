"use client"

import { useAppSelector } from '@/hooks/forRedux'
import React, { useState } from 'react'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'
import { Checkbox } from '../ui/checkbox'

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

    return (
        <div>
            <h1>FiltersDashboard</h1>
            <h2>{filters.category} ---- {filters.cuisines}</h2>
            <div className='flex justify-center gap-x-6'>
                <CategoriesRadioOptions handleFiltersChange={handleFiltersChange} />
                <CuisinesCheckboxes handleFiltersChange={handleFiltersChange} />
            </div>
        </div>
    )
}

type FilterChangeTypes = {
    handleFiltersChange: (d: string, k: string) => void
}

const CuisinesCheckboxes = ({ handleFiltersChange }: FilterChangeTypes) => {
    const cuisines = useAppSelector(state => state.cuisines.list)
    const renderCheckboxes = () => cuisines.map(item => <RenderCheckbox name={item.strArea} key={item.strArea} handleFiltersChange={handleFiltersChange} />)

    return (
        <div>
            <h2>Cuisines - to choose from</h2>
            <div>
                {renderCheckboxes()}
            </div>
        </div>
    )
}

type CheckboxTypes = {
    name: string,
    handleFiltersChange: (d: string, k: string) => void
}

const RenderCheckbox = ({ name, handleFiltersChange }: CheckboxTypes) => {
    return (
        <div className="items-top flex space-x-2">
            <Checkbox id={name} onClick={() => handleFiltersChange(name, "cuisines")} />

            {/* <Checkbox id={name} onClick={() => console.log("clicked")} /> */}
            {/* <input type="checkbox" id={name} onChange={e => console.log(e.target.value)} /> */}
            <label
                htmlFor={name}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                {name}
            </label>
        </div>
    )
}


const CategoriesRadioOptions = ({ handleFiltersChange }: FilterChangeTypes) => {
    const categories = useAppSelector(state => state.categories.list)
    const renderCategories = () => categories.map(item => <RenderRadioItem name={item.strCategory} key={item.strCategory} />)

    return (
        <div>
            <h2>Categories Options</h2>
            <RadioGroup defaultValue='Beef' onValueChange={d => handleFiltersChange(d, "category")}>
                {renderCategories()}
            </RadioGroup>
        </div>
    )
}

const RenderRadioItem = ({ name }: { name: string }) => {
    return (
        <div className="flex items-center space-x-2">
            <RadioGroupItem value={name} id={name} onChange={e => console.log(e.target)} />
            <Label htmlFor={name}>{name}</Label>
        </div>
    )
}