import {
  AddShoppingCartRounded,
  RemoveShoppingCartRounded,
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
} from "@mui/material";
import Footer from "components/Footer";
import Header from "components/Header";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "store";
import { setCart } from "state";

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
  const cart = useSelector((state: RootState) => state.global.cart);
  const inCart = cart.some((item) => item._id === product?._id);

  const formatPrice = (n: number) =>
    n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${baseUrl}/get/product/${id}`);
        if (!res.ok) {
          navigate("/shop");
          return;
        }
        const data = await res.json();
        setProduct(data);
      } catch {
        navigate("/shop");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const discountedPrice = product
    ? product.price * ((100 - product.discount) / 100)
    : 0;

  const handleAddToCart = () => {
    if (!product) return;
    if (inCart) {
      dispatch(setCart(cart.filter((item) => item._id !== product._id)));
    } else {
      dispatch(setCart([...cart, { ...product, quantity: qty }]));
    }
  };

  return (
    <Box>
      <Header />
      <Box
        sx={{
          pt: "120px",
          pb: "80px",
          minHeight: "100vh",
          width: isSmallScreen ? "95%" : isMediumScreen ? "90%" : "80%",
          mx: "auto",
        }}
      >
        {loading ? (
          <Box
            display="flex"
            gap="40px"
            flexDirection={isMediumScreen ? "column" : "row"}
          >
            <Skeleton
              variant="rectangular"
              width={isMediumScreen ? "100%" : "45%"}
              height={400}
              sx={{ borderRadius: "10px" }}
            />
            <Box flex={1} display="flex" flexDirection="column" gap="16px">
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="text" width="40%" height={30} />
              <Skeleton variant="text" width="80%" height={20} />
              <Skeleton variant="text" width="80%" height={20} />
              <Skeleton variant="text" width="50%" height={20} />
            </Box>
          </Box>
        ) : product ? (
          <Box
            display="flex"
            gap={isSmallScreen ? "24px" : "48px"}
            flexDirection={isMediumScreen ? "column" : "row"}
          >
            <Box
              sx={{
                width: isMediumScreen ? "100%" : "45%",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "2px 2px 12px #E0E0E0",
                flexShrink: 0,
              }}
            >
              <Box
                component="img"
                src={`${imageUrl}/uploads/${product.imageName}`}
                alt={product.name}
                sx={{
                  width: "100%",
                  height: isSmallScreen ? "260px" : "420px",
                  objectFit: "cover",
                }}
              />
            </Box>

            <Box display="flex" flexDirection="column" flex={1} gap="12px">
              {product.discount > 0 && (
                <Chip
                  label={`-${product.discount}% OFF`}
                  sx={{
                    backgroundColor: "#Ed981b",
                    color: "white",
                    fontFamily: "Nunito",
                    fontWeight: "bold",
                    width: "fit-content",
                  }}
                />
              )}
              <Typography variant="h4" fontFamily="Playfair Display" fontWeight="bold">
                {product.name[0].toUpperCase()}{product.name.slice(1)}
              </Typography>
              <Typography
                fontFamily="Nunito"
                color="secondary"
                fontWeight="bold"
                fontSize="15px"
              >
                {product.category[0].toUpperCase()}{product.category.slice(1)}
              </Typography>

              <Divider />

              <Box display="flex" alignItems="center" gap="12px">
                <Typography
                  fontFamily="Nunito"
                  fontWeight="bold"
                  fontSize="24px"
                  color="primary"
                >
                  ${formatPrice(discountedPrice)}
                </Typography>
                {product.discount > 0 && (
                  <Typography
                    fontFamily="Nunito"
                    fontSize="16px"
                    sx={{ textDecoration: "line-through", opacity: 0.6 }}
                  >
                    ${formatPrice(product.price)}
                  </Typography>
                )}
              </Box>

              <Typography fontFamily="Nunito" fontSize="14px" color="text.secondary">
                {product.description}
              </Typography>

              <Typography fontFamily="Nunito" fontSize="13px">
                <strong>In stock:</strong> {product.supply} units
              </Typography>

              <Box display="flex" alignItems="center" gap="12px" mt="8px">
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{
                    border: "1px solid #E0E0E0",
                    borderRadius: "20px",
                    overflow: "hidden",
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    disabled={inCart}
                  >
                    <Typography fontWeight="bold" px="4px">−</Typography>
                  </IconButton>
                  <Typography px="12px" fontFamily="Nunito" fontWeight="bold">
                    {qty}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setQty(Math.min(product.supply, qty + 1))}
                    disabled={inCart}
                  >
                    <Typography fontWeight="bold" px="4px">+</Typography>
                  </IconButton>
                </Box>

                <Button
                  variant="contained"
                  onClick={handleAddToCart}
                  startIcon={
                    inCart ? <RemoveShoppingCartRounded /> : <AddShoppingCartRounded />
                  }
                  sx={{ borderRadius: "20px", textTransform: "none", px: "24px" }}
                >
                  <Typography color="white" fontFamily="Nunito" fontWeight="bold">
                    {inCart ? "Remove from Cart" : "Add to Cart"}
                  </Typography>
                </Button>
              </Box>

              {inCart && (
                <Button
                  variant="outlined"
                  onClick={() => navigate("/checkout")}
                  sx={{ borderRadius: "20px", textTransform: "none", width: "fit-content" }}
                >
                  <Typography fontFamily="Nunito" fontWeight="bold">
                    Go to Checkout
                  </Typography>
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
