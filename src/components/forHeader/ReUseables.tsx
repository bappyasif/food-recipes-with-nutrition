import { useLocale } from "next-intl"
import Link from "next/link"
import { extractRecipeId } from "../forFilters/RecipesView"
import { RecipeMealType } from "@/types"
import { ellipsedText } from "../forRecipe/FewNonRelatedRecipes"

export const ShowAllFoundRecipes = ({ showDropdown, handleFalsyForFocused, recipes, forModal }: { showDropdown: boolean, handleFalsyForFocused: () => void, recipes: RecipeMealType[], forModal?: boolean }) => {
    const locale = useLocale()

    const renderRecipes = () => recipes.map(item => {
        const { label, uri, cuisineType, mealType } = item
        return (
            <Link
                href={`/${locale}/recipe/${extractRecipeId(uri)}`}
                key={uri}
                className='grid grid-cols-3 gap-1 text-primary justify-between p-1 xxs:px-1.5 lg:px-2.5 hover:bg-background'
                title={`Click to see in detail: ${label}`}
                onClick={handleFalsyForFocused}
            >
                <span className="xxs:hidden xl:block text-lg col-span-2">{label.length > 27 ? ellipsedText(label, 27) : label}</span>
                <span className="xxs:block xl:hidden col-span-2">{label.length > 20 ? ellipsedText(label, 20) : label}</span>
                <span className="capitalize text-right">{cuisineType[0]}</span>
            </Link>
        )
    })

    return (
        <div className={`absolute w-full ${forModal ? "top-20" : "top-8"} right-0 flex flex-col gap-y-0 ${recipes?.length && showDropdown ? "max-h-[11rem]" : "h-0"} overflow-y-scroll no-scrollbar z-50 bg-card rounded-b-xl`}>
            {recipes?.length && showDropdown ? renderRecipes() : null}
        </div>
    )
}