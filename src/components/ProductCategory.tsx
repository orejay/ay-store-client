import { Box, Typography } from "@mui/material";
import React from "react";
import lips from "../assets/lips.PNG";
import face from "../assets/face.jpg";
import skin from "../assets/skin.jpg";
import perfumery from "../assets/perfumery.jpg";
import household from "../assets/household.PNG";
import decorative from "../assets/decorative.jpg";
import { Link } from "react-router-dom";
import { Element } from "react-scroll";

const category = [
  { title: "skin", image: skin },
  { title: "face", image: face },
  { title: "lips", image: lips },
  { title: "perfumery", image: perfumery },
  { title: "household", image: household },
  { title: "decorative", image: decorative },
];

const ProductCategory = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      py="50px"
      alignItems="center"
      sx={{
        minHeight: "100vh",
        width: "100%",
      }}
      id="shop"
    >
      <Box sx={{ width: "90%", display: "flex", mb: "70px", ml: "10%" }}>
        <Box
          sx={{
            width: "2px",
            height: "50px",
            mr: "9px",
            backgroundColor: "#676769",
            borderRadius: "2px",
          }}
        ></Box>
        <Box>
          <Typography fontFamily="Nunito" fontWeight="bold" color="GrayText">
            Unique
          </Typography>
          <Typography
            variant="h5"
            fontWeight="bold"
            fontFamily="Playfair Display"
          >
            Categories
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          width: "40%",
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "80px",
          gridAutoRows: "180px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
        gap="15px"
      >
        {category.map((each, index) => (
          <Link
            to={`/products/${each.title}`}
            key={index}
            style={{
              height: "180px",
              width: "180px",
            }}
          >
            <Box
              component="img"
              alt="hero-img"
              src={each.image}
              width="100%"
              borderRadius="20px"
              sx={{
                objectFit: "cover",
                transform: "rotate(-10deg)",
                transformOrigin: "left",
                zIndex: 1,
              }}
            />
            <Typography
              variant="h6"
              fontFamily="Playfair Display"
              fontSize="16px"
              textAlign="center"
              fontWeight="bold"
              color="secondary"
              mt="10px"
            >
              {each.title[0].toUpperCase()}
              {each.title.slice(1)}
            </Typography>
          </Link>
        ))}
      </Box>
    </Box>
  );
};

export default ProductCategory;