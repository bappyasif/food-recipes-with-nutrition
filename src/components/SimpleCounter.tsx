"use client"

import { useAppDispatch, useAppSelector } from '@/hooks/forRedux'
import { decrement, increment } from '@/redux/features/recipes/RecipeSlice';
import React from 'react'

export const SimpleCounter = () => {
    const dispatch = useAppDispatch();
    const count = useAppSelector(state => state.recipes.count)
  return (
    <div>
        SimpleCounter
        <h2>{count}</h2>
      <button onClick={() => dispatch(increment())}>increment</button>
      <button onClick={() => dispatch(decrement())}>decrement</button>

    </div>
  )
}
