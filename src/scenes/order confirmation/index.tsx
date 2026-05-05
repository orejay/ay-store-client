import React, { useEffect } from "react";
import {
  Box, Button, Divider, Typography, useTheme, useMediaQuery,
} from "@mui/material";
import {
  CheckCircleRounded, LocalShippingOutlined,
  ReceiptLongOutlined, ShoppingBagOutlined,
} from "@mui/icons-material";
import Footer from "components/Footer";
import Header from "components/Header";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "store";
import { brand } from "../../theme";

const OrderConfirmation = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();
  const lastOrderRef = useSelector((state: RootState) => state.global.lastOrderRef);
  const lastOrderTotal = useSelector((state: RootState) => state.global.lastOrderTotal);
  const lastOrderItems = useSelector((state: RootState) => state.global.lastOrderItems);

  const borderColor = isDark ? "#27272E" : "#EBEBEB";
  const panelBg = isDark ? "#18181C" : "#fff";

  useEffect(() => {
    if (!lastOrderRef) navigate("/");
  }, [lastOrderRef]);

  const fmt = (n: number) => n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: theme.palette.background.default }}>
      <Header />
      <Box
        sx={{
          flex: 1,
          pt: { xs: "90px", md: "100px" },
          pb: "80px",
          px: { xs: "16px", md: "24px" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "560px" }}>

          {/* Success header */}
          <Box sx={{ textAlign: "center", mb: "36px" }}>
            <Box sx={{
              width: "88px", height: "88px", borderRadius: "50%",
              background: `linear-gradient(135deg, #10B981, #059669)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              mx: "auto", mb: "20px",
              boxShadow: "0 16px 48px rgba(0,201,141,0.35)",
              animation: "pop 0.5s ease",
              "@keyframes pop": { "0%": { transform: "scale(0.5)", opacity: 0 }, "100%": { transform: "scale(1)", opacity: 1 } },
            }}>
              <CheckCircleRounded sx={{ fontSize: "48px", color: "#fff" }} />
            </Box>

            <Typography variant="h4" fontFamily="Playfair Display" fontWeight={900} mb="10px">
              Order Confirmed!
            </Typography>
            <Typography fontFamily="Nunito" color="text.secondary" fontSize="0.95rem" lineHeight={1.7} sx={{ maxWidth: "380px", mx: "auto" }}>
              Thank you for your purchase. Your order has been received and is being processed. You'll receive updates as it progresses.
            </Typography>
          </Box>

          {/* Order card */}
          <Box sx={{
            borderRadius: "18px",
            border: `1px solid ${borderColor}`,
            backgroundColor: panelBg,
            overflow: "hidden",
            boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(0,0,0,0.07)",
            mb: "20px",
          }}>
            {/* Card header */}
            <Box sx={{
              px: "20px", py: "16px",
              borderBottom: `1px solid ${borderColor}`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
              backgroundColor: isDark ? "#09090D" : "#FFFFFF",
            }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ReceiptLongOutlined sx={{ fontSize: "16px", color: brand.primary }} />
                <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.85rem">
                  Order Reference
                </Typography>
              </Box>
              <Typography fontFamily="Nunito" fontWeight={800} fontSize="0.85rem" color="primary">
                #{lastOrderRef?.slice(-10).toUpperCase()}
              </Typography>
            </Box>

            {/* Items list */}
            <Box sx={{ p: "8px 0" }}>
              {lastOrderItems.map((item, i) => (
                <Box
                  key={item._id}
                  sx={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    px: "20px", py: "12px",
                    borderBottom: i < lastOrderItems.length - 1 ? `1px solid ${borderColor}` : "none",
                  }}
                >
                  <Box>
                    <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.9rem">
                      {item.name[0].toUpperCase()}{item.name.slice(1)}
                    </Typography>
                    <Typography fontFamily="Nunito" color="text.secondary" fontSize="0.78rem">
                      Qty: {item.quantity}
                    </Typography>
                  </Box>
                  <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.9rem" color="primary">
                    ${fmt(item.price * item.quantity * ((100 - item.discount) / 100))}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Total */}
            <Box sx={{
              px: "20px", py: "16px",
              borderTop: `1px solid ${borderColor}`,
              backgroundColor: isDark ? "#09090D" : "#FFFFFF",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.95rem">
                Total Paid
              </Typography>
              <Typography fontFamily="Playfair Display" fontWeight={900} fontSize="1.35rem" color="primary">
                ${fmt(lastOrderTotal)}
              </Typography>
            </Box>
          </Box>

          {/* Track order hint */}
          <Box sx={{
            borderRadius: "14px",
            border: `1px solid ${isDark ? "#27272E" : "#E0F2FE"}`,
            backgroundColor: isDark ? "#0C1218" : "#F0F9FF",
            p: "16px 20px",
            display: "flex", alignItems: "center", gap: "14px",
            mb: "28px",
          }}>
            <LocalShippingOutlined sx={{ fontSize: "22px", color: brand.secondary, flexShrink: 0 }} />
            <Typography fontFamily="Nunito" fontSize="0.87rem" color="text.secondary" lineHeight={1.6}>
              Track your order status in{" "}
              <Box
                component="span"
                onClick={() => navigate("/customer/orders")}
                sx={{ color: brand.secondary, fontWeight: 700, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
              >
                My Orders
              </Box>
              . We'll update you at every stage.
            </Typography>
          </Box>

          {/* CTA buttons */}
          <Box sx={{ display: "flex", gap: "12px", flexDirection: isMobile ? "column" : "row" }}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<ShoppingBagOutlined />}
              onClick={() => navigate("/shop")}
              sx={{ py: "14px", flex: 1 }}
            >
              Continue Shopping
            </Button>
            <Button
              variant="outlined"
              fullWidth
              size="large"
              startIcon={<ReceiptLongOutlined />}
              onClick={() => navigate("/customer/orders")}
              sx={{ py: "14px", flex: 1 }}
            >
              View My Orders
            </Button>
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default OrderConfirmation;
