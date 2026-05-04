import { LocalActivity } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const Vouchers = () => {
  return (
    <Box>
      <Box sx={{ borderBottom: "1px solid #E0E0E0", pl: "30px", py: "10px" }}>
        <Typography
          fontFamily="Playfair Display"
          fontWeight="bold"
          color="secondary"
          variant="h5"
        >
          Vouchers
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          pt: "60px",
        }}
      >
        <LocalActivity
          sx={{
            fontSize: "90px",
            color: "#Ed981b",
          }}
        />
        <Typography
          fontFamily="Nunito"
          fontWeight="bold"
          fontSize="20px"
          pt="20px"
        >
          No vouchers yet!
        </Typography>
        <Typography
          pt="10px"
          fontSize="14px"
          sx={{ maxWidth: "40%", textAlign: "center" }}
        >
          Vouchers and discount codes you receive will appear here. Keep an eye
          on your email and our promotions for exclusive deals!
        </Typography>
        <Button
          variant="contained"
          sx={{ px: "30px", mt: "15px", borderRadius: "20px" }}
        >
          <Link to="/shop" className="w-full h-full">
            <Typography color="#FFFFFF" fontWeight="bold" fontFamily="Nunito">
              Continue Shopping
            </Typography>
          </Link>
        </Button>
      </Box>
    </Box>
  );
};

export default Vouchers;
