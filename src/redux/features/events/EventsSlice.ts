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
            state.list = action.payload
        }
    }
})

export const {addToEventsData} = eventsSlice.actions

const EventsReducer = eventsSlice.reducer

export default EventsReducer