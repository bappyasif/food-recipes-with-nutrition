import { mealdbApiRequestInterceptor } from "@/utils/axiosInterceptor"
import { createAsyncThunk } from "@reduxjs/toolkit"

const SEARCH = "/search.php"

const LIST = "/list.php"

const returnResponse = (urlStr:string) => mealdbApiRequestInterceptor({url: urlStr})

export const fetchRecipesByName = createAsyncThunk("fetchingRecipesByName", async(qStr: string) => {
    const urlStr:string = `${SEARCH}?s=${qStr}`
    const resp = await mealdbApiRequestInterceptor({url: urlStr})
    return resp
})

export const fetchCategoriesList = createAsyncThunk("fetchCategoriesList", async() => {
    const urlStr:string = `${LIST}?c=list`
    const resp = await returnResponse(urlStr)
    return resp.data
})

export const fetchCuisinesList = createAsyncThunk("fetchCuisinesList", async() => {
    const urlStr:string = `${LIST}?a=list`
    const resp = await returnResponse(urlStr)
    return resp.data
})