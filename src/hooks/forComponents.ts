import { fetchAndUpdateData } from "@/components/Header";
import { FiltersTypes, RecipeMealType } from "@/types";
import { searchRecipes } from "@/utils/dataFetching";
import axios from "axios";
import { useLocale } from "next-intl";
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

export const useForExtractingQueriesFromUrl = (handleRecipesFound:(data: RecipeMealType[], nextHref?: string) => void) => {
    const [params, setParams] = useState<URLSearchParams>()
    // const [mealsRecipes, setMealsRecipes] = useState<RecipeMealType[]>([])

    const searchParams = useSearchParams();
    // console.log(searchParams.get("q"), searchParams.size)

    const params2 = new URLSearchParams();

    const updateParams = (d: string, k: string) => params2.append(`${k}`, `${d}`)
    // const updateParams = (d: string, k: string) => setParams(prev => ({ ...prev, [k]: d }))

    const runOnce = () => {
        const queriesStr = searchParams.toString();
        // console.log(queriesStr, "sytringify")
        const tokenized = queriesStr.split("&")
        tokenized.forEach(item => {
            const tokens = item.split("=")
            // console.log(tokens[1].split("+").join(" "))
            // updateParams(tokens[1], tokens[0])
            updateParams(tokens[1]?.split("+").join(" "), tokens[0])
        })

        setParams(params2)
    }

    useEffect(() => {
        updateParams(process.env.NEXT_PUBLIC_EDAMAM_APP_ID!, "app_id")
        updateParams(process.env.NEXT_PUBLIC_EDAMAM_APP_KEY!, "app_key")
        searchParams.get("q") && updateParams(searchParams.get("q")!, "q")
        !searchParams.get("type") && updateParams("public", "type")
        // if we use random then "nexthref" wont be available which is used to fetch next 20 results from api
        // updateParams("true", "random")

        runOnce()

    }, [])

    useEffect(() => {
        // runOnce()
    }, [params])

    useEffect(() => {
        const timer = setTimeout(() => {
            // console.log(params, "ready for fetching data!!", searchParams.get("type"), params2, params?.get("app_id"), params?.toString(), params?.get("dishType"))
            // searchParams.get("type") && fetchAndUpdateData(params?.toString(), setMealsRecipes)
            
            
            params?.get("type") && axios.get("https://api.edamam.com/api/recipes/v2", { params }).then(d => {
                const onlyRecipes = d.data?.hits.map((item: any) => item.recipe)

                const readyForRendering = onlyRecipes.map((item: any) => item.mealType?.length && item.dishType?.length && item.dietLabels?.length && item).filter((item: any) => item).filter((v: any, idx: number, self: any) => idx === self.findIndex((t: any) => t.label === v.label))

                readyForRendering?.length && handleRecipesFound(readyForRendering, d.data?._links?.next?.href)
                
                // console.log(d.data?._links?.next?.href, "href", d.data)

                // readyForRendering?.length && setMealsRecipes(readyForRendering)
            })
        }, 1001)

        // console.log(params2, "running!!", params, searchParams.keys(), searchParams.toString(), searchParams.values())

        return () => clearTimeout(timer)
    }, [params])

    // useEffect(() => {
    //     // handleRecipesFound(mealsRecipes)
    // }, [mealsRecipes])

    // return { mealsRecipes }
}

export const useForRandomRecipesList = (mealType: string, diet: string, dishType: string, uri?: string) => {
    const [recipes, setRecipes] = useState<RecipeMealType[]>([])
    
    // this will keep count how many times same dat is being fetched when renderable dataset is less than 13
    // let count = 0;
    const [count, setCount] =  useState(1)

    const readySimilarRcipesRequest = () => {
        const params = {
            mealType: mealType[0].toUpperCase() + mealType.substring(1),
            diet: diet.toLocaleLowerCase(),
            dishType: dishType[0].toUpperCase() + dishType.substring(1),
            random: true,
            type: "public",
            app_id: process.env.NEXT_PUBLIC_EDAMAM_APP_ID,
            app_key: process.env.NEXT_PUBLIC_EDAMAM_APP_KEY,
            from: 1,
            to: 100
        }

        searchRecipes(params).then(d => {
            // console.log(d, "!!")
            const onlyRecipes = d?.hits.map((item: any) => item.recipe)
            // onlyRecipes?.length && setRecipes(onlyRecipes)

            const readyForRendering = onlyRecipes?.map((item: RecipeMealType) => item.mealType.length && item.dishType.length && item.dietLabels.length && item).filter((item: any) => item).filter((v: any, idx: number, self: any) => idx === self.findIndex((t: any) => t.label === v.label))

            if(count <= 4) {
                // readySimilarRcipesRequest()
                // count += 1;
                setCount(prev => prev + 1)
                // console.log(count, "count")
            }

            if(uri) {
                readyForRendering?.length && setRecipes(readyForRendering.filter((item:RecipeMealType) => item.uri !== uri))
            } else {
                readyForRendering?.length && setRecipes(readyForRendering)
            }

            // readyForRendering?.length && setRecipes(readyForRendering)
            // console.log(readyForRendering.length, "readyForRendeing")

        }).catch(err => console.log(err))

    }

    // to make sure that recipes has a good amount of options to render on page
    useEffect(() => {
        recipes.length && recipes.length < 13 && count <= 4 && readySimilarRcipesRequest()
    }, [recipes])

    useEffect(() => {
        mealType && diet && dishType && readySimilarRcipesRequest()
    }, [mealType, diet, dishType])

    return { recipes }
}

