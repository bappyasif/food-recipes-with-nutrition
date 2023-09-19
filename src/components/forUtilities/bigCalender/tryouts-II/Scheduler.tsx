"use client"

import React from 'react'
import { MostBasic } from './MostBasic'
import { WithoutDnd } from './WithoutDnd'

export const Scheduler = () => {
  return (
    <div>
        Scheduler
        <WithoutDnd />
        <MostBasic />
    </div>
  )
}
