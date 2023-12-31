import { Box, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import lips from "../assets/lips.PNG";
import face from "../assets/face.jpg";
import skin from "../assets/skin.jpg";
import perfumery from "../assets/perfumery.jpg";
import household from "../assets/household.PNG";
import decorative from "../assets/decorative.jpg";
import { Link } from "react-router-dom";
import { Element } from "react-scroll";
import { RootState, useAppDispatch } from "store";
import { setCategories } from "state";
import { useSelector } from "react-redux";

const category = [
  { title: "skin", image: skin },
  { title: "face", image: face },
  { title: "lips", image: lips },
  { title: "perfumery", image: perfumery },
  { title: "household", image: household },
  { title: "decorative", image: decorative },
];

const ProductCategory = () => {
  const dispatch = useAppDispatch();
  const isSmallScreen = useMediaQuery("(max-width: 450px)");
  const isMediumScreen = useMediaQuery("(max-width: 768px)");

  return (
    <Box
      display="flex"
      flexDirection="column"
      py={isMediumScreen ? "" : "50px"}
      alignItems="center"
      sx={{
        minHeight: "100vh",
        width: "100%",
      }}
      id="shop"
    >
      <Box
        sx={{
          width: "90%",
          display: "flex",
          mb: "70px",
          ml: isMediumScreen ? "" : "10%",
        }}
      >
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
          width: !isSmallScreen ? "40%" : "80%",
          display: "grid",
          gridTemplateColumns: !isSmallScreen
            ? "repeat(3,1fr)"
            : "repeat(1,1fr)",
          gap: "80px",
          gridAutoRows: "180px",
          justifyContent: "center",
          justifyItems: "center",
          flexWrap: "wrap",
        }}
        gap="15px"
      >
        {category.map((each, index) => (
          <Link
            to={`/shop`}
            key={index}
            style={{
              height: !isSmallScreen ? "180px" : "200px",
              width: !isSmallScreen ? "180px" : "200px",
            }}
            onClick={() => dispatch(setCategories([each.title]))}
          >
            <Box
              component="img"
              alt="product-category-img"
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
              mt={!isSmallScreen ? "10px" : "6px"}
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
