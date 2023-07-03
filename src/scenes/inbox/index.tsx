import { Email } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import React from "react";

const Inbox = () => {
  return (
    <Box
      sx={{
        backgroundColor: "white",
        width: "78%",
        borderRadius: "5px",
        boxShadow: "2px 2px 7px #E0E0E0",
      }}
    >
      <Box sx={{ borderBottom: "1px solid #E0E0E0", pl: "30px", py: "10px" }}>
        <Typography
          fontFamily="Playfair Display"
          fontWeight="bold"
          color="secondary"
          variant="h5"
        >
          Inbox
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
        <Email
          sx={{
            fontSize: "90px",
            color: "#Ed981b",
            transform: "rotate(-15deg)",
          }}
        />
        <Typography
          fontFamily="Nunito"
          fontWeight="bold"
          fontSize="20px"
          pt="20px"
        >
          You have no message at the moment!
        </Typography>
        <Typography
          pt="10px"
          fontSize="14px"
          sx={{ maxWidth: "40%", textAlign: "center" }}
        >
          Here you will be able to see all the messages that we send you. Stay
          tuned.
        </Typography>
      </Box>
    </Box>
  );
};

export default Inbox;
