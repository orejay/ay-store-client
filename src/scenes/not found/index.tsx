import React from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { ArrowBackRounded, StorefrontRounded } from "@mui/icons-material";
import { Link } from "react-router-dom";
import Header from "components/Header";
import Footer from "components/Footer";
import { brand } from "../../theme";

const NotFound = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Header />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: "24px",
          pt: "80px",
          pb: "60px",
        }}
      >
        {/* Large 404 */}
        <Typography
          fontFamily="Playfair Display"
          fontWeight={900}
          fontSize={{ xs: "6rem", md: "10rem" }}
          lineHeight={1}
          sx={{
            background: `linear-gradient(135deg, ${brand.primary}, ${brand.secondary})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            mb: "8px",
            userSelect: "none",
          }}
        >
          404
        </Typography>

        <Typography
          fontFamily="Playfair Display"
          fontWeight={700}
          fontSize={{ xs: "1.4rem", md: "1.9rem" }}
          mb="12px"
        >
          Page not found
        </Typography>

        <Typography
          fontFamily="Nunito"
          fontSize="0.95rem"
          color="text.secondary"
          sx={{ maxWidth: "360px", lineHeight: 1.7, mb: "36px" }}
        >
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back on track.
        </Typography>

        <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <Link to="/">
            <Button
              variant="contained"
              startIcon={<ArrowBackRounded />}
              sx={{
                fontFamily: "Nunito",
                fontWeight: 700,
                px: "24px",
                py: "10px",
                borderRadius: "100px",
              }}
            >
              Back to Home
            </Button>
          </Link>
          <Link to="/shop">
            <Button
              variant="outlined"
              startIcon={<StorefrontRounded />}
              sx={{
                fontFamily: "Nunito",
                fontWeight: 700,
                px: "24px",
                py: "10px",
                borderRadius: "100px",
                borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)",
                color: "text.secondary",
                "&:hover": {
                  borderColor: brand.primary,
                  color: brand.primary,
                  backgroundColor: `${brand.primary}08`,
                },
              }}
            >
              Browse Shop
            </Button>
          </Link>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default NotFound;
