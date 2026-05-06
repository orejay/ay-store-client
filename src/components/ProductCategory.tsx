import React from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { Link } from "react-router-dom";
import { Element } from "react-scroll";
import { RootState, useAppDispatch } from "store";
import { setCategories } from "state";
import { useSelector } from "react-redux";
import { brand } from "../theme";
import womens from "../assets/cat-womens.webp";
import mens from "../assets/cat-mens.webp";
import footwear from "../assets/cat-footwear.webp";
import bags from "../assets/cat-bags.png";
import activewear from "../assets/cat-activewear.webp";
import watches from "../assets/cat-watches.webp";

const categories = [
  { title: "Women's Wear", value: "womens", image: womens },
  { title: "Men's Wear", value: "mens", image: mens },
  { title: "Footwear", value: "footwear", image: footwear },
  { title: "Bags & Accessories", value: "bags", image: bags },
  { title: "Activewear", value: "activewear", image: activewear },
  { title: "Watches & Jewellery", value: "watches", image: watches },
];

const ProductCategory = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery("(max-width:600px)");
  const isMedium = useMediaQuery("(max-width:960px)");

  return (
    <Element name="shop">
      <Box
        id="shop"
        sx={{
          px: { xs: "20px", sm: "40px", md: "64px" },
          py: { xs: "48px", md: "80px" },
          backgroundColor: isDark ? "#09090D" : "#FFFFFF",
        }}
      >
        {/* Section header */}
        <Box sx={{ mb: { xs: "28px", md: "40px" } }}>
          <Typography
            fontFamily="Nunito"
            fontWeight={700}
            fontSize="0.78rem"
            letterSpacing="0.08em"
            color={brand.secondary}
            mb="8px"
            sx={{ textTransform: "uppercase" }}
          >
            Unique
          </Typography>
          <Typography
            fontFamily="Playfair Display"
            fontWeight={900}
            fontSize={{ xs: "1.6rem", md: "2rem" }}
            color="text.primary"
            lineHeight={1.1}
          >
            Shop by Category
          </Typography>
        </Box>

        {/* Category grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "repeat(2, 1fr)"
              : isMedium
                ? "repeat(3, 1fr)"
                : "repeat(6, 1fr)",
            gap: { xs: "12px", md: "16px" },
          }}
        >
          {categories.map(({ title, value, image }) => (
            <Link
              key={value}
              to="/shop"
              onClick={() => dispatch(setCategories([value]))}
            >
              <Box
                sx={{
                  position: "relative",
                  borderRadius: "16px",
                  overflow: "hidden",
                  aspectRatio: "3/4",
                  cursor: "pointer",
                  "&:hover img": { transform: "scale(1.07)" },
                  "&:hover .overlay": { opacity: 1 },
                  "&:hover .label": { transform: "translateY(0)", opacity: 1 },
                }}
              >
                <Box
                  component="img"
                  src={image}
                  alt={title}
                  className="cat-img"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 0.45s ease",
                  }}
                />

                {/* Permanent bottom gradient */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "55%",
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
                    pointerEvents: "none",
                  }}
                />

                {/* Hover overlay tint */}
                <Box
                  className="overlay"
                  sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: `${brand.primary}30`,
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                    pointerEvents: "none",
                  }}
                />

                {/* Label */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "14px",
                    left: 0,
                    right: 0,
                    textAlign: "center",
                  }}
                >
                  <Typography
                    fontFamily="Playfair Display"
                    fontWeight={700}
                    fontSize={{ xs: "0.85rem", md: "0.95rem" }}
                    color="#FFFFFF"
                    sx={{ textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
                  >
                    {title}
                  </Typography>
                </Box>
              </Box>
            </Link>
          ))}
        </Box>
      </Box>
    </Element>
  );
};

export default ProductCategory;
