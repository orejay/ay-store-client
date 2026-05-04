import { CheckCircleOutlineRounded } from "@mui/icons-material";
import { Box, Button, Divider, Typography, useMediaQuery } from "@mui/material";
import Footer from "components/Footer";
import Header from "components/Header";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "store";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width:450px)");
  const isMediumScreen = useMediaQuery("(max-width:768px)");
  const lastOrderRef = useSelector((state: RootState) => state.global.lastOrderRef);
  const lastOrderTotal = useSelector((state: RootState) => state.global.lastOrderTotal);
  const lastOrderItems = useSelector((state: RootState) => state.global.lastOrderItems);

  useEffect(() => {
    if (!lastOrderRef) navigate("/");
  }, [lastOrderRef]);

  const formatPrice = (n: number) =>
    n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <Box>
      <Header />
      <Box
        sx={{
          pt: "120px",
          pb: "80px",
          minHeight: "100vh",
          width: isSmallScreen ? "95%" : isMediumScreen ? "85%" : "55%",
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
        }}
      >
        <CheckCircleOutlineRounded sx={{ fontSize: "80px", color: "#00C98D" }} />

        <Typography
          variant="h4"
          fontFamily="Playfair Display"
          fontWeight="bold"
          textAlign="center"
        >
          Order Placed!
        </Typography>

        <Typography
          fontFamily="Nunito"
          fontSize="15px"
          color="text.secondary"
          textAlign="center"
        >
          Thank you for your purchase. Your order has been received and is being
          processed.
        </Typography>

        <Box
          sx={{
            width: "100%",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "2px 2px 10px #E0E0E0",
            p: "24px",
          }}
        >
          <Box display="flex" justifyContent="space-between" mb="12px">
            <Typography fontFamily="Nunito" fontWeight="bold">
              Reference
            </Typography>
            <Typography fontFamily="Nunito" color="text.secondary" fontSize="14px">
              {lastOrderRef}
            </Typography>
          </Box>

          <Divider sx={{ mb: "16px" }} />

          {lastOrderItems.map((item) => (
            <Box
              key={item._id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              py="8px"
              sx={{ borderBottom: "1px solid #F0F0F0" }}
            >
              <Box>
                <Typography fontFamily="Nunito" fontWeight="bold" fontSize="14px">
                  {item.name[0].toUpperCase()}{item.name.slice(1)}
                </Typography>
                <Typography fontFamily="Nunito" color="text.secondary" fontSize="12px">
                  Qty: {item.quantity}
                </Typography>
              </Box>
              <Typography fontFamily="Nunito" fontWeight="bold" color="primary">
                ${formatPrice(item.price * item.quantity * ((100 - item.discount) / 100))}
              </Typography>
            </Box>
          ))}

          <Box display="flex" justifyContent="space-between" mt="16px">
            <Typography fontFamily="Nunito" fontWeight="bold" fontSize="16px">
              Total Paid
            </Typography>
            <Typography
              fontFamily="Nunito"
              fontWeight="bold"
              fontSize="18px"
              color="primary"
            >
              ${formatPrice(lastOrderTotal)}
            </Typography>
          </Box>
        </Box>

        <Typography
          fontFamily="Nunito"
          fontSize="13px"
          color="text.secondary"
          textAlign="center"
        >
          You can track your order status in{" "}
          <span
            style={{ color: "#077488", cursor: "pointer", fontWeight: "bold" }}
            onClick={() => navigate("/customer/orders")}
          >
            My Orders
          </span>
          .
        </Typography>

        <Box display="flex" gap="16px" flexWrap="wrap" justifyContent="center">
          <Button
            variant="contained"
            sx={{ borderRadius: "20px", px: "28px", textTransform: "none" }}
            onClick={() => navigate("/shop")}
          >
            <Typography color="white" fontFamily="Nunito" fontWeight="bold">
              Continue Shopping
            </Typography>
          </Button>
          <Button
            variant="outlined"
            sx={{ borderRadius: "20px", px: "28px", textTransform: "none" }}
            onClick={() => navigate("/customer/orders")}
          >
            <Typography fontFamily="Nunito" fontWeight="bold">
              View My Orders
            </Typography>
          </Button>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default OrderConfirmation;
