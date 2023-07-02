import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import React from "react";
import heroBg from "../assets/hero.png";
import { ShoppingCartOutlined } from "@mui/icons-material";

const Hero = () => {
  const scrollToSection = (sectionId: string): void => {
    const section = document.getElementById(sectionId);
    const offset = 80; // Adjust the value to add space on top

    if (section) {
      const position = section.offsetTop - offset;

      window.scrollTo({
        top: position,
        behavior: "smooth",
      });

      // section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mt="40px"
    >
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
            onClick={() => scrollToSection("shop")}
          >
            <ShoppingCartOutlined sx={{ color: "#FFFFFF" }} />
            <Typography color="#FFFFFF">Shop our categories</Typography>
          </Button>
        </Box>
      </Box>
      <Box>
        <Box
          component="img"
          alt="hero-img"
          src={heroBg}
          height="80vh"
          sx={{ objectFit: "cover", opacity: "60%" }}
        />
      </Box>
    </Box>
  );
};

export default Hero;
