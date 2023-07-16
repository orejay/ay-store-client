import { ArrowBackIosRounded, Close } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";
import CheckoutCart from "components/CheckoutCart";
import DeliveryDetails from "components/DeliveryDetails";
import FlexBetween from "components/FlexBetween";
import Footer from "components/Footer";
import Header from "components/Header";
import PaystackPayment from "components/PaystackPayment";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { setCart, setCloseModal, setModalMessage, setPrevPage } from "state";
import { RootState, useAppDispatch } from "store";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  id: string;
  token: string;
}

const Checkout = () => {
  const cart = useSelector((state: RootState) => state.global.cart);
  const [tab, setTab] = useState(0);
  const deliveryAddress = useSelector(
    (state: RootState) => state.global.deliveryAddress
  );
  const user: UserData | null = JSON.parse(
    localStorage.getItem("user") || "null"
  ) as UserData | null;
  const token = user?.token;
  const { pathname } = useLocation();
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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
    dispatch(setPrevPage(pathname));
    localStorage.removeItem("user");
    navigate("/signin");
  };

  useEffect(() => {
    auth();
    if (cart.length < 1) navigate("/");
  }, []);

  const formatNumberWithCommas = (number: string) => {
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const total = () => {
    let x = 0;
    for (let i = 0; i < cart.length; i++) {
      console.log(cart[i]);
      x += cart[i].price * cart[i].quantity * ((100 - cart[i].discount) / 100);
    }
    return x;
  };

  return (
    <Box>
      <Header />
      <Box
        sx={{
          pt: "100px",
          pb: "80px",
          minHeight: "100vh",
          width: "80%",
          mx: "auto",
        }}
      >
        <Box
          sx={{
            display: "grid",
            mx: "auto",
            gap: "40px",
            width: "75%",
            gridTemplateColumns: "repeat(7,1fr)",
            gridAutoRows: "50px",
            mb: "35px",
          }}
        >
          <Box
            sx={{
              gridColumn: "span 2",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              onClick={() => {
                tab > 0 && setTab(0);
              }}
              sx={{
                backgroundColor: tab >= 0 ? "#Ed981b" : "#Dfeaec",
                borderRadius: "4px",
                width: "55px",
                height: "55px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transform: "rotate(45deg)",
                cursor: "pointer",
              }}
            >
              <Typography
                fontFamily="Nunito"
                fontWeight="bold"
                fontSize="12px"
                color="white"
                sx={{ transform: "rotate(-45deg)" }}
              >
                01
              </Typography>
            </Box>
            <Typography fontFamily="Nunito" fontWeight="bold">
              My bag
            </Typography>
            <Box
              sx={{
                width: "30px",
                height: "2px",
                backgroundColor: tab >= 0 ? "#Ed981b" : "#Dfeaec",
              }}
            ></Box>
          </Box>
          <Box
            sx={{
              gridColumn: "span 3",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              onClick={() => {
                tab > 1 && setTab(1);
              }}
              sx={{
                backgroundColor: tab > 0 ? "#Ed981b" : "#Dfeaec",
                borderRadius: "4px",
                width: "55px",
                height: "55px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transform: "rotate(45deg)",
              }}
            >
              <Typography
                fontFamily="Nunito"
                fontWeight="bold"
                fontSize="12px"
                color="white"
                sx={{ transform: "rotate(-45deg)" }}
              >
                02
              </Typography>
            </Box>
            <Typography fontFamily="Nunito" fontWeight="bold">
              Delivery & Payment
            </Typography>
            <Box
              sx={{
                width: "30px",
                height: "2px",
                backgroundColor: tab > 0 ? "#Ed981b" : "#Dfeaec",
              }}
            ></Box>
          </Box>
          <Box
            sx={{
              gridColumn: "span 2",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                backgroundColor: tab > 1 ? "#Ed981b" : "#Dfeaec",
                borderRadius: "4px",
                width: "55px",
                height: "55px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transform: "rotate(45deg)",
                cursor: "pointer",
              }}
            >
              <Typography
                fontFamily="Nunito"
                fontWeight="bold"
                fontSize="12px"
                color="white"
                sx={{ transform: "rotate(-45deg)" }}
              >
                03
              </Typography>
            </Box>
            <Typography fontFamily="Nunito" fontWeight="bold">
              Confirm
            </Typography>
            <Box
              sx={{
                width: "30px",
                height: "2px",
                backgroundColor: tab > 1 ? "#Ed981b" : "#Dfeaec",
              }}
            ></Box>
          </Box>
        </Box>
        <Box
          display="grid"
          sx={{
            width: "100%",
            height: "75vh",
            gap: "40px",
            gridTemplateColumns: "repeat(3,1fr)",
            gridTemplateRows: "repeat(2,1fr)",
          }}
        >
          <Box
            sx={{
              gridColumn: "span 2",
              boxShadow: "2px 2px 7px #E0E0E0",
              gridRow: "span 2",
              borderRadius: "5px",
              backgroundColor: "white",
              overflow: "hidden",
            }}
          >
            {tab === 0 || tab === 2 ? <CheckoutCart /> : <DeliveryDetails />}
          </Box>
          {[0, 1].includes(tab) && (
            <Box
              sx={{
                boxShadow: "2px 2px 7px #E0E0E0",
                gridRow: "span 1",
                borderRadius: "5px",
                backgroundColor: "white",
                p: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                {tab > 0 && (
                  <Box>
                    <IconButton onClick={() => setTab(tab - 1)}>
                      <ArrowBackIosRounded sx={{ color: "#Ed981b" }} />
                    </IconButton>
                  </Box>
                )}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  sx={{ borderBottom: "2px solid #E0E0E0", py: "10px" }}
                >
                  <Typography fontFamily="Nunito" fontWeight="bold">
                    Sub Total
                  </Typography>
                  <Typography fontFamily="Nunito" fontWeight="bold">
                    ${formatNumberWithCommas(total().toFixed(2))}
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  sx={{ py: "10px", mt: "10px" }}
                >
                  <Typography fontFamily="Nunito" fontWeight="bold">
                    Total
                  </Typography>
                  <Typography fontFamily="Nunito" fontWeight="bold">
                    ${formatNumberWithCommas(total().toFixed(2))}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mx: "auto", width: "100%" }}>
                <Button
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    borderRadius: "20px",
                    width: "100%",
                  }}
                  onClick={() => setTab(tab + 1)}
                >
                  <Typography
                    color="white"
                    fontFamily="Nunito"
                    fontWeight="bold"
                  >
                    Next Step
                  </Typography>
                </Button>
              </Box>
            </Box>
          )}
          {tab === 1 && (
            <Box
              sx={{
                boxShadow: "2px 2px 7px #E0E0E0",
                gridRow: "span 1",
                borderRadius: "5px",
                backgroundColor: "white",
                p: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                overflow: "auto",
                maxHeight: "50vh",
                "&::-webkit-scrollbar": {
                  width: "0.4em",
                },
                "&::-webkit-scrollbar-track": {
                  background: "transparent",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "gray",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "darkgray",
                },
              }}
            >
              {cart.map((each, i) => (
                <Box
                  key={each._id}
                  sx={{
                    borderBottom: "2px solid #E0E0E0",
                    mt: i > 0 ? "10px" : "",
                    "& hover": { bgcolor: "#F0F0F0" },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ mb: "5px" }}>
                      <Typography
                        fontWeight="bold"
                        fontSize="17px"
                        fontFamily="Nunito"
                      >
                        {each.name}
                      </Typography>
                      <Typography
                        fontFamily="Playfair Display"
                        fontWeight="bold"
                        fontSize="14px"
                        color="secondary"
                      >
                        {each.category}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography fontSize="13px" fontStyle="italic" mb="5px">
                    {each.description.slice(0, 30)}...
                  </Typography>

                  <Typography
                    fontFamily="Playfair Display"
                    fontWeight="bold"
                    fontSize="14px"
                    mb="5px"
                  >
                    {each.quantity} x{" "}
                    {formatNumberWithCommas(
                      (each.price * ((100 - each.discount) / 100)).toFixed(2)
                    )}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
          {tab === 2 && (
            <Box
              sx={{
                boxShadow: "2px 2px 7px #E0E0E0",
                // gridRow: "span 2",
                borderRadius: "5px",
                backgroundColor: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                {tab === 2 && (
                  <Box sx={{ p: "10px 0 0 10px" }}>
                    <IconButton onClick={() => setTab(tab - 1)}>
                      <ArrowBackIosRounded sx={{ color: "#Ed981b" }} />
                    </IconButton>
                  </Box>
                )}
                <Box
                  sx={{
                    p: "20px",
                  }}
                >
                  <FlexBetween
                    sx={{
                      borderBottom: "1px solid #E0E0E0",
                      pb: "10px",
                      mb: "10px",
                    }}
                  >
                    <Typography fontWeight="bold">Total</Typography>
                    <Typography fontWeight="bold">
                      ${formatNumberWithCommas(total().toFixed(2))}
                    </Typography>
                  </FlexBetween>
                  <FlexBetween
                    sx={{
                      alignItems: "start",
                      borderBottom: "1px solid #E0E0E0",
                      pb: "10px",
                    }}
                  >
                    <Typography fontWeight="bold">Contact</Typography>
                    <Box>
                      <Typography fontStyle="italic" fontSize="14px">
                        {deliveryAddress?.address}
                      </Typography>
                      <Typography fontStyle="italic" fontSize="14px">
                        {deliveryAddress?.city}
                      </Typography>
                      <Typography fontStyle="italic" fontSize="14px">
                        {deliveryAddress?.state},{deliveryAddress?.country}
                      </Typography>
                      <Typography fontStyle="italic" fontSize="14px">
                        {deliveryAddress?.phoneNumber}
                      </Typography>
                    </Box>
                  </FlexBetween>
                  <Box sx={{ mx: "auto", width: "100%", pt: "10px" }}>
                    <PaystackPayment />
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Checkout;
