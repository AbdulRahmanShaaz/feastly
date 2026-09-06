import {createSlice} from "@reduxjs/toolkit"
import { FaCity } from "react-icons/fa6";
import { RxStretchVertically } from "react-icons/rx";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData:null,
        city:null
    },
    reducers: {
        setUserData: (state, action) => {   
            state.userData = action.payload;
        },
        setCity:(state,action)=>{
            state.city = action.payload;
        }
    }
})
export const {setUserData,setCity} = userSlice.actions
export default userSlice.reducer