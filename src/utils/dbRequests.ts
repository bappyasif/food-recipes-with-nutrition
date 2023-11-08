// import { EventItemTypes } from "@/components/forUtilities/bigCalender/Scheduler";
import { EventItemTypes, RecipeMealType } from "@/types";
import axios from "axios"

export const updateRecordInCollection = (uri:string, images:object) => {
    console.log(assembleReqStr(), "update", uri)

    // axios.put(`${assembleReqStr()}/${uri}`, {uri}).then((resp) => console.log(resp.status, "updated!!")).catch(err => console.log(err, "error occured...."))

    axios.put(assembleReqStr(), {uri, images}).then((resp) => console.log(resp.status, "updated!!")).catch(err => console.log(err, "error occured...."))
}

const getBaseApiUrl = () => {
    let apiUrl: string;

    if (process.env.NODE_ENV === "development") {
        apiUrl = "http://localhost:3000"
    } else {
        apiUrl = process.env.NEXT_PUBLIC_API_HOSTED!
    }

    return apiUrl
}

export const assembleReqStr = () => {
    const endpoint: string = process.env.NEXT_PUBLIC_API_ENDPOINT!

    // let apiUrl: string;

    // if (process.env.NODE_ENV === "development") {
    //     apiUrl = "http://localhost:3000"
    // } else {
    //     apiUrl = process.env.NEXT_PUBLIC_API_HOSTED!
    // }

    const apiUrl = getBaseApiUrl()

    const reqStr = `${apiUrl}/${endpoint}`

    return reqStr
}

export const addToDbCollection = async (recipeData: RecipeMealType) => {
    const { label, calories, co2EmissionsClass, cuisineType, uri, images } = recipeData

    const data = {
        label, co2EmissionsClass, calories, cuisineType: cuisineType[0], uri, images: images?.REGULAR || images?.SMALL, count: 1
    }

    const statCode = (await axios.post(assembleReqStr(), data)).status

    console.log("status code!!", statCode)

    // axios.post(reqStr, params).then(() => console.log("done")).catch(err => console.log("error occured", err))
}

export const addToSchedulerEvents = async (eventData: EventItemTypes) => {
    const { description, end, id, start, title, recipes, user } = eventData

    const data = {
        description, end, id, start, title, recipes, user
    }

    const reqStr = `${getBaseApiUrl()}/${process.env.NEXT_PUBLIC_SCHEDULER_EVENTS_API_ENDPOINT}`

    const statCode = (await axios.post(reqStr, data)).status

    console.log("status code!!", statCode)

    // axios.post(reqStr, params).then(() => console.log("done")).catch(err => console.log("error occured", err))
}

export const fetchUserEventsDataFromDb = async (userEmail:string, userName: string) => {
    const reqStr = `${getBaseApiUrl()}/${process.env.NEXT_PUBLIC_SCHEDULER_EVENTS_API_ENDPOINT}?email=${userEmail}&name=${userName}`
    
    const resp = await axios.get(reqStr)

    const statCode = (resp).status

    const data = resp.data

    console.log("status code!!", statCode, data)
    return data
}

export const updateUserEventDataInDb = async (params: EventItemTypes
    ) => {
    const reqStr = `${getBaseApiUrl()}/${process.env.NEXT_PUBLIC_SCHEDULER_EVENTS_API_ENDPOINT}`
    
    const resp = await axios.put(reqStr, {...params})

    const statCode = (resp).status

    const data = resp.data

    console.log("status code!!", statCode, data)
}