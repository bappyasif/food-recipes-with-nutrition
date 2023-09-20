"use client"

import React from 'react'
import { MostBasic } from './MostBasic'
import { WithoutDnd } from './WithoutDnd'
import { WithDnd } from './WithDnd'

export const Scheduler = () => {
  return (
    <div>
        Scheduler
        <WithDnd />
        <WithoutDnd />
        <MostBasic />
    </div>
  )
}
