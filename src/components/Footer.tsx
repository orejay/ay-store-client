import { Box, Button, Typography, IconButton } from "@mui/material";
import React from "react";
import FlexBetween from "./FlexBetween";
import {
  Facebook,
  Instagram,
  Twitter,
  CopyrightOutlined,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <Box py="40px" px="60px">
      <Box>
        <h1 className="Nunito text-primary font-bold">
          <Link to="/">BEAUTY</Link>
        </h1>
      </Box>
      <FlexBetween mt="20px">
        <FlexBetween sx={{ ml: "90px" }} gap="80px">
          <Box display="flex" flexDirection="column" gap="15px">
            <Link to="/about" className="Nunito font-bold text-drk">
              About
            </Link>
            <Link to="/shop" className="Nunito font-bold text-drk">
              Shop
            </Link>
            <Link to="/contact" className="Nunito font-bold text-drk">
              Contact
            </Link>
          </Box>
          <Box display="flex" flexDirection="column" gap="15px">
            <Typography fontFamily="Nunito" fontWeight="bold">
              SAY HI!
            </Typography>
            <Typography fontFamily="Nunito">+234387349719180</Typography>
          </Box>
        </FlexBetween>
        <Box>
          <Typography
            variant="h4"
            fontFamily="Playfair Display"
            fontWeight="bold"
            textAlign="right"
          >
            Let's stay in touch.
          </Typography>
          <FlexBetween mt="15px" gap="25px">
            <Button
              variant="outlined"
              sx={{ borderRadius: "25px", px: "50px", textAlign: "left" }}
            >
              <Typography
                fontSize="12px"
                fontFamily="Nunito"
                fontWeight="bold"
                textAlign="left"
              >
                Follow Us
              </Typography>
            </Button>
            <Button
              variant="contained"
              sx={{ borderRadius: "25px", px: "50px" }}
            >
              <Typography
                color="#FFFFFF"
                fontSize="12px"
                fontFamily="Nunito"
                fontWeight="bold"
              >
                Subscribe
              </Typography>
            </Button>
          </FlexBetween>
          <Box display="flex" justifyContent="end">
            <FlexBetween mt="40px" width="40%">
              <IconButton>
                <Facebook />
              </IconButton>
              <IconButton>
                <Twitter />
              </IconButton>
              <IconButton>
                <Instagram />
              </IconButton>
            </FlexBetween>
          </Box>
        </Box>
      </FlexBetween>
      <FlexBetween width="50%" mt="40px">
        <Box display="flex">
          <CopyrightOutlined sx={{ fontSize: "14px" }} />
          <Typography fontFamily="Nunito" fontWeight="bold">
            Beauty 2023
          </Typography>
        </Box>
        <FlexBetween gap="20px">
          <Typography fontFamily="Nunito" fontWeight="bold">
            Privacy & Policy
          </Typography>
          <Typography fontFamily="Nunito" fontWeight="bold">
            Terms & Conditions
          </Typography>
        </FlexBetween>
      </FlexBetween>
    </Box>
  );
};

export default Footer;
