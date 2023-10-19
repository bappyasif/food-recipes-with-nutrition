"use client"

import { CategoriesCuisinesCarouselType, FiltersTypes, ReuseableCarouselType } from '@/types'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { CarouselVertical } from './CarouselVertical'
import { Button } from '../ui/button'
import { cuisines, dishes } from '../forFilters/FiltersDashboard'
import { useForQuerifiedParams } from '@/hooks/forComponents'
import { useTranslations } from 'use-intl';

export const DuoCarousels = () => {
    const newDishes = dishes.map(name => ({ name: name, picture: `https://source.unsplash.com/random/200?meal=${name.split(" ").join("")}` }))

    const newCuisines = cuisines.map(name => ({ name: name, picture: `https://source.unsplash.com/random/200?cuisine=${name.split(" ").join("")}` }))

    return (
        <div className='flex gap-4'>
            <ReusableCarousel title='Dish' items={newDishes} />
            <ReusableCarousel title='Cuisine' items={newCuisines} />
        </div>
    )
}

export const ReusableCarousel = ({ ...item }: ReuseableCarouselType) => {
    const { items, title } = item;

    const newDishes = dishes.map(name => ({ name: name, picture: `https://source.unsplash.com/random/200?meal=${name.split(" ").join("")}` }))

    const newCuisines = cuisines.map(name => ({ name: name, picture: `https://source.unsplash.com/random/200?cuisine=${name.split(" ").join("")}` }))

    const t = useTranslations("default")

    return (
        <div className='flex flex-col gap-y-4 justify-center items-center'>
            <h2 className='text-xl font-bold'>{t(`${title}`)}</h2>
            {/* <CarouselVertical items={items} title={title} /> */}
            <CarouselVertical items={title === "Dish" ? newDishes : newCuisines} title={title} />
        </div>
    )
}

export const ReusableCarouselCard = ({ carouselType, ...item }: CategoriesCuisinesCarouselType & { carouselType: string }) => {
    const { name, picture } = item;

    const [params, setParams] = useState<FiltersTypes>({})

    const prepareForDataFetching = () => {
        if (carouselType === "Dishes") {
            setParams(prev => ({ dishType: [name] }))
        } else {
            setParams(prev => ({ cuisineType: [name] }))
        }

        // console.log(params, "params!!")
    }

    const { querifyFilters } = useForQuerifiedParams(params, true)

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