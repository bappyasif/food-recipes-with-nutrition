"use client"

import { Provider } from "react-redux"
import store from "../store"
import { ReactNode } from "react"
import { fetchCategoriesList, fetchCuisinesList, fetchRecipesWithShallowRoutingOnce } from "../thunks"

store.dispatch(fetchCategoriesList())
store.dispatch(fetchCuisinesList());
store.dispatch(fetchRecipesWithShallowRoutingOnce())

export const ReduxStoreProvider = ({children}:{children: ReactNode}) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}