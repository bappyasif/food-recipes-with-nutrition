import { fetchRecipesWithShallowRoutingOnce, getAllViewedRecipesFromDb } from "@/redux/thunks"
import { RecipeMealType, ViewedMealType } from "@/types"
import { addToDbCollection, updateRecordInCollection } from "@/utils/dbRequests"
import { createSlice } from "@reduxjs/toolkit"

type RecipesInitStateTypes = {
    viewedList?: ViewedMealType[]
    list: RecipeMealType[],
    untracked: {
        page: number,
        data: RecipeMealType[]
    }[]
}

const initRecipesState: RecipesInitStateTypes = {
    viewedList: [],
    list: [],
    untracked: [{ data: [], page: 0 }]
}

const recipesSlice = createSlice({
    initialState: initRecipesState,
    name: "recipes",
    reducers: {
        // already existing recipe count increment
        updateRecipeCount: (state, action) => {
            const { recipeUri, images } = action.payload

            state.list = state.list.map(item => {
                if (item.uri === recipeUri) {
                    if (item?.count) {
                        item.count += 1
                    } else {
                        item.count = 1
                    }
                    item.images = images

                    updateRecordInCollection(recipeUri, images)
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

            state.list = state.list.concat(withCount)

            // add to db too
            addToDbCollection(action.payload)
        },

        // add data to untracked recipes list, so that when user clicks on view more previously rendered data can be extracted from store by pageNumber, and no need to call api to get those data again
        addRecipesToUntracked: (state, action) => {
            const { pageNumber, recipesData } = action.payload;
            state.untracked = recipesData.length ? [...state.untracked, { data: recipesData, page: pageNumber }] : state.untracked
        },

        // trying alternative to update list from component (now going back to store dispatch instead, willbe keeping this for future reference)
        addRecipesAtOnce: (state, action) => {
            state.list = action.payload;
            // state.viewedList = action.payload
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchRecipesWithShallowRoutingOnce.fulfilled, (state, action) => {
            // console.log(action.payload, "payload!!")
        }),
        // updating all found data from backend api server to redux store to be used by components who needs it (i.e. recently viewed meal, popular recipes view)
        builder.addCase(getAllViewedRecipesFromDb.fulfilled, (state, action) => {
            // console.log(action.payload?.recipes.length)
            state.list = action.payload?.recipes
        })
    }
})

export const { updateRecipeCount, addRecipeToList, addRecipesToUntracked, addRecipesAtOnce } = recipesSlice.actions

const RecipesReducer = recipesSlice.reducer;

export default RecipesReducer