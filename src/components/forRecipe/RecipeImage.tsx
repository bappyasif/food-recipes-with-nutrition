import { useForTruthToggle } from "@/hooks/forComponents"
import star from "../../../public/vercel.svg"
import Image from 'next/image'
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
            className='relative w-1/2 rounded flex flex-col gap-y-6 items-center'
            onClick={handleClick}
        >
            <h1 className='text-4xl'>{label}</h1>

            {/* <SquareElem showIt={isTrue} data={data} /> */}

            <div title="Click To See More Info" className="flex justify-center items-start h-full">

                <SquareElem showIt={isTrue} data={data} />

                <img className={`transition-all duration-700 ${isTrue ? "h-[23.4rem] translate-x-32" : "h-64 translate-x-0 w-64"} z-20 rounded cursor-pointer ${!isTrue ? styles.borderSlick : ""} relative`} src={images?.LARGE?.url || images.REGULAR.url} height={images?.LARGE?.height || images.REGULAR.height} width={images?.LARGE?.width || images.REGULAR.width} alt={label} />

                <CircleElem stopIt={!isTrue} />
            </div>
        </div>
    )
}

const SquareElem = ({ showIt, data }: { showIt: boolean, data: RecipeMealType }) => {
    const { calories, cautions, co2EmissionsClass, cuisineType, dietLabels, dishType, mealType, yield: servings, totalWeight } = data;

    return (
        <div className={`absolute rounded-xl transition-all duration-1000 ${showIt ? "bg-slate-400 h-fit w-[650px]" : "bg-slate-800 h-40 w-36"} pl-2`}>

            <div className={`grid grid-cols-1 justify-items-start transition-all duration-700 ${!showIt ? "-translate-y-20 opacity-0 scale-0" : "translate-y-0 opacity-100 scale-100"} py-2`}>
                <div className='flex flex-col gap-y-4 justify-between'>
                    <div className='flex flex-col gap-y-1'>
                        <Badge className='text-lg flex gap justify-between'><span>Meal Type</span> <span>{mealType}</span></Badge>
                        <Badge className='text-lg flex gap justify-between'><span>Cautions</span> <span>{cautions[0]}</span></Badge>
                        <Badge className='text-lg flex gap justify-between'><span>Carbon Emission Rating</span> <span>{co2EmissionsClass}</span></Badge>
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
        <Badge className='px-4 flex gap-x-4 w-64 justify-between text-xl'><span>{text} </span>{val}</Badge>
    )
}

const CircleElem = ({ stopIt }: { stopIt: boolean }) => {
    return (
        <div className={`absolute h-64 w-72 transition-all duration-1000 ${stopIt ? `bg-slate-400 ${styles.animateSpin} opacity-100` : "bg-slate-400 -z-10"} rounded-full opacity-0`}></div>
    )
}

{/* <Image
                    className={`transition-all duration-700 ${isTrue ? "h-96 translate-x-32" : "h-52 translate-x-0"} z-10`}
                    src={star}
                    alt='star png'
                    width={265}
                    height={265}
                /> */}


{/* <div 
                    // className="w-48 relative bg-slate-600 h-60"
                    className={`${styles.box}`}
                >
                    
                    <span className={`${styles.animateBorder}`}>
                    </span>

                    <span className={`${styles.animateBorder}`}>
                    </span>

                    <span className={`${styles.animateBorder}`}>
                    </span>

                    <span className={`${styles.animateBorder}`}>
                    </span>
                </div> */}