import { configureStore } from "@reduxjs/toolkit";
import RecipesReducer from "../features/recipes/RecipeSlice";

const store = configureStore({
    reducer: {
        recipes: RecipesReducer
    }
})

export type AppDispatch = typeof store.dispatch

export type RootStoreStateType = ReturnType<typeof store.getState>

export default store