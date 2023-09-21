"use client"

import { useAppDispatch, useAppSelector } from '@/hooks/forRedux'
import { decrement, increment } from '@/redux/features/recipes/RecipesSlice';
import React from 'react'

export const SimpleCounter = () => {
  const dispatch = useAppDispatch();
  const count = useAppSelector(state => state.recipes.count)
  const categories = useAppSelector(state => state.categories.list)
  const cuisines = useAppSelector(state => state.cuisines.list)

  return (
    <div>
      SimpleCounter
      <h2>{count} {categories.length} {cuisines.length}</h2>
      <button onClick={() => dispatch(increment())}>increment</button>
      <button onClick={() => dispatch(decrement())}>decrement</button>

    </div>
  )
}
