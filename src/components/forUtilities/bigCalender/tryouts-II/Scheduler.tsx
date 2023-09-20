"use client"

import React from 'react'
import { MostBasic } from './MostBasic'
import { WithoutDnd } from './WithoutDnd'
import { WithDnd } from './WithDnd'
import { WithMostFunctionalities } from './WithMostFunctionalities'

export const Scheduler = () => {
  return (
    <div>
        Scheduler
        <WithMostFunctionalities />
        {/* <WithDnd />
        <WithoutDnd />
        <MostBasic /> */}
    </div>
  )
}
