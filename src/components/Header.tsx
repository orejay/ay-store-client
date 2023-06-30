import {
  Box,
  Button,
  useTheme,
  IconButton,
  Typography,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import React from "react";
import FlexBetween from "./FlexBetween";
import { SearchRounded, ShoppingCartOutlined } from "@mui/icons-material";

const Header = () => {
  const theme = useTheme();

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
            />
            <IconButton>
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
