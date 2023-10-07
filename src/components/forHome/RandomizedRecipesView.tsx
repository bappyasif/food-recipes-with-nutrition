import { RecipeMealType } from '@/types'
import React from 'react'
import { ReusableModal, extractRecipeId } from '../forFilters/RecipesView'
import { Badge } from '../ui/badge'
import Link from 'next/link'
import { ellipsedText } from '../forRecipe/FewNonRelatedRecipes'

export const RandomizedRecipesView = ({ recipes }: { recipes: RecipeMealType[] }) => {
    const renderRecipes = () => recipes.map(item => <RenderRecipeItem key={item.uri} data={item} />)

    return (
        <div className='font-bold text-xl'>
            <Badge className='bg-success-content hover:bg-accent-content text-primary-content my-2'>{recipes.length ? `Recipes Found - ${recipes.length}` : "Recipes will show here when ready, Click To Find Recipes...."}</Badge>
            {
                recipes.length
                    ? <ReusableModal title='Randomly Chosen Recipes Based On Chosen Filters' triggerText='Click To View' changeWidth={true}>
                        {/* <DialogDescription className='text-primary flex flex-col gap-y-4'>
                            
                        </DialogDescription> */}
                        <div className='grid grid-cols-3 h-[650px] justify-items-center place-items-center gap-4 overflow-y-scroll scroll-smooth'>
                            {renderRecipes()}
                        </div>
                    </ReusableModal>
                    : null
            }
        </div>
    )
}

// const ReusableModal = ({ children, triggerText, title }: { children: any, triggerText: string, title: string }) => {
//     return (
//         <Dialog>
//             {/* <DialogTitle>{props.title}</DialogTitle>
//             <DialogHeader>{props.title}</DialogHeader> */}
//             <DialogTrigger><Badge variant={'secondary'} className='w-full'>{triggerText}</Badge></DialogTrigger>
//             <DialogContent className='bg-primary-focus CONTENT'
//                 style={{ minWidth: "80%" }}
//             >
//                 <DialogHeader>
//                     <DialogTitle className='text-primary-content'>{title}</DialogTitle>

//                     {children}
//                 </DialogHeader>
//             </DialogContent>
//         </Dialog>
//     )
// }

const RenderRecipeItem = ({ data }: { data: RecipeMealType }) => {
    const { uri, label, calories, images, mealType, co2EmissionsClass } = data;
    const { LARGE, REGULAR, SMALL } = images;
    return (
        <div className='flex flex-col gap-y-2 justify-center items-center w-56'>
            <Link href={`/recipe/${extractRecipeId(uri)}`} className='flex flex-col gap-y-2' title={label}>
                <h2>{label.length > 13 ? ellipsedText(label, 13) : label}</h2>
                <img src={REGULAR.url} height={REGULAR.height} width={REGULAR.width} alt={label} className='w-56 h-48 rounded-sm' />
            </Link>
            
            <div className='flex flex-col gap-y-1.5'>
                <RenderReusableBadgeItem text={`${calories.toFixed(2)}`} title='Calories' />
                <RenderReusableBadgeItem title='Meal Type' text={mealType[0]} />
                <RenderReusableBadgeItem title='CO2 Emission Rating' text={co2EmissionsClass} />
            </div>
        </div>
    )
}

const RenderReusableBadgeItem = ({ title, text }: { title: string, text: string }) => {
    return (
        <Badge className='flex justify-around gap-x-4'>
            <span>{title}</span>
            <span>{text}</span>
        </Badge>
    )
}