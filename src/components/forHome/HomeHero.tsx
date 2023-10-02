import React from 'react'

// export const HomeHero = () => {
//     return (
//         <div 
//         className='w-2/4 mx-auto relative text-primary-foreground'
//         style={{
//             backgroundImage: "url('https://source.unsplash.com/random/200?food=1')",
//             backgroundSize: "cover",
//             height: "240px"
//         }}
//         >
//             {/* <img className='absolute h-[9rem] w-full rounded-xl object-cover -z-0' src="https://source.unsplash.com/random/200?food=1" alt="" /> */}
//             <div className="bg-white text-primary text-6xl font-bold w-full mix-blend-screen">NATURE</div>
            
//         </div>
//     )
// }


export const HomeHero = () => {
    return (
        <div 
            className='w-2/4 mx-auto relative text-primary-foreground h-[16.01rem]'
            // style={{
            //     backgroundImage: "url('https://source.unsplash.com/random/200?food=1')",
            //     backgroundSize: "cover",
            //     // height: "240px"
            // }}
        >
            <img className='absolute h-full w-full object-cover -z-0' src="https://source.unsplash.com/random/200?food=1" alt="" />
           
            <div className='w-full z-20 absolute'>
                <div className='grid grid-cols-3 place-items-center items-center h-[4rem]'>
                    <div className='h-full w-full rounded-s-xl rounded-xl bg-transparent flex justify-between'>
                        <span className='border border-primary-focus w-1/2'></span>
                        <span className='border border-primary-focus w-1/2'></span>
                    </div>
                    <h2 className='col-span-2 text-4xl font-extrabold h-full bg-primary-focus flex items-center w-full text-center pl-[.38rem]'>Make Cooking Adventurous</h2>
                </div>
                
                <div className='grid grid-cols-3 place-items-center items-center h-[4rem]'>
                    <h2 className='text-4xl font-extrabold h-full w-full bg-primary-focus flex items-center justify-center'>Healthy</h2>
                    <div className='col-span-2 h-full w-full bg-transparent flex justify-between'>
                        <span className='border border-x-primary-focus border-y-0 w-1/4'></span>
                        <span className='border border-x-primary-focus border-y-0 w-1/4'></span>
                        <span className='border border-x-primary-focus border-y-0 w-1/4'></span>
                        <span className='border border-x-primary-focus border-y-0 w-1/4'></span>
                    </div>
                </div>

                <div className='grid grid-cols-3 place-items-center items-center h-[4rem]'>
                    <div className='col-span-2 h-full w-full bg-transparent flex justify-between'>
                        <span className='border border-x-primary-focus border-y-primary-focus w-1/4'></span>
                        <span className='border border-x-primary-focus border-y-primary-focus w-1/4'></span>
                        <span className='border border-x-primary-focus border-y-primary-focus w-1/4'></span>
                        <span className='border border-x-primary-focus border-y-primary-focus w-1/4'></span>
                    </div>
                    <h2 className='text-4xl font-extrabold h-full w-full bg-primary-focus flex items-center justify-center'>Fun</h2>
                </div>

                <div className='grid grid-cols-3 place-items-center items-center h-[4rem]'>
                    <h2 className='text-4xl font-extrabold h-full w-full bg-primary-focus flex items-center justify-center col-span-2'>And Really Delicious</h2>
                    <div className='h-full w-full rounded-l-box bg-transparent flex justify-between'>
                        <span className='border border-primary-focus w-1/2'></span>
                        <span className='border border-primary-focus w-1/2'></span>
                    </div>
                </div>
            </div>
        </div>
    )
}

// export const HomeHero = () => {
//     return (
//         <div className='grid grid-rows-3 grid-cols-1 gap-0 w-2/4 mx-auto justify-items-center place-items-center relative text-primary-foreground'>
//             <img className='absolute h-[9rem] w-full rounded-xl object-cover z-0' src="https://source.unsplash.com/random/200?food=1" alt="" />
            
//             <div className='grid grid-cols-3 place-items-center items-center z-10 h-full'>
//                 {/* <img className='h-[110px] w-full rounded-xl object-cover' src="https://source.unsplash.com/random/200?food=1" alt="" /> */}
//                 <div className='h-full w-60 rounded-s-xl rounded-xl bg-transparent border'></div>
//                 <h2 className='col-span-2 text-4xl font-extrabold bg-primary h-full'>Make Cooking Adventurous</h2>
//             </div>
//             <div className='grid grid-cols-3 place-items-center items-center z-10 h-full'>
//                 <h2 className='col-span-2 text-4xl font-extrabold bg-primary h-full w-full'>Healthy Fun And</h2>
//                 <div className='h-full w-full rounded-s-xl rounded-r-2xl bg-transparent border'></div>
//                 {/* <img className='col-span-2 h-[110px] w-full rounded-s-xl rounded-r-2xl object-cover' src="https://source.unsplash.com/random/200?food=2" alt="" /> */}
//             </div>
//             <div className='grid grid-cols-3 place-items-center items-center z-10 h-full'>
//                 {/* <img className='col-span-2 h-[110px] w-full rounded-e-full object-cover' src="https://source.unsplash.com/random/200?food=3" alt="" /> */}
//                 <div className='col-span-2 h-full w-full rounded-e-full bg-transparent border'></div>
//                 <h2 className='text-4xl font-extrabold h-full bg-primary w-full'>Nutritious</h2>
//             </div>
//             {/* <img src="https://source.unsplash.com/random/200?food=1" alt="" />
//             <h2 className='col-span-2 text-6xl font-extrabold'>Get Cooking</h2> */}
//         </div>
//     )
// }
