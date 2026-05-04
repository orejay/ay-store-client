import { Favorite, FavoriteBorderRounded } from "@mui/icons-material";
import { Box, Button, CircularProgress, IconButton, Typography, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "store";
import { setWishlist, setCart } from "state";

interface WishlistProduct {
  _id: string;
  name: string;
  price: number;
  discount: number;
  imageName: string;
  category: string;
  supply: number;
  rating: number;
  description: string;
  imagePath: string;
  images?: string[];
}

const SavedItems = () => {
  const isSmallScreen = useMediaQuery("(max-width:450px)");
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const imageUrl = import.meta.env.VITE_IMAGE_URL;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const wishlist = useSelector((state: RootState) => state.global.wishlist);
  const cart = useSelector((state: RootState) => state.global.cart);
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const formatNum = (n: string) => n.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const fetchWishlist = async () => {
    if (!user?.token) { setLoading(false); return; }
    try {
      const res = await fetch(`${baseUrl}/get/wishlist`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      setProducts(data.products || []);
      dispatch(setWishlist((data.products || []).map((p: WishlistProduct) => p._id)));
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
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
    <Box>
      <Box sx={{ borderBottom: "1px solid #E0E0E0", pl: "30px", py: "10px" }}>
        <Typography fontFamily="Playfair Display" fontWeight="bold" color="secondary" variant="h5">
          Saved Items
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" pt="60px">
          <CircularProgress color="primary" />
        </Box>
      ) : products.length === 0 ? (
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%", pt: "60px" }}>
          <Favorite sx={{ fontSize: "90px", color: "#Ed981b" }} />
          <Typography fontFamily="Nunito" fontWeight="bold" fontSize="20px" pt="20px">
            You haven't saved an item yet!
          </Typography>
          <Typography pt="10px" fontSize="14px" sx={{ maxWidth: "40%", textAlign: "center" }}>
            Found something you like? Tap the heart icon on a product to save it here.
          </Typography>
          <Button variant="contained" sx={{ px: "30px", mt: "15px", borderRadius: "20px" }}>
            <Link to="/shop" className="w-full h-full">
              <Typography color="#FFFFFF" fontWeight="bold" fontFamily="Nunito">Continue Shopping</Typography>
            </Link>
          </Button>
        </Box>
      ) : (
        <Box sx={{ p: "20px", display: "grid", gridTemplateColumns: isSmallScreen ? "1fr" : "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
          {products.map((product) => {
            const discounted = product.price * ((100 - product.discount) / 100);
            const inCart = cart.some((c) => c._id === product._id);
            return (
              <Box key={product._id} sx={{ boxShadow: "2px 2px 7px #E0E0E0", borderRadius: "8px", overflow: "hidden", position: "relative" }}>
                <Box
                  component="img"
                  src={`${imageUrl}/uploads/${product.imageName}`}
                  alt={product.name}
                  sx={{ width: "100%", height: "160px", objectFit: "cover", cursor: "pointer" }}
                  onClick={() => navigate(`/products/${product._id}`)}
                />
                <IconButton
                  size="small"
                  onClick={() => toggleWishlist(product._id)}
                  sx={{ position: "absolute", top: 8, right: 8, backgroundColor: "white", "&:hover": { backgroundColor: "#fff0f0" } }}
                >
                  <Favorite sx={{ color: "#e53935", fontSize: "18px" }} />
                </IconButton>
                <Box sx={{ p: "10px" }}>
                  <Typography fontFamily="Nunito" fontWeight="bold" fontSize="14px" noWrap>
                    {product.name[0].toUpperCase()}{product.name.slice(1)}
                  </Typography>
                  <Typography fontFamily="Nunito" color="primary" fontWeight="bold" fontSize="13px">
                    ${formatNum(discounted.toFixed(2))}
                    {product.discount > 0 && (
                      <Typography component="span" sx={{ textDecoration: "line-through", opacity: 0.6, fontSize: "11px", ml: "6px" }}>
                        ${formatNum(String(product.price))}
                      </Typography>
                    )}
                  </Typography>
                  <Button
                    variant={inCart ? "outlined" : "contained"}
                    size="small"
                    fullWidth
                    disabled={product.supply === 0}
                    sx={{ mt: "8px", borderRadius: "20px", textTransform: "none", fontSize: "12px" }}
                    onClick={() => {
                      if (inCart) {
                        dispatch(setCart(cart.filter((c) => c._id !== product._id)));
                      } else {
                        dispatch(setCart([...cart, { ...product, quantity: 1 }]));
                      }
                    }}
                  >
                    {product.supply === 0 ? "Out of Stock" : inCart ? "Remove from Cart" : "Add to Cart"}
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
