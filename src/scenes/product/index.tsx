import {
  AddShoppingCartRounded,
  FavoriteBorderRounded,
  FavoriteRounded,
  RemoveShoppingCartRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Skeleton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Footer from "components/Footer";
import Header from "components/Header";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "store";
import { setCart, setWishlist } from "state";

interface ProductVariant {
  _id: string;
  size: string;
  color: string;
  stock: number;
}

interface ProductData {
  name: string;
  price: number;
  rating: number;
  discount: number;
  quantity: number;
  supply: number;
  imageName: string;
  imagePath: string;
  images?: string[];
  description: string;
  category: string;
  _id: string;
  variants?: ProductVariant[];
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMediumScreen = useMediaQuery("(max-width:768px)");
  const isSmallScreen = useMediaQuery("(max-width:450px)");
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const imageUrl = import.meta.env.VITE_IMAGE_URL;
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [mainImage, setMainImage] = useState("");
  const cart = useSelector((state: RootState) => state.global.cart);
  const wishlist = useSelector((state: RootState) => state.global.wishlist);
  const inCart = cart.some((item) => item._id === product?._id);
  const isSaved = product ? wishlist.includes(product._id) : false;
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const formatPrice = (n: number) =>
    n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${baseUrl}/get/product/${id}`);
        if (!res.ok) { navigate("/shop"); return; }
        const data = await res.json();
        setProduct(data);
        setMainImage(data.imageName);
        if (data.variants?.length) setSelectedVariant(data.variants[0]);
      } catch {
        navigate("/shop");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!user?.token || !product) return;
    fetch(`${baseUrl}/get/wishlist`, { headers: { Authorization: `Bearer ${user.token}` } })
      .then((r) => r.json())
      .then((data) => {
        dispatch(setWishlist((data.products || []).map((p: any) => p._id)));
      })
      .catch(() => {});
  }, [product]);

  const toggleWishlist = async () => {
    if (!user?.token || !product) return;
    await fetch(`${baseUrl}/post/wishlist/${product._id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${user.token}` },
    });
    if (isSaved) {
      dispatch(setWishlist(wishlist.filter((wid) => wid !== product._id)));
    } else {
      dispatch(setWishlist([...wishlist, product._id]));
    }
  };

  const hasVariants = (product?.variants?.length ?? 0) > 0;
  const availableStock = hasVariants ? (selectedVariant?.stock ?? 0) : (product?.supply ?? 0);

  const discountedPrice = product
    ? product.price * ((100 - product.discount) / 100)
    : 0;

  const handleAddToCart = () => {
    if (!product) return;
    if (hasVariants && !selectedVariant) return;
    if (inCart) {
      dispatch(setCart(cart.filter((item) => item._id !== product._id)));
    } else {
      dispatch(setCart([...cart, {
        ...product,
        quantity: qty,
        ...(selectedVariant ? { selectedVariant } : {}),
      }]));
    }
  };

  const galleryImages: string[] = product?.images?.length
    ? product.images
    : product?.imageName
    ? [product.imageName]
    : [];

  return (
    <Box>
      <Header />
      <Box sx={{ pt: "120px", pb: "80px", minHeight: "100vh", width: isSmallScreen ? "95%" : isMediumScreen ? "90%" : "80%", mx: "auto" }}>
        {loading ? (
          <Box display="flex" gap="40px" flexDirection={isMediumScreen ? "column" : "row"}>
            <Skeleton variant="rectangular" width={isMediumScreen ? "100%" : "45%"} height={400} sx={{ borderRadius: "10px" }} />
            <Box flex={1} display="flex" flexDirection="column" gap="16px">
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="text" width="40%" height={30} />
              <Skeleton variant="text" width="80%" height={20} />
              <Skeleton variant="text" width="80%" height={20} />
              <Skeleton variant="text" width="50%" height={20} />
            </Box>
          </Box>
        ) : product ? (
          <Box display="flex" gap={isSmallScreen ? "24px" : "48px"} flexDirection={isMediumScreen ? "column" : "row"}>
            {/* Image gallery */}
            <Box sx={{ width: isMediumScreen ? "100%" : "45%", flexShrink: 0 }}>
              <Box sx={{ borderRadius: "10px", overflow: "hidden", boxShadow: "2px 2px 12px #E0E0E0", mb: "12px" }}>
                <Box component="img" src={`${imageUrl}/uploads/${mainImage || product.imageName}`} alt={product.name} sx={{ width: "100%", height: isSmallScreen ? "260px" : "420px", objectFit: "cover" }} />
              </Box>
              {galleryImages.length > 1 && (
                <Box display="flex" gap="8px" flexWrap="wrap">
                  {galleryImages.map((imgName, i) => (
                    <Box
                      key={i}
                      component="img"
                      src={`${imageUrl}/uploads/${imgName}`}
                      alt=""
                      onClick={() => setMainImage(imgName)}
                      sx={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        cursor: "pointer",
                        border: mainImage === imgName ? "2px solid #Ed981b" : "2px solid transparent",
                        opacity: mainImage === imgName ? 1 : 0.7,
                        transition: "0.2s",
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>

            {/* Details */}
            <Box display="flex" flexDirection="column" flex={1} gap="12px">
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                {product.discount > 0 && (
                  <Chip label={`-${product.discount}% OFF`} sx={{ backgroundColor: "#Ed981b", color: "white", fontFamily: "Nunito", fontWeight: "bold" }} />
                )}
                {user?.token && (
                  <IconButton onClick={toggleWishlist} sx={{ ml: "auto" }}>
                    {isSaved
                      ? <FavoriteRounded sx={{ color: "#e53935" }} />
                      : <FavoriteBorderRounded sx={{ color: "#e53935" }} />}
                  </IconButton>
                )}
              </Box>

              <Typography variant="h4" fontFamily="Playfair Display" fontWeight="bold">
                {product.name[0].toUpperCase()}{product.name.slice(1)}
              </Typography>
              <Typography fontFamily="Nunito" color="secondary" fontWeight="bold" fontSize="15px">
                {product.category[0].toUpperCase()}{product.category.slice(1)}
              </Typography>

              <Divider />

              <Box display="flex" alignItems="center" gap="12px">
                <Typography fontFamily="Nunito" fontWeight="bold" fontSize="24px" color="primary">
                  ${formatPrice(discountedPrice)}
                </Typography>
                {product.discount > 0 && (
                  <Typography fontFamily="Nunito" fontSize="16px" sx={{ textDecoration: "line-through", opacity: 0.6 }}>
                    ${formatPrice(product.price)}
                  </Typography>
                )}
              </Box>

              <Typography fontFamily="Nunito" fontSize="14px" color="text.secondary">
                {product.description}
              </Typography>

              {/* Variant selectors */}
              {hasVariants && (
                <Box>
                  <Typography fontFamily="Nunito" fontWeight="bold" fontSize="13px" mb="6px">
                    Select variant:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap="8px">
                    {product.variants!.map((v) => (
                      <Box
                        key={v._id}
                        onClick={() => { setSelectedVariant(v); setQty(1); }}
                        sx={{
                          px: "12px",
                          py: "4px",
                          border: selectedVariant?._id === v._id ? "2px solid #Ed981b" : "1px solid #E0E0E0",
                          borderRadius: "20px",
                          cursor: v.stock === 0 ? "not-allowed" : "pointer",
                          opacity: v.stock === 0 ? 0.4 : 1,
                          backgroundColor: selectedVariant?._id === v._id ? "#fff8ee" : "white",
                        }}
                      >
                        <Typography fontFamily="Nunito" fontSize="13px" fontWeight="bold">
                          {[v.size, v.color].filter(Boolean).join(" / ")}
                        </Typography>
                        {v.stock === 0 && <Typography fontSize="10px" color="error">Out of stock</Typography>}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Stock status */}
              {availableStock === 0 ? (
                <Typography fontFamily="Nunito" fontWeight="bold" fontSize="13px" sx={{ color: "#d32f2f" }}>
                  Out of Stock
                </Typography>
              ) : availableStock <= 5 ? (
                <Typography fontFamily="Nunito" fontSize="13px" sx={{ color: "#Ed981b" }}>
                  <strong>Only {availableStock} left!</strong>
                </Typography>
              ) : (
                <Typography fontFamily="Nunito" fontSize="13px" color="text.secondary">In stock</Typography>
              )}

              {availableStock > 0 && (
                <Box display="flex" alignItems="center" gap="12px" mt="8px">
                  <Box display="flex" alignItems="center" sx={{ border: "1px solid #E0E0E0", borderRadius: "20px", overflow: "hidden" }}>
                    <IconButton size="small" onClick={() => setQty(Math.max(1, qty - 1))} disabled={inCart}>
                      <Typography fontWeight="bold" px="4px">−</Typography>
                    </IconButton>
                    <Typography px="12px" fontFamily="Nunito" fontWeight="bold">{qty}</Typography>
                    <IconButton size="small" onClick={() => setQty(Math.min(availableStock, qty + 1))} disabled={inCart}>
                      <Typography fontWeight="bold" px="4px">+</Typography>
                    </IconButton>
                  </Box>

                  <Button
                    variant="contained"
                    onClick={handleAddToCart}
                    disabled={hasVariants && !selectedVariant}
                    startIcon={inCart ? <RemoveShoppingCartRounded /> : <AddShoppingCartRounded />}
                    sx={{ borderRadius: "20px", textTransform: "none", px: "24px" }}
                  >
                    <Typography color="white" fontFamily="Nunito" fontWeight="bold">
                      {inCart ? "Remove from Cart" : "Add to Cart"}
                    </Typography>
                  </Button>
                </Box>
              )}

              {inCart && (
                <Button variant="outlined" onClick={() => navigate("/checkout")} sx={{ borderRadius: "20px", textTransform: "none", width: "fit-content" }}>
                  <Typography fontFamily="Nunito" fontWeight="bold">Go to Checkout</Typography>
                </Button>
              )}
            </Box>
          </Box>
        ) : null}
      </Box>
      <Footer />
    </Box>
  );
};

export default ProductDetail;
