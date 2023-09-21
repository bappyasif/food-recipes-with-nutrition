import { configureStore } from "@reduxjs/toolkit";
import RecipesReducer from "../features/recipes/RecipesSlice";
import CategoriesReducer from "../features/categories/CategoriesSlice";
import CuisinesReducer from "../features/cuisines/CuisinesSlice";

const store = configureStore({
    reducer: {
        recipes: RecipesReducer,
        categories: CategoriesReducer,
        cuisines: CuisinesReducer
    }
})

export type AppDispatch = typeof store.dispatch

export type RootStoreStateType = ReturnType<typeof store.getState>

export default store