import { Box } from "@mui/material";
import Header from "components/Header";
import React from "react";
import Footer from "components/Footer";
import Hero from "components/Hero";

const Homepage = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Header />
      <Hero />
      <Footer />
    </Box>
  );
};

export default Homepage;
