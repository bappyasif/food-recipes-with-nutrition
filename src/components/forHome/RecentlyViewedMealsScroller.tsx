"use client"

import { ViewedMealCardType } from '@/types'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { useForRecipeCarouselItems, useForTruthToggle } from '@/hooks/forComponents'
import styles from "@/app/Home.module.css"
import { Badge } from '../ui/badge'

export const RecentlyViewedMealsScroller = () => {
  const [onlyFour, setOnlyFour] = useState<ViewedMealCardType[]>();
  // const [onlyFour, setOnlyFour] = useState<number[]>();
  const [beginFrom, setBeginFrom] = useState(0);
  // const [resumeFrom, setResumeFrom] = useState(-1);

  const handleNext = () => {
    // if(isTrue) {
    //   // console.log("PAUSE from next")
    //   return
    // }
    if(beginFrom > 5) {
      setBeginFrom(0)
    } else {
      // console.log("Now PAUSE from next, elseblck", isTrue)
      !isTrue && setBeginFrom(prev => prev+1)
    }
  }

  const handlePrev = () => {
    if(beginFrom === 0) {
      setBeginFrom(5)
    } else {
      setBeginFrom(prev => prev-1)
    }
  }

  const handleOnlyFour = () => {
    let temp:number[] = [];
    Array.from([0,1,2,3]).forEach((v => {
      if(v+beginFrom >= 6) {
        // console.log(v, beginFrom, v + beginFrom, "adjusted", (v + beginFrom) - 6)
        temp.push((v + beginFrom) - 6)
      } else {
        // console.log(v, beginFrom, v + beginFrom)
        temp.push(v + beginFrom)
      }
    }))

    let fourCards:ViewedMealCardType[] = []

    temp.forEach(v => {
      cards.forEach((item, idx) => {
        if(idx === v) {
          fourCards.push({category: item.category, name: item.name, nutrition: item.nuttrition, picture: item.picture})
        }
      })
    })
    
    // console.log(temp, fourCards)
    setOnlyFour(fourCards)
  }

  const {isTrue, handleFalsy, handleTruthy} = useForTruthToggle()

  // useEffect(() => {
  //   isTrue && clearInterval(timer)
  // }, [isTrue])

  useEffect(() => {
    !isTrue && handleOnlyFour()
  }, [beginFrom])

  useEffect (() => {
    let timer = setInterval(() => {

      // !isTrue ? handleNext() : clearInterval(timer)
      if(!isTrue) {
        // setOnlyFour([])

        handleNext()
        // console.log(beginFrom, "play from timer", !isTrue)
      } else {
        clearInterval(timer)
        // console.log(beginFrom, "pause from timer else block!!", !isTrue, timer)
        return
      }

      // console.log(beginFrom, "PAUSE from timer", isTrue)
    }, 6000)
    
    // setTimerRunning(timer)
    return () => clearInterval(timer)

  }, [beginFrom, isTrue])

  // const {handleFalsy, handleNext, handlePrev, handleTruthy, isTrue, onlyFour} = useForRecipeCarouselItems(data)

  // console.log(beginFrom, isTrue)

  const renderCards = () => onlyFour?.map((item, idx) => <RenderDeliciousMealCard key={item.name} category={item.category} name={item.name} nutrition={item.nutrition} picture={item.picture} idx={idx} />)

  return (
    <div>
      <h2>Some Recently Viewed Meals</h2>
      <div>
      {/* <Button onClick={handlePrev}>prev</Button>
      <Button onClick={handleNext}>next</Button> */}
      {/* <button onClick={handleTruthy}>pause</button>
      <button onClick={handleFalsy}>play</button> */}
      </div>
      <div 
        className='grid xxs:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-4 place-content-center place-items-center'
        onMouseEnter={handleTruthy}
        onMouseLeave={handleFalsy}
      >
        {renderCards()}
      </div>
    </div>
  )
}

