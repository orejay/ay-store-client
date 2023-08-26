import {
  Box,
  Button,
  useTheme,
  IconButton,
  Typography,
  TextField,
  Divider,
  ListItem,
  List,
  useMediaQuery,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import FlexBetween from "./FlexBetween";
import {
  BorderRight,
  CloseRounded,
  DeleteOutlineRounded,
  DeleteRounded,
  KeyboardArrowDownRounded,
  MenuRounded,
  PermIdentityRounded,
  SearchRounded,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { useAppDispatch, RootState } from "store";
import { setCart, setShowCart, setShowSearches } from "state";

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
  const theme = useTheme();
  const baseUrl = process.env.REACT_APP_BASE_URL;
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
  const showCart = useSelector((state: RootState) => state.global.showCart);
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
      console.log(cart[i]);
      x += cart[i].price * ((100 - cart[i].discount) / 100);
    }
    return x;
  };

  const search = async () => {
    try {
      console.log(searchText);
      const response = await fetch(
        `${baseUrl}/get/products/search?name=${searchText}`
      );
      const jsonData = await response.json();
      setData(jsonData.products);
      console.log(jsonData.products);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Box
      py="5px"
      px="20px"
      width="100vw"
      sx={{
        position: "fixed",
        backgroundColor: theme.palette.background.default,
        zIndex: "100",
        display: "flex",
        justifyContent: "end",
      }}
    >
      <Box sx={{ position: "absolute", top: 8, left: 20 }}>
        <IconButton onClick={() => setOpenMenu(!openMenu)}>
          <MenuRounded />
        </IconButton>
      </Box>
      <FlexBetween sx={{ width: "60%", height: "fit" }}>
        <Box>
          <h1 className="Nunito text-primary font-bold">
            <Link to="/">BEAUTY</Link>
          </h1>
        </Box>
        <Box
          sx={{
            backgroundColor: showCart ? "white" : "",
            borderRadius: "20px 20px 0 0",
          }}
        >
          <Box
            p="10px"
            sx={{ cursor: "pointer", zIndex: "100" }}
            onClick={() => {
              dispatch(setShowCart(!showCart));
              dispatch(setShowSearches(false));
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
                  ml: "12px",
                  mb: "10px",
                }}
              >
                <Typography fontSize="12px" fontWeight="bold" color="primary">
                  {cart?.length}
                </Typography>
              </Box>
            )}
            <ShoppingCartOutlined />
          </Box>
        </Box>
      </FlexBetween>
      {openMenu && (
        <Box
          sx={{
            height: "100vh",
            // backgroundColor: theme.palette.background.default,
            backgroundColor: "red",
          }}
        ></Box>
      )}
    </Box>
  );
};

export default MobileHeader;
