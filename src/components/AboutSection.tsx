import React from "react";
import { Box, Button, Typography, useTheme, useMediaQuery } from "@mui/material";
import { ArrowForwardRounded, CheckCircleOutlineRounded } from "@mui/icons-material";
import { Link } from "react-router-dom";
import about from "../assets/about.PNG";
import { brand } from "../theme";

const perks = [
  "100% natural ingredients",
  "Cruelty-free & certified",
  "Expert beauty guidance",
  "Fast & safe delivery",
];

const AboutSection = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <Box
      id="about"
      sx={{
        px: { xs: "20px", sm: "40px", md: "64px" },
        py: { xs: "60px", md: "100px" },
        backgroundColor: isDark ? "#16161A" : "#FFFFFF",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          gap: { xs: "40px", md: "80px" },
          maxWidth: "1100px",
          mx: "auto",
        }}
      >
        {/* Image side */}
        <Box
          sx={{
            flexShrink: 0,
            position: "relative",
            width: { xs: "260px", md: "380px" },
            height: { xs: "260px", md: "380px" },
            mx: isMobile ? "auto" : "0",
          }}
        >
          {/* Decorative ring */}
          <Box
            sx={{
              position: "absolute",
              inset: "-12px",
              borderRadius: "30% 70% 50% 30% / 10% 30% 50% 70%",
              border: `2px solid ${brand.primary}30`,
            }}
          />
          <Box
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: "30% 70% 50% 30% / 10% 30% 50% 70%",
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src={about}
              alt="About Beauty"
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>

          {/* Floating badge */}
          <Box
            sx={{
              position: "absolute",
              bottom: "-16px",
              right: "-16px",
              backgroundColor: brand.primary,
              color: "#fff",
              borderRadius: "14px",
              px: "18px",
              py: "12px",
              boxShadow: `0 8px 24px ${brand.primary}50`,
            }}
          >
            <Typography fontFamily="Playfair Display" fontWeight={900} fontSize="1.4rem" lineHeight={1}>
              10k+
            </Typography>
            <Typography fontFamily="Nunito" fontWeight={600} fontSize="0.75rem">
              Happy Clients
            </Typography>
          </Box>
        </Box>

        {/* Text side */}
        <Box sx={{ flex: 1 }}>
          <Typography
            fontFamily="Nunito"
            fontWeight={700}
            fontSize="0.78rem"
            letterSpacing="0.08em"
            color={brand.secondary}
            mb="12px"
            sx={{ textTransform: "uppercase" }}
          >
            About Us
          </Typography>
          <Typography
            fontFamily="Playfair Display"
            fontWeight={900}
            fontSize={{ xs: "1.8rem", md: "2.4rem" }}
            lineHeight={1.15}
            color="text.primary"
            mb="20px"
          >
            Where Beauty Meets{" "}
            <Box component="span" sx={{ color: brand.primary }}>
              Confidence
            </Box>
          </Typography>
          <Typography
            fontFamily="Nunito"
            fontSize="0.95rem"
            color="text.secondary"
            lineHeight={1.75}
            mb="28px"
          >
            Welcome to our beauty shop, where we believe in the power of transformation
            and self-expression. We offer a wide range of premium beauty products designed
            to enhance your natural beauty and boost your confidence. Our dedicated team
            is here to help you look and feel your absolute best — every single day.
          </Typography>

          {/* Perks */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              mb: "32px",
            }}
          >
            {perks.map((perk) => (
              <Box key={perk} sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircleOutlineRounded
                  sx={{ fontSize: "17px", color: brand.primary, flexShrink: 0 }}
                />
                <Typography fontFamily="Nunito" fontWeight={600} fontSize="0.88rem" color="text.secondary">
                  {perk}
                </Typography>
              </Box>
            ))}
          </Box>

          <Link to="/about">
            <Button
              variant="contained"
              endIcon={<ArrowForwardRounded />}
              sx={{
                borderRadius: "100px",
                px: "28px",
                py: "12px",
                background: `linear-gradient(135deg, ${brand.primary} 0%, #D4800A 100%)`,
                boxShadow: `0 8px 24px ${brand.primary}35`,
                fontFamily: "Nunito",
                fontWeight: 700,
                "&:hover": { opacity: 0.9, transform: "translateY(-1px)" },
                transition: "all 0.2s ease",
              }}
            >
              Discover Our Story
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default AboutSection;
