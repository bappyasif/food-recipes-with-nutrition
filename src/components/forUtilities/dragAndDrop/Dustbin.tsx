import React, { CSSProperties, useCallback } from 'react'
import { useDrop } from 'react-dnd'
import { CardType } from './Container'

const style: CSSProperties = {
    height: '12rem',
    width: '12rem',
    marginRight: '1.5rem',
    marginBottom: '1.5rem',
    color: 'white',
    padding: '1rem',
    textAlign: 'center',
    fontSize: '1rem',
    lineHeight: 'normal',
    float: 'left',
}

export const ItemTypes = {
    BOX: 'box',
}


// export const Dustbin = ({cards}: {cards: string[]}) => {
export const Dustbin = ({cards}: {cards: CardType[]}) => {
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.BOX,
        drop: () => ({ name: 'Dustbin bees!!' }),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }))

    const isActive = canDrop && isOver
    let backgroundColor = 'hsl(var(--pf)'
    if (isActive) {
        backgroundColor = 'darkgreen'
    } else if (canDrop) {
        backgroundColor = 'darkkhaki'
    }

    const renderCard = useCallback((card:string, index:number) => {
        return (
            <h2 key={card + index}>{card}</h2>
        //   <Card
        //     key={card.id}
        //     index={index}
        //     id={card.id}
        //     text={card.text}
        //     moveCard={moveCard}
        //   />
        )
      }, [])

      const renderCards = () => cards.map((card, idx) => renderCard(card.text, idx))

    return (
        <div
            className='bg-primary-focus'
            ref={drop}
            style={{ ...style, backgroundColor }}
            // data-testid="dustbin"
        >
            {isActive ? 'Release to drop' : 'Drag a box here'}
            {renderCards()}
        </div>
    )
}
