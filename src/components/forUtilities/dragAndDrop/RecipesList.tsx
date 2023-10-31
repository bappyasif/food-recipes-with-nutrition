import { useForInputTextChange } from '@/hooks/forComponents'
import { RecipeTypes } from '@/types'
import { searchRecipesByNameFromApi } from '@/utils/dataFetching'
import React, { CSSProperties, useEffect, useState } from 'react'
// import { BoxProps } from './Box'
import { useDrag } from 'react-dnd'
import { Bucket } from './Bucket'
import { Button } from '@/components/ui/button'

type RecipeCardType = {
    id: number,
    label: string,
    imgSrc: string,
    uri: string
}

export const RecipesList = ({ open }: { open: boolean }) => {
    const [recipeCards, setRecipeCards] = useState<CardBoxProps[]>([])
    const addToCards = (item: CardBoxProps) => setRecipeCards(prev => [...prev, item])
    const updateCards = (dataset: CardBoxProps[]) => setRecipeCards(dataset)

    // console.log(recipeCards, "recipeCards!!")

    return (
        <div
            className={`flex xxs:flex-col xxs:gap-y-4 md:flex-row gap-2 justify-between transition-all duration-1000 ${open ? "xxs:w-52 sm:w-[14rem] md:w-[33rem] scale-100 min-h-full h-[510px]" : "h-72 w-0 scale-0"}`}
        // className={`flex xxs:flex-col xxs:gap-y-4 md:flex-row gap-2 justify-between transition-all duration-1000 ${open ? "h-96 -translate-x-96" : "h-72 scale-0 translate-x-0"}`}

        // className={`transition-all duration-1000 ${open ? "h-[690px] xxs:w-64 sm:w-[26rem] md:w-[36rem] xl:w-[830px] scale-100" : "h-72 w-0 scale-0"}`}
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
            <input type="text" placeholder='seacrh recipes by name' value={text} onChange={handleTextChange}
                // className='bg-transparent px-2 my-2 w-full border-b-2 rounded-lg' 
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
        <div className={`absolute flex flex-col gap-y-2 ${recipes?.length ? "h-[22.5rem] overflow-y-scroll no-scrollbar" : "h-0"} w-full`}>
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
    const { addToCards, data } = items

    const { label, id, imgSrc } = data;

    const [{ isDragging, handlerId }, drag] = useDrag(() => ({
        //   type: ItemTypes.BOX,
        // type: "box",
        type: "card",
        item: { label, id, imgSrc },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult<DropResult>()
            if (item && dropResult) {
                // handleAddToList(item.name)
                addToCards({ label, id, imgSrc })
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
            className='p-2 bg-primary-foreground flex flex-col gap-y-2 items-center justify-between w-full'
            ref={drag}
            style={{ ...style, opacity }}
        // data-testid={`box`}
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
    // backgroundColor: 'white',
    // padding: '0.5rem 1rem',
    // marginRight: '1.5rem',
    // marginBottom: '1.5rem',
    cursor: 'move',
    float: 'left',
}