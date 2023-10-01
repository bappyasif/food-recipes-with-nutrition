import React from 'react'

export const HomeHero = () => {
    return (
        <div className='grid grid-rows-3 grid-cols-1 gap-8 w-1/2 mx-auto justify-items-center place-items-center relative text-primary-foreground'>
            {/* <img className='absolute h-[29rem] w-full rounded-xl object-cover z-0' src="https://source.unsplash.com/random/200?food=1" alt="" /> */}
            
            <div className='grid grid-cols-3 place-items-center items-center z-10 h-full'>
                <img className='h-[110px] w-full rounded-xl object-cover' src="https://source.unsplash.com/random/200?food=1" alt="" />
                {/* <div className='col-span-2 h-full w-full rounded-s-xl rounded-xl bg-transparent'></div> */}
                <h2 className='col-span-2 text-4xl font-extrabold bg-primary h-full'>Make Cooking Adventurous</h2>
            </div>
            <div className='grid grid-cols-3 place-items-center items-center z-10 h-full'>
                <h2 className='text-4xl font-extrabold bg-primary h-full'>Healthy Fun</h2>
                {/* <div className='col-span-2 h-full w-full rounded-s-xl rounded-r-2xl bg-transparent'></div> */}
                <img className='col-span-2 h-[110px] w-full rounded-s-xl rounded-r-2xl object-cover' src="https://source.unsplash.com/random/200?food=2" alt="" />
            </div>
            <div className='grid grid-cols-3 place-items-center items-center z-10 h-full'>
                <img className='col-span-2 h-[110px] w-full rounded-e-full object-cover' src="https://source.unsplash.com/random/200?food=3" alt="" />
                {/* <div className='col-span-2 h-full w-full rounded-e-full bg-transparent'></div> */}
                <h2 className='text-4xl font-extrabold h-full'>And Nutritious</h2>
            </div>
            {/* <img src="https://source.unsplash.com/random/200?food=1" alt="" />
            <h2 className='col-span-2 text-6xl font-extrabold'>Get Cooking</h2> */}
        </div>
    )
}
