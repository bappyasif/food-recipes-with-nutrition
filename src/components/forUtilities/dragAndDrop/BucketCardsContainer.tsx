import React, { CSSProperties, FC, memo, useCallback, useEffect, useState } from 'react'
import { CardBoxProps } from './RecipesList'
import { useDrag, useDrop } from 'react-dnd'
import update from 'immutability-helper'

export const BucketCardsContainer = ({ recipeCards }: { recipeCards: CardBoxProps[] }) => {
    const [cards, setCards] = useState<CardBoxProps[]>([])

    useEffect(() => {
        setCards(recipeCards)
    }, [recipeCards])

    const findCard = useCallback(
        (id: string) => {
            const card = cards.filter((c) => `${c?.id}` === id)[0]
            return {
                card,
                index: cards.indexOf(card),
            }
        },
        [cards],
    )

    const moveCard = useCallback(
        (id: string, atIndex: number) => {
            const { card, index } = findCard(id)
            setCards(
                update(cards, {
                    $splice: [
                        [index, 1],
                        [atIndex, 0, card],
                    ],
                }),
            )
        },
        [findCard, cards, setCards],
    )

    const [, drop] = useDrop(() => ({ accept: "card" }))
    return (
        <div
            ref={drop}
            // className='flex flex-col gap-y-2 h-72 overflow-y-scroll no-scrollbar w-[10.5rem]'
            // className='flex flex-col gap-y-2 h-96 overflow-y-scroll no-scrollbar w-full'
            // className='flex flex-col gap-y-2 h-full overflow-y-scroll no-scrollbar w-full mb-6'
            className='flex flex-col gap-y-2 h-32 md:h-full overflow-y-scroll no-scrollbar w-full mb-6'
        >
            {cards.map((card) => (
                <Card
                    key={card?.id}
                    id={`${card?.id}`}
                    text={card?.label}
                    imgSrc={card?.imgSrc}
                    moveCard={moveCard}
                    findCard={findCard}
                />
            ))}
        </div>
    )
}

const style: CSSProperties = {
    backgroundColor: 'white',
    cursor: 'move',
}

export interface CardProps {
    id: string
    text: string
    imgSrc: string
    moveCard: (id: string, to: number) => void
    findCard: (id: string) => { index: number }
}

interface Item {
    id: string
    originalIndex: number
}

export const Card: FC<CardProps> = memo(function Card({
    id,
    text,
    imgSrc,
    moveCard,
    findCard,
}) {
    const originalIndex = findCard(id).index
    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: "card",
            item: { id, originalIndex },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
            end: (item, monitor) => {
                const { id: droppedId, originalIndex } = item
                const didDrop = monitor.didDrop()
                if (!didDrop) {
                    moveCard(droppedId, originalIndex)
                }
            },
        }),
        [id, originalIndex, moveCard],
    )

    const [, drop] = useDrop(
        () => ({
            accept: "card",
            hover({ id: draggedId }: Item) {
                if (draggedId !== id) {
                    const { index: overIndex } = findCard(id)
                    moveCard(draggedId, overIndex)
                }
            },
        }),
        [findCard, moveCard],
    )

    const opacity = isDragging ? 0 : 1

    return (
        <div
            ref={(node) => drag(drop(node))}
            className='flex gap-x-2 outline outline-primary outline-1 justify-between items-center px-4'
            style={{ ...style, opacity }}
        >
            <h2 className='text-primary text-xl'>{text}</h2>
            <img src={imgSrc} width={60} height={60} alt={text} className='w-11 h-11 rounded-full' />
        </div>
    )
})

