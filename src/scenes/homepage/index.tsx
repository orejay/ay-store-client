import { Box } from "@mui/material";
import Header from "components/Header";
import React from "react";
import Footer from "components/Footer";
import Hero from "components/Hero";
import { setShowSearches } from "../../state";
import { useAppDispatch } from "store";
import ProductCategory from "components/ProductCategory";

const Homepage = () => {
  const dispatch = useAppDispatch();
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column" }}
      onClick={() => dispatch(setShowSearches(false))}
    >
      <Header />
      <Hero />
      <ProductCategory />
      <Footer />
    </Box>
  );
};

export default Homepage;
