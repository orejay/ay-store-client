import { Box, IconButton, Typography } from "@mui/material";
import Header from "components/Header";
import React, { useEffect } from "react";
import Footer from "components/Footer";
import Hero from "components/Hero";
import { setCloseModal, setShowSearches } from "../../state";
import { RootState, useAppDispatch } from "store";
import ProductCategory from "components/ProductCategory";
import AboutSection from "components/AboutSection";
import { Close } from "@mui/icons-material";
import { CSSTransition } from "react-transition-group";
import { useSelector } from "react-redux";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  id: string;
  token: string;
}

const Homepage = () => {
  const user: UserData | null = JSON.parse(
    localStorage.getItem("user") || "null"
  ) as UserData | null;
  const token = user?.token;
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const dispatch = useAppDispatch();
  const closeModal = useSelector((state: RootState) => state.global.closeModal);
  const modalMessage = useSelector(
    (state: RootState) => state.global.modalMessage
  );

  const auth = async () => {
    try {
      const response = await fetch(`${baseUrl}/auth/authenticate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 401) signout();
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const signout = () => {
    localStorage.removeItem("user");
  };

  useEffect(() => {
    auth();
  }, []);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column" }}
      onClick={() => dispatch(setShowSearches(false))}
    >
      <Header />
      <Box sx={{ pt: "80px" }}>
        {
          <CSSTransition
            in={!closeModal}
            timeout={1000}
            classNames="fade"
            unmountOnExit
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: "5px",
                backgroundColor: "#00C98D",
                pl: "30px",
                pr: "10px",
                width: "100%",
              }}
            >
              <Typography
                fontFamily="Nunito"
                sx={{
                  color: "white",
                  fontStyle: "italic",
                }}
              >
                {modalMessage}
              </Typography>
              <IconButton
                onClick={() => {
                  dispatch(setCloseModal(true));
                }}
              >
                <Close sx={{ color: "white" }} />
              </IconButton>
            </Box>
          </CSSTransition>
        }
      </Box>
      <Hero />
      <ProductCategory />
      <AboutSection />
      <Footer />
    </Box>
  );
};

export default Homepage;
