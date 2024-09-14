import { ReactNode, useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { useForInputTextChange, useForSearchFetchRecipesFromApi, useForTruthToggle } from "@/hooks/forComponents";
import { searchRecipes } from "@/utils/dataFetching";
import { RecipeMealType } from "@/types";
import { Button } from "../ui/button";
import { RiSearchLine } from "react-icons/ri";
import Link from "next/link";
import { extractRecipeId } from "../forFilters/RecipesView";
import { useLocale } from "next-intl";
import { ellipsedText } from "../forRecipe/FewNonRelatedRecipes";
import { ShowAllFoundRecipes } from "./ReUseables";

export const SearchModal = ({ ButtonElem, clickedFalsy }: { ButtonElem: ReactNode, clickedFalsy: () => void }) => {
    const { handleTextChange, text } = useForInputTextChange();

    const { handleFalsy: handleFalsyForFocused, handleTruthy: handleTruthyForFocused, isTrue: forFocused } = useForTruthToggle()

    const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle();

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

    const {fetchRecipesFromApi, recipes, handleEnterPressed} = useForSearchFetchRecipesFromApi(text, handleFalsy, isTrue, handleTruthy)

    // const handleEnterPressed = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //     if (e.key === "Enter") {
    //         handleTruthy()
    //         text.length >= 2 && fetchRecipesFromApi()

    //         if (text.length < 2) {
    //             alert("at least use two or more letters")
    //         }
    //     }
    // }

    return (
        <Dialog modal onOpenChange={clickedFalsy}>
            <DialogTrigger asChild>
                {ButtonElem}
            </DialogTrigger>
            <DialogContent>
                <div className="flex gap-x-4 items-end relative my-8">
                    <input
                        className="xxs:block xs:hidden xxs:w-full h-full rounded-sm xxs:pl-1.5 bg-transparent text-secondary border-0 border-b-2 border-b-accent placeholder:text-secondary/80 xxs:text-sm focus:outline-none pb-0.5"
                        type="text" placeholder='search recipes by name'
                        value={text} onChange={handleTextChange} onFocus={handleTruthyForFocused}
                        onKeyUp={handleEnterPressed}
                    />
                    <Button
                        onClick={() => {
                            handleTruthy()
                            // clickedTruthy()
                        }}
                        variant={"ghost"}
                        title="Click To Search Now"
                        disabled={isTrue && text.length >= 2}
                        className={`absolute xxs:inline-flex xs:hidden right-0.5 xxs:bottom-1 h-full ${isTrue && text.length >= 2 ? "bg-accent" : "bg-accent/80"} text-muted hover:text-muted hover:bg-accent/60 font-semibold xxs:text-sm`}
                    >
                        <RiSearchLine size={20} />
                    </Button>
                </div>
                <ShowAllFoundRecipes
                    showDropdown={forFocused} handleFalsyForFocused={handleFalsyForFocused} recipes={recipes} forModal={true} />
            </DialogContent>
        </Dialog>
    )
}

// export const fetchAndUpdateData = (params: any, setRecipes: any, reset: () => void) => {
//     searchRecipes(params).then(d => {
//         const onlyRecipes = d?.hits.map((item: any) => item.recipe)

//         const readyForRendering = onlyRecipes?.map((item: any) => item?.mealType?.length && item?.dishType?.length && item?.dietLabels?.length && item).filter((item: any) => item).filter((v: any, idx: number, self: any) => idx === self.findIndex((t: any) => t.label === v.label)) || []

//         readyForRendering?.length && setRecipes(readyForRendering)

//         !readyForRendering?.length && alert("Sorry, nothing is found to display for this search term, please try again, thank you :)")

//     }).catch(err => console.log(err))
//         .finally(reset)
// }

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
//         <div className={`absolute w-full ${forModal ? "top-20" : "top-8"} right-0 flex flex-col gap-y-0 ${recipes?.length && showDropdown ? "max-h-[11rem]" : "h-0"} overflow-y-scroll no-scrollbar z-50 bg-card rounded-b-xl`}>
//             {recipes?.length && showDropdown ? renderRecipes() : null}
//         </div>
//     )
// }