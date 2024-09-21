import { ReactNode } from "react"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { useForInputTextChange, useForSearchFetchRecipesFromApi, useForTruthToggle } from "@/hooks/forComponents";
import { Button } from "../ui/button";
import { RiSearchLine } from "react-icons/ri";
import { ShowAllFoundRecipes } from "./ReUseables";

export const SearchModal = ({ ButtonElem, clickedFalsy }: { ButtonElem: ReactNode, clickedFalsy: () => void }) => {
    const { handleTextChange, text } = useForInputTextChange();

    const { handleFalsy: handleFalsyForFocused, handleTruthy: handleTruthyForFocused, isTrue: forFocused } = useForTruthToggle()

    const { handleFalsy, handleTruthy, isTrue } = useForTruthToggle();

    const {recipes, handleEnterPressed} = useForSearchFetchRecipesFromApi(text, handleFalsy, isTrue, handleTruthy)

    return (
        <Dialog modal onOpenChange={clickedFalsy}>
            <DialogTrigger asChild>
                {ButtonElem}
            </DialogTrigger>
            <DialogContent>
                <div className="flex gap-x-4 items-end relative my-8">
                    <input
                        className="xxs:block xs:hidden xxs:w-full h-full rounded-sm xxs:pl-1.5 bg-transparent text-secondary border-0 border-b-2 border-b-accent placeholder:text-secondary/80 xxs:text-sm focus:outline-none pb-0.5"
                        type="text" placeholder='search recipes by name'
                        value={text} onChange={handleTextChange} onFocus={handleTruthyForFocused}
                        onKeyUp={handleEnterPressed}
                    />
                    <Button
                        onClick={() => {
                            handleTruthy()
                        }}
                        variant={"ghost"}
                        title="Click To Search Now"
                        disabled={isTrue && text.length >= 2}
                        className={`absolute xxs:inline-flex xs:hidden right-0.5 xxs:bottom-1 h-full ${isTrue && text.length >= 2 ? "bg-accent" : "bg-accent/80"} text-muted hover:text-muted hover:bg-accent/60 font-semibold xxs:text-sm`}
                    >
                        <RiSearchLine size={20} />
                    </Button>
                </div>
                <ShowAllFoundRecipes
                    showDropdown={forFocused} handleFalsyForFocused={handleFalsyForFocused} recipes={recipes} forModal={true} />
            </DialogContent>
        </Dialog>
    )
}