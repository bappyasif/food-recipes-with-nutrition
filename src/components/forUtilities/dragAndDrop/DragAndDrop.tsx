"use client"

import React from 'react'
import { DndProvider } from 'react-dnd'
import {HTML5Backend} from "react-dnd-html5-backend"
import { RecipesList } from './RecipesList'

export const DragAndDrop = ({open}: {open: boolean}) => {
  return (
    <DndProvider backend={HTML5Backend}>
        {/* <Container /> */}
        <RecipesList open={open} />
    </DndProvider>
  )
}
