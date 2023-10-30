import { fetchRecipesWithShallowRoutingOnce, getAllViewedRecipesFromDb } from "@/redux/thunks"
import { RecipeMealType, RecipeTypes, ViewedMealType } from "@/types"
import { addToDbCollection } from "@/utils/dbRequests"
import { createSlice } from "@reduxjs/toolkit"

type RecipesInitStateTypes = {
    // recipes: RecipeTypes[],
    viewedList?: ViewedMealType[]
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
    viewedList: [],
    list: [],
    // untracked: []
    untracked: [{ data: [], page: 0 }]
}

const recipesSlice = createSlice({
    initialState: initRecipesState,
    name: "recipes",
    reducers: {
        // already existing recipe count increment
        updateRecipeCount: (state, action) => {
            const { recipeUri } = action.payload
            // console.log(recipeUri, action.payload, "chck chck!!")
            state.list = state.list.map(item => {
                if (item.uri === recipeUri) {
                    if (item?.count) {
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

            // add to db too
            // console.log("update db!!")
            // addToDbCollection(action.payload) // causing multiple re-renders!!
        },

        // add data to untracked recipes list, so that when user clicks on view more previously rendered data can be extracted from store by pageNumber, and no need to call api to get those data again
        addRecipesToUntracked: (state, action) => {
            const { pageNumber, recipesData } = action.payload;
            // console.log(pageNumber, recipesData, "check it!!")
            // state.untracked = {
            //     [pageNumber]: recipesData
            // }
            // state.untracked = state.untracked.concat({[pageNumber]: recipesData})
            // state.untracked = state.untracked.concat({data: recipesData, page: pageNumber})
            state.untracked = recipesData.length ? [...state.untracked, { data: recipesData, page: pageNumber }] : state.untracked
        },

        // trying alternative to update list from component
        addRecipesAtOnce: (state, action) => {
            state.list = action.payload;
            // state.viewedList = action.payload
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchRecipesWithShallowRoutingOnce.fulfilled, (state, action) => {
            // console.log(action.payload, "payload!!")
        }),
        builder.addCase(getAllViewedRecipesFromDb.fulfilled, (state, action) => {
            // console.log(action.payload, "viewed meals", state.list)
            // state.list = action.payload.length && action.payload
            // state.list = state.list.concat(action.payload)
            // state.viewedList = action.payload
        })
    }
})

export const { updateRecipeCount, addRecipeToList, addRecipesToUntracked, addRecipesAtOnce } = recipesSlice.actions

const RecipesReducer = recipesSlice.reducer;

export default RecipesReducer