import React from "react";
import Header from "./components/Header";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "scenes/homepage";
import "typeface-nunito";
import "typeface-playfair-display";
import SignUp from "scenes/signup";
import SignIn from "scenes/signin";
import Account from "scenes/account";
import Shop from "scenes/shop";
import About from "scenes/about";
import Contact from "scenes/contact";
import Layout from "scenes/layout";
import Orders from "scenes/orders";
import Inbox from "scenes/inbox";
import Vouchers from "scenes/vouchers";
import SavedItems from "scenes/saved items";
import AddressBook from "scenes/address book";
import AccManagement from "scenes/account management";
import ChangePassword from "scenes/change password";
import AddProduct from "scenes/add product";
import Catalog from "scenes/catalog";
import EditProduct from "scenes/edit product";
import Users from "scenes/users";
import AdminManagement from "scenes/admin account";
import { useAppDispatch } from "store";
import { setShowCart, setShowSearches } from "state";
import Checkout from "scenes/checkout";
import ManageOrders from "scenes/manage orders";
import ProductDetail from "scenes/product";
import ProtectedRoute from "components/ProtectedRoute";

function App() {
  const theme = createTheme({
    typography: {
      fontFamily: "Nunito, Playfair Display, Arial, sans-serif",
    },
    palette: themeSettings(),
  });
  const dispatch = useAppDispatch();

  return (
    <div
      onClick={() => {
        dispatch(setShowSearches(false));
      }}
    >
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/about" element={<About />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/customer/account" element={<Account />} />
              <Route path="/customer/orders" element={<Orders />} />
              <Route path="/customer/inbox" element={<Inbox />} />
              <Route path="/customer/vouchers" element={<Vouchers />} />
              <Route path="/customer/saved" element={<SavedItems />} />
              <Route path="/customer/addresses" element={<AddressBook />} />
              <Route path="/customer/addresses/add" element={<AddressBook />} />
              <Route
                path="/customer/addresses/edit"
                element={<AddressBook />}
              />
              <Route path="/customer/password" element={<ChangePassword />} />
              <Route
                path="/customer/account/management"
                element={<AccManagement />}
              />

              <Route
                path="/admin/account"
                element={
                  <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                    <AdminManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products/add"
                element={
                  <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                    <AddProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products/edit"
                element={
                  <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                    <EditProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/catalog"
                element={
                  <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                    <Catalog />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route path="/admin/password" element={<ChangePassword />} />
              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                    <ManageOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/account/management"
                element={<AccManagement />}
              />
            </Route>

            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
