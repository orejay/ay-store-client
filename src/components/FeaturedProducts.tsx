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
          gap: { xs: "16px", md: "24px" },
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
              sx={{ position: "relative", cursor: "pointer" }}
            >
              {/* ── Image block ── */}
              <Box
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "12px",
                  paddingTop: "125%",
                  backgroundColor: isDark ? "#1C1C20" : "#F3F4F6",
                  mb: "12px",
                }}
              >
                <Link to={`/products/${each._id}`}>
                  <Box
                    component="img"
                    src={`${imageUrl}/uploads/${each.imageName}`}
                    alt={each.name}
                    sx={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)",
                      transform: isHovered ? "scale(1.08)" : "scale(1)",
                    }}
                  />
                </Link>

                {/* Discount pill */}
                {each.discount > 0 && (
                  <Box
                    sx={{
                      position: "absolute", top: "12px", left: "12px", zIndex: 2,
                      backgroundColor: brand.secondary, color: "#fff",
                      fontFamily: "Nunito", fontWeight: 800, fontSize: "0.68rem",
                      px: "9px", py: "3px", borderRadius: "100px", letterSpacing: "0.02em",
                    }}
                  >
                    -{each.discount}%
                  </Box>
                )}

                {/* Out of stock */}
                {each.supply === 0 && (
                  <Box
                    sx={{
                      position: "absolute", inset: 0, zIndex: 2,
                      background: "rgba(0,0,0,0.42)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <Typography
                      fontFamily="Nunito" fontWeight={700} color="#fff" fontSize="0.8rem"
                      sx={{ px: "14px", py: "5px", border: "1px solid rgba(255,255,255,0.55)", borderRadius: "100px", letterSpacing: "0.04em" }}
                    >
                      Out of Stock
                    </Typography>
                  </Box>
                )}

                {/* Slide-up "Add to bag" — desktop hover */}
                {each.supply > 0 && (
                  <Box
                    onClick={() =>
                      inCart
                        ? dispatch(setCart(cart.filter((i) => i._id !== each._id)))
                        : dispatch(setCart([...cart, { ...each, quantity: 1 }]))
                    }
                    sx={{
                      position: "absolute",
                      bottom: 0, left: 0, right: 0, zIndex: 3,
                      display: { xs: "none", md: "flex" },
                      alignItems: "center", justifyContent: "center", gap: "8px",
                      py: "13px",
                      background: inCart ? "rgba(239,68,68,0.92)" : "rgba(0,0,0,0.82)",
                      backdropFilter: "blur(4px)",
                      cursor: "pointer",
                      transform: isHovered ? "translateY(0)" : "translateY(100%)",
                      transition: "transform 0.28s cubic-bezier(0.34,1.56,0.64,1)",
                    }}
                  >
                    {inCart
                      ? <RemoveShoppingCartRounded sx={{ fontSize: "15px", color: "#fff" }} />
                      : <AddShoppingCartRounded sx={{ fontSize: "15px", color: "#fff" }} />}
                    <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.78rem" color="#fff" letterSpacing="0.06em" sx={{ textTransform: "uppercase" }}>
                      {inCart ? "Remove" : "Add to Bag"}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* ── Info below image ── */}
              <Box sx={{ px: "2px" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", mb: "4px" }}>
                  <Link to={`/products/${each._id}`} style={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      fontFamily="Nunito"
                      fontWeight={600}
                      fontSize={{ xs: "0.85rem", md: "0.9rem" }}
                      lineHeight={1.35}
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        "&:hover": { color: brand.primary },
                        transition: "color 0.15s",
                      }}
                    >
                      {each.name[0].toUpperCase()}{each.name.slice(1)}
                    </Typography>
                  </Link>

                  {/* Mobile cart button */}
                  {each.supply > 0 && (
                    <IconButton
                      size="small"
                      onClick={() =>
                        inCart
                          ? dispatch(setCart(cart.filter((i) => i._id !== each._id)))
                          : dispatch(setCart([...cart, { ...each, quantity: 1 }]))
                      }
                      sx={{
                        display: { xs: "flex", md: "none" },
                        flexShrink: 0,
                        backgroundColor: inCart ? brand.primary : isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6",
                        color: inCart ? "#fff" : theme.palette.text.secondary,
                        width: "30px", height: "30px",
                        "&:hover": { backgroundColor: brand.primary, color: "#fff" },
                      }}
                    >
                      {inCart
                        ? <RemoveShoppingCartRounded sx={{ fontSize: "14px" }} />
                        : <AddShoppingCartRounded sx={{ fontSize: "14px" }} />}
                    </IconButton>
                  )}
                </Box>

                {/* Price row */}
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Typography fontFamily="Nunito" fontWeight={800} fontSize="0.95rem" color="primary">
                    {fmt(discountedPrice)}
                  </Typography>
                  {each.discount > 0 && (
                    <Typography fontFamily="Nunito" fontSize="0.78rem" color="text.disabled" sx={{ textDecoration: "line-through" }}>
                      {fmt(each.price)}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Mobile view-all */}
      <Box sx={{ display: { xs: "flex", sm: "none" }, justifyContent: "center", mt: "32px" }}>
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
