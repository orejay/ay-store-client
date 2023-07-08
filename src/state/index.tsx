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
  addresses: AddressData[];
}

interface AddressData {
  _id: string;
  contactName: string;
  phoneNumber: string;
  user: string;
  isDefault: boolean;
  address: string;
  city: string;
  state: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  __v: string;
}

const initialState: InitialState = {
  productId: "",
  showSearches: false,
  cart: [],
  categories: [],
  addresses: [],
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
    setAddresses: (state, action) => {
      state.addresses = action.payload;
    },
  },
});

export const {
  setShowSearches,
  setProductId,
  setCart,
  setCategories,
  setAddresses,
} = globalSlice.actions;
export default globalSlice.reducer;
