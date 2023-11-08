import { EventItemTypes } from "@/types"
import { createSlice } from "@reduxjs/toolkit"

type EventsDataType = {
    list: EventItemTypes[]
}

const initEventsDataState:EventsDataType = {
    list: []
}

const eventsSlice = createSlice({
    initialState: initEventsDataState,
    name: "Events",
    reducers: {
        addToEventsData: (state, action) => {
            console.log(state.list.concat(action.payload))
            // state.list = state.list.concat(action.payload)
        },

        initializeUserEventsData: (state, action) => {
            state.list = action.payload
        }
    },
    // extraReducers(builder) {
    //     builder.addCase()
    // },
})

export const {addToEventsData, initializeUserEventsData} = eventsSlice.actions

const EventsReducer = eventsSlice.reducer

export default EventsReducer