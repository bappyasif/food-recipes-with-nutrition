"use client"

import { Provider } from "react-redux"
import store from "../store"
import { ReactNode } from "react"
import { fetchCategoriesList, fetchCuisinesList } from "../thunks"

store.dispatch(fetchCategoriesList())
store.dispatch(fetchCuisinesList());

export const ReduxStoreProvider = ({children}:{children: ReactNode}) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}