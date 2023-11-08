import { configureStore } from "@reduxjs/toolkit";
import RecipesReducer from "../features/recipes/RecipesSlice";
import CategoriesReducer from "../features/categories/CategoriesSlice";
import CuisinesReducer from "../features/cuisines/CuisinesSlice";
import EventsReducer from "../features/events/EventsSlice";

const store = configureStore({
    reducer: {
        recipes: RecipesReducer,
        categories: CategoriesReducer,
        cuisines: CuisinesReducer,
        events: EventsReducer
    }
})

export type AppDispatch = typeof store.dispatch

export type RootStoreStateType = ReturnType<typeof store.getState>

export default store