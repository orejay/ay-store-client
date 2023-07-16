import { Box, Button, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCart, setCloseModal, setModalMessage } from "state";
import { RootState, useAppDispatch } from "store";

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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user: UserData | null = JSON.parse(
    localStorage.getItem("user") || "null"
  ) as UserData | null;
  const token = user?.token;
  const key = String(process.env.REACT_APP_PAYSTACK_KEY);
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const cart = useSelector((state: RootState) => state.global.cart);
  const instructions = useSelector(
    (state: RootState) => state.global.instructions
  );
  const deliveryAddress = useSelector(
    (state: RootState) => state.global.deliveryAddress
  );

  const total = () => {
    let x = 0;
    for (let i = 0; i < cart.length; i++) {
      console.log(cart[i]);
      x += cart[i].price * cart[i].quantity * ((100 - cart[i].discount) / 100);
    }
    return x;
  };

  const checkout = async (ref: string) => {
    const response = await fetch(`${baseUrl}/post/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        order: [...cart],
        address: { ...deliveryAddress },
        instructions: instructions,
        price: total().toFixed(2),
        ref: ref,
      }),
    });

    const jsonData = await response.json();

    if (response.ok) {
      dispatch(setCart([]));
      dispatch(setModalMessage("Order Placed Successfully!"));
      dispatch(setCloseModal(false));
      navigate("/");
    }

    console.log(jsonData);
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
        const verify = async () => {
          try {
            const res = await fetch(
              `${baseUrl}/get/verify-paystack/${response.reference}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${user?.token}`,
                },
              }
            );
            const jsonData = await res.json();
            if (jsonData.data.status) checkout(response.reference);
          } catch (error) {
            console.error("something went wrong", error);
          }
        };
        verify();
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
