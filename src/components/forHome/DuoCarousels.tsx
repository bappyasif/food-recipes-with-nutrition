"use client"

import { CategoriesCuisinesCarouselType, ReuseableCarouselType } from '@/types'
import Image from 'next/image'
import React from 'react'

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

    const renderItems = () => items.map(item => <ReusableCarouselCard key={item.name} name={item.name} picture={item.picture} />)

    return (
        <div>
            <h2>{title}</h2>
            <div
                className='flex flex-col gap-y-4 h-48 overflow-y-scroll'
            >{renderItems()}</div>
        </div>
    )
}

const ReusableCarouselCard = ({ ...item }: CategoriesCuisinesCarouselType) => {
    const { name, picture } = item;

    return (
        <div>
            <Image
                className='w-32 h-20 object-cover'
                // fill={true}
                placeholder='blur'
                blurDataURL={picture}
                loading='lazy'
                width={80}
                height={50}
                alt={`${name}`}
                src={picture}
            />
            <p>{name}</p>
        </div>
    )
}

const categories = [
    { name: "vegetables", picture: "https://source.unsplash.com/random/200?vegetables" },
    { name: "beef", picture: "https://source.unsplash.com/random/200?beef" },
    { name: "chicken", picture: "https://source.unsplash.com/random/200?chicken" },
    { name: "fish", picture: "https://source.unsplash.com/random/200?fish" },
    { name: "duck", picture: "https://source.unsplash.com/random/200?duck" },
    { name: "seafood", picture: "https://source.unsplash.com/random/200?seafood" }
]

const cuisines = [
    { name: "american", picture: "https://source.unsplash.com/random/200?cuisine,american" },
    { name: "british", picture: "https://source.unsplash.com/random/200?cuisine,british" },
    { name: "chinese", picture: "https://source.unsplash.com/random/200?cuisine,chinese" },
    { name: "french", picture: "https://source.unsplash.com/random/200?cuisine,french" },
    { name: "italian", picture: "https://source.unsplash.com/random/200?cuisine,italian" },
    { name: "jamaican", picture: "https://source.unsplash.com/random/200?cuisine,jamaican" },
]


/**
 * 
 * 
 // const CuisinesCarousel = () => {

//     const renderItems = () => cuisines.map(item => <ReusableCarouselCard key={item.name} name={item.name} picture={item.picture} />)

//     return (
//         <div>
//             <h2>Cuisines</h2>
//             <div className='flex flex-col gap-y-4 h-48 overflow-y-scroll'>{renderItems()}</div>
//         </div>
//     )
// }

// const CategoriesCarousel = () => {
//     const renderItems = () => categories.map(item => <ReusableCarouselCard key={item.name} name={item.name} picture={item.picture} />)

//     return (
//         <div>
//             <h2>Categories</h2>
//             <div
//                 className='flex flex-col gap-y-4 h-48 overflow-clip'
//             >{renderItems()}</div>
//         </div>
//     )
// }
 */