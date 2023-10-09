"use client"

import { CategoriesCuisinesCarouselType, FiltersTypes, ReuseableCarouselType } from '@/types'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { CarouselVertical } from './CarouselVertical'
import { Button } from '../ui/button'
import { cuisines, dishes } from '../forFilters/FiltersDashboard'
import { useForQuerifiedParams } from '@/hooks/forComponents'

export const DuoCarousels = () => {
    const newDishes = dishes.map(name => ({name: name, picture: `https://source.unsplash.com/random/200?meal=${name.split(" ").join("")}`}))

    const newCuisines = cuisines.map(name => ({name: name, picture: `https://source.unsplash.com/random/200?cuisine=${name.split(" ").join("")}`}))

    // https://source.unsplash.com/random/200?sig=1

    // console.log(newCuisines, "cuisines")

    return (
        <div className='flex gap-4'>
            <ReusableCarousel title='Dishes' items={newDishes} />
            <ReusableCarousel title='Cuisines' items={newCuisines} />
        </div>
    )
}

export const ReusableCarousel = ({ ...item }: ReuseableCarouselType) => {
    const {items, title} = item;

    return (
        <div className='flex flex-col gap-y-4 justify-center items-center'>
            <h2 className='text-xl font-bold'>{title}</h2>
            <CarouselVertical items={items} title={title} />
        </div>
    )
}

export const ReusableCarouselCard = ({carouselType, ...item }: CategoriesCuisinesCarouselType & {carouselType: string}) => {
    const { name, picture } = item;

    const [params, setParams] = useState<FiltersTypes>({})

    // const params:FiltersTypes = {
    //     // mealType: mealType,
    //     // diet: diet.toLocaleLowerCase(),
    //     // dishType: dishType,
    //     // random: true,
    //     // type: "public",
    //     // app_id: process.env.NEXT_PUBLIC_EDAMAM_APP_ID,
    //     // app_key: process.env.NEXT_PUBLIC_EDAMAM_APP_KEY
    // }

    const prepareForDataFetching = () => {
        if(carouselType === "Dishes") {
            // params.dishType = [name]
            setParams(prev => ({dishType: [name]}))
        } else {
            // params.mealType = [name]
            setParams(prev => ({cuisineType: [name]}))
        }

        console.log(params, "params!!")
    }

    const {querifyFilters} = useForQuerifiedParams(params)

    useEffect(() => {
        (params.cuisineType || params.dishType) ? querifyFilters() : null
    }, [params])

    return (
        <Button variant={'link'} onClick={prepareForDataFetching} className='flex flex-col-reverse gap-x-4 p-1 justify-center items-center h-16 transition-all duration-500 hover:scale-110 -z-0'>
            <Image
                className='w-44 h-11 object-cover relative'
                // fill={true}
                placeholder='blur'
                blurDataURL={picture}
                loading='lazy'
                width={80}
                height={50}
                alt={`${name}`}
                src={picture}
            />
            <p className='absolute bg-muted-foreground text-muted px-2 capitalize opacity-80 text-sm'>{name}</p>
        </Button>
    )
}

export const categories = [
    { name: "vegetables", picture: "https://source.unsplash.com/random/200?vegetables" },
    { name: "beef", picture: "https://source.unsplash.com/random/200?beef" },
    { name: "chicken", picture: "https://source.unsplash.com/random/200?chicken" },
    { name: "fish", picture: "https://source.unsplash.com/random/200?fish" },
    { name: "duck", picture: "https://source.unsplash.com/random/200?duck" },
    { name: "seafood", picture: "https://source.unsplash.com/random/200?seafood" },
    { name: "pork", picture: "https://source.unsplash.com/random/200?pork" },
    { name: "eggs", picture: "https://source.unsplash.com/random/200?egg" },
    { name: "dairy", picture: "https://source.unsplash.com/random/200?dairy" },
    { name: "lentils", picture: "https://source.unsplash.com/random/200?lentils" }
]

// export const cuisines = [
//     { name: "american", picture: "https://source.unsplash.com/random/200?cuisine,american" },
//     { name: "british", picture: "https://source.unsplash.com/random/200?cuisine,british" },
//     { name: "chinese", picture: "https://source.unsplash.com/random/200?cuisine,chinese" },
//     { name: "french", picture: "https://source.unsplash.com/random/200?cuisine,french" },
//     { name: "italian", picture: "https://source.unsplash.com/random/200?cuisine,italian" },
//     { name: "jamaican", picture: "https://source.unsplash.com/random/200?cuisine,jamaican" },
//     { name: "bengali", picture: "https://source.unsplash.com/random/200?cuisine,bengali" },
//     { name: "indian", picture: "https://source.unsplash.com/random/200?cuisine,indian" },
//     { name: "african", picture: "https://source.unsplash.com/random/200?cuisine,african" },
//     { name: "japanese", picture: "https://source.unsplash.com/random/200?cuisine,japanese" },
// ]