import { youtubeApiRequestInterceptor } from '@/utils/axiosInterceptor';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

export const ShowYoutubeVids = ({recipeStr}: {recipeStr: string}) => {
  const [vidId, setVidId] = useState("")
  const fetchDataFromYoutube = () => {
    const KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    const ENDPOINT = "/search"
    const params = {
      q: recipeStr || "Glazed Pork Tenderloins",
      maxResults: 10,
      key: KEY
    }

    youtubeApiRequestInterceptor({ url: ENDPOINT, params }).then(data => {
      console.log(data, "data from youtube")
      // https://www.youtube.com/watch?v=LkaTx6u0rSU
      data.data.items[0]?.id.videoId && setVidId(data.data.items[0]?.id.videoId)
    }).catch(err => console.log("fetch failed!!", err))

    // const client = axios.create({baseURL: BASE_URL})
    // client.get(ENDPOINT, {params}).then(data => console.log(data, "data from youtube")).catch(err => console.log("fetch failed!!", err))
  }

  useEffect(() => {
    fetchDataFromYoutube()
  }, [])

  return (
    <div className='flex flex-col justify-between items-center h-96'>
      <h2 className='text-xl font-bold mt-3'>Popular Youtube Video About This Recipe</h2>
      <iframe className="xxs:w-full lg:w-1/2 lg:h-80 xl:w-[27rem]" width="720" height="315"
        src={`https://www.youtube.com/embed/${vidId}`}>
      </iframe>
    </div>
  )
}
