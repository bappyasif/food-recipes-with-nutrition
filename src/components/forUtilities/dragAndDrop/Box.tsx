import React, { CSSProperties } from 'react'
import { ItemTypes } from './Dustbin'
import {useDrag} from "react-dnd"

const style: CSSProperties = {
    border: '1px dashed gray',
    // backgroundColor: 'white',
    // padding: '0.5rem 1rem',
    // marginRight: '1.5rem',
    // marginBottom: '1.5rem',
    cursor: 'move',
    float: 'left',
  }
  
  export interface BoxProps {
    name: string,
    handleAddToList: (v:string) => void
  }
  
  interface DropResult {
    name: string
  }

export const Box = ({ name, handleAddToList }: BoxProps) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: ItemTypes.BOX,
    // type:"box",
      item: { name },
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult<DropResult>()
        if (item && dropResult) {
            handleAddToList(item.name)
          alert(`You dropped ${item.name} into ${dropResult.name}!`)
        }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        handlerId: monitor.getHandlerId(),
      }),
    }))
  
    const opacity = isDragging ? 0.4 : 1
    return (
      <div
        className='p-2 bg-primary-foreground'
        ref={drag} 
        style={{ ...style, opacity }} 
        // data-testid={`box`}
      >
        {name}
      </div>
    )
  }
