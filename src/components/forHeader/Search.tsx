import { useForInputTextChange, useForOutsideClick, useForSearchFetchRecipesFromApi, useForTruthToggle } from '@/hooks/forComponents';
import React, { useEffect, useRef } from 'react'
import { Button } from '../ui/button';
import { RiSearchLine } from 'react-icons/ri';
import { ShowAllFoundRecipes } from './ReUseables';

export const Search = ({clicked}: {clicked: boolean}) => {
    const { handleTextChange, text } = useForInputTextChange();

    const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle();

    const { handleFalsy: handleFalsyForFocused, handleTruthy: handleTruthyForFocused, isTrue: forFocused } = useForTruthToggle()

    useEffect(() => {
        handleFalsy()
    }, [text])

    const ref = useRef<HTMLDivElement>(null)

    useForOutsideClick(ref, handleFalsyForFocused)

    const {recipes, handleEnterPressed} = useForSearchFetchRecipesFromApi(text, handleFalsy, isTrue, handleTruthy)

    return (
        <div
            className='relative xxs:w-fit flex items-end xs:text-xs sm:text-sm lg:text-xl h-fit self-end pb-0.5'
            ref={ref}
        >
            <input
                className="xxs:hidden xs:block xs:w-64 md:w-72 lg:w-96 2xl:w-[29rem] h-full rounded-sm xxs:pl-1.5 lg:pl-1.5 text-muted-foreground bg-transparent border-0 border-b-2 border-b-accent placeholder:text-content xs:text-sm md:text-lg lg:text-xl focus:outline-none pb-0.5"
                type="text" placeholder='search recipes by name'
                value={text} onChange={handleTextChange} onFocus={handleTruthyForFocused}
                onKeyUp={handleEnterPressed}
            />
            <Button
                onClick={handleTruthy}
                variant={"ghost"}
                title="Click To Search Now"
                disabled={isTrue && text.length >= 2}
                className={`absolute xxs:hidden xs:inline-flex right-0.5 xs:bottom-1.5 xs:h-4 lg:h-6 ${isTrue && text.length >= 2 ? "bg-secondary text-content-light/80" : "bg-background/80 text-muted"} hover:text-muted hover:bg-background/60 font-semibold xxs:text-xs md:text-lg lg:text-xl xs:px-1.5 md:px-4`}
            >
                <RiSearchLine />
            </Button>

            {
                !clicked
                    ? <ShowAllFoundRecipes
                        showDropdown={forFocused} handleFalsyForFocused={handleFalsyForFocused} recipes={recipes} />
                    : null
            }
        </div>
    )
}