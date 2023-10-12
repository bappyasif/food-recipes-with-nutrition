import { useForTruthToggle } from "@/hooks/forComponents"
import { RecipeMealType } from "@/types"
import { Badge } from "../ui/badge"
import styles from "./Recipe.module.css"

export const RecipeImage = ({ ...data }: RecipeMealType) => {
    const { images, label } = data;

    const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

    const handleClick = () => {
        isTrue ? handleFalsy() : handleTruthy()
    }

    return (
        <div
            className='relative xxs:w-full md:w-2/3 lg:w-1/3 rounded flex flex-col gap-y-6 items-center'
            onClick={handleClick}
        >
            <h1 className='xxs:text-2xl md:text-3xl lg:text-4xl font-bold'>{label}</h1>

            <div title="Click To See More Info" className="flex xxs:flex-col lg:flex-row xxs:justify-start lg:justify-center items-start h-full">

                <SquareElem showIt={isTrue} data={data} />

                {/* smaller screen */}
                <img className={`xxs:block lg:hidden transition-all duration-700 ${isTrue ? `h-[23.4rem] opacity-20 xxs:w-full sm:w-64 xxs:ml-0 rotate-180` : `h-64 translate-x-0 xxs:w-56 lg:w-64 lg:ml-4 -rotate-180`} z-20 rounded cursor-pointer ${!isTrue ? styles.borderSlick : ``} relative object-cover`} src={images?.LARGE?.url || images.REGULAR.url} height={images?.LARGE?.height || images.REGULAR.height} width={images?.LARGE?.width || images.REGULAR.width} alt={label} />

                {/* bigger screen */}
                <img className={`xxs:hidden lg:block transition-all duration-700 ${isTrue ? `h-[23.4rem] translate-x-32 rotate-[360deg]` : `h-64 translate-x-0 rotate-[-360deg]`} xxs:w-10 lg:w-64 z-20 rounded cursor-pointer ${!isTrue ? styles.borderSlick : ``} relative ml-4 object-cover`} src={images?.LARGE?.url || images.REGULAR.url} height={images?.LARGE?.height || images.REGULAR.height} width={images?.LARGE?.width || images.REGULAR.width} alt={label} />
            </div>
        </div>
    )
}

const SquareElem = ({ showIt, data }: { showIt: boolean, data: RecipeMealType }) => {
    const { calories, cautions, co2EmissionsClass, cuisineType, dietLabels, dishType, mealType, yield: servings, totalWeight } = data;

    return (
        <div className={`absolute transition-all duration-1000 ${showIt ? "bg-slate-400 h-fit xxs:w-fit lg:w-[650px]" : `bg-slate-800 xxs:left-0 sm:left-[24%] h-64 xxs:w-[16rem] lg:w-[18.6rem] rounded-full ${styles.animateSpin} self-center`} xxs:pl-0 lg:pl-2`}>

            <div className={`grid grid-cols-1 justify-items-start transition-all duration-700 ${!showIt ? "-translate-y-20 opacity-0 scale-0" : "translate-y-0 opacity-100 scale-100"} py-2 z-10`}>
                
                <div className='flex flex-col gap-y-4 justify-between'>
                    
                    <div className='flex flex-col gap-y-1'>
                        <Badge className='text-lg flex gap justify-between bg-accent'><span>Meal Type</span> <span>{mealType}</span></Badge>
                        <Badge className='text-lg flex gap justify-between bg-accent'><span>Cautions</span> <span>{cautions[0] || "None"}</span></Badge>
                        <Badge className='text-lg flex gap justify-between bg-accent'><span>Carbon Emission Rating</span> <span>{co2EmissionsClass}</span></Badge>
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
        <Badge className='px-4 flex gap-x-4 w-64 justify-between text-xl bg-accent'><span>{text} </span>{val}</Badge>
    )
}