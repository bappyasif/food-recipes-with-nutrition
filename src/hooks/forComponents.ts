import { FiltersTypes, RecipeMealType, ShallowRoutingTypes } from "@/types";
import { searchRecipes } from "@/utils/dataFetching";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
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

    const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setText(e.target.value)

    return { text, handleTextChange }
}

export const useForExtractingQueriesFromUrl = () => {
    const [params, setParams] = useState<URLSearchParams>()
    const [mealsRecipes, setMealsRecipes] = useState<RecipeMealType[]>([])

    const searchParams = useSearchParams();
    console.log(searchParams.get("q"), searchParams.size)

    const params2 = new URLSearchParams();

    const updateParams = (d: string, k: string) => params2.append(`${k}`, `${d}`)
    // const updateParams = (d: string, k: string) => setParams(prev => ({ ...prev, [k]: d }))

    const runOnce = () => {
        const queriesStr = searchParams.toString();
        const tokenized = queriesStr.split("&")
        tokenized.forEach(item => {
            const tokens = item.split("=")
            updateParams(tokens[1], tokens[0])
        })

        setParams(params2)

        // console.log(tokenized.length, "tokenized!!", tokenized, params2)

        // if (searchParams.get("health")) {
        //     updateParams(searchParams.get("health")!, "health")
        // } else if (searchParams.get("cuisineType")) {
        //     updateParams(searchParams.get("cuisineType")!, "cuisineType")
        // } else if (searchParams.get("mealType")) {
        //     updateParams(searchParams.get("mealType")!, "mealType")
        // } else if (searchParams.get("dishType")) {
        //     updateParams(searchParams.get("dishType")!, "dishType")
        // } else if (searchParams.get("q")) {
        //     updateParams(searchParams.get("q")!, "q")
        // }
    }

    useEffect(() => {
        // setParams(prev => ({
        //     ...prev, type: "public", app_id: process.env.NEXT_PUBLIC_EDAMAM_APP_ID,
        //     app_key: process.env.NEXT_PUBLIC_EDAMAM_APP_KEY,
        //     q: searchParams.get("q") as string
        // }))
        updateParams(process.env.NEXT_PUBLIC_EDAMAM_APP_ID!, "app_id")
        updateParams(process.env.NEXT_PUBLIC_EDAMAM_APP_KEY!, "app_key")
        searchParams.get("q") && updateParams(searchParams.get("q")!, "q")
        !searchParams.get("type") && updateParams("public", "type")

        runOnce()

    }, [])

    useEffect(() => {
        // runOnce()
    }, [params])

    useEffect(() => {
        const timer = setTimeout(() => {
            console.log(params)
            // params?.q && searchRecipes(params).then(d =>{
            //     console.log(d)
            //     const onlyRecipes = d?.hits.map((item:any) => item.recipe)
            //     onlyRecipes?.length &&  setMealsRecipes(onlyRecipes)
            // }).catch(err => console.log(err))

            // going with this way
            // params?.get("type") && axios.get("https://api.edamam.com/api/recipes/v2", { params }).then(d => {
            //     // console.log(d.data)
            //     const onlyRecipes = d.data?.hits.map((item: any) => item.recipe)
            //     onlyRecipes?.length && setMealsRecipes(onlyRecipes)
            // }).catch(err => console.log(err))

        }, 1001)

        console.log(params2, "running!!", params, searchParams.keys(), searchParams.toString(), searchParams.values())

        return () => clearTimeout(timer)
    }, [params])

    useEffect(() => {
        // handleRecipesFound(mealsRecipes)
    }, [mealsRecipes])

    return { mealsRecipes }
}

export const useForRandomRecipesList = (mealType:string, diet:string, dishType:string) => {
    const [recipes, setRecipes] = useState<RecipeMealType[]>([])
    const readySimilarRcipesRequest = () => {
        const params = {
            mealType: mealType[0].toUpperCase()+mealType.substring(1),
            diet: diet.toLocaleLowerCase(),
            dishType: dishType[0].toUpperCase()+dishType.substring(1),
            random: true,
            type: "public",
            app_id: process.env.NEXT_PUBLIC_EDAMAM_APP_ID,
            app_key: process.env.NEXT_PUBLIC_EDAMAM_APP_KEY,
            from: 1,
            to: 100
        }

        searchRecipes(params).then(d => {
            console.log(d, "!!")
            const onlyRecipes = d?.hits.map((item: any) => item.recipe)
            // onlyRecipes?.length && setRecipes(onlyRecipes)

            const readyForRendering = onlyRecipes?.map((item:any) => item.mealType.length && item.dishType.length && item.dietLabels.length && item).filter((item:any) => item).filter((v:any, idx:number, self:any) => idx === self.findIndex((t:any) => t.label === v.label))
            
            readyForRendering?.length && setRecipes(readyForRendering)
            console.log(readyForRendering.length, "readyForRendeing")

        }).catch(err => console.log(err))

    }

    useEffect(() => {
        mealType && diet && dishType && readySimilarRcipesRequest()
    }, [mealType, diet, dishType])

    return {recipes}
}

