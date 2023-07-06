import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const AddressBook = () => {
  return (
    <Box
      sx={{
        backgroundColor: "white",
        width: "78%",
        borderRadius: "5px",
        boxShadow: "2px 2px 7px #E0E0E0",
      }}
    >
      <Box
        sx={{
          borderBottom: "1px solid #E0E0E0",
          px: "30px",
          py: "13px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          fontFamily="Playfair Display"
          fontWeight="bold"
          color="secondary"
          variant="h5"
        >
          Address Book
        </Typography>
        <Button variant="contained" sx={{ px: "20px", borderRadius: "20px" }}>
          <Link to="/customer/add-address" className="w-full h-full">
            <Typography
              color="#FFFFFF"
              fontWeight="bold"
              fontFamily="Nunito"
              fontSize="12px"
            >
              Add New Address
            </Typography>
          </Link>
        </Button>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gridAutoRows: "200px",
          gap: "20px",
          p: "20px",
        }}
      ></Box>
    </Box>
  );
};

export default AddressBook;
