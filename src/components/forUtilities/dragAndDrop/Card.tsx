import React, { CSSProperties, memo } from 'react'
import { useDrag, useDrop } from 'react-dnd'

type CardProps = {
    id: number,
    text: string,
    moveCard: (i: number, to: number) => void,
    findCard: (i: number) => { idx: number }
}

const style: CSSProperties = {
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'move',
  }

export const Card = memo(({ id, text, moveCard, findCard }: CardProps) => {
    const originalIdx = findCard(id).idx

    const [{isDragging}, drag] = useDrag(
        () => ({
            type: "card",
            item: {id, originalIdx},
            collect: (monitor) => ({
                isDragging: monitor.isDragging()
            }),
            end: (item, monitor) => {
                const {id: droppedId, originalIdx} = item;
                const didDrop = monitor.didDrop()

                if(!didDrop) {
                    moveCard(droppedId, originalIdx)
                }
            }
        }),
        [id, originalIdx, moveCard]
    )

    const [, drop] = useDrop(
        () => ({
            accept: "card",
            hover({id: draggedId}: {id: number}) {
                if(draggedId !== id) {
                    const {idx: overIndex} = findCard(id)
                    moveCard(draggedId, overIndex)
                }
            }
        }),
        [moveCard, findCard]
    )

    const opacity = isDragging ? 0 : 1

    return (
        <div ref={node => drag(drop(node))} style={{...style, opacity}}>{text}</div>
    )
})

Card.displayName = "Card"