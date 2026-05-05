import {
  AddShoppingCartRounded,
  FavoriteBorderRounded,
  FavoriteRounded,
  RemoveShoppingCartRounded,
  StarRounded,
  LocalOfferOutlined,
  ShoppingCartCheckoutOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Footer from "components/Footer";
import Header from "components/Header";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "store";
import { setCart, setWishlist } from "state";
import { brand } from "../../theme";

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
  brand?: string;
  _id: string;
  variants?: ProductVariant[];
}

const fmt = (n: number) => "₦" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery("(max-width:768px)");
  const isSmall = useMediaQuery("(max-width:450px)");

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

  const borderColor = isDark ? "#27272E" : "#EBEBEB";
  const cardBg = isDark ? "#18181C" : "#FFFFFF";

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
  const discountedPrice = product ? product.price * ((100 - product.discount) / 100) : 0;

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
    <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: "100vh" }}>
      <Header />

      <Box sx={{ pt: { xs: "70px", md: "80px" }, pb: "80px", px: { xs: "16px", sm: "24px", md: "48px" }, maxWidth: "1200px", mx: "auto" }}>
        {loading ? (
          <Box sx={{ display: "flex", gap: "40px", flexDirection: isMobile ? "column" : "row", pt: "24px" }}>
            <Skeleton variant="rectangular" width={isMobile ? "100%" : "45%"} height={460} sx={{ borderRadius: "16px", flexShrink: 0 }} />
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", pt: "8px" }}>
              <Skeleton variant="text" width="40%" height={24} />
              <Skeleton variant="text" width="70%" height={44} />
              <Skeleton variant="text" width="30%" height={36} />
              <Skeleton variant="text" width="90%" height={20} />
              <Skeleton variant="text" width="90%" height={20} />
              <Skeleton variant="text" width="60%" height={20} />
            </Box>
          </Box>
        ) : product ? (
          <Box sx={{ display: "flex", gap: { xs: "24px", md: "52px" }, flexDirection: isMobile ? "column" : "row", pt: "24px" }}>

            {/* ── Image gallery ── */}
            <Box sx={{ width: isMobile ? "100%" : "45%", flexShrink: 0 }}>
              {/* Main image */}
              <Box
                sx={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: `1px solid ${borderColor}`,
                  backgroundColor: cardBg,
                  mb: "12px",
                  position: "relative",
                }}
              >
                {product.discount > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "14px",
                      left: "14px",
                      zIndex: 2,
                      backgroundColor: brand.secondary,
                      color: "#fff",
                      fontFamily: "Nunito",
                      fontWeight: 800,
                      fontSize: "0.78rem",
                      px: "10px",
                      py: "4px",
                      borderRadius: "100px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <LocalOfferOutlined sx={{ fontSize: "14px" }} />
                    -{product.discount}% OFF
                  </Box>
                )}
                <Box
                  component="img"
                  src={`${imageUrl}/uploads/${mainImage || product.imageName}`}
                  alt={product.name}
                  sx={{
                    width: "100%",
                    height: isSmall ? "280px" : isMobile ? "360px" : "460px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </Box>

              {/* Thumbnails */}
              {galleryImages.length > 1 && (
                <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {galleryImages.map((imgName, i) => (
                    <Box
                      key={i}
                      component="img"
                      src={`${imageUrl}/uploads/${imgName}`}
                      alt=""
                      onClick={() => setMainImage(imgName)}
                      sx={{
                        width: "68px",
                        height: "68px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        cursor: "pointer",
                        border: `2px solid ${mainImage === imgName ? brand.primary : borderColor}`,
                        opacity: mainImage === imgName ? 1 : 0.65,
                        transition: "all 0.2s",
                        "&:hover": { opacity: 1, borderColor: brand.primary },
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>

            {/* ── Product info ── */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: "0" }}>
              {/* Category + wishlist row */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "12px" }}>
                <Typography
                  fontFamily="Nunito"
                  fontWeight={700}
                  fontSize="0.78rem"
                  letterSpacing="0.06em"
                  color={brand.secondary}
                  sx={{ textTransform: "uppercase" }}
                >
                  {product.category[0].toUpperCase()}{product.category.slice(1)}
                  {product.brand ? ` · ${product.brand}` : ""}
                </Typography>
                {user?.token && (
                  <IconButton
                    onClick={toggleWishlist}
                    size="small"
                    sx={{
                      color: isSaved ? "#e53935" : theme.palette.text.disabled,
                      border: `1px solid ${borderColor}`,
                      borderRadius: "10px",
                      p: "7px",
                      "&:hover": { borderColor: "#e53935", color: "#e53935", backgroundColor: "rgba(229,57,53,0.06)" },
                    }}
                  >
                    {isSaved
                      ? <FavoriteRounded sx={{ fontSize: "18px" }} />
                      : <FavoriteBorderRounded sx={{ fontSize: "18px" }} />}
                  </IconButton>
                )}
              </Box>

              {/* Name */}
              <Typography
                variant="h4"
                fontFamily="Playfair Display"
                fontWeight={900}
                lineHeight={1.2}
                mb="14px"
                sx={{ fontSize: { xs: "1.5rem", md: "1.8rem" } }}
              >
                {product.name[0].toUpperCase()}{product.name.slice(1)}
              </Typography>

              {/* Rating */}
              <Box sx={{ display: "flex", alignItems: "center", gap: "4px", mb: "20px" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarRounded
                    key={star}
                    sx={{
                      fontSize: "17px",
                      color: star <= Math.round(product.rating) ? "#F59E0B" : (isDark ? "#3F3F46" : "#E5E7EB"),
                    }}
                  />
                ))}
                <Typography fontFamily="Nunito" fontSize="0.85rem" color="text.secondary" ml="4px">
                  {product.rating.toFixed(1)} out of 5
                </Typography>
              </Box>

              <Divider sx={{ borderColor, mb: "20px" }} />

              {/* Price */}
              <Box sx={{ mb: "20px" }}>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
                  <Typography fontFamily="Playfair Display" fontWeight={900} fontSize="2rem" color="primary" lineHeight={1}>
                    {fmt(discountedPrice)}
                  </Typography>
                  {product.discount > 0 && (
                    <Typography fontFamily="Nunito" fontSize="1rem" color="text.disabled" sx={{ textDecoration: "line-through" }}>
                      {fmt(product.price)}
                    </Typography>
                  )}
                </Box>
                {product.discount > 0 && (
                  <Typography fontFamily="Nunito" fontSize="0.82rem" color={brand.secondary} fontWeight={700} mt="4px">
                    You save {fmt(product.price - discountedPrice)}
                  </Typography>
                )}
              </Box>

              {/* Description */}
              <Typography fontFamily="Nunito" fontSize="0.92rem" color="text.secondary" lineHeight={1.75} mb="20px">
                {product.description}
              </Typography>

              <Divider sx={{ borderColor, mb: "20px" }} />

              {/* Variant selector */}
              {hasVariants && (
                <Box mb="20px">
                  <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.85rem" mb="10px">
                    Select Variant
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {product.variants!.map((v) => (
                      <Box
                        key={v._id}
                        onClick={() => { if (v.stock > 0) { setSelectedVariant(v); setQty(1); } }}
                        sx={{
                          px: "14px",
                          py: "7px",
                          border: `2px solid ${selectedVariant?._id === v._id ? brand.primary : borderColor}`,
                          borderRadius: "10px",
                          cursor: v.stock === 0 ? "not-allowed" : "pointer",
                          opacity: v.stock === 0 ? 0.4 : 1,
                          backgroundColor: selectedVariant?._id === v._id
                            ? `${brand.primary}12`
                            : "transparent",
                          transition: "all 0.15s",
                          "&:hover": v.stock > 0 ? { borderColor: brand.primary } : {},
                        }}
                      >
                        <Typography fontFamily="Nunito" fontSize="0.85rem" fontWeight={600}
                          color={selectedVariant?._id === v._id ? brand.primary : "text.primary"}>
                          {[v.size, v.color].filter(Boolean).join(" / ")}
                        </Typography>
                        {v.stock === 0 && (
                          <Typography fontFamily="Nunito" fontSize="0.7rem" color="error">Out of stock</Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Stock status */}
              <Box mb="20px">
                {availableStock === 0 ? (
                  <Chip
                    label="Out of Stock"
                    size="small"
                    sx={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#EF4444", fontFamily: "Nunito", fontWeight: 700 }}
                  />
                ) : availableStock <= 5 ? (
                  <Chip
                    label={`Only ${availableStock} left!`}
                    size="small"
                    sx={{ backgroundColor: `${brand.secondary}18`, color: brand.secondary, fontFamily: "Nunito", fontWeight: 700 }}
                  />
                ) : (
                  <Chip
                    label="In Stock"
                    size="small"
                    sx={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10B981", fontFamily: "Nunito", fontWeight: 700 }}
                  />
                )}
              </Box>

              {/* Quantity + add to cart */}
              {availableStock > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  {/* Qty stepper */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      border: `1.5px solid ${borderColor}`,
                      borderRadius: "100px",
                      overflow: "hidden",
                      backgroundColor: cardBg,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      disabled={inCart}
                      sx={{ px: "12px", py: "8px", borderRadius: 0, color: theme.palette.text.secondary }}
                    >
                      <Typography fontWeight={700} fontSize="1rem">−</Typography>
                    </IconButton>
                    <Typography
                      px="16px"
                      fontFamily="Nunito"
                      fontWeight={700}
                      fontSize="0.95rem"
                    >
                      {qty}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => setQty(Math.min(availableStock, qty + 1))}
                      disabled={inCart}
                      sx={{ px: "12px", py: "8px", borderRadius: 0, color: theme.palette.text.secondary }}
                    >
                      <Typography fontWeight={700} fontSize="1rem">+</Typography>
                    </IconButton>
                  </Box>

                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleAddToCart}
                    disabled={hasVariants && !selectedVariant}
                    startIcon={inCart ? <RemoveShoppingCartRounded /> : <AddShoppingCartRounded />}
                    sx={{
                      borderRadius: "100px",
                      px: "28px",
                      py: "12px",
                      fontFamily: "Nunito",
                      fontWeight: 700,
                      fontSize: "0.92rem",
                      flex: 1,
                      background: inCart
                        ? `linear-gradient(135deg, #EF4444, #DC2626)`
                        : `linear-gradient(135deg, ${brand.primary}, #0038CC)`,
                      boxShadow: `0 6px 20px ${inCart ? "#EF444440" : brand.primary + "40"}`,
                    }}
                  >
                    {inCart ? "Remove from Cart" : "Add to Cart"}
                  </Button>
                </Box>
              )}

              {inCart && (
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/checkout")}
                  startIcon={<ShoppingCartCheckoutOutlined />}
                  sx={{
                    mt: "12px",
                    borderRadius: "100px",
                    px: "28px",
                    py: "12px",
                    fontFamily: "Nunito",
                    fontWeight: 700,
                    fontSize: "0.92rem",
                    borderColor: brand.primary,
                    color: brand.primary,
                    "&:hover": { backgroundColor: `${brand.primary}08` },
                  }}
                >
                  Go to Checkout
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
