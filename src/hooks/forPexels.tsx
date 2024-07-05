"use client"

import {createClient} from "pexels"
import { useEffect, useState } from "react"

const pexelClient = createClient(process.env.NEXT_PUBLIC_API_KEY_PEXEL!)

export const useToGetAnImageUrl = (name: string) => {
    const [imgSrc, setImgSrc] = useState("")

    useEffect(() => {
        pexelClient.photos.search({ query: name })
            .then((photos: any) => {
                setImgSrc(photos?.photos[0]?.src?.medium)
            }).catch(err => console.log(err))
    }, [name])

    return { imgSrc }
}

export const useToGetRandomImageUrlIfFails = (imgSrc: string) => {
    const [failSafeUrl, setFailSafeUrl] = useState(imgSrc);

    const handleFailsafe = () => {
        setFailSafeUrl("https://picsum.photos/600/600/?blur")
    }

    useEffect(() => {
        imgSrc && setFailSafeUrl(imgSrc)
    }, [imgSrc])

    return {failSafeUrl, handleFailsafe}
}