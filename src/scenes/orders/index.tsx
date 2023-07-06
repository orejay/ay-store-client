import { ShoppingCart } from "@mui/icons-material";
import { Box, Typography, Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  id: string;
  token: string;
}

interface OrderData {}

const Orders = () => {
  const user: UserData | null = JSON.parse(
    localStorage.getItem("user") || "null"
  ) as UserData | null;
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [data, setData] = useState<OrderData[]>([]);
  console.log(user);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    try {
      const response = await fetch(`${baseUrl}/get/orders/${user?.id}`);
      const jsonData = await response.json();
      setData(jsonData);
      console.log(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
          Orders
        </Typography>
      </Box>
      <Box>
        {data.length > 1 ? (
          ""
        ) : (
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
            <ShoppingCart
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
              You have placed no orders yet!
            </Typography>
            <Typography
              pt="10px"
              fontSize="14px"
              sx={{ maxWidth: "40%", textAlign: "center" }}
            >
              All your orders will be saved here for you to access their state
              anytime.
            </Typography>
            <Button
              variant="contained"
              sx={{ px: "30px", mt: "15px", borderRadius: "20px" }}
            >
              <Link to="/shop" className="w-full h-full">
                <Typography
                  color="#FFFFFF"
                  fontWeight="bold"
                  fontFamily="Nunito"
                >
                  Continue Shopping
                </Typography>
              </Link>
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Orders;
