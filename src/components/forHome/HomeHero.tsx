import React from 'react'

export const HomeHero = () => {
    return (
        <div className='grid grid-rows-3 grid-cols-1 gap-8'>
            <div className='grid grid-cols-3 place-items-center items-center'>
                <img className='h-[110px] w-full rounded-xl object-cover' src="https://source.unsplash.com/random/200?food=1" alt="" />
                <h2 className='col-span-2 text-7xl font-extrabold'>Make Cooking Adventurous</h2>
            </div>
            <div className='grid grid-cols-3 place-items-center items-center'>
                <h2 className='text-6xl font-extrabold'>Healthy Fun</h2>
                <img className='col-span-2 h-[110px] w-full rounded-s-xl rounded-r-2xl object-cover' src="https://source.unsplash.com/random/200?food=2" alt="" />
            </div>
            <div className='grid grid-cols-3 place-items-center items-center'>
                <img className='col-span-2 h-[110px] w-full rounded-e-full object-cover' src="https://source.unsplash.com/random/200?food=3" alt="" />
                <h2 className='text-6xl font-extrabold'>And Nutritious</h2>
            </div>
            {/* <img src="https://source.unsplash.com/random/200?food=1" alt="" />
            <h2 className='col-span-2 text-6xl font-extrabold'>Get Cooking</h2> */}
        </div>
    )
}
