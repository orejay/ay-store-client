import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  InputBase,
  Button,
  Divider,
  useTheme,
  Tooltip,
} from "@mui/material";
import {
  Facebook,
  Instagram,
  Twitter,
  YouTube,
  ArrowForwardRounded,
  CopyrightOutlined,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { brand } from "../theme";

const links = {
  Company: [
    { label: "Shop", path: "/shop" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ],
  Account: [
    { label: "My Account", path: "/customer/account" },
    { label: "My Orders", path: "/customer/orders" },
    { label: "Saved Items", path: "/customer/saved" },
  ],
};

const socials = [
  { icon: <Instagram sx={{ fontSize: "18px" }} />, label: "Instagram" },
  { icon: <Facebook sx={{ fontSize: "18px" }} />, label: "Facebook" },
  { icon: <Twitter sx={{ fontSize: "18px" }} />, label: "Twitter" },
  { icon: <YouTube sx={{ fontSize: "18px" }} />, label: "YouTube" },
];

const Footer = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [email, setEmail] = useState("");

  const borderColor = isDark ? "#27272E" : "#EBEBEB";
  const subtleText = theme.palette.text.secondary;

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: isDark ? "#0C0C0E" : "#FAFAFA",
        borderTop: `1px solid ${borderColor}`,
        pt: { xs: "48px", md: "72px" },
        pb: "32px",
        px: { xs: "20px", sm: "40px", md: "64px" },
      }}
    >
      {/* Top grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr 2fr" },
          gap: { xs: "40px", md: "48px" },
          mb: { xs: "48px", md: "64px" },
        }}
      >
        {/* Brand column */}
        <Box>
          <Link to="/">
            <Typography
              sx={{
                fontFamily: "Playfair Display",
                fontWeight: 900,
                fontSize: "1.6rem",
                color: brand.primary,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                mb: "16px",
                display: "block",
              }}
            >
              BEAUTY
            </Typography>
          </Link>
          <Typography
            fontFamily="Nunito"
            fontSize="0.9rem"
            color="text.secondary"
            lineHeight={1.7}
            mb="24px"
            maxWidth="280px"
          >
            Premium beauty products crafted for every skin type. Look and feel
            your best, every day.
          </Typography>
          {/* Social icons */}
          <Box sx={{ display: "flex", gap: "8px" }}>
            {socials.map(({ icon, label }) => (
              <Tooltip key={label} title={label} arrow>
                <IconButton
                  size="small"
                  sx={{
                    color: subtleText,
                    border: `1px solid ${borderColor}`,
                    borderRadius: "10px",
                    p: "8px",
                    transition: "all 0.2s",
                    "&:hover": {
                      color: brand.primary,
                      borderColor: brand.primary,
                      backgroundColor: `${brand.primary}0D`,
                    },
                  }}
                >
                  {icon}
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        </Box>

        {/* Link columns */}
        {Object.entries(links).map(([heading, items]) => (
          <Box key={heading}>
            <Typography
              fontFamily="Nunito"
              fontWeight={800}
              fontSize="0.82rem"
              letterSpacing="0.08em"
              color="text.primary"
              mb="18px"
              sx={{ textTransform: "uppercase" }}
            >
              {heading}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {items.map(({ label, path }) => (
                <Link key={path} to={path}>
                  <Typography
                    fontFamily="Nunito"
                    fontWeight={600}
                    fontSize="0.9rem"
                    color="text.secondary"
                    sx={{
                      transition: "color 0.18s",
                      "&:hover": { color: brand.primary },
                    }}
                  >
                    {label}
                  </Typography>
                </Link>
              ))}
            </Box>
          </Box>
        ))}

        {/* Newsletter column */}
        <Box>
          <Typography
            fontFamily="Nunito"
            fontWeight={800}
            fontSize="0.82rem"
            letterSpacing="0.08em"
            color="text.primary"
            mb="18px"
            sx={{ textTransform: "uppercase" }}
          >
            Stay in the loop
          </Typography>
          <Typography
            fontFamily="Nunito"
            fontSize="0.88rem"
            color="text.secondary"
            lineHeight={1.65}
            mb="20px"
          >
            Get exclusive offers, beauty tips and new arrivals delivered to your inbox.
          </Typography>
          <Box
            sx={{
              display: "flex",
              border: `1.5px solid ${borderColor}`,
              borderRadius: "100px",
              overflow: "hidden",
              backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F3F4F6",
              transition: "border-color 0.2s",
              "&:focus-within": { borderColor: brand.primary },
            }}
          >
            <InputBase
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                flex: 1,
                px: "16px",
                py: "10px",
                fontFamily: "Nunito",
                fontSize: "0.86rem",
              }}
            />
            <IconButton
              onClick={() => setEmail("")}
              sx={{
                m: "4px",
                backgroundColor: brand.primary,
                color: "#fff",
                borderRadius: "100px",
                p: "8px",
                "&:hover": { backgroundColor: "#D4800A" },
                transition: "background 0.2s",
              }}
            >
              <ArrowForwardRounded sx={{ fontSize: "16px" }} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: borderColor, mb: "24px" }} />

      {/* Bottom bar */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: "12px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <CopyrightOutlined sx={{ fontSize: "13px", color: subtleText }} />
          <Typography fontFamily="Nunito" fontSize="0.82rem" color="text.secondary">
            {new Date().getFullYear()} Beauty. All rights reserved.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: "20px" }}>
          {["Privacy Policy", "Terms & Conditions"].map((text) => (
            <Typography
              key={text}
              fontFamily="Nunito"
              fontSize="0.82rem"
              color="text.secondary"
              sx={{
                cursor: "pointer",
                transition: "color 0.18s",
                "&:hover": { color: brand.primary },
              }}
            >
              {text}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
