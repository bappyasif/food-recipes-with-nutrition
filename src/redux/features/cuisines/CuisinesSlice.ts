import { fetchCuisinesList } from "@/redux/thunks"
import { CuisineTypes } from "@/types"
import { createSlice } from "@reduxjs/toolkit"

type InitCuisinesType = {
    list: CuisineTypes[]
}

const initCuisinesState: InitCuisinesType = {
    list: []
}

const cuisinesSlice = createSlice({
    initialState: initCuisinesState,
    name: "cuisines",
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchCuisinesList.fulfilled, (state, action) => {
            const {meals} = action.payload;
            const newList = meals.map((item: CuisineTypes) => ({strArea: item.strArea, count: 0}))
            state.list = newList; 
        })
    }
})

const CuisinesReducer = cuisinesSlice.reducer;

export default CuisinesReducer