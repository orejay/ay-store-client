import React, { useEffect } from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { CloseRounded } from "@mui/icons-material";
import { CSSTransition } from "react-transition-group";
import { useSelector } from "react-redux";
import Header from "components/Header";
import Footer from "components/Footer";
import Hero from "components/Hero";
import ProductCategory from "components/ProductCategory";
import AboutSection from "components/AboutSection";
import FeaturedProducts from "components/FeaturedProducts";
import { setCloseModal, setModalMessage, setShowSearches } from "../../state";
import { RootState, useAppDispatch } from "store";
import { brand } from "../../theme";

interface UserData {
  firstName: string; lastName: string; email: string;
  phoneNumber: string; role: string; id: string; token: string;
}

const Homepage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const user: UserData | null = JSON.parse(localStorage.getItem("user") || "null");
  const token = user?.token;
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const dispatch = useAppDispatch();
  const closeModal = useSelector((state: RootState) => state.global.closeModal);
  const modalMessage = useSelector((state: RootState) => state.global.modalMessage);

  const auth = async () => {
    try {
      const res = await fetch(`${baseUrl}/auth/authenticate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) localStorage.removeItem("user");
    } catch { /* silent */ }
  };

  useEffect(() => { auth(); }, []);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column" }}
      onClick={() => dispatch(setShowSearches(false))}
    >
      <Header />

      {/* Toast notification */}
      <Box sx={{ pt: "60px", position: "relative", zIndex: 900 }}>
        <CSSTransition in={!closeModal} timeout={300} classNames="fade" unmountOnExit>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: "20px",
              py: "10px",
              background: `linear-gradient(135deg, ${brand.primary} 0%, #D4800A 100%)`,
            }}
          >
            <Typography fontFamily="Nunito" fontWeight={600} fontSize="0.88rem" color="#fff">
              {modalMessage}
            </Typography>
            <IconButton
              size="small"
              onClick={() => { dispatch(setCloseModal(true)); dispatch(setModalMessage("")); }}
              sx={{ color: "rgba(255,255,255,0.8)", "&:hover": { color: "#fff" }, p: "4px" }}
            >
              <CloseRounded sx={{ fontSize: "16px" }} />
            </IconButton>
          </Box>
        </CSSTransition>
      </Box>

      <Hero />
      <FeaturedProducts />
      <ProductCategory />
      <AboutSection />
      <Footer />
    </Box>
  );
};

export default Homepage;
