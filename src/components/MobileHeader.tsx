import {
  Box,
  Button,
  useTheme,
  IconButton,
  Typography,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import FlexBetween from "./FlexBetween";
import {
  MenuRounded,
  PermIdentityRounded,
  SearchRounded,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useAppDispatch, RootState } from "store";
import {
  setCloseModal,
  setModalMessage,
  setShowCart,
  setShowSearches,
} from "state";

interface ProductData {
  name: string;
  _id: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  id: string;
  token: string;
}

const nav = ["About", "Shop", "Contact"];

const MobileHeader = () => {
  const isSmallScreen = useMediaQuery("(max-width:450px)");
  const theme = useTheme();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const user: UserData | null = JSON.parse(
    localStorage.getItem("user") || "null"
  ) as UserData | null;
  const [searchText, setSearchText] = useState("");
  const [active, setActive] = useState("");
  const [openMenu, setOpenMenu] = useState<Boolean>(false);
  const [data, setData] = useState<ProductData[]>([]);
  const showSearches = useSelector(
    (state: RootState) => state.global.showSearches
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const cart = useSelector((state: RootState) => state.global.cart);

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  const formatNumberWithCommas = (number: string) => {
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/signin");
  };

  const total = () => {
    let x = 0;
    for (let i = 0; i < cart.length; i++) {
      x += cart[i].price * ((100 - cart[i].discount) / 100);
    }
    return x;
  };

  const search = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/get/products/search?name=${searchText}`
      );
      const jsonData = await response.json();
      setData(jsonData.products);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Box
      py="5px"
      px="16px"
      sx={{
        width: "100%",
        boxSizing: "border-box",
        position: "fixed",
        backgroundColor: theme.palette.background.default,
        zIndex: "100",
        overflowX: "hidden",
      }}
    >
      <Box sx={{ position: "absolute", top: 8, left: 12 }}>
        <IconButton onClick={() => setOpenMenu(!openMenu)}>
          <MenuRounded />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <FlexBetween
          gap="8px"
          sx={{ width: isSmallScreen ? "80%" : "65%", height: "fit" }}
        >
          <Box>
            <h1 className="Nunito text-primary font-bold">
              <Link to="/">BEAUTY</Link>
            </h1>
          </Box>
          <FlexBetween sx={{ position: "relative" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TextField
                variant="standard"
                color="secondary"
                placeholder="search..."
                sx={{ width: isSmallScreen ? "90px" : "120px" }}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  dispatch(setShowCart(false));
                  if (e.target.value.length > 1) {
                    search();
                    dispatch(setShowSearches(true));
                  }
                }}
              />
              <IconButton onClick={search}>
                <SearchRounded />
              </IconButton>
            </Box>
            {data?.length > 0 && showSearches === true ? (
              <ul
                style={{
                  backgroundColor: "white",
                  position: "absolute",
                  width: "calc(100vw - 32px)",
                  maxWidth: "300px",
                  top: 45,
                  right: 0,
                  padding: "8px 0",
                  borderRadius: "5px",
                  boxShadow: "2px 4px 12px rgba(0,0,0,0.12)",
                  zIndex: 200,
                }}
              >
                {data.map((each) => (
                  <Link
                    key={each._id}
                    to={`/products/${each._id}`}
                    className="w-full h-full pl-3 Nunito font-semibold py-2 hover:bg-hov transition-all ease-in-out duration-400 block"
                  >
                    {each.name}
                  </Link>
                ))}
              </ul>
            ) : showSearches && searchText.length > 0 ? (
              <div
                style={{
                  backgroundColor: "white",
                  position: "absolute",
                  width: "calc(100vw - 32px)",
                  maxWidth: "300px",
                  top: 45,
                  right: 0,
                  padding: "8px 0",
                  borderRadius: "5px",
                  boxShadow: "2px 4px 12px rgba(0,0,0,0.12)",
                  zIndex: 200,
                }}
              >
                <span className="pl-3 Nunito font-semibold">
                  No results found...
                </span>
              </div>
            ) : (
              ""
            )}
            <Box>
              <Box
                p="10px"
                sx={{ cursor: "pointer", zIndex: "100", position: "relative" }}
                onClick={() => {
                  if (cart.length > 0) {
                    navigate("/checkout");
                  } else {
                    dispatch(setModalMessage("Your cart is empty!"));
                    dispatch(setCloseModal(false));
                  }
                }}
              >
                {cart?.length > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%",
                      position: "absolute",
                      width: "14px",
                      height: "14px",
                      backgroundColor: "#F4f7fc",
                      top: 4,
                      right: 4,
                    }}
                  >
                    <Typography
                      fontSize="12px"
                      fontWeight="bold"
                      color="primary"
                    >
                      {cart?.length}
                    </Typography>
                  </Box>
                )}
                <ShoppingCartOutlined />
              </Box>
            </Box>
          </FlexBetween>
        </FlexBetween>
      </Box>
      {openMenu && (
        <Box
          sx={{
            width: "100%",
            backgroundColor: theme.palette.background.default,
            p: "20px",
            pt: "40px",
            boxSizing: "border-box",
          }}
        >
          <Box
            gap="15px"
            sx={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            {nav.map((each, index) => (
              <Link
                key={index}
                to={`/${each.toLowerCase()}`}
                onClick={() => setOpenMenu(false)}
                className={`Nunito font-semibold text-lg ${
                  active === each.toLowerCase() ? "text-primary" : "text-drk"
                }`}
              >
                {each}
              </Link>
            ))}
          </Box>
          {!user ? (
            <FlexBetween
              gap="10px"
              sx={{
                flexDirection: "column",
                alignItems: "flex-start",
                mt: "40px",
              }}
            >
              <Typography
                fontFamily="Nunito"
                fontWeight="bold"
                color={`${active === "signin" ? "primary" : ""}`}
              >
                <Link to="/signin" className={`hover:text-gry`}>
                  Sign In
                </Link>
              </Typography>
              <Button
                variant="outlined"
                color={`${active === "signup" ? "primary" : "secondary"}`}
                sx={{ borderRadius: "20px", px: "20px" }}
              >
                <Typography
                  fontFamily="Nunito"
                  fontWeight="bold"
                  color={`${active === "signup" ? "primary" : "secondary"}`}
                  sx={{ textTransform: "none" }}
                >
                  <Link to="/signup">Sign Up</Link>
                </Typography>
              </Button>
            </FlexBetween>
          ) : (
            <FlexBetween
              gap="10px"
              sx={{
                flexDirection: "column",
                alignItems: "flex-start",
                mt: "40px",
              }}
            >
              <Box display="flex">
                <Typography
                  fontFamily="Nunito"
                  fontWeight="bold"
                  color="secondary"
                >
                  <Link to="/customer/account" className={`hover:text-gry`}>
                    Hi, {user.firstName}
                    <PermIdentityRounded sx={{ ml: "3px" }} />
                  </Link>
                </Typography>
              </Box>
              <Button
                variant="outlined"
                color="primary"
                sx={{ borderRadius: "20px", px: "20px" }}
                onClick={logout}
              >
                <Typography
                  fontFamily="Nunito"
                  fontWeight="bold"
                  color="primary"
                  sx={{ textTransform: "none" }}
                >
                  <Link to="/signin">Sign Out</Link>
                </Typography>
              </Button>
            </FlexBetween>
          )}
        </Box>
      )}
    </Box>
  );
};

export default MobileHeader;
