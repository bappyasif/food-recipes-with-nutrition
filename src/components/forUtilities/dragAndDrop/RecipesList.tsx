import { useForInputTextChange } from '@/hooks/forComponents'
import { RecipeTypes } from '@/types'
import { searchRecipesByNameFromApi } from '@/utils/dataFetching'
import React, { CSSProperties, useEffect, useState } from 'react'
// import { BoxProps } from './Box'
import { useDrag } from 'react-dnd'
import { Bucket } from './Bucket'

type RecipeCardType = {
    id: number,
    label: string,
    imgSrc: string,
    uri: string
}

export const RecipesList = ({open}: {open: boolean}) => {
    const [recipeCards, setRecipeCards] = useState<CardBoxProps[]>([])
    const addToCards = (item: CardBoxProps) => setRecipeCards(prev => [...prev, item])
    const updateCards = (dataset: CardBoxProps[]) => setRecipeCards(dataset)

    // console.log(recipeCards, "recipeCards!!")

    return (
        <div className={`flex xxs:flex-col xxs:gap-y-4 md:flex-row gap-2 justify-between transition-all duration-1000 ${open ? "h-96" : "h-72"}`}>
            <Bucket cards={recipeCards} updateCards={updateCards} />
            <SearchRecipesByName addToCards={addToCards} />
        </div>
    )
}

const SearchRecipesByName = ({addToCards}: {addToCards: (d: any) => void}) => {
    const { handleTextChange, text } = useForInputTextChange();

    return (
        <div className='relative bg-accent'>
            <input type="text" placeholder='seacrh recipes by name' value={text} onChange={handleTextChange} className='bg-transparent' />
            <ShowAllFoundRecipes text={text} addToCards={addToCards} />
        </div>
    )
}

const ShowAllFoundRecipes = ({ text, addToCards }: { text: string, addToCards: (d:any) => void }) => {
    const [recipes, setRecipes] = useState<RecipeTypes[]>([])

    useEffect(() => {
        text && searchRecipesByNameFromApi(text).then(data => setRecipes(data.meals)).catch(err => console.log(err))
        !text && setRecipes([])
    }, [text])

    const returnNeededData = (item : RecipeTypes) => ({label: item.strMeal, id: item.idMeal, imgSrc: item.strMealThumb})

    const renderRecipes = () => recipes.map(item => <CardBox key={item.idMeal} data={returnNeededData(item)} addToCards={addToCards} />)

    return (
        <div className={`absolute flex flex-col gap-y-2 ${recipes?.length ? "h-80 overflow-y-scroll" : "h-0"}`}>
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
    // handleAddToList: ()
    // addToCards: (d: CardBoxProps) => void
}

type RecipeCardBoxProps = {
    data: CardBoxProps,
    addToCards: (d: CardBoxProps) => void
}

// const CardBox = ({ ...items }: CardBoxProps) => {
const CardBox = ({ ...items }: RecipeCardBoxProps) => {
    const {addToCards,data} = items
    
    const {label, id, imgSrc} = data;

    const [{ isDragging, handlerId }, drag] = useDrag(() => ({
        //   type: ItemTypes.BOX,
        // type: "box",
        type: "card",
        item: { label, id, imgSrc },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult<DropResult>()
            if (item && dropResult) {
                // handleAddToList(item.name)
                addToCards({label, id, imgSrc})
                // console.log(label, "dropped!!")
                // alert(`You dropped ${item.name} into ${dropResult.name}!`)
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
            className='p-2 bg-primary-foreground flex gap-2 items-center justify-between'
            ref={drag}
            style={{ ...style, opacity }}
        // data-testid={`box`}
        >
            <h2 className='text-primary text-xl'>{label}</h2>
            <img src={imgSrc} width={60} height={60} alt={label} className='w-11 h-11 rounded-full' />
        </div>
    )
}

const style: CSSProperties = {
    border: '1px dashed gray',
    // backgroundColor: 'white',
    // padding: '0.5rem 1rem',
    // marginRight: '1.5rem',
    // marginBottom: '1.5rem',
    cursor: 'move',
    float: 'left',
}