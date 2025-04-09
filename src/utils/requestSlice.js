import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "request",
  initialState: null,
  reducers: {
    addRequests: (state, action) => {
      return action.payload;
    },
    removeRequest: (state, action) => {
      if (!state) return null;
      const newArray = state.filter((r) => r._id !== action.payload);
      return newArray;
    },
    removeAllRequests: () => {
      return null;
    },
  },
});

export const { addRequests, removeRequest, removeAllRequests } =
  requestSlice.actions;
export default requestSlice.reducer;
