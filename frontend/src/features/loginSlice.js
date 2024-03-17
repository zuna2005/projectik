import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    currentUser: {status: ''}
}

const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.currentUser = action.payload
        }
    }
})

export const {setUser} = loginSlice.actions

export default loginSlice.reducer