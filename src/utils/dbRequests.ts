import { RecipeMealType } from "@/types";
import axios from "axios"

export const updateRecordInCollection = (uri:string, images:object) => {
    console.log(assembleReqStr(), "update", uri)

    // axios.put(`${assembleReqStr()}/${uri}`, {uri}).then((resp) => console.log(resp.status, "updated!!")).catch(err => console.log(err, "error occured...."))

    axios.put(assembleReqStr(), {uri, images}).then((resp) => console.log(resp.status, "updated!!")).catch(err => console.log(err, "error occured...."))
}

export const assembleReqStr = () => {
    const endpoint: string = process.env.NEXT_PUBLIC_API_ENDPOINT!

    let apiUrl: string;

    if (process.env.NODE_ENV === "development") {
        apiUrl = "http://localhost:3000"
    } else {
        apiUrl = process.env.NEXT_PUBLIC_API_HOSTED!
    }

    const reqStr = `${apiUrl}/${endpoint}`

    return reqStr
}

export const addToDbCollection = async (recipeData: RecipeMealType) => {
    const { label, calories, co2EmissionsClass, cuisineType, uri, images } = recipeData

    // const endpoint: string = process.env.NEXT_PUBLIC_API_ENDPOINT!

    // let apiUrl: string;

    // if (process.env.NODE_ENV === "development") {
    //     apiUrl = "http://localhost:3000"
    // } else {
    //     apiUrl = process.env.NEXT_PUBLIC_API_HOSTED!
    // }

    // const reqStr = `${apiUrl}/${endpoint}`

    const data = {
        label, co2EmissionsClass, calories, cuisineType: cuisineType[0], uri, images: images?.REGULAR || images?.SMALL, count: 1
    }

    // console.log("here bees!!", data)

    // const statCode = (await axios.post(reqStr, data)).status

    const statCode = (await axios.post(assembleReqStr(), data)).status

    console.log("status code!!", statCode)

    // axios.post(reqStr, params).then(() => console.log("done")).catch(err => console.log("error occured", err))
}