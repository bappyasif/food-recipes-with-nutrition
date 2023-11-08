import { EventItemTypes } from "@/types"
import { updateUserEventDataInDb } from "@/utils/dbRequests"
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
            state.list = state.list.concat(action.payload)
        },

        deleteFromEventsData: (state, action) => {
            const {id} = action.payload;
            const filter = state.list.filter(item => item.id !== id)
            state.list = filter
        },

        updateSpecificEventData: (state, action) => {
            const {id, updatedData} = action.payload

            console.log(id, updatedData, "ready!!")

            state.list = state.list.map(item => {
                if(item.id === id) {
                    item = {...item, ...updatedData}
                    updateUserEventDataInDb(item)
                }
                return item
            })
            
        },

        initializeUserEventsData: (state, action) => {
            state.list = action.payload
        }
    },
    // extraReducers(builder) {
    //     builder.addCase()
    // },
})

export const {addToEventsData, initializeUserEventsData, updateSpecificEventData, deleteFromEventsData} = eventsSlice.actions

const EventsReducer = eventsSlice.reducer

export default EventsReducer