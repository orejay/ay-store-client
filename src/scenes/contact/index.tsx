import { MessageRounded, SendRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Typography,
} from "@mui/material";
import Footer from "components/Footer";
import Header from "components/Header";
import React from "react";

const Contact = () => {
  return (
    <Box>
      <Header />
      <Box
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        py="150px"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            border: "2px solid #E0E0E0",
            borderRadius: "30px",
            width: "35%",
            p: "4%",
          }}
        >
          <Typography
            variant="h4"
            fontFamily="Playfair Display"
            fontWeight="bold"
            color="secondary"
            mb="35px"
          >
            Send us a message
          </Typography>

          <FormControl variant="outlined" sx={{ mb: "20px" }}>
            <InputLabel color="secondary">Name</InputLabel>
            <Input
              required
              type="text"
              color="secondary"
              // onChange={(e) =>
              //   setBody((body) => ({ ...body, email: e.target.value }))
              // }
            />
          </FormControl>
          <FormControl variant="outlined" sx={{ mb: "20px" }}>
            <InputLabel color="secondary">Email</InputLabel>
            <Input
              required
              type="email"
              color="secondary"
              // onChange={(e) =>
              //   setBody((body) => ({ ...body, password: e.target.value }))
              // }
            />
          </FormControl>
          <FormControl variant="outlined" sx={{ mb: "20px" }}>
            <InputLabel color="secondary">Phone Number</InputLabel>
            <Input
              required
              type="phone"
              color="secondary"
              // onChange={(e) =>
              //   setBody((body) => ({ ...body, password: e.target.value }))
              // }
            />
          </FormControl>
          <FormControl variant="outlined" sx={{ mb: "20px" }}>
            <InputLabel color="secondary">Message</InputLabel>
            <Input
              required
              type="text"
              color="secondary"
              multiline
              // onChange={(e) =>
              //   setBody((body) => ({ ...body, password: e.target.value }))
              // }
            />
          </FormControl>
          <Button
            variant="contained"
            sx={{ borderRadius: "20px", mt: "15px" }}
            // onClick={signIn}
          >
            <Typography color="#ffffff" sx={{ textTransform: "none" }}>
              Send
            </Typography>
            <SendRounded sx={{ fontSize: "17px", color: "white", ml: "5px" }} />
          </Button>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Contact;
