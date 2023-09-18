"use client"

import React from 'react'
import { DndProvider } from 'react-dnd'
import {HTML5Backend} from "react-dnd-html5-backend"
import { Container } from './Container'

export const DragAndDrop = () => {
  return (
    <DndProvider backend={HTML5Backend}>
        <Container />
    </DndProvider>
  )
}
