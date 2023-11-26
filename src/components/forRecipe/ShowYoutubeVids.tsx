import { youtubeApiRequestInterceptor } from '@/utils/axiosInterceptor';
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button';

export const ShowYoutubeVids = ({ recipeStr }: { recipeStr: string }) => {
  const [YTResp, setYTResp] = useState<any[]>([])
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
      // console.log(data, "data from youtube")
      data.data.items.length && setYTResp(data.data.items)

      data.data.items[0]?.id.videoId && setVidId(data.data.items[0]?.id.videoId)
    }).catch(err => console.log("fetch failed!!", err))
  }

  useEffect(() => {
    fetchDataFromYoutube()
  }, [])

  const findVidId = () => YTResp.findIndex((item:any) => item.id.videoId === vidId)

  const updateVidId = (id:number) => setVidId(YTResp[id].id.videoId)

  const handleNext = () => {
    const foundIdx = findVidId()
    if(foundIdx > -1 && foundIdx < 9) {
      updateVidId(foundIdx + 1)
    } else if(foundIdx === 9) {
      updateVidId(0)
    }
    // console.log(foundIdx, "found idx")
  }

  const handlePrev = () => {
    const foundIdx = findVidId()
    if(foundIdx > 0 && foundIdx < 10) {
      updateVidId(foundIdx - 1)
    } else if(foundIdx === 0) {
      updateVidId(9)
    }
  }

  return (
    <div className='flex flex-col justify-between items-center lg:h-96'>
      <h2 className='text-xl font-bold mt-3'>Popular Youtube Videos About This Recipe</h2>
      {/* smaller screens */}
      <div className='xxs:flex flex-col lg:hidden gap-y-2 items-center w-full mb-10'>
        <iframe className="xxs:w-full" width="720" height="315"
          src={`https://www.youtube.com/embed/${vidId}`}>
        </iframe>
        <div className='w-full flex justify-between gap-x-2 text-muted'>
        <Button className='bg-card w-1/3' variant={'default'} onClick={handlePrev}>Prev</Button>
        <Button className='bg-card w-1/3' variant={'default'} onClick={handleNext}>Next</Button>
        </div>
      </div>

      {/* bigger screens */}
      <div className='xxs:hidden lg:flex gap-x-2 items-center'>
        <Button className='bg-card text-muted-foreground hover:text-primary-foreground' variant={'default'} onClick={handlePrev}>Prev</Button>
        <iframe className="xxs:w-full lg:w-1/2 lg:h-80 xl:w-[27rem]" width="720" height="315"
          src={`https://www.youtube.com/embed/${vidId}`}>
        </iframe>
        <Button className='bg-card text-muted-foreground hover:text-primary-foreground' variant={'default'} onClick={handleNext}>Next</Button>
      </div>
    </div>
  )
}
