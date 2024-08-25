import { searchRecipes } from "@/utils/dataFetching"

export const fetchAndUpdateData = (params: any, setRecipes: any, reset: () => void) => {
    searchRecipes(params).then(d => {
        const onlyRecipes = d?.hits.map((item: any) => item.recipe)

        const readyForRendering = onlyRecipes?.map((item: any) => item?.mealType?.length && item?.dishType?.length && item?.dietLabels?.length && item).filter((item: any) => item).filter((v: any, idx: number, self: any) => idx === self.findIndex((t: any) => t.label === v.label)) || []

        readyForRendering?.length && setRecipes(readyForRendering)

        !readyForRendering?.length && alert("Sorry, nothing is found to display for this search term, please try again, thank you :)")

    }).catch(err => console.log(err))
        .finally(reset)
}