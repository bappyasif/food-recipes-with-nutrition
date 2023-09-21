import { mealdbApiRequestInterceptor } from "@/utils/axiosInterceptor"
import { createAsyncThunk } from "@reduxjs/toolkit"

const SEARCH = "/search.php"

export const fetchRecipesByName = createAsyncThunk("fetchingRecipesByName", async(qStr: string) => {
    const urlStr:string = `${SEARCH}?s=${qStr}`
    const resp = await mealdbApiRequestInterceptor({url: urlStr})
    return resp
})

// export const 