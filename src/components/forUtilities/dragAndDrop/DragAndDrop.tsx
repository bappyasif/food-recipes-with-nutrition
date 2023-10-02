"use client"

import React from 'react'
import { DndProvider } from 'react-dnd'
import {HTML5Backend} from "react-dnd-html5-backend"
import { Container } from './Container'
import { RecipesList } from './RecipesList'

export const DragAndDrop = () => {
  return (
    <DndProvider backend={HTML5Backend}>
        <Container />
        <RecipesList />
    </DndProvider>
  )
}
