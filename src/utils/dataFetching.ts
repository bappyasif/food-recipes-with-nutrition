import { edamamApiRequestInterceptor, mealdbApiRequestInterceptor } from "./axiosInterceptor"

export const SEARCH = "/search.php"

export const searchRecipesByNameFromApi = async (qStr: string) => {
    const url = `${SEARCH}?s=${qStr}`
    const resp = await mealdbApiRequestInterceptor({url: url})
    return resp?.data
    // const resp = await fetch(`${MEAL_DB_URL}${url}`)
    // return resp.json()
}

const Search = "/recipes/v2"

export const searchRecipes = async ({...params}) => {
    const url = Search
    const resp = await edamamApiRequestInterceptor({url, params})
    return resp?.data
}

const BY_URI = "by-uri";

export const searchRecipeById = async ({...params}, recipeId:string) => {
    const url = `${Search}/${recipeId}`
    const resp = await edamamApiRequestInterceptor({url, params})
    return resp?.data
}