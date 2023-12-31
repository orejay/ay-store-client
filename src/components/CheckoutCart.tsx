import {
  AddRounded,
  DeleteOutlineRounded,
  RemoveRounded,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  customQuantity,
  decrementQuantity,
  incrementQuantity,
  setCart,
} from "state";
import { RootState, useAppDispatch } from "store";

const CheckoutCart = () => {
  const isSmallScreen = useMediaQuery("(max-width:450px)");
  const isMediumScreen = useMediaQuery("(max-width:768px)");
  const imageUrl = process.env.REACT_APP_IMAGE_URL;
  const cart = useSelector((state: RootState) => state.global.cart);
  const dispatch = useAppDispatch();
  const formatNumberWithCommas = (number: string) => {
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <Box
      p="20px"
      sx={{
        overflow: "auto",
        maxHeight: "70vh",
        "&::-webkit-scrollbar": {
          width: "0.4em",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "gray",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "darkgray",
        },
      }}
    >
      {cart?.map((each) => (
        <Box
          sx={{
            borderBottom: "2px solid #E0E0E0",
            p: "10px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box
            component="img"
            src={`${imageUrl}/uploads/${each.imageName}`}
            width={isSmallScreen ? "30%" : "25%"}
            height={isSmallScreen ? "100px" : "150px"}
            sx={{
              borderRadius: "15px",
              objectFit: "cover",
              zIndex: 1,
            }}
          />
          <Box
            width={isSmallScreen ? "65%" : "70%"}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="start"
              >
                <Box>
                  <Typography
                    fontWeight="bold"
                    fontFamily="Playfair Display"
                    color="secondary"
                  >
                    {each.category}
                  </Typography>
                  <Typography fontWeight="bold" fontFamily="Nunito">
                    {each.name}
                  </Typography>
                </Box>
                <IconButton
                  onClick={() =>
                    dispatch(
                      setCart(cart.filter((item) => item._id !== each._id))
                    )
                  }
                >
                  <DeleteOutlineRounded sx={{ color: "#Ed981b" }} />
                </IconButton>
              </Box>
              <Typography
                fontSize="13px"
                fontStyle="italic"
                mt={isSmallScreen ? "" : "10px"}
              >
                {each.description.slice(0, 30)}...
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box width="40%">
                <IconButton
                  onClick={() => dispatch(decrementQuantity(each._id))}
                >
                  <RemoveRounded
                    sx={{ fontSize: isSmallScreen ? "16px" : "" }}
                  />
                </IconButton>
                <TextField
                  variant="standard"
                  value={String(each.quantity)}
                  sx={{ width: "20%" }}
                  inputProps={{
                    style: { textAlign: "center" },
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                  onChange={(e) => {
                    const itemId = each._id;
                    dispatch(
                      customQuantity({
                        itemId,
                        quantity: Number(e.target.value),
                      })
                    );
                  }}
                />
                <IconButton
                  onClick={() => dispatch(incrementQuantity(each._id))}
                >
                  <AddRounded sx={{ fontSize: isSmallScreen ? "16px" : "" }} />
                </IconButton>
              </Box>
              <Typography
                fontFamily="Playfair Display"
                color="primary"
                fontWeight="bold"
              >
                $
                {formatNumberWithCommas(
                  (
                    each.price *
                    each.quantity *
                    ((100 - each.discount) / 100)
                  ).toFixed(2)
                )}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default CheckoutCart;
