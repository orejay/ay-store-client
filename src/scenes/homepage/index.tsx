import { Box, Button, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import Header from "components/Header";
import { ShoppingCartOutlined } from "@mui/icons-material";
import React from "react";
import Footer from "components/Footer";

const Homepage = () => {
  const theme = useTheme();
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Header />
      <Box height="100vh" display="flex" alignItems="center">
        <Box ml="10%">
          <Box width="50%">
            <Typography
              variant="h3"
              fontFamily="Playfair Display"
              fontWeight="bold"
              marginBottom="50px"
            >
              Take Pleasure in the way you look
            </Typography>
            <Link to="/shop" className="">
              <Button
                variant="contained"
                sx={{
                  borderRadius: "25px",
                  gap: "20px",
                  display: "flex",
                  alignItems: "center",
                  px: "30px",
                  py: "10px",
                }}
              >
                <ShoppingCartOutlined sx={{ color: "#FFFFFF" }} />
                <Typography color="#FFFFFF">Shop now</Typography>
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Homepage;
