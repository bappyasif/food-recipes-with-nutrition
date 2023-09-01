import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
    reducer: {}
})

export type AppDispatch = typeof store.dispatch

export type RootStoreStateType = ReturnType<typeof store.getState>

export default store