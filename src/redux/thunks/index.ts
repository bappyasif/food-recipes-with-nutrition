import { useForExtractingQueriesFromUrl } from "@/hooks/forComponents"
import { mealdbApiRequestInterceptor } from "@/utils/axiosInterceptor"
import { searchRecipes } from "@/utils/dataFetching"
import { assembleReqStr } from "@/utils/dbRequests"
import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

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

export const fetchRecipesWithShallowRoutingOnce = createAsyncThunk("fetchRecipesWithShallowRoutingOnce", async () => {
    // const {params} = useForExtractingQueriesFromUrl()
    // console.log("tHUnked!! needs to be done from coimpoennt instead")
    // const resp = await searchRecipes(params)
    // console.log(resp, "resp!!", params)
    // return resp?.data
})

export const getAllViewedRecipesFromDb = createAsyncThunk("getAllViewedRecipes", async () => {
    const resp = await axios.get(assembleReqStr())
    return resp.data
})