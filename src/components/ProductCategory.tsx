import { Box } from "@mui/material";
import React from "react";

const category = ["", "", "", "", "", ""];

const ProductCategory = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      py="50px"
      alignItems="center"
      sx={{
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Box
        sx={{
          width: "85%",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
        gap="15px"
      >
        {category.map((each, index) => (
          <Box
            key={index}
            sx={{
              height: "250px",
              width: "250px",
              border: "2px solid #E0E0E0",
            }}
          ></Box>
        ))}
      </Box>
    </Box>
  );
};

export default ProductCategory;
