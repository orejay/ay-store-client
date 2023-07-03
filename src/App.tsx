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

function App() {
  const theme = createTheme({
    typography: {
      fontFamily: "Nunito, Playfair Display, Arial, sans-serif",
    },
    palette: themeSettings(),
  });

  return (
    <div>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/about" element={<About />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/contact" element={<Contact />} />
            <Route element={<Layout />}>
              <Route path="/customer/account" element={<Account />} />
              <Route path="/customer/orders" element={<Orders />} />
              <Route path="/customer/inbox" element={<Inbox />} />
              <Route path="/customer/vouchers" element={<Vouchers />} />
              <Route path="/customer/saved" element={<SavedItems />} />
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
