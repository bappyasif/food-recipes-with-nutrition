import { fetchRecipesWithShallowRoutingOnce } from "@/redux/thunks"
import { RecipeMealType, RecipeTypes } from "@/types"
import { createSlice } from "@reduxjs/toolkit"

type RecipesInitStateTypes = {
    // recipes: RecipeTypes[],
    list: RecipeMealType[],
    // count: number,
    // untracked: RecipeMealType[]
    // untracked: {
    //     [key:string]: RecipeMealType[]
    // }[]
    untracked: {
        page: number,
        data: RecipeMealType[]
    }[]
}

const initRecipesState: RecipesInitStateTypes = {
    list: [],
    // untracked: []
    untracked: [{data: [], page: 0}]
}

const recipesSlice = createSlice({
    initialState: initRecipesState,
    name: "recipes",
    reducers: {
        // already existing recipe count increment
        updateRecipeCount: (state, action) => {
            const {recipeUri} = action.payload
            // console.log(recipeUri, action.payload, "chck chck!!")
            state.list = state.list.map(item => {
                if(item.uri === recipeUri) {
                    if(item?.count) {
                        item.count += 1
                    } else {
                        item.count = 1
                    }
                }

                return item
            })
        },

        // adding fresh new recipe to list
        addRecipeToList: (state, action) => {
            const withCount = {
                ...action.payload,
                count: 1
            }
            // console.log(action.payload, withCount)
            state.list = state.list.concat(withCount)
            // state.list = state.list.concat(action.payload)
        },

        // add data to untracked recipes list, so that when user clicks on view more previously rendered data can be extracted from store by pageNumber, and no need to call api to get those data again
        addRecipesToUntracked: (state, action) => {
            const {pageNumber, recipesData} = action.payload;
            console.log(pageNumber, recipesData, "check it!!")
            // state.untracked = {
            //     [pageNumber]: recipesData
            // }
            // state.untracked = state.untracked.concat({[pageNumber]: recipesData})
            // state.untracked = state.untracked.concat({data: recipesData, page: pageNumber})
            state.untracked = recipesData.length ? [...state.untracked, {data: recipesData, page: pageNumber}] : state.untracked
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchRecipesWithShallowRoutingOnce.fulfilled, (state, action) => {
            // console.log(action.payload, "payload!!")
        })
    }
})

export const {updateRecipeCount,addRecipeToList, addRecipesToUntracked} = recipesSlice.actions

const RecipesReducer = recipesSlice.reducer;

export default RecipesReducer