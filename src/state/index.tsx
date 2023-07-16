import { createSlice } from "@reduxjs/toolkit";

interface ProductData {
  name: string;
  quantity: number;
  price: number;
  rating: number;
  discount: number;
  imageName: string;
  imagePath: string;
  description: string;
  category: string;
  supply: number;
  _id: string;
}
interface InitialState {
  productId: string;
  products: ProductData[];
  showSearches: boolean;
  showCart: boolean;
  cart: ProductData[];
  categories: string[];
  addresses: AddressData[];
  deliveryAddress: DeliveryAddress | null;
  instructions: string;
  prevPage: string;
  closeModal: boolean;
  modalMessage: string;
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

interface DeliveryAddress {
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
  products: [],
  showSearches: false,
  showCart: false,
  cart: [],
  categories: [],
  addresses: [],
  deliveryAddress: null,
  instructions: "",
  prevPage: "",
  closeModal: true,
  modalMessage: "",
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setProductId: (state, action) => {
      state.productId = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setShowSearches: (state, action) => {
      state.showSearches = action.payload;
    },
    setShowCart: (state, action) => {
      state.showCart = action.payload;
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
    incrementQuantity: (state, action) => {
      const { payload: itemId } = action;
      const updatedCart = state.cart.map((item) =>
        item._id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      );
      state.cart = updatedCart;
    },
    decrementQuantity: (state, action) => {
      const { payload: itemId } = action;
      const updatedCart = state.cart.map((item) =>
        item._id === itemId ? { ...item, quantity: item.quantity - 1 } : item
      );
      state.cart = updatedCart;
    },
    customQuantity: (state, action) => {
      const {
        payload: { itemId, quantity },
      } = action;
      const updatedCart = state.cart.map((item) =>
        item._id === itemId ? { ...item, quantity } : item
      );
      state.cart = updatedCart;
    },
    setDeliveryAddress: (state, action) => {
      state.deliveryAddress = action.payload;
    },
    setInstructions: (state, action) => {
      state.instructions = action.payload;
    },
    setPrevPage: (state, action) => {
      state.prevPage = action.payload;
    },
    setCloseModal: (state, action) => {
      state.closeModal = action.payload;
    },
    setModalMessage: (state, action) => {
      state.modalMessage = action.payload;
    },
  },
});

export const {
  incrementQuantity,
  decrementQuantity,
  customQuantity,
  setShowSearches,
  setProductId,
  setCart,
  setCategories,
  setAddresses,
  setProducts,
  setShowCart,
  setDeliveryAddress,
  setInstructions,
  setPrevPage,
  setCloseModal,
  setModalMessage,
} = globalSlice.actions;
export default globalSlice.reducer;
