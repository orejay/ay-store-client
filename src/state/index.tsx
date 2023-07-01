import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  productId: string;
  showSearches: boolean;
}

const initialState: InitialState = {
  productId: "",
  showSearches: false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setProductId: (state, action) => {
      state.productId = action.payload;
    },
    setShowSearches: (state, action) => {
      state.showSearches = action.payload;
    },
  },
});

export const { setShowSearches } = globalSlice.actions;
export default globalSlice.reducer;