const RenderDeliciousMealCard = ({idx,  ...item}: ViewedMealCardType & {idx: number}) => {
  const { category, name, nutrition, picture } = item;

  // console.log(picture, "picture")
  const [sec, setSec] = useState(0);
  const upTick = () => {
    const timer = setTimeout(() => {
      setSec(1)
    }, 1000)

    return () => clearTimeout(timer)
  }

  useEffect(() => {
    upTick()
  }, [idx, item])

  const {handleFalsy, handleTruthy, isTrue} = useForTruthToggle()

  return (
    <div 
      // className={`${styles.moveToLeft}`}
      className={`${styles.dissolvePhoto} h-56 overflow-clip`}
      // className={`h-56 overflow-clip transition-all duration-1000 ${sec ? "-translate-x-20" : "translate-x-0"}`}
    >
      <Image
        className=' w-60 h-48 object-cover hover:h-36 hover:object-cover'
        // fill={true}
        placeholder='blur'
        blurDataURL= {picture}
        loading='lazy'
        width={400} 
        height={200}
        alt={`${name}, ${category}, ${nutrition}`}
        src={picture}
      />
      <div className='flex flex-col gap-y-2 items-center justify-center'>
        <ReusableBadge text={nutrition} title='Calorie' />
        <ReusableBadge text={category} title='Category' />
        <ReusableBadge text={name} title='Name' />
      </div>
    </div>
  )
}

const ReusableBadge = ({title, text}: {title: string, text: string | number}) => {
  return (
    <Badge className='flex gap-x-4 justify-between items-center bg-muted-foreground text-muted'>
      <span>{title}:</span>
      <span>{text}</span>
    </Badge>
  )
}


const cards = [
  { name: "delicious meal - I", category: "vegetables", picture: "https://source.unsplash.com/random/200?food=1", nuttrition: 220 },
  { name: "delicious meal - II", category: "beef", picture: "https://source.unsplash.com/random/200?food=2", nuttrition: 240 },
  { name: "delicious meal - III", category: "fish", picture: "https://source.unsplash.com/random/200?food=3", nuttrition: 260 },
  { name: "delicious meal - IV", category: "chicken", picture: "https://source.unsplash.com/random/200?food=4", nuttrition: 280 },
  { name: "delicious meal - V", category: "duck", picture: "https://source.unsplash.com/random/200?food=5", nuttrition: 300 },
  { name: "delicious meal - VI", category: "lentils", picture: "https://source.unsplash.com/random/200?food=6", nuttrition: 320 }
]

/**
 * 
 * 
 export const RecentlyViewedMealsScroller = () => {
  const [onlyFour, setOnlyFour] = useState<ViewedMealCardType[]>();
  // const [onlyFour, setOnlyFour] = useState<number[]>();
  const [beginFrom, setBeginFrom] = useState(0);
  // const [resumeFrom, setResumeFrom] = useState(-1);

  let timer:any;

  const handleNext = () => {
    if(isTrue) {
      console.log("PAUSE from next")
      return
    }
    if(beginFrom > 5) {
      setBeginFrom(0)
    } else {
      console.log("Now PAUSE from next, elseblck", isTrue)
      !isTrue && setBeginFrom(prev => prev+1)
    }
  }

  const handlePrev = () => {
    if(beginFrom === 0) {
      setBeginFrom(5)
    } else {
      setBeginFrom(prev => prev-1)
    }
  }

  const handleOnlyFour = () => {
    let temp:number[] = [];
    Array.from([0,1,2,3]).forEach((v => {
      if(v+beginFrom >= 6) {
        // console.log(v, beginFrom, v + beginFrom, "adjusted", (v + beginFrom) - 6)
        temp.push((v + beginFrom) - 6)
      } else {
        // console.log(v, beginFrom, v + beginFrom)
        temp.push(v + beginFrom)
      }
    }))

    let fourCards:ViewedMealCardType[] = []

    temp.forEach(v => {
      cards.forEach((item, idx) => {
        if(idx === v) {
          fourCards.push({category: item.category, name: item.name, nutrition: item.nuttrition, picture: item.picture})
        }
      })
    })
    
    console.log(temp, fourCards)
    setOnlyFour(fourCards)
  }

  const {isTrue, handleFalsy, handleTruthy} = useForTruthToggle()

  const intervalFunc = () => {
    let timer = setInterval(() => {

      // !isTrue ? handleNext() : clearInterval(timer)
      if(!isTrue) {
        handleNext()
        console.log(beginFrom, "PAUSE from timer", !isTrue)
      } else {
        clearInterval(timer)
        console.log(beginFrom, "PAUSE from timer else block!!", !isTrue, timer)
        return
      }

      // console.log(beginFrom, "PAUSE from timer", isTrue)
    }, 8001)
    
    // setTimerRunning(timer)
    return () => clearInterval(timer)
  }

  useEffect(() => {
    isTrue && clearInterval(timer)
  }, [isTrue])

  useEffect(() => {
    !isTrue && handleOnlyFour()
  }, [beginFrom])

  useEffect (() => {
    // intervalFunc()
  }, [beginFrom])

  console.log(beginFrom, isTrue)

  const renderCards = () => onlyFour?.map(item => <RenderDeliciousMealCard key={item.name} category={item.category} name={item.name} nutrition={item.nutrition} picture={item.picture} />)

  return (
    <div>
      <NoobTimer />
      
      <h2>Some Recently Viewed Meals</h2>
      <div>
      <Button onClick={handlePrev}>prev</Button>
      <Button onClick={handleNext}>next</Button>
      <button onClick={handleTruthy}>pause</button>
      <button onClick={handleFalsy}>play</button>
      </div>
      <div 
        className='grid grid-cols-4 gap-x-4 overflow-x-scroll place-content-center place-items-center'
      >
        {renderCards()}
      </div>
    </div>
  )
}
 */


