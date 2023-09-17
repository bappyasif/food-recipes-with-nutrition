"use client"

import React from 'react'
import { Button } from '../ui/button'
import styles from "@/app/Home.module.css"

export const HorizontalCarousel = () => {
    const data = ["een", "twee", "drie", "vier", "vijf", "zes", "zeven", "acht", "negen", "tien"]

    const renderData = () => data.map(item => <Button className={styles["card"] + " w-40"} variant={'destructive'}>{item}</Button>)

  return (
    <div className='w-full overflow-hidden flex'>
        <div className={`flex gap-4 overflow-hidden flex-nowrap ${styles["cardSlides"]}`}>{renderData()}</div>
        <div className={`flex gap-4 overflow-hidden flex-nowrap`}>{renderData()}</div>
    </div>
  )
}
