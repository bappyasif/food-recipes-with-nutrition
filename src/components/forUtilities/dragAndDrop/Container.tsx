"use client"

import React, { useState } from 'react'
import { Dustbin } from './Dustbin'
import { Box } from './Box'
import { CardsContainer } from './CardsContainer'

export type CardType = {id: number, text: string}

export const Container = () => {
    const [cards, setCards] = useState<CardType[]>([])
    // const handleAddToList = (item: string) => setCards(prev => [...prev, item])
    const handleAddToList = (item: string) => setCards(prev => [...prev, {id: cards.length, text: item}])

  return (
    <div>
      <div className='flex gap-x-4' style={{ overflow: 'hidden', clear: 'both' }}>
        <Dustbin cards={cards} />
        {cards?.length}
        <CardsContainer cards={cards} updateCards={(data) => setCards(data)} />
        {/* <CardsContainer /> */}
      </div>
      <div className='flex flex-col gap-y-1 w-fit text-primary-content' style={{ overflow: 'hidden', clear: 'both' }}>
        <Box name="Glass" handleAddToList={handleAddToList} />
        <Box name="Banana" handleAddToList={handleAddToList} />
        <Box name="Paper" handleAddToList={handleAddToList} />
      </div>
    </div>
  )
}
