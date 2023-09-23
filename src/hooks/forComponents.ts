import { RecipeMealType, ShallowRoutingTypes } from "@/types";
import { searchRecipes } from "@/utils/dataFetching";
import { useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

export const useForPauseAndPlayMealScroll = () => {
    const [seconds, setSeconds] = useState(30);
    const [pause, setPause] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!pause) { //I used '!paused' because I set pause initially to false. 
                if (seconds > 0) {
                    setSeconds(seconds - 1);
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    });

    const handlePauseToggle = () => {
        setPause(!pause);
    }

    return {
        handlePauseToggle,
    }
}

export const useForTruthToggle = () => {
    const [isTrue, setIsTrue] = useState(false);

    const handleTruthy = () => setIsTrue(true)

    const handleFalsy = () => setIsTrue(false)

    return { isTrue, handleFalsy, handleTruthy }
}

export const useForInputTextChange = () => {
    const [text, setText] = useState("");

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)

    return { text, handleTextChange }
}

export const useForExtractingQueriesFromUrl = () => {
    const [params, setParams] = useState<ShallowRoutingTypes>({  })
    const [mealsRecipes, setMealsRecipes] = useState<RecipeMealType[]>([])

    const searchParams = useSearchParams();
    console.log(searchParams.get("q"), searchParams.size)

    const updateParams = (d: string, k: string) => setParams(prev => ({ ...prev, [k]: d }))

    const runOnce = () => {
        if (searchParams.get("health")) {
            updateParams(searchParams.get("health")!, "health")
        } else if (searchParams.get("cuisineType")) {
            updateParams(searchParams.get("cuisineType")!, "cuisineType")
        } else if (searchParams.get("mealType")) {
            updateParams(searchParams.get("mealType")!, "mealType")
        } else if (searchParams.get("dishType")) {
            updateParams(searchParams.get("dishType")!, "dishType")
        } else if (searchParams.get("q")) {
            updateParams(searchParams.get("q")!, "q")
        }
    }

    useEffect(() => {
        setParams(prev => ({
            ...prev, type: "public", app_id: process.env.NEXT_PUBLIC_EDAMAM_APP_ID,
            app_key: process.env.NEXT_PUBLIC_EDAMAM_APP_KEY,
            q: searchParams.get("q") as string
        }))

        runOnce()

    }, [])

    useEffect(() => {
        // runOnce()
    }, [params])

    useEffect(() => {
        const timer = setTimeout(() => {
            console.log(params)
            params?.q && searchRecipes(params).then(d =>{
                console.log(d)
                const onlyRecipes = d?.hits.map((item:any) => item.recipe)
                onlyRecipes?.length &&  setMealsRecipes(onlyRecipes)
            }).catch(err => console.log(err))
        }, 1001)

        console.log("runing!!")

        return () => clearTimeout(timer)
    }, [params])

    return {mealsRecipes}
}