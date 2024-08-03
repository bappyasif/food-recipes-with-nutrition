import { useForTruthToggle } from "@/hooks/forComponents"
import { RecipeMealType } from "@/types"
import { Badge } from "../ui/badge"
import styles from "./Recipe.module.css"
import Image from "next/image"
import { ellipsedText } from "./FewNonRelatedRecipes"
import { ShareInSocialMedias } from "../forUtilities/dragAndDrop/Bucket"
import { extractRecipeId, removeWrodRecipe } from "../forFilters/RecipesView"
import { useLocale } from "next-intl"

export const RecipeImage = ({ ...data }: RecipeMealType) => {
    const { images, label, uri, cuisineType, mealType, dishType, dietLabels } = data;

    const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

    const handleClick = () => {
        isTrue ? handleFalsy() : handleTruthy()
    }

    const locale = useLocale()

    const modifiers = (str:string, sym: string) => str.split(sym).join("_")

    const prepareHashtags = () => {
        const mealName = modifiers(label, " ")
        const dishName = modifiers(dishType[0], " ")
        const dietName = modifiers(dietLabels[0], " ")
        const foodType = modifiers(mealType[0], " ")
        const cusineName = modifiers(cuisineType[0], " ")
        
        return [mealName, dishName, dishName, dietName, foodType, cusineName]
    }

    const prepTitle = () => `Recipe : ${label}`

    const prepDescription = () => `Recipe For Making ${label} from "What's Cooking Yo!!"`

    return (
        <div
            className='relative xxs:w-full rounded flex flex-col gap-y-6 items-center'
            onClick={handleClick}
        >
            <h1 className='xxs:text-2xl md:text-3xl lg:text-4xl font-bold text-center'>{removeWrodRecipe(label)}</h1>

            <ShareInSocialMedias hashtags={prepareHashtags()} nestedRoute={`${locale}/recipe/${extractRecipeId(uri)}`} title={prepTitle()} description={prepDescription()} ready={!!uri} />

            <div title={isTrue ? "Back To Minimal View" : "Click To See More Info"} className="flex xxs:flex-col lg:flex-row xxs:justify-start lg:justify-center items-center">

                <SquareElem showIt={isTrue} data={data} />

                {/* smaller screen */}
                <Image
                    src={images?.LARGE?.url || images.REGULAR.url} height={images?.LARGE?.height || images.REGULAR.height} width={images?.LARGE?.width || images.REGULAR.width} alt={label}

                    className={`xxs:block lg:hidden transition-all duration-700 ${isTrue ? `h-[18.8rem] opacity-20 xxs:w-[13.2rem] xxs:ml-0 rotate-[360deg]` : `xxs:h-48 sm:h-64 translate-x-0 xxs:w-56 sm:w-80 lg:ml-4 -rotate-[360deg]`} z-20 rounded cursor-pointer ${!isTrue ? styles.borderSlick : ``} relative object-cover rounded-sm`}

                    blurDataURL={images?.LARGE?.url || images.REGULAR.url} 
                    placeholder='blur' loading='eager'
                />

                {/* bigger screen */}
                <Image
                    src={images?.LARGE?.url || images.REGULAR.url} 
                    height={images?.LARGE?.height || images.REGULAR.height} width={images?.LARGE?.width || images.REGULAR.width} alt={label}
                    
                    className={`xxs:hidden lg:block transition-all duration-700 ${isTrue ? `h-[18.4rem] w-[15.8rem] translate-x-[7.6rem] rotate-[360deg] rounded` : `h-96 lg:w-96 translate-x-2 rotate-[-360deg]`} z-20 rounded cursor-pointer ${!isTrue ? styles.borderSlick : ``} relative ml-0 object-cover rounded-sm aspect-square`}

                    blurDataURL={images?.LARGE?.url || images.REGULAR.url} 
                    placeholder='blur' loading='eager'
                />
            </div>

            {/* <ShareInSocialMedias hashtags={prepareHashtags()} nestedRoute={`${locale}/recipe/${extractRecipeId(uri)}`} title={prepTitle()} description={prepDescription()} ready={!!uri} /> */}
        </div>
    )
}

const SquareElem = ({ showIt, data }: { showIt: boolean, data: RecipeMealType }) => {
    const { calories, cautions, co2EmissionsClass, cuisineType, dietLabels, dishType, mealType, yield: servings, totalWeight } = data;

    return (
        <div 
            // className={`absolute transition-all duration-1000 ${showIt ? "bg-slate-400 h-fit xxs:w-fit lg:w-[32.1rem] rounded-sm" : `bg-slate-800 xxs:left-0 sm:left-[22%] xxs:h-0 sm:h-0 lg:h-[22rem] lg:w-[18rem] rounded-full ${styles.animateSpin} self-center`} xxs:pl-0 lg:pl-2`}

            className={`absolute transition-all duration-1000 ${showIt ? "bg-slate-400 h-fit xxs:w-fit lg:w-[32.1rem] rounded-sm" : `rounded-full`} xxs:pl-0 lg:pl-2`}
        >

            <div className={`grid grid-cols-1 justify-items-start transition-all duration-300 ${!showIt ? "-translate-y-20 opacity-0 scale-0" : "translate-y-0 opacity-100 scale-100"} py-2 z-10`}>

                <div className='flex flex-col gap-y-4 justify-between w-fit'>

                    <div className='flex flex-col gap-y-1'>
                        <Badge title={`Meal Type : ${mealType}`} className='xxs:text-sm lg:text-[0.9rem] font-light flex gap-x-6 justify-between bg-accent'><span>Meal Type</span> <span>{mealType}</span></Badge>
                        <Badge title={`Cautions : ${cautions[0]}`} className='xxs:text-sm lg:text-[0.9rem] font-light flex gap-x-6 justify-between bg-accent'><span>Cautions</span> <span>{cautions[0] || "None"}</span></Badge>
                        <Badge title={`Carbon Emissions Rating : ${co2EmissionsClass}`} className='xxs:text-sm lg:text-[0.9rem] font-light flex gap-x-6 justify-between bg-accent'><span>Carbon Emission Rating</span> <span>{co2EmissionsClass}</span></Badge>
                    </div>

                    <div className='flex flex-col gap-y-1'>
                        <ReusableBadge text='Diet' val={dietLabels[0]} />
                        <ReusableBadge text='Cuisine' val={cuisineType[0]} />
                        <ReusableBadge text='Dish' val={dishType[0]} />
                    </div>

                    <div className='flex flex-col gap-y-1'>
                        <ReusableBadge text='Yield' val={servings} />
                        <ReusableBadge text='Calories' val={calories.toFixed(2)} />
                        <ReusableBadge text='Weight' val={totalWeight.toFixed(2)} />
                    </div>
                </div>

            </div>
        </div>
    )
}

const ReusableBadge = ({ text, val }: { text: string, val: string | number }) => {
    return (
        <Badge title={`${text} : ${val}`} className='px-4 flex gap-x-4 w-fit justify-between xxs:text-sm lg:text-[0.9rem] font-light bg-accent'>
            <span>{text} </span><span>{ typeof val === "string" && val.length > 14 ? ellipsedText(val, 14) : val}</span>
        </Badge>
    )
}