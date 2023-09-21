import { fetchCategoriesList } from "@/redux/thunks"
import { CategoryTypes } from "@/types"
import { createSlice } from "@reduxjs/toolkit"

type InitCategoriesType = {
    list: CategoryTypes[]
}

const initCategoriesState: InitCategoriesType = {
    list: []
}

const categoriesSlice = createSlice({
    initialState: initCategoriesState,
    name: "categories",
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchCategoriesList.fulfilled, (state, action) => {
            const {meals} = action.payload;
            const list = meals.map((item:CategoryTypes) => ({strCategory: item.strCategory, count: 0}))
            state.list = list
        })
    }
})

const CategoriesReducer = categoriesSlice.reducer;

export default CategoriesReducer