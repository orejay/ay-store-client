import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const AccManagement = () => {
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
          Account Management
        </Typography>
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

export default AccManagement;
