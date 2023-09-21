import { MEAL_DB_URL, mealdbApiRequestInterceptor } from "./axiosInterceptor"

export const SEARCH = "/search.php"

export const searchRecipesByNameFromApi = async (qStr: string) => {
    const url = `${SEARCH}?s=${qStr}`
    const resp = await mealdbApiRequestInterceptor({url: url})
    return resp?.data
    // const resp = await fetch(`${MEAL_DB_URL}${url}`)
    // return resp.json()
}