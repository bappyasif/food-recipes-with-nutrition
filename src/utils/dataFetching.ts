import { MEAL_DB_URL, edamamApiRequestInterceptor, mealdbApiRequestInterceptor } from "./axiosInterceptor"

export const SEARCH = "/search.php"

export const searchRecipesByNameFromApi = async (qStr: string) => {
    const url = `${SEARCH}?s=${qStr}`
    const resp = await mealdbApiRequestInterceptor({url: url})
    return resp?.data
    // const resp = await fetch(`${MEAL_DB_URL}${url}`)
    // return resp.json()
}

export const Search = "/recipes/v2"

export const searchRecipes = async ({...params}) => {
    const url = Search
    // console.log({url, params})
    const resp = await edamamApiRequestInterceptor({url, params})
    return resp?.data
    // return "ts"
}