export const useForRecipeCarouselItems = (data: RecipeMealType[]) => {
    const [beginFrom, setBeginFrom] = useState(0);
    const [onlyFour, setOnlyFour] = useState<RecipeMealType[]>();

    const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle()

    const handleNext = () => {
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
                temp.push((v + beginFrom) - 20)
            } else {
                temp.push(v + beginFrom)
            }
        }))

        let fourCards: RecipeMealType[] = []

        temp.forEach(v => {
            data.forEach((item, idx) => {
                if (idx === v) {
                    fourCards.push(item)
                }
            })
        })

        // console.log(temp, fourCards)
        setOnlyFour(fourCards)
    }

    useEffect(() => {
        !isTrue && handleOnlyFour()
    }, [beginFrom])

    useEffect(() => {
        let timer = setInterval(() => {

            // console.log(isTrue, "istryue!!", timer)
            !isTrue ? handleNext() : clearInterval(timer)

            if (!isTrue) {
                handleNext()
            } else {
                clearInterval(timer)
                return
            }

        }, 200000)

        return () => clearInterval(timer)

    }, [beginFrom, isTrue])

    useEffect(() => {
        handleNext()
    }, [data])

    return { onlyFour, handleNext, handlePrev, handleFalsy, handleTruthy, isTrue }
}

export const useForQuerifiedParams = (filters: FiltersTypes, fromHome?: boolean) => {
    const router = useRouter()

    const locale = useLocale()

    const querifyFilters = () => {
        let str = fromHome ? `/${locale}/filter-recipes?type=public&` : "?type=public&";

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

        // console.log(str, "querified!!")
        router.push(str.slice(0, str.lastIndexOf("&")), undefined)
    }

    return { querifyFilters }
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

        // console.log(checkIfExistsAlready, "exists!!")
        if (checkIfExistsAlready === -1 && items[rndNum]) {
            setDataset(prev => [...prev, items[rndNum]])
        }
    }

    useEffect(() => {
        if (dataset.length < 8 && rndNum !== -1) {
            addOneToDataset()
            randomizeOnce()
        }
    }, [dataset, rndNum])

    useEffect(() => {
        randomizeOnce()
    }, [])

    return { dataset }
}

export const useForOutsideClick = (ref: any, callback: () => void) => {
    const handleClick = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target)) {
            callback();
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("click", handleClick);
        };
    });
};

export const useForIfRecipesFoundWithExistingFilters = () => {
    const {handleFalsy, handleTruthy, isTrue} = useForTruthToggle()
    const searchParams = useSearchParams()
    // console.log(searchParams, "searchParams!!", searchParams.get("type"))

    useEffect(() => {
        handleFalsy()
        const timer = setTimeout(handleTruthy, 4000)

        return () => clearTimeout(timer)
    }, [searchParams])

    console.log(isTrue, "isTrue!!")

    return {isTimed: isTrue, filtersExist: searchParams.get("type")}
}

export const useForAddToFiltersFromParams = (setFilters: React.Dispatch<React.SetStateAction<FiltersTypes>>) => {
    const searchParams = useSearchParams()

    console.log(searchParams.getAll("cuisineType"), searchParams.getAll("mealType"), searchParams.getAll("dishType"), searchParams.getAll("health"), searchParams.getAll("diet"))

    // this works partially, but needs to find a wway to go through each filters case currently it only runs for first condition
    // maybe using useHook for each filtersType might do
    const runThis = () => {
        if(searchParams.getAll("cuisineType").length) {
            setFilters(prev => ({...prev, cuisineType: searchParams.getAll("cuisineType")}))
            console.log(searchParams.getAll("cuisineType"))
        } else if(searchParams.getAll("dishType").length) {
            setFilters(prev => ({...prev, dishType: searchParams.getAll("cuisineType")}))
            console.log(searchParams.getAll("dishType"))
        } else if(searchParams.getAll("mealType").length) {
            setFilters(prev => ({...prev, mealType: searchParams.getAll("mealType")}))
            console.log(searchParams.getAll("mealType"))
        } else if(searchParams.getAll("diet").length) {
            setFilters(prev => ({...prev, diet: searchParams.getAll("diet")}))
            console.log(searchParams.getAll("diet"))
        } else if(searchParams.getAll("health").length) {
            setFilters(prev => ({...prev, health: searchParams.getAll("health")}))
            console.log(searchParams.getAll("health"))
        } else if(searchParams.getAll("q").length) {
            setFilters(prev => ({...prev, q: searchParams.get("q")!}))
            console.log(searchParams.get("q"))
        }
    }

    useEffect(() => {
        runThis()
    }, [searchParams])

    console.log(searchParams.get("cuisineType"), searchParams.get("type"))
}