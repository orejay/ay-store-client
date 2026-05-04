import React, { useEffect, useState } from "react";
import {
  Box, Button, CircularProgress, Typography, useTheme,
} from "@mui/material";
import { ConfirmationNumberOutlined, ShoppingBagOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { brand } from "../../theme";

const Vouchers = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [loading, setLoading] = useState(false);
  const borderColor = isDark ? "#27272E" : "#EBEBEB";

  useEffect(() => { setLoading(false); }, []);

  return (
    <Box sx={{ p: { xs: "16px", md: "28px" } }}>
      {/* Page header */}
      <Box sx={{ pb: "20px", borderBottom: `1px solid ${borderColor}`, mb: "24px" }}>
        <Typography fontFamily="Playfair Display" fontWeight={900} fontSize="1.3rem">
          Vouchers
        </Typography>
        <Typography fontFamily="Nunito" fontSize="0.82rem" color="text.secondary" mt="2px">
          Apply discount codes at checkout
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" pt="60px">
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Box>
          {/* Info card */}
          <Box
            sx={{
              borderRadius: "16px",
              border: `1px dashed ${isDark ? "#3F3F46" : "#D1D5DB"}`,
              backgroundColor: isDark ? "#0C0C0E" : "#FAFAFA",
              p: { xs: "28px 20px", md: "40px 36px" },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "16px",
              mb: "20px",
            }}
          >
            <Box sx={{
              width: "80px", height: "80px", borderRadius: "50%",
              background: `linear-gradient(135deg, ${brand.primary}20, ${brand.secondary}20)`,
              border: `2px dashed ${brand.primary}50`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ConfirmationNumberOutlined sx={{ fontSize: "36px", color: brand.primary }} />
            </Box>

            <Box sx={{ maxWidth: "380px" }}>
              <Typography fontFamily="Playfair Display" fontWeight={700} fontSize="1.2rem" mb="10px">
                Got a Voucher Code?
              </Typography>
              <Typography fontFamily="Nunito" color="text.secondary" fontSize="0.9rem" lineHeight={1.75}>
                Enter your coupon code at checkout to unlock your discount. Voucher codes are distributed through our promotions, loyalty rewards, and special events.
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "280px" }}>
              <Link to="/shop" style={{ width: "100%" }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<ShoppingBagOutlined />}
                  sx={{ py: "12px" }}
                >
                  Shop &amp; Apply at Checkout
                </Button>
              </Link>
            </Box>
          </Box>

          {/* How it works */}
          <Box sx={{
            borderRadius: "16px",
            border: `1px solid ${borderColor}`,
            backgroundColor: isDark ? "#0C0C0E" : "#fff",
            p: "24px",
          }}>
            <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.8rem"
              color="text.secondary" letterSpacing="0.06em" textTransform="uppercase" mb="16px">
              How Vouchers Work
            </Typography>
            {[
              { step: "1", text: "Add items to your cart and proceed to checkout." },
              { step: "2", text: "In the order summary panel, enter your coupon code." },
              { step: "3", text: "Your discount is applied instantly to the total." },
            ].map((item) => (
              <Box key={item.step} sx={{ display: "flex", gap: "14px", mb: "14px", alignItems: "flex-start" }}>
                <Box sx={{
                  width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                  backgroundColor: `${brand.primary}18`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Typography fontFamily="Nunito" fontWeight={800} fontSize="0.8rem" color={brand.primary}>
                    {item.step}
                  </Typography>
                </Box>
                <Typography fontFamily="Nunito" fontSize="0.88rem" color="text.secondary" pt="4px" lineHeight={1.65}>
                  {item.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Vouchers;
