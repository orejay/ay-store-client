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
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import FlexBetween from "./FlexBetween";
import {
  BorderRight,
  SearchRounded,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { useAppDispatch, RootState } from "store";
import { setShowSearches } from "state";

interface ProductData {
  name: string;
  _id: string;
}

const nav = ["About", "Shop", "Contact"];

const Header = () => {
  const theme = useTheme();
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [searchText, setSearchText] = useState("");
  const [active, setActive] = useState("");
  const [data, setData] = useState<ProductData[]>([]);
  const showSearches = useSelector(
    (state: RootState) => state.global.showSearches
  );
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

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
      py="15px"
      px="60px"
      width="100vw"
      sx={{
        position: "fixed",
        backgroundColor: theme.palette.background.default,
        zIndex: "100",
      }}
    >
      <FlexBetween>
        <Box>
          <h1 className="Nunito text-primary font-bold">
            <Link to="/">BEAUTY</Link>
          </h1>
        </Box>

        <FlexBetween width="20%" gap="15px">
          {nav.map((each, index) => (
            <Link
              to={`/${each.toLowerCase()}`}
              className={`Nunito font-semibold ${
                active === each.toLowerCase() ? "text-primary" : "text-drk"
              }`}
            >
              {each}
            </Link>
          ))}
        </FlexBetween>

        <FlexBetween gap="20px">
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
        <FlexBetween gap="5px" backGround="green">
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
              onChange={(e) => {
                setSearchText(e.target.value);
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
          {data.length > 0 && showSearches === true ? (
            <ul
              style={{
                backgroundColor: "white",
                position: "absolute",
                width: "200px",
                top: 60,
                padding: "1% 0",
                borderRadius: "12px",
              }}
            >
              {data.map((each) => (
                <Link
                  key={each._id}
                  to={`/products/${each.name}`}
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
                width: "200px",
                top: 60,
                padding: "1% 0",
                borderRadius: "12px",
              }}
            >
              <span className="pl-3 Nunito font-semibold">
                No results found...
              </span>
            </div>
          ) : (
            ""
          )}
          <IconButton>
            <ShoppingCartOutlined />
          </IconButton>
        </FlexBetween>
      </FlexBetween>
    </Box>
  );
};

export default Header;
