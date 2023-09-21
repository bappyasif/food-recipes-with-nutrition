import axios, { AxiosResponse } from "axios"

export const MEAL_DB_URL = "https://www.themealdb.com/api/json/v1/1"

export const mealdbApiRequestInterceptor = ({ ...options }) => {
    const client = axios.create({ baseURL: MEAL_DB_URL })

    const onSuccess = (resp:AxiosResponse) => resp

    const onError = (err:AxiosResponse) => err

    return client(options).then(onSuccess).catch(onError)
}