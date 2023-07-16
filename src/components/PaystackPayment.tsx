import { Box, Button, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  id: string;
  token: string;
}

const PaystackPayment = () => {
  const user: UserData | null = JSON.parse(
    localStorage.getItem("user") || "null"
  ) as UserData | null;
  const key = String(process.env.REACT_APP_PAYSTACK_KEY);
  const cart = useSelector((state: RootState) => state.global.cart);

  const total = () => {
    let x = 0;
    for (let i = 0; i < cart.length; i++) {
      console.log(cart[i]);
      x += cart[i].price * cart[i].quantity * ((100 - cart[i].discount) / 100);
    }
    return x;
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const payWithPaystack = (e: React.FormEvent) => {
    e.preventDefault();

    // Retrieve form values
    const email = user?.email;
    const amount = total().toFixed(2);
    const ref = String(Math.floor(Math.random() * 1000000000000) + 1);

    // Call PaystackPop.setup
    const handler = (window as any).PaystackPop.setup({
      key: key,
      email,
      amount: Number(amount) * 100,
      ref,
      onClose: function () {
        alert("You're about to leave without completing your payment.");
      },
      callback: function (response: any) {
        console.log(response);
        const message = "Payment complete! Reference: " + response.reference;
        // alert(message);
      },
    });

    handler.openIframe();
  };

  return (
    <Box sx={{ mx: "auto", width: "100%", pt: "10px" }}>
      <Button
        variant="contained"
        sx={{
          textTransform: "none",
          borderRadius: "20px",
          width: "100%",
        }}
        onClick={(e) => {
          // checkout();
          payWithPaystack(e);
        }}
      >
        <Typography color="white" fontFamily="Nunito" fontWeight="bold">
          Pay Now With Paystack
        </Typography>
      </Button>
    </Box>
  );
};

export default PaystackPayment;
