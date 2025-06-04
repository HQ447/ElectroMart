import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userID: null,
  userEmail: null,
  userName: null,
  cartArrSize: 0,
  delCharges: 3,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserID: (state, action) => {
      state.userID = action.payload;
    },
    setDelCharges: (state, action) => {
      state.delCharges = action.payload;
    },
    setUserEmail: (state, action) => {
      state.userEmail = action.payload;
    },
    setUserName: (state, action) => {
      state.userName = action.payload;
    },
    setCartArrSize: (state, action) => {
      state.cartArrSize = action.payload;
    },
  },
});

export const {
  setUserID,
  setUserEmail,
  setUserName,
  setCartArrSize,
  setDelCharges,
} = userSlice.actions;
export default userSlice.reducer;
