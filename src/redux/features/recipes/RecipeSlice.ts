import { RecipeTypes } from "@/types"
import { createSlice } from "@reduxjs/toolkit"

type RecipesInitStateTypes = {
    recipes: RecipeTypes[],
    count: number
}

const initRecipesState: RecipesInitStateTypes = {
    recipes: [],
    count: 0
}

const recipesSlice = createSlice({
    initialState: initRecipesState,
    name: "recipes",
    reducers: {
        increaseRecipeCount: (state, action) => {
            
        },
        increment: (state) => {
            state.count += 1
        },
        decrement: (state) => {
            state.count -= 1
        }
    },
    extraReducers: builder => {
        
    }
})

export const {increaseRecipeCount, decrement, increment} = recipesSlice.actions

const RecipesReducer = recipesSlice.reducer;

export default RecipesReducer