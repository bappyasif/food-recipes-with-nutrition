import { useForInputTextChange } from '@/hooks/forComponents'
import { RecipeTypes } from '@/types'
import { searchRecipesByNameFromApi } from '@/utils/dataFetching'
import React, { CSSProperties, useEffect, useState } from 'react'
import { useDrag } from 'react-dnd'
import { Bucket } from './Bucket'
import { Button } from '@/components/ui/button'

export const RecipesList = ({ open }: { open: boolean }) => {
    const [recipeCards, setRecipeCards] = useState<CardBoxProps[]>([])
    const addToCards = (item: CardBoxProps) => setRecipeCards(prev => [...prev, item])
    const updateCards = (dataset: CardBoxProps[]) => setRecipeCards(dataset)

    return (
        <div
            className={`flex xxs:flex-col xxs:gap-y-4 md:flex-row gap-2 justify-between transition-all duration-1000 ${open ? "xxs:w-52 sm:w-[14rem] md:w-[33rem] scale-100 min-h-full h-[510px]" : "h-72 w-0 scale-0"}`}
        >
            <Bucket cards={recipeCards} updateCards={updateCards} />
            <SearchRecipesByName addToCards={addToCards} />
        </div>
    )
}

const SearchRecipesByName = ({ addToCards }: { addToCards: (d: any) => void }) => {
    const { handleTextChange, text } = useForInputTextChange();

    return (
        <div className='relative'>
            <input 
                type="text" placeholder='seacrh recipes by name' 
                value={text} onChange={handleTextChange}
                className="w-full mt-2 rounded-sm pl-4 text-special-foreground bg-transparent border-0 border-b-2 border-b-special placeholder:text-special-foreground mb-1.5"
            />
            <ShowAllFoundRecipes text={text} addToCards={addToCards} />
        </div>
    )
}

const ShowAllFoundRecipes = ({ text, addToCards }: { text: string, addToCards: (d: any) => void }) => {
    const [recipes, setRecipes] = useState<RecipeTypes[]>([])

    useEffect(() => {
        text && searchRecipesByNameFromApi(text).then(data => setRecipes(data.meals)).catch(err => console.log(err))
        !text && setRecipes([])
    }, [text])

    const returnNeededData = (item: RecipeTypes) => ({ label: item.strMeal, id: item.idMeal, imgSrc: item.strMealThumb })

    const renderRecipes = () => recipes.map(item => <CardBox key={item.idMeal} data={returnNeededData(item)} addToCards={addToCards} />)

    return (
        <div className={`absolute flex flex-col gap-y-2 ${recipes?.length ? "h-[29rem] overflow-y-scroll no-scrollbar" : "h-0"} xxs:w-[13rem] sm:w-[13.9rem] lg:w-[15.9rem]`}>
            {recipes?.length ? renderRecipes() : null}
        </div>
    )
}

interface DropResult {
    name: string,
    id: number
}

export type CardBoxProps = {
    label: string,
    imgSrc: string,
    id: string,
}

type RecipeCardBoxProps = {
    data: CardBoxProps,
    addToCards: (d: CardBoxProps) => void
}

const CardBox = ({ ...items }: RecipeCardBoxProps) => {
    const { addToCards, data } = items

    const { label, id, imgSrc } = data;

    const [{ isDragging, handlerId }, drag] = useDrag(() => ({
        type: "card",
        item: { label, id, imgSrc },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult<DropResult>()
            if (item && dropResult) {
                addToCards({ label, id, imgSrc })
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
            className='p-2 bg-primary-foreground flex flex-col gap-y-2 items-center justify-between w-full'
            ref={drag}
            style={{ ...style, opacity }}
        >
            <div className='flex gap-x-2 items-center justify-between'>
                <h2 className='text-primary text-xl'>{label}</h2>
                <img src={imgSrc} width={60} height={60} alt={label} className='w-11 h-11 rounded-full' />
            </div>
            <Button className='text-primary' variant={'secondary'} onClick={() => {
                addToCards({ label, id, imgSrc })
            }}>Add Recipe To Bucket</Button>
        </div>
    )
}

const style: CSSProperties = {
    border: '1px dashed gray',
    cursor: 'move',
    float: 'left',
}