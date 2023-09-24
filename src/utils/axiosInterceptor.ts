import axios, { AxiosResponse } from "axios"
import { Search } from "./dataFetching"

export const MEAL_DB_URL = "https://www.themealdb.com/api/json/v1/1"

export const mealdbApiRequestInterceptor = ({ ...options }) => {
    const client = axios.create({ baseURL: MEAL_DB_URL })

    const onSuccess = (resp:AxiosResponse) => resp

    const onError = (err:AxiosResponse) => err

    return client(options).then(onSuccess).catch(onError)
}

const EDAMAM_API_URL = `https://api.edamam.com/api`

export const edamamApiRequestInterceptor = ({...options}) => {
    const client = axios.create({ baseURL: EDAMAM_API_URL })

    const onSuccess = (resp:AxiosResponse) => resp

    const onError = (err:AxiosResponse) => err

    console.log(options, "options")

    return client(options).then(onSuccess).catch(onError)
}

export const searchRecipesFromMultipleFiltersSelection = async (filters: string) => {
    const URL = `${EDAMAM_API_URL}${Search}?${filters}`
    fetch(URL).then(resp=> resp.json()).catch(err=> console.log("req error"))
    .then(d=> console.log(d)).catch(err => console.log("res error"))
    // const client = axios.create()

    // const onSuccess = (resp:AxiosResponse) => resp

    // const onError = (err:AxiosResponse) => err

    // return client(URL).then(onSuccess).catch(onError)
}

// export const makeRequest = () => {
//     const method = "GET"
//     const url = endpoint
//     const params = { ...entries }
//     const headers = { 'x-api-key': process.env.NEXT_PUBLIC_NEWSCATCHER_API_KEY }
//     // console.log(url, params, headers)
//     // console.log(process.env.NEXT_PUBLIC_NEWSCATCHER_API_KEY)
//     return fetchSourcesOnRequests({ method, url, params, headers })
// }