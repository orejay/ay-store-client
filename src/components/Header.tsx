import {
  Box,
  Button,
  useTheme,
  IconButton,
  Typography,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import FlexBetween from "./FlexBetween";
import { SearchRounded, ShoppingCartOutlined } from "@mui/icons-material";

interface ProductData {
  name: string;
  _id: string;
}

const Header = () => {
  const theme = useTheme();
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState<ProductData[]>([]);

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
      py="20px"
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

        <FlexBetween width="27%" gap="25px">
          <Link to="/about" className="Nunito font-semibold text-drk">
            About
          </Link>
          <Link to="/shop" className="Nunito font-semibold text-drk">
            Shop
          </Link>
          <Link to="/contact" className="Nunito font-semibold text-drk">
            Contact
          </Link>
        </FlexBetween>

        <FlexBetween gap="20px">
          <Typography fontFamily="Nunito" fontWeight="bold">
            <Link to="/signin" className="hover:text-gry">
              Sign In
            </Link>
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ borderRadius: "20px", px: "20px" }}
          >
            <Typography
              fontFamily="Nunito"
              fontWeight="bold"
              color="secondary"
              sx={{ textTransform: "none" }}
            >
              <Link to="/signup">Sign Up</Link>
            </Typography>
          </Button>
        </FlexBetween>
        <FlexBetween gap="25px" backGround="green">
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
              onChange={(e) => setSearchText(e.target.value)}
            />
            <IconButton onClick={search}>
              <SearchRounded />
            </IconButton>
          </Box>
          <IconButton>
            <ShoppingCartOutlined />
          </IconButton>
        </FlexBetween>
      </FlexBetween>
    </Box>
  );
};

export default Header;
