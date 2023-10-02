import { useForInputTextChange } from '@/hooks/forComponents'
import { RecipeMealType, RecipeTypes } from '@/types'
import { searchRecipesByNameFromApi } from '@/utils/dataFetching'
import React, { CSSProperties, useEffect, useState } from 'react'
// import { BoxProps } from './Box'
import { useDrag } from 'react-dnd'

type RecipeCardType = {
    id: number,
    label: string,
    imgSrc: string,
    uri: string
}

export const RecipesList = () => {
    const [recipeCards, SetRecipeCards] = useState<RecipeCardType[]>([])

    return (
        <div>
            <SearchRecipesByName />
        </div>
    )
}

const SearchRecipesByName = () => {
    const { handleTextChange, text } = useForInputTextChange();

    return (
        <div className='relative'>
            <input type="text" placeholder='seacrh recipes by name' value={text} onChange={handleTextChange} />
            <ShowAllFoundRecipes text={text} />
        </div>
    )
}

const ShowAllFoundRecipes = ({ text }: { text: string }) => {
    const [recipes, setRecipes] = useState<RecipeTypes[]>([])

    useEffect(() => {
        text && searchRecipesByNameFromApi(text).then(data => setRecipes(data.meals)).catch(err => console.log(err))
        !text && setRecipes([])
    }, [text])

    // const renderRecipes = () => recipes.map(item => {
    //     return (
    //         <div key={item.idMeal} className='flex gap-x-2'>
    //             <span>{item?.strMeal}</span>
    //             <span>{item.strArea}</span>
    //             <span>{item.strCategory}</span>
    //         </div>
    //     )
    // })

    const renderRecipes = () => recipes.map(item => <Box id={item.idMeal} imgSrc={item.strMealThumb} label={item.strMeal} key={item.idMeal} />)

    return (
        <div className={`absolute flex flex-col gap-y-2 ${recipes?.length ? "h-40" : "h-0"} overflow-y-scroll`}>
            {recipes?.length ? renderRecipes() : null}
        </div>
    )
}

interface DropResult {
    name: string,
    id: number
}

type BoxProps = {
    label: string, 
    imgSrc: string,
    id: string,
    // handleAddToList: ()
}

const Box = ({ ...items }: BoxProps) => {
    const {label} = items;
    const [{ isDragging }, drag] = useDrag(() => ({
        //   type: ItemTypes.BOX,
        type: "box",
        item: { label },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult<DropResult>()
            if (item && dropResult) {
                // handleAddToList(item.name)
                console.log(label, "dropped!!")
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
            className='p-2 bg-primary-foreground'
            ref={drag}
            style={{ ...style, opacity }}
        // data-testid={`box`}
        >
            {label}
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