import React from "react";
import { Box, IconButton, TextField, Typography, useTheme, useMediaQuery } from "@mui/material";
import { AddRounded, DeleteOutlineRounded, RemoveRounded } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { customQuantity, decrementQuantity, incrementQuantity, setCart } from "state";
import { RootState, useAppDispatch } from "store";
import { brand } from "../theme";

const CheckoutCart = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isSmall = useMediaQuery("(max-width:480px)");
  const imageUrl = import.meta.env.VITE_IMAGE_URL;
  const cart = useSelector((state: RootState) => state.global.cart);
  const dispatch = useAppDispatch();

  const fmt = (n: string) => n.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const borderColor = isDark ? "#27272E" : "#F3F4F6";

  return (
    <Box sx={{ overflowY: "auto", maxHeight: "65vh", p: { xs: "12px", md: "20px" } }}>
      {cart.map((each, i) => (
        <Box
          key={each._id}
          sx={{
            display: "flex",
            gap: "14px",
            alignItems: "flex-start",
            py: "16px",
            borderBottom: i < cart.length - 1 ? `1px solid ${borderColor}` : "none",
          }}
        >
          {/* Image */}
          <Box
            component="img"
            src={`${imageUrl}/uploads/${each.imageName}`}
            alt={each.name}
            sx={{
              width: isSmall ? "72px" : "88px",
              height: isSmall ? "72px" : "88px",
              borderRadius: "10px",
              objectFit: "cover",
              flexShrink: 0,
              backgroundColor: isDark ? "#27272E" : "#F3F4F6",
            }}
          />

          {/* Details */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  fontFamily="Nunito"
                  fontWeight={700}
                  fontSize={{ xs: "0.85rem", md: "0.95rem" }}
                  noWrap
                >
                  {each.name[0].toUpperCase()}{each.name.slice(1)}
                </Typography>
                <Typography fontFamily="Nunito" fontSize="0.75rem" color={brand.secondary} fontWeight={600}>
                  {each.category[0].toUpperCase()}{each.category.slice(1)}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => dispatch(setCart(cart.filter((item) => item._id !== each._id)))}
                sx={{
                  color: theme.palette.text.disabled,
                  p: "4px",
                  ml: "6px",
                  flexShrink: 0,
                  "&:hover": { color: "#EF4444" },
                }}
              >
                <DeleteOutlineRounded sx={{ fontSize: "17px" }} />
              </IconButton>
            </Box>

            <Typography fontFamily="Nunito" fontSize="0.75rem" color="text.secondary" mt="4px" noWrap>
              {each.description.slice(0, 40)}…
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "10px" }}>
              {/* Qty controls */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  border: `1px solid ${borderColor}`,
                  borderRadius: "100px",
                  overflow: "hidden",
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => dispatch(decrementQuantity(each._id))}
                  sx={{ p: "4px", borderRadius: 0, color: theme.palette.text.secondary }}
                >
                  <RemoveRounded sx={{ fontSize: "14px" }} />
                </IconButton>
                <TextField
                  variant="standard"
                  value={String(each.quantity)}
                  onChange={(e) =>
                    dispatch(customQuantity({ itemId: each._id, quantity: Number(e.target.value) }))
                  }
                  InputProps={{ disableUnderline: true }}
                  inputProps={{
                    style: { textAlign: "center", fontFamily: "Nunito", fontWeight: 700, fontSize: "0.82rem", width: "28px", padding: 0 },
                    inputMode: "numeric",
                  }}
                  sx={{ "& input": { p: 0 } }}
                />
                <IconButton
                  size="small"
                  onClick={() => dispatch(incrementQuantity(each._id))}
                  sx={{ p: "4px", borderRadius: 0, color: theme.palette.text.secondary }}
                >
                  <AddRounded sx={{ fontSize: "14px" }} />
                </IconButton>
              </Box>

              {/* Line total */}
              <Typography fontFamily="Nunito" fontWeight={800} fontSize="0.95rem" color="primary">
                ${fmt((each.price * each.quantity * ((100 - each.discount) / 100)).toFixed(2))}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default CheckoutCart;
