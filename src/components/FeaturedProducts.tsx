import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Button,
} from "@mui/material";
import {
  AddShoppingCartRounded,
  RemoveShoppingCartRounded,
  ArrowForwardRounded,
  StarRounded,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "store";
import { setCart } from "state";
import { brand } from "../theme";

interface ProductData {
  name: string;
  price: number;
  rating: number;
  discount: number;
  quantity: number;
  supply: number;
  imageName: string;
  imagePath: string;
  description: string;
  category: string;
  _id: string;
}

const FeaturedProducts = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery("(max-width:600px)");
  const isMedium = useMediaQuery("(max-width:960px)");
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const imageUrl = import.meta.env.VITE_IMAGE_URL;
  const [products, setProducts] = useState<ProductData[]>([]);
  const [hovered, setHovered] = useState("");
  const dispatch = useAppDispatch();
  const cart = useSelector((state: RootState) => state.global.cart);

  const fmt = (n: number) => n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const borderColor = isDark ? "#27272E" : "#EBEBEB";

  useEffect(() => {
    fetch(`${baseUrl}/get/products/featured`)
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => {});
  }, []);

  if (products.length === 0) return null;

  return (
    <Box sx={{ px: { xs: "20px", sm: "40px", md: "64px" }, py: { xs: "48px", md: "80px" } }}>
      {/* Section header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          mb: { xs: "28px", md: "40px" },
        }}
      >
        <Box>
          <Typography
            fontFamily="Nunito"
            fontWeight={700}
            fontSize="0.78rem"
            letterSpacing="0.08em"
            color={brand.primary}
            mb="8px"
            sx={{ textTransform: "uppercase" }}
          >
            Handpicked for you
          </Typography>
          <Typography
            fontFamily="Playfair Display"
            fontWeight={900}
            fontSize={{ xs: "1.6rem", md: "2rem" }}
            color="text.primary"
            lineHeight={1.1}
          >
            Featured Products
          </Typography>
        </Box>
        <Link to="/shop">
          <Button
            endIcon={<ArrowForwardRounded />}
            sx={{
              fontFamily: "Nunito",
              fontWeight: 700,
              fontSize: "0.85rem",
              color: brand.primary,
              "&:hover": { backgroundColor: `${brand.primary}10` },
              display: { xs: "none", sm: "flex" },
            }}
          >
            View all
          </Button>
        </Link>
      </Box>

      {/* Product grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "repeat(2, 1fr)"
            : isMedium
            ? "repeat(3, 1fr)"
            : "repeat(4, 1fr)",
          gap: { xs: "12px", md: "20px" },
        }}
      >
        {products.map((each) => {
          const discountedPrice = each.price * ((100 - each.discount) / 100);
          const inCart = cart.some((item) => item._id === each._id);

          return (
            <Box
              key={each._id}
              onMouseEnter={() => setHovered(each._id)}
              onMouseLeave={() => setHovered("")}
              sx={{
                borderRadius: "14px",
                overflow: "hidden",
                border: `1px solid ${borderColor}`,
                backgroundColor: isDark ? "#18181C" : "#FFFFFF",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: isDark
                    ? "0 12px 32px rgba(0,0,0,0.5)"
                    : "0 12px 32px rgba(0,0,0,0.1)",
                },
                cursor: "pointer",
                position: "relative",
              }}
            >
              {/* Discount badge */}
              {each.discount > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    zIndex: 2,
                    backgroundColor: brand.primary,
                    color: "#fff",
                    fontFamily: "Nunito",
                    fontWeight: 800,
                    fontSize: "0.72rem",
                    px: "8px",
                    py: "3px",
                    borderRadius: "100px",
                  }}
                >
                  -{each.discount}%
                </Box>
              )}

              {/* Out of stock overlay */}
              {each.supply === 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "58%",
                    background: "rgba(0,0,0,0.45)",
                    zIndex: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography fontFamily="Nunito" fontWeight={700} color="white" fontSize="0.82rem">
                    Out of Stock
                  </Typography>
                </Box>
              )}

              {/* Image */}
              <Link to={`/products/${each._id}`}>
                <Box
                  component="img"
                  src={`${imageUrl}/uploads/${each.imageName}`}
                  alt={each.name}
                  sx={{
                    width: "100%",
                    height: { xs: "160px", md: "200px" },
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 0.4s ease",
                    "&:hover": { transform: "scale(1.04)" },
                  }}
                />
              </Link>

              {/* Info */}
              <Box sx={{ p: { xs: "10px", md: "14px" } }}>
                <Typography
                  fontFamily="Nunito"
                  fontWeight={600}
                  fontSize="0.78rem"
                  color="text.secondary"
                  mb="3px"
                >
                  {each.category[0].toUpperCase()}{each.category.slice(1)}
                </Typography>
                <Typography
                  fontFamily="Nunito"
                  fontWeight={700}
                  fontSize={{ xs: "0.85rem", md: "0.92rem" }}
                  noWrap
                  mb="8px"
                >
                  {each.name[0].toUpperCase()}{each.name.slice(1)}
                </Typography>

                {/* Rating */}
                <Box sx={{ display: "flex", alignItems: "center", gap: "3px", mb: "10px" }}>
                  <StarRounded sx={{ fontSize: "14px", color: brand.primary }} />
                  <Typography fontFamily="Nunito" fontSize="0.78rem" color="text.secondary">
                    {each.rating.toFixed(1)}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography fontFamily="Nunito" fontWeight={800} fontSize="0.95rem" color="primary">
                      ${fmt(discountedPrice)}
                    </Typography>
                    {each.discount > 0 && (
                      <Typography
                        fontFamily="Nunito"
                        fontSize="0.75rem"
                        color="text.secondary"
                        sx={{ textDecoration: "line-through" }}
                      >
                        ${fmt(each.price)}
                      </Typography>
                    )}
                  </Box>

                  {each.supply > 0 && (
                    <IconButton
                      size="small"
                      onClick={() =>
                        inCart
                          ? dispatch(setCart(cart.filter((i) => i._id !== each._id)))
                          : dispatch(setCart([...cart, { ...each, quantity: 1 }]))
                      }
                      sx={{
                        backgroundColor: inCart ? `${brand.primary}15` : isDark ? "rgba(255,255,255,0.06)" : "#F3F4F6",
                        color: inCart ? brand.primary : theme.palette.text.secondary,
                        p: "7px",
                        opacity: isMedium ? 1 : hovered === each._id ? 1 : 0,
                        transform: isMedium ? "none" : hovered === each._id ? "scale(1)" : "scale(0.85)",
                        transition: "all 0.2s ease",
                        "&:hover": { backgroundColor: `${brand.primary}25`, color: brand.primary },
                      }}
                    >
                      {inCart
                        ? <RemoveShoppingCartRounded sx={{ fontSize: "16px" }} />
                        : <AddShoppingCartRounded sx={{ fontSize: "16px" }} />}
                    </IconButton>
                  )}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Mobile view-all */}
      <Box sx={{ display: { xs: "flex", sm: "none" }, justifyContent: "center", mt: "28px" }}>
        <Link to="/shop">
          <Button
            variant="outlined"
            endIcon={<ArrowForwardRounded />}
            sx={{ borderRadius: "100px", px: "24px", fontFamily: "Nunito", fontWeight: 700 }}
          >
            View all products
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default FeaturedProducts;
