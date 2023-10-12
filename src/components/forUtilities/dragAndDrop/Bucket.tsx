import React, { CSSProperties, useCallback } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { CardBoxProps } from './RecipesList'
import update from 'immutability-helper'
import { Button } from '@/components/ui/button'
import moment from 'moment'
import { v4 } from 'uuid'
import { EventItemTypes, ITEMS } from '../bigCalender/Scheduler'
import { useForInputTextChange, useForTruthToggle } from '@/hooks/forComponents'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const style: CSSProperties = {
    height: '4rem',
    width: '12rem',
    marginRight: '1.5rem',
    // marginBottom: '1.5rem',
    color: 'white',
    padding: '1rem',
    textAlign: 'center',
    fontSize: '1rem',
    lineHeight: 'normal',
    float: 'left',
}

type BucketProps = {
    cards: CardBoxProps[],
    updateCards: (data: CardBoxProps[]) => void
}

export const Bucket = ({ cards, updateCards }: BucketProps) => {
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: "card",
        collect(monitor) {
            return ({
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
                // itemDropped: monitor.getItem()
            })
        },
    }))

    const isActive = canDrop && isOver;

    let backgroundColor = 'hsl(var(--pf)'

    if (isActive) {
        backgroundColor = 'darkgreen'
    } else if (canDrop) {
        backgroundColor = 'darkkhaki'
    }

    return (
        <div className='flex xxs:flex-col-reverse  md:flex-col gap-y-2 w-60'>
            <div
                className='bg-primary-focus'
                ref={drop}
                style={{ ...style, backgroundColor }}
            >
                {isActive ? 'Release to drop' : 'Drag a box here'}
            </div>
            Re-arrange Cards
            <hr />
            {/* we can directly use this for drop and drag of recipes card but have to make cards item compliance with already implemented module */}
            <RenderCardBoxes cards={cards} updateCards={updateCards} />

            <UserActions cards={cards} updateCards={updateCards} />
        </div>
    )
}

const UserActions = ({ cards, updateCards }: { cards: CardBoxProps[], updateCards: (data: CardBoxProps[]) => void }) => {
    const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle();

    const {handleTextChange, text} = useForInputTextChange()

    const {handleTextChange:handleDesc, text: descText} = useForInputTextChange()

    const handleScheduler = () => {

        const getFourRecipes = () => cards.map(item => ({ name: item.label, imgSrc: item.imgSrc })).slice(0, 4);

        const eventItem: EventItemTypes = {
            start: moment().toDate(),
            end: moment().add(1, "hour").toDate(),
            // id: 1,
            id: v4(),
            title: text || "no title has provided",
            description: descText || "go gogogogoogog",
            recipes: getFourRecipes()
        }

        ITEMS.push(eventItem)

        // console.log(eventItem)
        
        updateCards([])
        
        handleFalsy()
    }

    const handleClickedScheduler = () => handleTruthy()

    return (
        <div>
            <div className='flex justify-between'>
                <Button className='text-xs' onClick={handleClickedScheduler}>Add To Scheduler</Button>
                <Button className='text-xs'>Share In Social Media</Button>
            </div>
            {
                isTrue
                    ?
                    <Popover open={isTrue}>
                        <PopoverContent>
                            <span>
                                <span>Title</span>
                                <input type="text" value={text} onChange={handleTextChange} className='bg-secondary w-full' required />
                            </span>

                            <span>
                                <span>Descriptions</span>
                                <textarea name="description" id="description" className="w-full bg-secondary" rows={6} value={descText} onChange={handleDesc}></textarea>
                            </span>
                        </PopoverContent>
                        <PopoverTrigger>
                            <Button onClick={handleScheduler}>Add</Button>
                            <Button onClick={handleFalsy}>Cancel</Button>
                        </PopoverTrigger>
                    </Popover>
                    : null
            }
        </div>
    )
}

const RenderCardBoxes = ({ cards, updateCards }: { cards: CardBoxProps[], updateCards: (data: CardBoxProps[]) => void }) => {
    // const updateCards = (data: CardBoxProps[]) => setTest(data)

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

    const moveCard = useCallback(
        (id: string, atIndex: number) => {
            const { idx, card } = findCard(id)
            // console.log(idx, card, atIndex)
            updateCards(
                update(cards, {
                    $splice: [
                        [idx, 1],
                        [atIndex, 0, card]
                    ]
                })
            )
        },

        [findCard, cards, updateCards]
    )



    const renderCardBoxes = () => cards.map(item => <BucketCard key={item?.id} data={item} findCard={findCard} moveCard={moveCard} />)

    const [, drop] = useDrop(() => ({ accept: "card" }))

    return (
        <div ref={drop} className='flex flex-col gap-y-2 h-60 overflow-y-scroll'>
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

    if (!data?.id) return

    const { id, imgSrc, label } = data;

    const originalIdx = findCard(id).idx

    const [{ isDragging }, drag] = useDrag(() => ({
        type: "card",
        item: data,
        // item: {id, originalIdx},
        collect(monitor) {
            return {
                isDragging: monitor.isDragging()
            }
        },
        end(draggedItem, monitor) {
            // const {id, originalIdx} = draggedItem;
            const { id } = draggedItem
            const didDrop = monitor.didDrop()

            if (didDrop) {
                moveCard(id, originalIdx)
                // console.log("dropped!!", id, originalIdx)
                // console.log(id, "moving from drag", originalIdx)
            }
        },
    }), [id, originalIdx, moveCard])

    const [, drop] = useDrop(() => ({
        accept: "card",
        hover(item, monitor) {
            // console.log(item, "HOVERIBNG")
            const { id: draggedId } = item as CardBoxProps;
            if (draggedId !== id) {
                const { idx } = findCard(id)
                moveCard(draggedId, idx)
                // console.log(idx, "moving from hover", draggedId, id)
            }
        },
    }))

    const opacity = isDragging ? 0 : 1

    // console.log(opacity, "opac")

    return (
        <div
            ref={node => drag(drop(node))}
            className='flex gap-x-2 outline outline-primary outline-1 justify-between items-center'
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