import { EventItemTypes } from "@/types"
import { addToSchedulerEvents, deleteUserEventDataInDb, updateUserEventDataInDb } from "@/utils/dbRequests"
import { createSlice } from "@reduxjs/toolkit"
import moment from "moment"

export const ITEMS: EventItemTypes[] = [
    {
        start: moment().toDate(),
        end: moment().add(1, "days").toDate(),
        id: 1,
        // id: v4(),
        title: "bees bees",
        description: "go gogogogoogog"
    },
    {
        start: moment().toDate(),
        end: moment().add(1, "days").toDate(),
        id: 2,
        // id: v4(),
        title: "bees bees- II",
        description: "go gogogogoogog"
    },
    {
        start: moment().toDate(),
        end: moment().add(1, "hour").toDate(),
        id: 3,
        // id: v4(),
        title: "bees bees - III",
        description: "go gogogogoogog"
    },
    {
        start: moment().toDate(),
        end: moment().add(2, "hour").toDate(),
        id: 4,
        // id: v4(),
        title: "bees bees - IV",
        description: "go gogogogoogog"
    }
]

type EventsDataType = {
    list: EventItemTypes[]
}

const initEventsDataState:EventsDataType = {
    // list: []
    list: ITEMS
}

const eventsSlice = createSlice({
    initialState: initEventsDataState,
    name: "Events",
    reducers: {
        addToEventsData: (state, action) => {
            // console.log(state.list.concat(action.payload))
            state.list = state.list.concat(action.payload)
            action.payload?.user?.email && addToSchedulerEvents(action.payload)
        },

        deleteFromEventsData: (state, action) => {
            const {id} = action.payload;
            const filter = state.list.filter(item => item.id !== id)
            // console.log(state.list.length, filter.length)
            const removedItem = state.list.find(item => item.id === id)
            state.list = filter
            removedItem?.user?.email && deleteUserEventDataInDb(id)
        },

        updateSpecificEventData: (state, action) => {
            const {id, updatedData} = action.payload
            // const {updatedData} = action.payload

            console.log(updatedData, "ready!!")

            state.list = state.list.map(item => {
                if(item.id === updatedData?.id || item.id === id) {
                    item = {...item, ...updatedData}
                    item.user?.email && updateUserEventDataInDb(item)
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