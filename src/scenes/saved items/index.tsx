import React, { useEffect, useState } from "react";
import {
  Box, Button, CircularProgress, IconButton, Typography, useTheme, useMediaQuery, Chip,
} from "@mui/material";
import { Favorite, FavoriteBorderRounded, ShoppingCartOutlined } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "store";
import { setWishlist, setCart } from "state";
import { brand } from "../../theme";

interface WishlistProduct {
  _id: string; name: string; price: number; discount: number;
  imageName: string; category: string; supply: number; rating: number;
  description: string; imagePath: string; images?: string[];
}

const SavedItems = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery("(max-width:600px)");
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const imageUrl = import.meta.env.VITE_IMAGE_URL;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const wishlist = useSelector((state: RootState) => state.global.wishlist);
  const cart = useSelector((state: RootState) => state.global.cart);
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const borderColor = isDark ? "#27272E" : "#EBEBEB";

  const fmt = (n: number) => "₦" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const fetchWishlist = async () => {
    if (!user?.token) { setLoading(false); return; }
    try {
      const res = await fetch(`${baseUrl}/get/wishlist`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      setProducts(data.products || []);
      dispatch(setWishlist((data.products || []).map((p: WishlistProduct) => p._id)));
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  const toggleWishlist = async (productId: string) => {
    if (!user?.token) return;
    await fetch(`${baseUrl}/post/wishlist/${productId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setProducts((prev) => prev.filter((p) => p._id !== productId));
    dispatch(setWishlist(wishlist.filter((id) => id !== productId)));
  };

  useEffect(() => { fetchWishlist(); }, []);

  return (
    <Box sx={{ p: { xs: "16px", md: "28px" } }}>
      {/* Page header */}
      <Box sx={{ pb: "20px", borderBottom: `1px solid ${borderColor}`, mb: "24px" }}>
        <Typography fontFamily="Playfair Display" fontWeight={900} fontSize="1.3rem">
          Saved Items
        </Typography>
        <Typography fontFamily="Nunito" fontSize="0.82rem" color="text.secondary" mt="2px">
          Products you've hearted for later
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" pt="60px">
          <CircularProgress color="primary" />
        </Box>
      ) : products.length === 0 ? (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: "60px", textAlign: "center" }}>
          <Box sx={{
            width: "80px", height: "80px", borderRadius: "50%",
            backgroundColor: `${brand.primary}12`,
            display: "flex", alignItems: "center", justifyContent: "center", mb: "20px",
          }}>
            <FavoriteBorderRounded sx={{ fontSize: "38px", color: brand.primary }} />
          </Box>
          <Typography fontFamily="Playfair Display" fontWeight={700} fontSize="1.3rem" mb="10px">
            Nothing saved yet
          </Typography>
          <Typography fontFamily="Nunito" color="text.secondary" fontSize="0.9rem" mb="28px" sx={{ maxWidth: "340px" }}>
            Found something you love? Tap the heart icon on a product to save it here for later.
          </Typography>
          <Link to="/shop">
            <Button variant="contained" sx={{ px: "32px", py: "12px" }}>
              Browse Products
            </Button>
          </Link>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "repeat(2, 1fr)"
              : "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          {products.map((product) => {
            const discounted = product.price * ((100 - product.discount) / 100);
            const inCart = cart.some((c) => c._id === product._id);
            const outOfStock = product.supply === 0;

            return (
              <Box
                key={product._id}
                sx={{
                  borderRadius: "14px",
                  border: `1px solid ${borderColor}`,
                  backgroundColor: isDark ? "#09090D" : "#fff",
                  overflow: "hidden",
                  position: "relative",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: isDark ? "0 10px 32px rgba(0,0,0,0.5)" : "0 10px 32px rgba(0,0,0,0.09)",
                  },
                }}
              >
                {/* Image */}
                <Box sx={{ position: "relative" }}>
                  <Box
                    component="img"
                    src={`${imageUrl}/uploads/${product.imageName}`}
                    alt={product.name}
                    sx={{
                      width: "100%", height: "160px", objectFit: "cover",
                      cursor: "pointer", display: "block",
                      backgroundColor: isDark ? "#1A1A1E" : "#F3F4F6",
                    }}
                    onClick={() => navigate(`/products/${product._id}`)}
                  />
                  {/* Remove from wishlist */}
                  <IconButton
                    size="small"
                    onClick={() => toggleWishlist(product._id)}
                    sx={{
                      position: "absolute", top: "8px", right: "8px",
                      backgroundColor: isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.9)",
                      backdropFilter: "blur(4px)",
                      "&:hover": { backgroundColor: isDark ? "rgba(0,0,0,0.8)" : "#fff0f0" },
                      width: "30px", height: "30px",
                    }}
                  >
                    <Favorite sx={{ color: "#e53935", fontSize: "16px" }} />
                  </IconButton>
                  {/* Discount badge */}
                  {product.discount > 0 && (
                    <Box sx={{
                      position: "absolute", top: "8px", left: "8px",
                      backgroundColor: brand.primary,
                      borderRadius: "6px", px: "7px", py: "2px",
                    }}>
                      <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.7rem" color="#fff">
                        -{product.discount}%
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Details */}
                <Box sx={{ p: "12px" }}>
                  <Typography
                    fontFamily="Nunito"
                    fontWeight={700}
                    fontSize="0.88rem"
                    noWrap
                    mb="4px"
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    {product.name[0].toUpperCase()}{product.name.slice(1)}
                  </Typography>
                  <Typography fontFamily="Nunito" fontSize="0.72rem" color="text.secondary" mb="8px">
                    {product.category[0].toUpperCase()}{product.category.slice(1)}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "baseline", gap: "6px", mb: "10px" }}>
                    <Typography fontFamily="Nunito" fontWeight={800} fontSize="0.95rem" color="primary">
                      {fmt(discounted)}
                    </Typography>
                    {product.discount > 0 && (
                      <Typography fontFamily="Nunito" fontSize="0.75rem" color="text.disabled" sx={{ textDecoration: "line-through" }}>
                        {fmt(product.price)}
                      </Typography>
                    )}
                  </Box>

                  <Button
                    variant={inCart ? "outlined" : "contained"}
                    size="small"
                    fullWidth
                    disabled={outOfStock}
                    startIcon={<ShoppingCartOutlined sx={{ fontSize: "14px" }} />}
                    sx={{ borderRadius: "100px", fontFamily: "Nunito", fontWeight: 700, fontSize: "0.76rem" }}
                    onClick={() => {
                      if (inCart) {
                        dispatch(setCart(cart.filter((c) => c._id !== product._id)));
                      } else {
                        dispatch(setCart([...cart, { ...product, quantity: 1 }]));
                      }
                    }}
                  >
                    {outOfStock ? "Out of Stock" : inCart ? "Remove" : "Add to Cart"}
                  </Button>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default SavedItems;
