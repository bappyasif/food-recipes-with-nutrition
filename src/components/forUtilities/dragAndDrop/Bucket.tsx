import React, { CSSProperties, useCallback, useEffect } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { CardBoxProps } from './RecipesList'
import update from 'immutability-helper'
import { Button } from '@/components/ui/button'
import moment from 'moment'
import { v4 } from 'uuid'
import { useForInputTextChange, useForTruthToggle } from '@/hooks/forComponents'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, PinterestIcon, PinterestShareButton, TwitterIcon, TwitterShareButton } from "next-share"
import { Badge } from '@/components/ui/badge'
import { useSession } from 'next-auth/react'
import { EventItemTypes } from '@/types'
import { useRouter } from 'next/navigation'
import { addToSchedulerEvents } from '@/utils/dbRequests'

const style: CSSProperties = {
    height: '4rem',
    width: '13rem',
    // marginRight: '1.5rem',
    marginBottom: '1.5rem',
    color: 'white',
    padding: '1rem',
    textAlign: 'center',
    fontSize: '1rem',
    lineHeight: 'normal',
    float: 'left',
    paddingTop: "1.37rem"
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

    return (
        <div className='flex flex-col gap-y-2 w-60 justify-between items-center'>
            <div
                className={`bg-primary-focus ${isActive ? "bg-accent" : "bg-special-foreground"} mt-1.5 mx-auto xxs:hidden lg:block`}
                ref={drop}
                style={{ ...style }}
            >
                {isActive ? 'Release to drop' : 'Drag a box here'}
            </div>
            <h2 className='text-special font-bold text-xl'>Re-arrange Cards</h2>
            <hr />
            {/* we can directly use this for drop and drag of recipes card but have to make cards item compliance with already implemented module */}
            <RenderCardBoxes cards={cards} updateCards={updateCards} />

            <UserActions cards={cards} updateCards={updateCards} />
        </div>
    )
}

const UserActions = ({ cards, updateCards }: { cards: CardBoxProps[], updateCards: (data: CardBoxProps[]) => void }) => {
    const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle();

    const { handleTextChange, text, resetText } = useForInputTextChange()

    const { handleTextChange: handleDesc, text: descText, resetText: handleResetText } = useForInputTextChange()

    const { data, status } = useSession()

    const userData = data?.user

    // const dispatch = useAppDispatch()

    const route = useRouter()

    const handleScheduler = () => {

        const getFourRecipes = () => cards.map(item => ({ name: item.label, imgSrc: item.imgSrc }));

        const eventItem: EventItemTypes = {
            start: moment().toDate(),
            end: moment().add(1, "hour").toDate(),
            id: v4(),
            title: `Cooking Recipe List:: ${text}` || "no title has provided",
            description: descText || "go gogogogoogog",
            recipes: getFourRecipes()
        }

        if (userData?.email) {
            eventItem.user = {
                email: userData.email,
                name: userData.name!
            }
        }

        status === "authenticated" && addToSchedulerEvents(eventItem)

        // dispatch(addToEventsData(eventItem))

        updateCards([])

        handleFalsy()

        // route.refresh()
        route.replace("/")
    }

    const handleClickedScheduler = () => handleTruthy()

    useEffect(() => {
        !isTrue && resetText()
        !isTrue && handleResetText()
    }, [isTrue])

    const decideTitleText = () => {
        let str = ""

        if (status === "authenticated" && cards.length) {
            str = "Add To Scheuler Event"
        } else if (status === "unauthenticated" && cards.length) {
            str = "Please Login First"
        } else if (status === "authenticated" && !cards.length) {
            str = "Add Cards First From Search Results Dropdown"
        } else if (status === "unauthenticated" && !cards.length) {
            str = "Please Login First And Add Cards "
        }
        return str
    }

    return (
        <div className=''>
            <div
                className='flex xxs:flex-col gap-2 justify-between'
                title={decideTitleText()}
            >
                <Button
                    className='text-xs w-full text-muted'
                    disabled={!cards?.length || status === "unauthenticated"}
                    onClick={handleClickedScheduler}
                >Add To Scheduler</Button>
                <ShareInSocialMedias hashtags={["cooking", "recipes"]} description='Get to know your cooking side of it' title='Cooking Recipes' ready={!!cards.length} />
            </div>
            {
                isTrue
                    ?
                    <Popover open={isTrue}>
                        <PopoverContent className='bg-card flex flex-col gap-y-2 w-fit'>
                            <span>
                                <span>Title</span>
                                <input type="text" value={text} onChange={handleTextChange} className='bg-secondary w-full' required />
                            </span>

                            <span>
                                <span>Descriptions</span>
                                <textarea name="description" id="description" className="w-full bg-secondary" rows={6} value={descText} onChange={handleDesc}></textarea>
                            </span>

                            <EventCreateTimeAndDate />
                        </PopoverContent>

                        <PopoverTrigger className='bg-card flex gap-2 w-full my-1'>
                            <Badge onClick={handleScheduler} className='w-full text-center flex justify-center'>Add</Badge>
                            <Badge onClick={handleFalsy} className='w-full flex justify-center'>Cancel</Badge>
                        </PopoverTrigger>
                    </Popover>
                    : null
            }
        </div>
    )
}

