import { configureStore } from "@reduxjs/toolkit"
import loginSlice from "../features/loginSlice"
import modeSlice from "../features/modeSlice"

export const store = configureStore({
    reducer: {
        login: loginSlice,
        mode: modeSlice
    }    
})