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
    
    const { handleTextChange, text, resetText } = useForInputTextChange();

    useEffect(() => {
        open && resetText()
        open && setRecipeCards([])
    }, [open])

    return (
        <div 
            className='xxs:w-[18rem] md:w-[44.3rem]'
        >
            <p className='text-sm p-2 font-semibold text-primary text-center'>You can search your favorite recipes and add to it scheduler or share on social media as well.</p>
            
            <div
                className={`flex xxs:flex-col-reverse xxs:gap-y-4 md:flex-row gap-4 justify-between h-[37.4rem] md:h-[39.8rem] transition-all duration-1000 ${open ? "-translate-x-0" : ""} py-0.5`}
            >
                <Bucket cards={recipeCards} updateCards={updateCards} searchText={text} />
                <SearchRecipesByName addToCards={addToCards} handleTextChange={handleTextChange} text={text} />
            </div>
        </div>
    )
}

const SearchRecipesByName = ({ addToCards, text, handleTextChange }: { addToCards: (d: any) => void, text: string, handleTextChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void }) => {

    return (
        <div
            className='relative bg-accent/20 md:w-1/2 pl-2'
        >
            <input
                type="text" placeholder='seacrh recipes by name'
                value={text} onChange={handleTextChange}
                className="w-full rounded-sm px-2 text-special-foreground bg-transparent border-0 border-b-2 border-b-primary/80 placeholder:text-primary/80 mb-1.5 focus:outline-none text-xl md:text-3xl"
            />
            <ShowAllFoundRecipes text={text} addToCards={addToCards} />
        </div>
    )
}

const ShowAllFoundRecipes = ({ text, addToCards }: { text: string, addToCards: (d: any) => void }) => {
    const [recipes, setRecipes] = useState<RecipeTypes[]>([])

    useEffect(() => {
        !text && setRecipes([])
    }, [text])

    useEffect(() => {
        text && searchRecipesByNameFromApi(text).then(data => setRecipes(data.meals)).catch(err => console.log(err))
        !text && setRecipes([])
    }, [text])

    const returnNeededData = (item: RecipeTypes) => ({ label: item.strMeal, id: item.idMeal, imgSrc: item.strMealThumb })

    const renderRecipes = () => recipes.map(item => <CardBox key={item.idMeal} data={returnNeededData(item)} addToCards={addToCards} />)

    return (
        <div
            className={`absolute flex flex-col gap-y-2 ${recipes?.length ? " xxs:h-[13.9rem] md:h-[37.18rem] overflow-y-scroll no-scrollbar" : "h-0"} xxs:w-[94.4%] sm:w-[17.3rem] md:w-[20.99rem]`}
        >
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

    const [isAdded, setIsAdded] = useState(false)

    const [{ isDragging, handlerId }, drag] = useDrag(() => ({
        type: "card",
        item: { label, id, imgSrc },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult<DropResult>()
            if (item && dropResult && !isAdded) {
                addToCards({ label, id, imgSrc })
                setIsAdded(true)
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
            className={`p-0.5 md:p-2 bg-background flex flex-col gap-y-2 items-center justify-between w-full ${isAdded ? "bg-accent/60" : "pointer-events-auto"}`}
            ref={isAdded ?  null : drag}
            style={{ ...style, opacity }}
            title={isAdded ? "Already added" : 'Drag To Drop Box or Click Add'}
        >
            <div className='flex gap-x-2 items-center justify-between'>
                <h2 className='text-primary text-xl'>{label}</h2>
                <img src={imgSrc} width={60} height={60} alt={label} className='w-8 md:w-11 h-6 md:h-11 rounded-full' />
            </div>
            <Button className='text-content-light/80 bg-secondary/90 py-0.5 md:py-1 h-6 md:h-10' variant={'secondary'} disabled={isAdded} onClick={() => {
                setIsAdded(true)
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