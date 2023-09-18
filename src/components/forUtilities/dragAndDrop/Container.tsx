"use client"

import React, { useState } from 'react'
import { Dustbin } from './Dustbin'
import { Box } from './Box'

export const Container = () => {
    const [cards, setCards] = useState<string[]>([])
    const handleAddToList = (item: string) => setCards(prev => [...prev, item])

  return (
    <div>
      <div style={{ overflow: 'hidden', clear: 'both' }}>
        <Dustbin cards={cards} />
        {cards?.length}
      </div>
      <div className='flex flex-col gap-y-1 w-fit text-primary-content' style={{ overflow: 'hidden', clear: 'both' }}>
        <Box name="Glass" handleAddToList={handleAddToList} />
        <Box name="Banana" handleAddToList={handleAddToList} />
        <Box name="Paper" handleAddToList={handleAddToList} />
      </div>
    </div>
  )
}
