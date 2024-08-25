import { useForInputTextChange, useForOutsideClick, useForSearchFetchRecipesFromApi, useForTruthToggle } from '@/hooks/forComponents';
import { RecipeMealType } from '@/types';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
import { extractRecipeId } from '../forFilters/RecipesView';
import { ellipsedText } from '../forRecipe/FewNonRelatedRecipes';
import { Button } from '../ui/button';
import { RiSearchLine } from 'react-icons/ri';
import { searchRecipes } from '@/utils/dataFetching';
import { ShowAllFoundRecipes } from './ReUseables';

export const Search = ({clicked}: {clicked: boolean}) => {
    const { handleTextChange, text } = useForInputTextChange();

    const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle();

    const { handleFalsy: handleFalsyForFocused, handleTruthy: handleTruthyForFocused, isTrue: forFocused } = useForTruthToggle()

    useEffect(() => {
        handleFalsy()
    }, [text])

    const ref = useRef<HTMLDivElement>(null)

    useForOutsideClick(ref, handleFalsyForFocused)

    // const [recipes, setRecipes] = useState<RecipeMealType[]>([])

    // const fetchRecipesFromApi = () => {
    //     const params = {
    //         app_id: process.env.NEXT_PUBLIC_EDAMAM_APP_ID,
    //         app_key: process.env.NEXT_PUBLIC_EDAMAM_APP_KEY,
    //         q: text,
    //         random: true,
    //         type: "public",
    //     }

    //     fetchAndUpdateData(params, setRecipes, () => handleFalsy())
    // }

    // useEffect(() => {
    //     !text && setRecipes([])

    //     isTrue && text.length >= 2 && fetchRecipesFromApi()
    // }, [text, isTrue])

    const {recipes, fetchRecipesFromApi, handleEnterPressed} = useForSearchFetchRecipesFromApi(text, handleFalsy, isTrue, handleTruthy)

    // const handleEnterPressed = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //     if (e.key === "Enter") {
    //         handleTruthy()
    //         text.length >= 2 && fetchRecipesFromApi()

    //         if (text.length < 2) {
    //             alert("at least use two or more letters")
    //         }
    //     }
    // }

    // const { handleFalsy: clickedFalsy, handleTruthy: clickedTruthy, isTrue: clicked } = useForTruthToggle()



    return (
        <div
            className='relative xxs:w-fit flex items-end xs:text-xs sm:text-sm lg:text-xl h-fit self-end pb-0.5'
            ref={ref}
        >
            <input
                className="xxs:hidden xs:block xs:w-64 md:w-72 lg:w-96 2xl:w-[29rem] h-full rounded-sm xxs:pl-1.5 lg:pl-1.5 text-muted-foreground bg-transparent border-0 border-b-2 border-b-accent placeholder:text-content xs:text-sm md:text-lg lg:text-xl focus:outline-none pb-0.5"
                type="text" placeholder='search recipes by name'
                value={text} onChange={handleTextChange} onFocus={handleTruthyForFocused}
                onKeyUp={handleEnterPressed}
            />
            <Button
                onClick={handleTruthy}
                variant={"ghost"}
                title="Click To Search Now"
                disabled={isTrue && text.length >= 2}
                className={`absolute xxs:hidden xs:inline-flex right-0.5 xs:bottom-1.5 xs:h-4 lg:h-6 ${isTrue && text.length >= 2 ? "bg-secondary" : "bg-background/80"} text-muted hover:text-muted hover:bg-card font-semibold xxs:text-xs md:text-lg lg:text-xl xs:px-1.5 md:px-4`}
            >
                <RiSearchLine />
            </Button>

            {
                !clicked
                    ? <ShowAllFoundRecipes
                        showDropdown={forFocused} handleFalsyForFocused={handleFalsyForFocused} recipes={recipes} />
                    : null
            }
        </div>
    )
}

// const ShowAllFoundRecipes = ({ showDropdown, handleFalsyForFocused, recipes, forModal }: { showDropdown: boolean, handleFalsyForFocused: () => void, recipes: RecipeMealType[], forModal?: boolean }) => {
//     const locale = useLocale()

//     const renderRecipes = () => recipes.map(item => {
//         const { label, uri, cuisineType, mealType } = item
//         return (
//             <Link
//                 href={`/${locale}/recipe/${extractRecipeId(uri)}`}
//                 key={uri}
//                 className='grid grid-cols-3 gap-1 text-primary justify-between p-1 xxs:px-1.5 lg:px-2.5 hover:bg-background'
//                 title={`Click to see in detail: ${label}`}
//                 onClick={handleFalsyForFocused}
//             >
//                 <span className="text-lg col-span-2">{label.length > 27 ? ellipsedText(label, 27) : label}</span>
//                 <span className="capitalize text-right">{cuisineType[0]}</span>
//             </Link>
//         )
//     })

//     return (
//         <div className={`absolute w-full ${forModal ? "top-12" : "top-8"} right-0 flex flex-col gap-y-0 ${recipes?.length && showDropdown ? "max-h-[11rem]" : "h-0"} overflow-y-scroll no-scrollbar z-50 bg-card rounded-b-xl`}>
//             {recipes?.length && showDropdown ? renderRecipes() : null}
//         </div>
//     )
// }

// export const fetchAndUpdateData = (params: any, setRecipes: any, reset: () => void) => {
//     searchRecipes(params).then(d => {
//         const onlyRecipes = d?.hits.map((item: any) => item.recipe)

//         const readyForRendering = onlyRecipes?.map((item: any) => item?.mealType?.length && item?.dishType?.length && item?.dietLabels?.length && item).filter((item: any) => item).filter((v: any, idx: number, self: any) => idx === self.findIndex((t: any) => t.label === v.label)) || []

//         readyForRendering?.length && setRecipes(readyForRendering)

//         !readyForRendering?.length && alert("Sorry, nothing is found to display for this search term, please try again, thank you :)")

//     }).catch(err => console.log(err))
//         .finally(reset)
// }