export const useForRecipeCarouselItems = (data: RecipeMealType[]) => {
    const [beginFrom, setBeginFrom] = useState(0);
    const [onlyFour, setOnlyFour] = useState<RecipeMealType[]>();

    const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

    const handleNext = () => {
        // if(isTrue) {
        //   // console.log("PAUSE from next")
        //   return
        // }
        if (beginFrom > data.length) {
            setBeginFrom(0)
        } else {
            // console.log("Now PAUSE from next, elseblck", isTrue)
            !isTrue && setBeginFrom(prev => prev + 1)
        }
    }

    const handlePrev = () => {
        if (beginFrom === 0) {
            setBeginFrom(data.length)
        } else {
            setBeginFrom(prev => prev - 1)
        }
    }

    const handleOnlyFour = () => {
        let temp: number[] = [];
        Array.from(Array(8).keys()).forEach((v => {
            if (v + beginFrom >= 20) {
                // console.log(v, beginFrom, v + beginFrom, "adjusted", (v + beginFrom) - 6)
                temp.push((v + beginFrom) - 20)
            } else {
                // console.log(v, beginFrom, v + beginFrom)
                temp.push(v + beginFrom)
            }
        }))

        let fourCards: RecipeMealType[] = []

        temp.forEach(v => {
            data.forEach((item, idx) => {
                // console.log(idx, v, "check")
                if (idx === v) {
                    fourCards.push(item)
                    //   fourCards.push({category: item.category, name: item.name, nutrition: item.nuttrition, picture: item.picture})
                }
            })
        })

        console.log(temp, fourCards)
        setOnlyFour(fourCards)
    }

    useEffect(() => {
        !isTrue && handleOnlyFour()
    }, [beginFrom])

    // const renderRecipes = () => data.map(item => <RenderRecipeForCarousel key={item.uri} {...item} />)
    // const renderRecipes = () => onlyFour?.map((item, idx) => <RenderRecipeForCarousel key={item.uri} rdata={item} lastCard={idx === 7} firstCard={idx===0} />)

    useEffect(() => {
        let timer = setInterval(() => {

            console.log(isTrue, "istryue!!", timer)
            !isTrue ? handleNext() : clearInterval(timer)

            if (!isTrue) {
                handleNext()
                // console.log(beginFrom, "play from timer", !isTrue)
            } else {
                clearInterval(timer)
                // console.log(beginFrom, "pause from timer else block!!", !isTrue, timer)
                return
            }

            // console.log(beginFrom, "PAUSE from timer", isTrue)
        }, 200000)

        // !isTrue ? handleNext() : clearInterval(timer)

        // setTimerRunning(timer)
        return () => clearInterval(timer)

    }, [beginFrom, isTrue])

    useEffect(() => {
        handleNext()
    }, [data])

    return {onlyFour, handleNext, handlePrev, handleFalsy, handleTruthy, isTrue}
}

export const useForQuerifiedParams = (filters: FiltersTypes) => {
    const router = useRouter()

    const querifyFilters = () => {
        let str = "?type=public&";

        const querified = (items: string[], propKey: string) => items.forEach(item => str += `${propKey}=${item}&`)

        for (let k in filters) {
            if (filters[k as keyof FiltersTypes]?.length) {
                if (k !== "q") {
                    querified(filters[k as keyof FiltersTypes] as string[], k)
                } else {
                    str += `q=${filters.q}&`
                }
            }
        }
        // console.log(str, "STR!!", str.lastIndexOf("&"), str.slice(0, 143))
        console.log(str, "querified!!")
        router.push(str.slice(0, str.lastIndexOf("&")), undefined)
    }

    return {querifyFilters}
}

export const useForRanmoziedDataset = (items: string[]) => {
    const [dataset, setDataset] = useState<string[]>([])
    const [rndNum, setRndNum] = useState<number>(-1)

    const randomizeOnce = () => {
        const rndNum = Math.floor(Math.random() * items.length)
        setRndNum(rndNum)
    }

    const addOneToDataset = () => {
        const checkIfExistsAlready = dataset.findIndex((val) => val === items[rndNum])
        
        console.log(checkIfExistsAlready, "exists!!")
        if(checkIfExistsAlready === -1 && items[rndNum]) {
            setDataset(prev => [...prev, items[rndNum]])
        }
    }

    useEffect(() => {
        if(dataset.length < 8 && rndNum !== -1) {
            addOneToDataset()
            randomizeOnce()
        }
    }, [dataset, rndNum])

    useEffect(() => {
        randomizeOnce()
    }, [])

    // dataset.length && console.log(dataset)

    return {dataset}
}