/**
 * 
 * 
 const handleOnlyFour = () => {
    // for(let i=0; i < 4; i++) {
    //   console.log(i, beginFrom, i+beginFrom)
    // }
    let temp:number[] = [];
    Array.from([0,1,2,3]).forEach((v => {
      if(v+beginFrom >= 6) {
        // console.log(v, beginFrom, v + beginFrom, "adjusted", (v + beginFrom) - 6)
        temp.push((v + beginFrom) - 6)
      } else {
        // console.log(v, beginFrom, v + beginFrom)
        temp.push(v + beginFrom)
      }
    }))
    
    console.log(temp)
  }
 */


/**
 * 
 * 
 export const RecentlyViewedMealsScroller = () => {
  // const [allCards, setAllCards] = useState<ViewedMealCardType[]>([])

  const renderCards = () => cards.map(item => <RenderDeliciousMealCard key={item.name} category={item.category} name={item.name} nutrition={item.nuttrition} picture={item.picture} />)

  const [onlyFour, setOnlyFour] = useState<ViewedMealCardType[]>();
  const [beginFrom, setBeginFrom] = useState(0);

  const handleNext = () => {
    if(beginFrom === 5) {
      setBeginFrom(0)
    } else {
      setBeginFrom(prev => prev+1)
    }
  }

  const handlePrev = () => {
    if(beginFrom === 0) {
      setBeginFrom(5)
    } else {
      setBeginFrom(prev => prev-1)
    }
  }

  const [timerRunning, setTimerRunning] = useState<NodeJS.Timeout>()

  const intervalFunc = () => {
    const timer = setInterval(() => {
      handleNext()
    }, 100000001)
    
    setTimerRunning(timer)
  }

  const updateOnlyFour = () => {
    cards.forEach((item, idx) => {
      if(beginFrom + idx > 5) {
        // console.log(beginFrom, idx, idx - beginFrom, "data", cards[idx - beginFrom]?.name)
        console.log(beginFrom, idx, "data", cards[idx]?.name)
        // handlePrev()
        setBeginFrom(0)
      } else {
        // handleNext()
        setBeginFrom(6 - idx)
      }
    })
  }

  useEffect(() => {
    updateOnlyFour()
  }, [beginFrom])

  useEffect(() => {
    intervalFunc();
  }, [])

  return (
    <div>
      <h2>Some Recently Viewed Meals</h2>
      <div 
        className='grid grid-cols-4 gap-x-4 overflow-x-scroll'
      >
        {renderCards()}
      </div>
    </div>
  )
}
 */