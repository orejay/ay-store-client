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

  const imgSize = isSmallScreen ? "130px" : isMediumScreen ? "150px" : "180px";
  const gridCols = isSmallScreen
    ? "repeat(2,1fr)"
    : isMediumScreen
    ? "repeat(3,1fr)"
    : "repeat(3,1fr)";
  const gridWidth = isSmallScreen ? "95%" : isMediumScreen ? "90%" : "40%";
  const gapSize = isSmallScreen ? "20px" : isMediumScreen ? "30px" : "60px";

  return (
    <Box
      display="flex"
      flexDirection="column"
      py={isMediumScreen ? "30px" : "50px"}
      alignItems="center"
      sx={{
        minHeight: isMediumScreen ? "auto" : "100vh",
        width: "100%",
      }}
      id="shop"
    >
      <Box
        sx={{
          width: "90%",
          display: "flex",
          mb: isMediumScreen ? "40px" : "70px",
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
          width: gridWidth,
          display: "grid",
          gridTemplateColumns: gridCols,
          gap: gapSize,
          gridAutoRows: "auto",
          justifyContent: "center",
          justifyItems: "center",
        }}
      >
        {category.map((each, index) => (
          <Link
            to={`/shop`}
            key={index}
            style={{
              height: imgSize,
              width: imgSize,
            }}
            onClick={() => dispatch(setCategories([each.title]))}
          >
            <Box
              component="img"
              alt="product-category-img"
              src={each.image}
              width="100%"
              height="100%"
              borderRadius="20px"
              sx={{
                objectFit: "cover",
                transform: "rotate(-10deg)",
                transformOrigin: "left",
              }}
            />
            <Typography
              variant="h6"
              fontFamily="Playfair Display"
              fontSize={isSmallScreen ? "13px" : "16px"}
              textAlign="center"
              fontWeight="bold"
              color="secondary"
              mt={isSmallScreen ? "4px" : "8px"}
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
