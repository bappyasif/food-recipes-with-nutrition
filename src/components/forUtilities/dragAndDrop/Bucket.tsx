import React, { CSSProperties, useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import { CardBoxProps } from './RecipesList'
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
import { useLocale } from 'next-intl'
import { BucketCardsContainer } from './BucketCardsContainer'

const style: CSSProperties = {
    // height: '4rem',
    // width: '13rem',
    height: '1.1rem',
    width: '100%',
    // marginRight: '1.5rem',
    marginBottom: '1.5rem',
    // color: 'white',
    // padding: '1rem',
    padding: '1.3rem',
    textAlign: 'center',
    fontSize: '1rem',
    lineHeight: 'normal',
    float: 'left',
    // paddingTop: "1.37rem"
}

type BucketProps = {
    cards: CardBoxProps[],
    updateCards: (data: CardBoxProps[]) => void,
    searchText: string
}

export const Bucket = ({ cards, updateCards, searchText }: BucketProps) => {
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
        <div
            className='flex flex-col gap-y-2 w-72 md:w-1/2 justify-between items-center pl-2 bg-accent/40'
        >
            <h2
                className={`text-muted bg-background font-bold text-xl flex items-center justify-center rounded-sm`}
                style={{ ...style }}
            >
                {
                    cards.length === 0 ? "Search Recipes First" : cards.length < 2 ? "Add More Cards" : "You Can Re-arrange Cards"
                }
            </h2>

            {/* we can directly use this for drop and drag of recipes card but have to make cards item compliance with already implemented module */}
            <BucketCardsContainer recipeCards={cards} />

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

    const route = useRouter()

    const [seStr, setSeStr] = useState({ start: "", end: "" })

    const getStartStr = (data: any) => setSeStr(prev => ({ ...prev, start: data.start }))
    const getEndStr = (data: any) => setSeStr(prev => ({ ...prev, end: data.end }))

    const handleScheduler = () => {
        const getFourRecipes = () => cards.map(item => ({ name: item.label, imgSrc: item.imgSrc }));

        const eventItem: EventItemTypes = {
            start: seStr.start ? moment(seStr.start!).toDate() : moment().toDate(),
            end: seStr.end ? moment(seStr.end!).toDate() : moment().add(1, "hour").toDate(),
            id: v4(),
            title: `Cooking Recipe List:: ${text}` || "no title has provided",
            description: descText || "go gogogogoogog",
            recipes: getFourRecipes()
        }

        if (userData?.email) {
            eventItem.user = {
                email: userData.email,
                name: userData.name || "Dear User"
            }
        }

        status === "authenticated" && addToSchedulerEvents(eventItem)

        updateCards([])

        handleFalsy()

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
        <div
            className='w-full self-center pb-0.5'
        >
            <div
                className='flex xxs:flex-col gap-2 justify-between'
            >
                <Button
                    className='text-xs w-full text-content-light/80'
                    disabled={!cards?.length || status === "unauthenticated"}
                    onClick={handleClickedScheduler}
                    title={decideTitleText()}
                >Add To Scheduler</Button>
                <ShareInSocialMedias hashtags={["cooking", "recipes"]} description='Get to know your cooking side of it' title='Cooking Recipes' ready={!!cards.length} />
            </div>
            {
                isTrue
                    ?
                    <Popover open={isTrue}>
                        <PopoverContent className='bg-accent flex flex-col gap-y-2 w-fit text-content/90 z-40'>
                            <span>
                                <span>Title</span>
                                <input type="text" value={text} onChange={handleTextChange} className='bg-secondary/80 w-full' required placeholder='e.g. Event title goes here....' />
                            </span>

                            <span>
                                <span>Descriptions</span>
                                <textarea name="description" id="description" className="w-full bg-secondary/80" rows={6} value={descText} onChange={handleDesc} placeholder='e.g. Event details goes here....'></textarea>
                            </span>

                            <EventCreateTimeAndDate getEndStr={getEndStr} getStartStr={getStartStr} />

                            {/* <div className='bg-card flex gap-2 w-full my-1'>
                                <Badge onClick={handleScheduler} className='w-full text-center flex justify-center'>Add</Badge>
                                <Badge onClick={handleFalsy} className='w-full flex justify-center'>Cancel</Badge>
                            </div> */}
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

const CustomDateAndTime = ({ heading, getData }: { heading: string, getData: (item: object) => void }) => {
    const { handleTextChange, text, resetText } = useForInputTextChange()

    console.log(text)

    const isStart = () => heading.includes("Start")

    useEffect(() => {
        getData({ [isStart() ? "start" : "end"]: text })
    }, [text])

    return (
        <span className='flex justify-between gap-x-2 w-full'>
            <span>{heading}</span>
            <input className='bg-accent/20' type="datetime-local" name="date-time" id="date-time" onChange={handleTextChange} />
        </span>
    )
}

const EventCreateTimeAndDate = ({ getStartStr, getEndStr }: { getStartStr: (data: object) => void, getEndStr: (data: object) => void }) => {
    return (
        <span className='flex flex-col gap-1'>
            <CustomDateAndTime heading='Start Date-time' getData={getStartStr} />
            <CustomDateAndTime heading='End Date-time' getData={getEndStr} />
        </span>
    )
}

export const ShareInSocialMedias = ({ nestedRoute, hashtags, title, description, ready }: { nestedRoute?: string, hashtags?: string[], title: string, description: string, ready: boolean }) => {
    const decideUrl = process.env.NODE_ENV === "development" ? "http://localhost:3000" : `${process.env.NEXT_PUBLIC_API_HOSTED}`

    const locale = useLocale()

    return (
        <div
            title={!ready ? "Add Cards First From Search Results Dropdown" : "Ready For Share"}
        >
            {/* <span className='text-special-foreground font-bold'>Share in Social Media</span> */}

            <span
                // className={`flex justify-between gap-2 ${ready ? "cursor-pointer" : "cursor-auto pointer-events-none"}`}
                className={`flex justify-start gap-4 ${ready ? "cursor-pointer" : "cursor-auto pointer-events-none"}`}
            >
                <FacebookShareButton url={`${decideUrl}/${nestedRoute ? nestedRoute : locale}`} hashtag={`${hashtags?.length ? hashtags[0] : "What's_Cooking_Yo!!"}`} title={`${title}`}
                >
                    <FacebookIcon size={36} round />
                </FacebookShareButton>

                <TwitterShareButton
                    url={`${decideUrl}/${nestedRoute ? nestedRoute : locale}`}
                    hashtags={hashtags?.length ? hashtags : ["test", "test2"]}
                    related={["item1", "item2"]}
                    title={`${title}`}
                >
                    <TwitterIcon round size={36} />
                </TwitterShareButton>

                <PinterestShareButton url={`${decideUrl}/${nestedRoute ? nestedRoute : locale}`} media='' description={description || "some description"}
                    title={`${title}`}
                >
                    <PinterestIcon round size={36} />
                </PinterestShareButton>

                <EmailShareButton url={`${decideUrl}/${nestedRoute ? nestedRoute : locale}`} subject='Some Subject For Email' body='Some text for body!! some more tetx mose more text!!' separator='[[<#>]]'
                    title={`${title}`}
                >
                    <EmailIcon round size={36} />
                </EmailShareButton>
            </span>

        </div>
    )
}