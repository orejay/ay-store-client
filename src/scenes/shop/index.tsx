import { Box } from "@mui/material";
import Footer from "components/Footer";
import Header from "components/Header";
import React from "react";

const Shop = () => {
  return (
    <Box>
      <Header />
      <Box sx={{ minHeight: "100vh" }}></Box>
      <Footer />
    </Box>
  );
};

export default Shop;