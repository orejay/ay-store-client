import { createSlice } from "@reduxjs/toolkit";

interface ProductData {
  name: string;
  price: number;
  rating: number;
  discount: number;
  description: string;
  category: string;
  _id: string;
}
interface InitialState {
  productId: string;
  showSearches: boolean;
  cart: ProductData[];
  categories: string[];
}

const initialState: InitialState = {
  productId: "",
  showSearches: false,
  cart: [],
  categories: [],
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
    setCart: (state, action) => {
      state.cart = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
  },
});

export const { setShowSearches, setProductId, setCart, setCategories } =
  globalSlice.actions;
export default globalSlice.reducer;
