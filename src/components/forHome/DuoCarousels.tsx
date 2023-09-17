"use client"

import { CategoriesCuisinesCarouselType, ReuseableCarouselType } from '@/types'
import Image from 'next/image'
import React from 'react'
import { CarouselVertical } from './CarouselVertical'
import { Button } from '../ui/button'

export const DuoCarousels = () => {
    return (
        <div className='flex gap-4'>
            <ReusableCarousel title='Categories' items={categories} />
            <ReusableCarousel title='Cuisines' items={cuisines} />
        </div>
    )
}

const ReusableCarousel = ({ ...item }: ReuseableCarouselType) => {
    const {items, title} = item;

    return (
        <div className='flex flex-col gap-y-4 justify-center items-center'>
            <h2 className='text-xl'>{title}</h2>
            <CarouselVertical items={items} />
        </div>
    )
}

export const ReusableCarouselCard = ({ ...item }: CategoriesCuisinesCarouselType) => {
    const { name, picture } = item;

    return (
        <Button variant={'link'} className='flex flex-col-reverse text-primary-content gap-x-4 p-1 justify-center items-center h-16 text-primary-foreground transition-all duration-500 hover:scale-110 hover:bg-primary-focus'>
            <Image
                className='w-28 h-16 object-cover relative'
                // fill={true}
                placeholder='blur'
                blurDataURL={picture}
                loading='lazy'
                width={80}
                height={50}
                alt={`${name}`}
                src={picture}
            />
            <p className='absolute bg-secondary-focus px-4 capitalize opacity-80'>{name}</p>
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

export const cuisines = [
    { name: "american", picture: "https://source.unsplash.com/random/200?cuisine,american" },
    { name: "british", picture: "https://source.unsplash.com/random/200?cuisine,british" },
    { name: "chinese", picture: "https://source.unsplash.com/random/200?cuisine,chinese" },
    { name: "french", picture: "https://source.unsplash.com/random/200?cuisine,french" },
    { name: "italian", picture: "https://source.unsplash.com/random/200?cuisine,italian" },
    { name: "jamaican", picture: "https://source.unsplash.com/random/200?cuisine,jamaican" },
    { name: "bengali", picture: "https://source.unsplash.com/random/200?cuisine,bengali" },
    { name: "indian", picture: "https://source.unsplash.com/random/200?cuisine,indian" },
    { name: "african", picture: "https://source.unsplash.com/random/200?cuisine,african" },
    { name: "japanese", picture: "https://source.unsplash.com/random/200?cuisine,japanese" },
]