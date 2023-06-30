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
            <Route path="/shop" element={<Navigate to="/" replace />} />

            <Route path="/signup" element={<SignUp />} />
            <Route path="/customer/account" element={<Account />} />
            <Route path="/signin" element={<SignIn />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
