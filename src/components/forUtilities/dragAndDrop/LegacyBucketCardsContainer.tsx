import React, { CSSProperties, useCallback } from 'react'
import { CardBoxProps } from './RecipesList'
import { useDrag, useDrop } from 'react-dnd'
import update from 'immutability-helper'

export const BucketCardsContainer = ({ cards, updateCards }: { cards: CardBoxProps[], updateCards: (data: CardBoxProps[]) => void }) => {
    const findCard = useCallback(
        (id: string) => {
            const card = cards.find((item, idx) => item?.id === id) as CardBoxProps

            return {
                card,
                idx: cards.indexOf(card)
            }
        }
        ,
        [cards]
    )

    // const moveCard = useCallback(
    //     (dragCardId: string, hoverIndex: number) => {
    //         const { idx, card } = findCard(dragCardId)
    //         updateCards(
    //             update(cards, {
    //                 $splice: [
    //                     [idx, 1],
    //                     [hoverIndex, 0, card]
    //                 ]
    //             })
    //         )
    //     },

    //     [findCard, cards, updateCards]
    // )

    const moveCard = (dragCardId: string, hoverIndex: number) => {
        const { idx, card } = findCard(dragCardId)
        console.log(idx, hoverIndex, "checkfrommoive!!")
        updateCards(
            update(cards, {
                $splice: [
                    [idx, 1],
                    [hoverIndex, 0, card]
                ]
            })
        )
    }

    const renderCardBoxes = () => cards.map(item => <BucketCard key={item?.id} data={item} findCard={findCard} moveCard={moveCard} />)

    const [, drop] = useDrop(() => ({ accept: "card" }))

    return (
        <div ref={drop} className='flex flex-col gap-y-2 h-72 overflow-y-scroll no-scrollbar w-[10.5rem]'>
            {renderCardBoxes()}
        </div>
    )
}

type BucketCardProps = {
    data: CardBoxProps,
    moveCard: (i: string, to: number) => void,
    findCard: (i: string) => { idx: number }
}

const BucketCard = ({ ...items }: BucketCardProps) => {
    const { data, findCard, moveCard } = items

    const originalIdx = findCard(data?.id).idx

    const [{ isDragging }, drag] = useDrag(() => ({
        type: "card",
        item: data,
        collect(monitor) {
            return {
                isDragging: data?.id ? monitor.isDragging() : false
            }
        },
        end(draggedItem, monitor) {
            if (!data?.id) return

            const { id } = draggedItem
            const didDrop = monitor.didDrop()

            if (didDrop) {
                if(id === data.id) return

                const {idx} = findCard(id)

                console.log(idx, "DRPPING!! end dragged", originalIdx)

                moveCard(id, originalIdx)
            }
        },
    }), [data?.id, originalIdx, moveCard])

    const [, drop] = useDrop(() => ({
        accept: "card",
        // drop(item, monitor) {
        //     if (!data?.id) return
        //     const { idx } = findCard(data?.id)
        //     const { id: drppedId } = item as CardBoxProps;
        //     if(monitor.canDrop()) {
        //         if(drppedId === data.id) return
        //         moveCard(drppedId, idx)
        //         console.log(drppedId, "drooped2222", data.id)
        //     } else {
        //         console.log(drppedId, "dropped!!", data.id, monitor.canDrop(), monitor.didDrop())
        //     }
        // },

        hover(item, monitor) {
            if (!data?.id) return
            const { id: draggedId } = item as CardBoxProps;

            // if (draggedId !== data?.id) {
            //     const { idx } = findCard(data?.id)
            //     moveCard(draggedId, idx)
            // }

            // console.log(draggedId, "draggedId", data.id)

            const { idx } = findCard(data?.id)
            const {idx: dIdx} = findCard(draggedId)
            console.log(dIdx, idx, "check!! from hover!!")

            if(dIdx === -1) return

            if (monitor?.isOver()) {
                if (draggedId !== data.id) {
                    // moveCard(draggedId, idx)
                    moveCard(draggedId, idx)
                }
            } 
            // else {
            //     console.log(draggedId, data.id, "else block!!")
            //     moveCard(draggedId, idx)
            // }

            // const { idx } = findCard(data?.id)
            // moveCard(draggedId, idx)
        },
    }))

    const opacity = isDragging ? 0 : 1

    if (!data?.id) return

    const { id, imgSrc, label } = data;

    return (
        <div
            ref={node => drag(drop(node))}
            className='flex gap-x-2 outline outline-primary outline-1 justify-between items-center px-4'
            style={{ ...cardBoxstyle, opacity }}
        >
            <h2 className='text-primary text-xl'>{label}</h2>
            <img src={imgSrc} width={60} height={60} alt={label} className='w-11 h-11 rounded-full' />
        </div>
    )
}

const cardBoxstyle: CSSProperties = {
    // border: '1px dashed gray',
    // padding: '0.5rem 1rem',
    // marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'move',
}
