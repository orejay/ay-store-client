import React from "react";
import { Box, Button, Divider, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import Footer from "components/Footer";
import Header from "components/Header";
import { Link } from "react-router-dom";
import {
  DiamondOutlined, FavoriteOutlined, LocalShippingOutlined,
  ShieldOutlined, StarOutlined, VerifiedOutlined,
} from "@mui/icons-material";
import { brand } from "../../theme";
import about from "../../assets/about.PNG";

const stats = [
  { value: "10K+", label: "Happy Customers" },
  { value: "500+", label: "Premium Products" },
  { value: "5+", label: "Years of Excellence" },
  { value: "100%", label: "Authentic Brands" },
];

const values = [
  {
    icon: <DiamondOutlined sx={{ fontSize: "28px" }} />,
    title: "Premium Quality",
    body: "Every product on our shelf is curated by experts who understand style and quality. We partner only with brands that meet our strict standards.",
  },
  {
    icon: <VerifiedOutlined sx={{ fontSize: "28px" }} />,
    title: "Authenticity Guaranteed",
    body: "We source directly from certified distributors and brand partners, ensuring you receive only genuine products — no fakes, ever.",
  },
  {
    icon: <FavoriteOutlined sx={{ fontSize: "28px" }} />,
    title: "Customer First",
    body: "Your satisfaction is our priority. From seamless browsing to fast delivery and responsive support, every touchpoint is designed for you.",
  },
  {
    icon: <LocalShippingOutlined sx={{ fontSize: "28px" }} />,
    title: "Fast Delivery",
    body: "We know you can't wait to try your new products. That's why we process and ship orders quickly, with real-time tracking at every step.",
  },
];

const team = [
  { initials: "AY", name: "Ayomide Johnson", role: "Founder & CEO" },
  { initials: "TF", name: "Tolu Fashola", role: "Head of Curation" },
  { initials: "NK", name: "Ngozi Kalu", role: "Customer Experience" },
];

const About = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery("(max-width:600px)");
  const isMedium = useMediaQuery("(max-width:900px)");

  const borderColor = isDark ? "#27272E" : "#EBEBEB";
  const panelBg = isDark ? "#18181C" : "#FFFFFF";

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default }}>
      <Header />

      {/* ── Hero ── */}
      <Box
        sx={{
          pt: { xs: "100px", md: "120px" },
          pb: { xs: "64px", md: "80px" },
          px: { xs: "24px", md: "10%" },
          background: isDark
            ? `linear-gradient(160deg, #1A1208 0%, #0C0C0E 60%)`
            : `linear-gradient(160deg, #FEF3E2 0%, #FFFFFF 60%)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative orb */}
        <Box sx={{
          position: "absolute", top: "-80px", right: "-80px",
          width: "380px", height: "380px", borderRadius: "50%",
          background: `radial-gradient(circle, ${brand.primary}20 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        <Box sx={{ maxWidth: "680px" }}>
          <Box sx={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            backgroundColor: `${brand.primary}15`,
            border: `1px solid ${brand.primary}30`,
            borderRadius: "100px", px: "14px", py: "6px", mb: "24px",
          }}>
            <StarOutlined sx={{ fontSize: "14px", color: brand.primary }} />
            <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.8rem" color={brand.primary}>
              Our Story
            </Typography>
          </Box>

          <Typography
            variant="h2"
            fontFamily="Playfair Display"
            fontWeight={900}
            lineHeight={1.2}
            mb="20px"
            sx={{ fontSize: { xs: "2rem", md: "2.8rem" } }}
          >
            Style Redefined.{" "}
            <Box component="span" sx={{ color: brand.primary }}>
              Confidence
            </Box>{" "}
            Delivered.
          </Typography>

          <Typography
            fontFamily="Nunito"
            fontSize={{ xs: "1rem", md: "1.05rem" }}
            color="text.secondary"
            lineHeight={1.8}
            mb="32px"
            sx={{ maxWidth: "540px" }}
          >
            Fashionero was born from a simple belief: everyone deserves access to premium fashion and lifestyle products without compromise. We're more than a store — we're your trusted partner in self-expression.
          </Typography>

          <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link to="/shop">
              <Button variant="contained" size="large" sx={{ px: "32px", py: "13px" }}>
                Shop the Collection
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outlined" size="large" sx={{ px: "32px", py: "13px" }}>
                Get in Touch
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>

      {/* ── Stats bar ── */}
      <Box
        sx={{
          backgroundColor: brand.primary,
          py: { xs: "28px", md: "36px" },
          px: { xs: "24px", md: "10%" },
        }}
      >
        <Grid container spacing={2} justifyContent="center">
          {stats.map((s, i) => (
            <Grid item xs={6} md={3} key={i} sx={{ textAlign: "center" }}>
              <Typography fontFamily="Playfair Display" fontWeight={900} fontSize={{ xs: "1.8rem", md: "2.4rem" }} color="#fff">
                {s.value}
              </Typography>
              <Typography fontFamily="Nunito" fontWeight={600} fontSize="0.9rem" sx={{ color: "rgba(255,255,255,0.8)" }}>
                {s.label}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ── Our Story section ── */}
      <Box sx={{ px: { xs: "24px", md: "10%" }, py: { xs: "64px", md: "88px" } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMedium ? "column-reverse" : "row",
            alignItems: "center",
            gap: { xs: "40px", md: "64px" },
          }}
        >
          {/* Text */}
          <Box sx={{ flex: 1 }}>
            <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.8rem"
              color={brand.primary} letterSpacing="0.1em" textTransform="uppercase" mb="10px">
              About Us
            </Typography>
            <Typography variant="h3" fontFamily="Playfair Display" fontWeight={700} mb="20px" lineHeight={1.25}>
              More Than a Fashion Store
            </Typography>
            <Typography fontFamily="Nunito" color="text.secondary" fontSize="1rem" lineHeight={1.85} mb="20px">
              Founded in Lagos, Nigeria, Fashionero began as a passion project to bring world-class fashion and lifestyle products directly to consumers across Africa. What started as a small curated catalogue has grown into a full-service fashion destination trusted by thousands.
            </Typography>
            <Typography fontFamily="Nunito" color="text.secondary" fontSize="1rem" lineHeight={1.85} mb="20px">
              We believe great style is not a luxury — it's a form of self-care and expression. That's why we go beyond simply selling products: we educate, inspire, and support our community on their style journeys.
            </Typography>
            <Typography fontFamily="Nunito" color="text.secondary" fontSize="1rem" lineHeight={1.85}>
              Every item in our store is handpicked, authenticity-verified, and backed by our satisfaction guarantee. When you shop with us, you shop with confidence.
            </Typography>
          </Box>

          {/* Image */}
          <Box sx={{ flex: isMedium ? "none" : "0 0 420px", width: isMedium ? "100%" : "420px" }}>
            <Box
              sx={{
                borderRadius: "24px",
                overflow: "hidden",
                border: `1px solid ${borderColor}`,
                boxShadow: isDark ? "0 12px 40px rgba(0,0,0,0.5)" : "0 12px 40px rgba(0,0,0,0.09)",
                aspectRatio: "4/3",
              }}
            >
              <Box
                component="img"
                alt="about-img"
                src={about}
                sx={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Our Values ── */}
      <Box
        sx={{
          backgroundColor: panelBg,
          borderTop: `1px solid ${borderColor}`,
          borderBottom: `1px solid ${borderColor}`,
          px: { xs: "24px", md: "10%" },
          py: { xs: "64px", md: "88px" },
        }}
      >
        <Box sx={{ textAlign: "center", mb: "52px" }}>
          <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.8rem"
            color={brand.primary} letterSpacing="0.1em" textTransform="uppercase" mb="10px">
            What We Stand For
          </Typography>
          <Typography variant="h3" fontFamily="Playfair Display" fontWeight={700} mb="14px">
            Our Core Values
          </Typography>
          <Typography fontFamily="Nunito" color="text.secondary" fontSize="1rem" sx={{ maxWidth: "520px", mx: "auto" }}>
            These principles guide every decision we make — from the products we stock to the service we deliver.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {values.map((v, i) => (
            <Grid item xs={12} sm={6} key={i}>
              <Box
                sx={{
                  p: "28px",
                  borderRadius: "16px",
                  border: `1px solid ${borderColor}`,
                  backgroundColor: isDark ? "#09090D" : "#fff",
                  height: "100%",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: isDark ? "0 12px 32px rgba(0,0,0,0.5)" : "0 12px 32px rgba(0,0,0,0.09)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: "52px", height: "52px", borderRadius: "14px",
                    backgroundColor: `${brand.primary}15`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: brand.primary, mb: "18px",
                  }}
                >
                  {v.icon}
                </Box>
                <Typography fontFamily="Playfair Display" fontWeight={700} fontSize="1.1rem" mb="10px">
                  {v.title}
                </Typography>
                <Typography fontFamily="Nunito" color="text.secondary" fontSize="0.92rem" lineHeight={1.75}>
                  {v.body}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ── Mission statement ── */}
      <Box
        sx={{
          px: { xs: "24px", md: "10%" },
          py: { xs: "64px", md: "88px" },
          textAlign: "center",
        }}
      >
        <Box sx={{ maxWidth: "720px", mx: "auto" }}>
          <Box sx={{
            display: "flex", justifyContent: "center", mb: "24px",
          }}>
            <ShieldOutlined sx={{ fontSize: "40px", color: brand.secondary }} />
          </Box>
          <Typography variant="h4" fontFamily="Playfair Display" fontWeight={700} mb="20px" lineHeight={1.3}>
            "Our mission is to make premium fashion and lifestyle products accessible to everyone — one authentic piece at a time."
          </Typography>
          <Divider sx={{ width: "60px", mx: "auto", mb: "20px", borderWidth: "2px", borderColor: brand.primary }} />
          <Typography fontFamily="Nunito" color="text.secondary" fontSize="1rem" lineHeight={1.8}>
            We are committed to bridging the gap between global fashion brands and everyday consumers. Through transparency, trust, and a relentless focus on quality, Fashionero is building Africa's most loved fashion and lifestyle destination.
          </Typography>
        </Box>
      </Box>

      {/* ── Meet the Team ── */}
      <Box
        sx={{
          backgroundColor: panelBg,
          borderTop: `1px solid ${borderColor}`,
          borderBottom: `1px solid ${borderColor}`,
          px: { xs: "24px", md: "10%" },
          py: { xs: "64px", md: "88px" },
        }}
      >
        <Box sx={{ textAlign: "center", mb: "52px" }}>
          <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.8rem"
            color={brand.primary} letterSpacing="0.1em" textTransform="uppercase" mb="10px">
            The People Behind Fashionero
          </Typography>
          <Typography variant="h3" fontFamily="Playfair Display" fontWeight={700}>
            Meet the Team
          </Typography>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          {team.map((member, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Box
                sx={{
                  p: "32px 24px",
                  borderRadius: "16px",
                  border: `1px solid ${borderColor}`,
                  backgroundColor: isDark ? "#09090D" : "#fff",
                  textAlign: "center",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: isDark ? "0 12px 32px rgba(0,0,0,0.5)" : "0 12px 32px rgba(0,0,0,0.09)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: "80px", height: "80px", borderRadius: "50%",
                    background: i % 2 === 0
                      ? `linear-gradient(135deg, ${brand.primary}, #0038CC)`
                      : `linear-gradient(135deg, ${brand.secondary}, #CC4400)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    mx: "auto", mb: "18px",
                    boxShadow: `0 8px 24px ${i % 2 === 0 ? brand.primary : brand.secondary}40`,
                  }}
                >
                  <Typography fontFamily="Playfair Display" fontWeight={900} fontSize="1.5rem" color="#fff">
                    {member.initials}
                  </Typography>
                </Box>
                <Typography fontFamily="Playfair Display" fontWeight={700} fontSize="1.1rem" mb="6px">
                  {member.name}
                </Typography>
                <Typography fontFamily="Nunito" color="text.secondary" fontSize="0.88rem">
                  {member.role}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ── CTA ── */}
      <Box
        sx={{
          px: { xs: "24px", md: "10%" },
          py: { xs: "64px", md: "88px" },
          textAlign: "center",
          background: isDark
            ? `linear-gradient(160deg, #1A1208 0%, #0C0C0E 100%)`
            : `linear-gradient(160deg, #FEF3E2 0%, #FFFFFF 100%)`,
        }}
      >
        <Typography variant="h3" fontFamily="Playfair Display" fontWeight={700} mb="16px">
          Ready to Explore?
        </Typography>
        <Typography fontFamily="Nunito" color="text.secondary" fontSize="1rem" mb="36px" sx={{ maxWidth: "480px", mx: "auto" }}>
          Browse our curated collection of premium fashion and lifestyle products and find exactly what your wardrobe needs.
        </Typography>
        <Link to="/shop">
          <Button
            variant="contained"
            size="large"
            sx={{
              px: "48px", py: "16px", fontSize: "1.05rem",
              boxShadow: `0 8px 28px ${brand.primary}45`,
            }}
          >
            Discover the Collection
          </Button>
        </Link>
      </Box>

      <Footer />
    </Box>
  );
};

export default About;