const EventCreateTimeAndDate = () => {
    return (
        <span className='flex flex-col gap-1'>
            <span className='flex justify-between gap-x-2 w-full'>
                <span>Start Date-time</span>
                <input type="datetime-local" name="date-time" id="date-time" />
            </span>

            <span className='flex justify-between gap-x-2 w-full'>
                <span>End Date-time</span>
                <input type="datetime-local" name="date-time" id="date-time" />
            </span>
        </span>
    )
}

export const ShareInSocialMedias = ({ nestedRoute, hashtags, title, description, ready }: { nestedRoute?: string, hashtags?: string[], title: string, description: string, ready: boolean }) => {
    const decideUrl = process.env.NODE_ENV === "development" ? "http://localhost:3000" : process.env.NEXT_PUBLIC_API_HOSTED

    return (
        <>
            <span className='text-special-foreground font-bold'>Share in Social Media</span>

            <span className={`flex justify-between gap-2 ${ready ? "cursor-pointer" : "cursor-auto pointer-events-none"}`}>
                <FacebookShareButton url={`${decideUrl}/${nestedRoute ? nestedRoute : ""}`} hashtag={`${hashtags?.length ? hashtags[0] : "What's_Cooking_Yo!!"}`} title={title}>
                    <FacebookIcon size={36} round />
                </FacebookShareButton>

                <TwitterShareButton
                    url={`${decideUrl}/${nestedRoute ? nestedRoute : ""}`}
                    hashtags={hashtags?.length ? hashtags : ["test", "test2"]}
                    related={["item1", "item2"]} title={title} via="Whats_Cooking_Yo!!">
                    <TwitterIcon round size={36} />
                </TwitterShareButton>

                <PinterestShareButton url={`${decideUrl}/${nestedRoute ? nestedRoute : ""}`} media='' description={description || "some description"} title={title}>
                    <PinterestIcon round size={36} />
                </PinterestShareButton>

                <EmailShareButton url={`${decideUrl}/${nestedRoute ? nestedRoute : ""}`} subject='Some Subject For Email' body='Some text for body!! some more tetx mose more text!!' separator='[[<#>]]'>
                    <EmailIcon round size={36} />
                </EmailShareButton>
            </span>

        </>
    )
}

const RenderCardBoxes = ({ cards, updateCards }: { cards: CardBoxProps[], updateCards: (data: CardBoxProps[]) => void }) => {
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
                moveCard(id, originalIdx)
            }
        },
    }), [data?.id, originalIdx, moveCard])

    const [, drop] = useDrop(() => ({
        accept: "card",
        hover(item, monitor) {
            if (!data?.id) return
            const { id: draggedId } = item as CardBoxProps;

            if (draggedId !== data?.id) {
                const { idx } = findCard(data?.id)
                moveCard(draggedId, idx)
            }
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