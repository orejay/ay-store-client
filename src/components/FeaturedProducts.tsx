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

const fmt = (n: number) => "₦" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

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
          const isHovered = hovered === each._id;

          return (
            <Box
              key={each._id}
              onMouseEnter={() => setHovered(each._id)}
              onMouseLeave={() => setHovered("")}
              sx={{
                borderRadius: "16px",
                overflow: "hidden",
                border: `1px solid ${borderColor}`,
                backgroundColor: isDark ? "#18181C" : "#FFFFFF",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: isDark
                    ? "0 16px 40px rgba(0,0,0,0.55)"
                    : "0 16px 40px rgba(0,0,0,0.1)",
                },
                cursor: "pointer",
                position: "relative",
              }}
            >
              {/* Image wrapper */}
              <Box sx={{ position: "relative", overflow: "hidden" }}>
                {/* Discount badge */}
                {each.discount > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      zIndex: 2,
                      backgroundColor: brand.secondary,
                      color: "#fff",
                      fontFamily: "Nunito",
                      fontWeight: 800,
                      fontSize: "0.7rem",
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
                      inset: 0,
                      background: "rgba(0,0,0,0.5)",
                      zIndex: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      fontFamily="Nunito"
                      fontWeight={700}
                      color="white"
                      fontSize="0.82rem"
                      sx={{
                        px: "12px", py: "4px",
                        border: "1px solid rgba(255,255,255,0.5)",
                        borderRadius: "100px",
                      }}
                    >
                      Out of Stock
                    </Typography>
                  </Box>
                )}

                <Link to={`/products/${each._id}`}>
                  <Box
                    component="img"
                    src={`${imageUrl}/uploads/${each.imageName}`}
                    alt={each.name}
                    sx={{
                      width: "100%",
                      height: { xs: "190px", md: "230px" },
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.5s ease",
                      transform: isHovered ? "scale(1.06)" : "scale(1)",
                    }}
                  />
                </Link>
              </Box>

              {/* Card body */}
              <Box sx={{ p: { xs: "12px", md: "16px" } }}>
                <Typography
                  fontFamily="Nunito"
                  fontWeight={600}
                  fontSize="0.72rem"
                  letterSpacing="0.04em"
                  color={brand.secondary}
                  mb="4px"
                  sx={{ textTransform: "uppercase" }}
                >
                  {each.category[0].toUpperCase()}{each.category.slice(1)}
                </Typography>

                <Link to={`/products/${each._id}`}>
                  <Typography
                    fontFamily="Nunito"
                    fontWeight={700}
                    fontSize={{ xs: "0.88rem", md: "0.95rem" }}
                    mb="8px"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: 1.4,
                      "&:hover": { color: brand.primary },
                      transition: "color 0.15s",
                    }}
                  >
                    {each.name[0].toUpperCase()}{each.name.slice(1)}
                  </Typography>
                </Link>

                {/* Rating */}
                <Box sx={{ display: "flex", alignItems: "center", gap: "3px", mb: "10px" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarRounded
                      key={star}
                      sx={{
                        fontSize: "13px",
                        color: star <= Math.round(each.rating) ? "#F59E0B" : (isDark ? "#3F3F46" : "#E5E7EB"),
                      }}
                    />
                  ))}
                  <Typography fontFamily="Nunito" fontSize="0.72rem" color="text.secondary" ml="2px">
                    {each.rating.toFixed(1)}
                  </Typography>
                </Box>

                {/* Price row */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography fontFamily="Nunito" fontWeight={800} fontSize="1rem" color="primary" lineHeight={1.2}>
                      {fmt(discountedPrice)}
                    </Typography>
                    {each.discount > 0 && (
                      <Typography
                        fontFamily="Nunito"
                        fontSize="0.75rem"
                        color="text.disabled"
                        sx={{ textDecoration: "line-through" }}
                      >
                        {fmt(each.price)}
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
                        backgroundColor: inCart ? brand.primary : isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6",
                        color: inCart ? "#fff" : theme.palette.text.secondary,
                        p: "8px",
                        opacity: isMedium ? 1 : isHovered ? 1 : 0,
                        transform: isMedium ? "none" : isHovered ? "scale(1)" : "scale(0.8)",
                        transition: "all 0.2s ease",
                        "&:hover": { backgroundColor: brand.primary, color: "#fff" },
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
