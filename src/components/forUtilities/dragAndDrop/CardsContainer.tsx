import React, { useCallback, useState } from 'react'
import { useDrop } from 'react-dnd'
import { Card } from './Card'
import update from 'immutability-helper'
import { CardType } from './Container'

const ITEMS = [
    {
      id: 1,
      text: 'Write a cool JS library',
    },
    {
      id: 2,
      text: 'Make it generic enough',
    },
    {
      id: 3,
      text: 'Write README',
    },
    {
      id: 4,
      text: 'Create some examples',
    },
    {
      id: 5,
      text: 'Spam in Twitter and IRC to promote it',
    },
    {
      id: 6,
      text: '???',
    },
    {
      id: 7,
      text: 'PROFIT',
    },
  ]

// {cards, updateCards}: {cards: string[], updateCards: (c:string[]) => void}

type CardProp = {
    id: number;
    text: string;
}

// export const CardsContainer = () => {
//     const [cards, setCards] = useState<CardProp[]>(ITEMS);

//     const findCard = useCallback(
//         (id:number) => {
//             const card = cards.find((card) => card?.id === id) as CardProp

//             console.log(card);

//             return {
//                 card,
//                 idx: cards.indexOf(card)
//             }
//         }
//         ,
//         [cards]
//     )

//     const moveCard = useCallback(
//         (id:number, atIndex: number) => {
//             const {idx, card} = findCard(id)
//             card && setCards(
//                 update(cards, {
//                     $splice: [
//                         [idx, 1],
//                         [atIndex, 0, card]
//                     ]
//                 })
//             )
//         },

//         [findCard, cards, setCards]
//     )

//     const [, drop] = useDrop(() => ({accept: "card"}))
    
//     const renderCards = () => cards.map((card, idx) => <Card findCard={findCard} id={card.id} moveCard={moveCard} text={card?.text} key={idx} />)

//   return (
//     <div ref={drop} className='w-fit text-primary-content'>{renderCards()}</div>
//   )
// }

export const CardsContainer = ({cards, updateCards}: {cards: CardType[], updateCards: (c:CardType[]) => void}) => {
    
    const findCard = useCallback(
        (id:number) => {
            const card = cards.find((_, idx) => id === idx) as CardType

            return {
                card,
                idx: cards.indexOf(card)
            }
        }
        ,
        [cards]
    )

    const moveCard = useCallback(
        (id:number, atIndex: number) => {
            const {idx, card} = findCard(id)
            updateCards(
                update(cards, {
                    $splice: [
                        [idx, 1],
                        [atIndex, 0, card]
                    ]
                })
            )

            // let temp: CardType[] = []

            // temp = temp.concat(cards.slice(0, idx), card, cards.slice(atIndex))
            // updateCards(temp)
        },

        [findCard, cards, updateCards]
    )

    const [, drop] = useDrop(() => ({accept: "card"}))
    
    const renderCards = () => cards.map((card, idx) => <Card findCard={findCard} id={idx} moveCard={moveCard} text={card.text} key={idx} />)

  return (
    <div ref={drop} className='w-fit text-primary-content'>{renderCards()}</div>
  )
}
