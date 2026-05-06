import React from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link } from "react-router-dom";
import { ArrowForwardRounded, ShoppingBagOutlined } from "@mui/icons-material";
import heroBg from "../assets/hero.webp";
import { brand } from "../theme";

const Hero = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        backgroundColor: isDark ? "#09090D" : "#FFFFFF",
      }}
    >
      {/* Background image (desktop only) */}
      {!isMobile && (
        <Box
          component="img"
          src={heroBg}
          alt=""
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            height: "100%",
            width: "56%",
            objectFit: "cover",
            objectPosition: "center top",
            opacity: isDark ? 0.72 : 1,
          }}
        />
      )}

      {/* Gradient overlay blending image into background */}
      {!isMobile && (
        <Box
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            height: "100%",
            width: "68%",
            background: isDark
              ? `linear-gradient(to right, #09090D 28%, rgba(9,9,13,0.75) 50%, transparent 80%)`
              : `linear-gradient(to right, #FFFFFF 28%, rgba(255,255,255,0.75) 50%, transparent 80%)`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Mobile tinted bg */}
      {isMobile && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: isDark
              ? `linear-gradient(160deg, #0C0C0E 60%, rgba(232,146,10,0.08) 100%)`
              : `linear-gradient(160deg, #FFFFFF 60%, rgba(232,146,10,0.06) 100%)`,
          }}
        />
      )}

      {/* Decorative circle */}
      <Box
        sx={{
          position: "absolute",
          top: "-80px",
          right: isMobile ? "-80px" : "38%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${brand.primary}18 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          px: { xs: "24px", sm: "48px", md: "80px", lg: "96px" },
          maxWidth: isMobile ? "100%" : "55%",
          pt: "80px",
        }}
      >
        {/* Eyebrow label */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            px: "14px",
            py: "6px",
            borderRadius: "100px",
            backgroundColor: `${brand.primary}15`,
            border: `1px solid ${brand.primary}30`,
            mb: "28px",
          }}
        >
          <Box
            sx={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: brand.primary,
            }}
          />
          <Typography
            fontFamily="Nunito"
            fontWeight={700}
            fontSize="0.78rem"
            sx={{
              color: brand.primary,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            New Collection
          </Typography>
        </Box>

        {/* Headline */}
        <Typography
          sx={{
            fontFamily: "Playfair Display",
            fontWeight: 900,
            fontSize: { xs: "2.4rem", sm: "3rem", md: "3.6rem", lg: "4.2rem" },
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            mb: "24px",
            color: theme.palette.text.primary,
          }}
        >
          Take Pleasure{" "}
          <Box component="span" sx={{ color: brand.primary }}>
            in the way
          </Box>{" "}
          you look
        </Typography>

        {/* Subtext */}
        <Typography
          fontFamily="Nunito"
          fontSize={{ xs: "0.95rem", md: "1.05rem" }}
          color="text.secondary"
          lineHeight={1.7}
          mb="40px"
          maxWidth="480px"
        >
          Discover premium clothing, accessories, and lifestyle pieces curated
          for every occasion. Trusted by thousands of happy customers.
        </Typography>

        {/* CTAs */}
        <Box sx={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          <Link to="/shop">
            <Button
              variant="contained"
              endIcon={<ShoppingBagOutlined />}
              sx={{
                borderRadius: "100px",
                px: "28px",
                py: "13px",
                fontSize: "0.95rem",
                background: `linear-gradient(135deg, ${brand.primary} 0%, #0038CC 100%)`,
                boxShadow: `0 8px 24px ${brand.primary}40`,
                "&:hover": {
                  opacity: 0.92,
                  transform: "translateY(-2px)",
                  boxShadow: `0 12px 32px ${brand.primary}50`,
                },
                transition: "all 0.25s ease",
              }}
            >
              Shop Now
            </Button>
          </Link>
          <Link to="/about">
            <Button
              variant="outlined"
              endIcon={<ArrowForwardRounded />}
              sx={{
                borderRadius: "100px",
                px: "28px",
                py: "13px",
                fontSize: "0.95rem",
                borderColor: isDark
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(0,0,0,0.15)",
                color: theme.palette.text.primary,
                "&:hover": {
                  borderColor: brand.primary,
                  color: brand.primary,
                  backgroundColor: `${brand.primary}08`,
                },
                transition: "all 0.2s ease",
              }}
            >
              Our Story
            </Button>
          </Link>
        </Box>

        {/* Stats strip */}
        <Box
          sx={{
            display: "flex",
            gap: { xs: "28px", md: "40px" },
            mt: "52px",
            flexWrap: "wrap",
          }}
        >
          {[
            { value: "10k+", label: "Happy Clients" },
            { value: "500+", label: "Products" },
            { value: "4.9★", label: "Avg. Rating" },
          ].map(({ value, label }) => (
            <Box key={label}>
              <Typography
                fontFamily="Playfair Display"
                fontWeight={900}
                fontSize="1.5rem"
                color={brand.primary}
              >
                {value}
              </Typography>
              <Typography
                fontFamily="Nunito"
                fontSize="0.82rem"
                color="text.secondary"
              >
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Hero;
