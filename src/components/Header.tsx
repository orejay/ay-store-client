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
import PCHeader from "./PCHeader";
import MobileHeader from "./MobileHeader";

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

const Header = () => {
  const isMediumScreen = useMediaQuery("(max-width:768px)");
  const isSmallScreen = useMediaQuery("(max-width:450px)");
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

  return <Box>{isMediumScreen ? <MobileHeader /> : <PCHeader />}</Box>;
};

export default Header;
