import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { AddRounded, CheckRounded, LocationOnOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setDeliveryAddress, setInstructions, setPrevPage } from "state";
import { RootState, useAppDispatch } from "store";
import { brand } from "../theme";

interface AddressData {
  _id: string; contactName: string; phoneNumber: string;
  user: string; isDefault: boolean; address: string;
  city: string; state: string; country: string;
  createdAt: string; updatedAt: string; __v: string;
}

interface UserData {
  firstName: string; lastName: string; email: string;
  phoneNumber: string; role: string; id: string; token: string;
}

const DeliveryDetails = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery("(max-width:600px)");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const deliveryAddress = useSelector((state: RootState) => state.global.deliveryAddress);
  const deliveryInstructions = useSelector((state: RootState) => state.global.instructions);
  const [data, setData] = useState<AddressData[]>([]);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const user: UserData | null = JSON.parse(localStorage.getItem("user") || "null");
  const { pathname } = useLocation();
  const borderColor = isDark ? "#27272E" : "#EBEBEB";

  const getAddresses = async () => {
    try {
      const res = await fetch(`${baseUrl}/get/addresses`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const json = await res.json();
      setData(json);
      const def = json.find((a: AddressData) => a.isDefault);
      if (def) dispatch(setDeliveryAddress(def));
    } catch { /* silent */ }
  };

  const makeDefault = async (id: string) => {
    try {
      await fetch(`${baseUrl}/edit/addresses/set-default/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      getAddresses();
    } catch { /* silent */ }
  };

  useEffect(() => { getAddresses(); }, []);

  return (
    <Box sx={{ p: { xs: "16px", md: "24px" } }}>
      <Typography fontFamily="Nunito" fontWeight={800} fontSize="0.9rem"
        letterSpacing="0.06em" color="text.secondary" mb="16px"
        sx={{ textTransform: "uppercase" }}>
        Select Delivery Address
      </Typography>

      {data.length === 0 ? (
        <Box
          sx={{
            textAlign: "center", py: "40px",
            border: `1px dashed ${borderColor}`, borderRadius: "12px",
          }}
        >
          <LocationOnOutlined sx={{ fontSize: "36px", color: theme.palette.text.disabled, mb: "10px" }} />
          <Typography fontFamily="Nunito" fontWeight={600} color="text.secondary" fontSize="0.9rem">
            No saved addresses
          </Typography>
        </Box>
      ) : (
        <Box sx={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)",
          gap: "12px",
          mb: "20px",
        }}>
          {data.map((each) => {
            const isSelected = deliveryAddress?._id === each._id;
            return (
              <Box
                key={each._id}
                onClick={() => makeDefault(each._id)}
                sx={{
                  borderRadius: "12px",
                  border: `1.5px solid ${isSelected ? brand.primary : borderColor}`,
                  backgroundColor: isSelected
                    ? `${brand.primary}08`
                    : isDark ? "#16161A" : "#FAFAFA",
                  p: "16px",
                  cursor: "pointer",
                  position: "relative",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: brand.primary,
                    backgroundColor: `${brand.primary}06`,
                  },
                }}
              >
                {isSelected && (
                  <Box sx={{
                    position: "absolute", top: "12px", right: "12px",
                    width: "20px", height: "20px", borderRadius: "50%",
                    backgroundColor: brand.primary,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <CheckRounded sx={{ fontSize: "13px", color: "#fff" }} />
                  </Box>
                )}
                <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.9rem" mb="6px">
                  {each.contactName}
                </Typography>
                <Typography fontFamily="Nunito" fontSize="0.82rem" color="text.secondary" lineHeight={1.65}>
                  {each.address}<br />
                  {each.city}, {each.state}<br />
                  {each.country}
                </Typography>
                <Typography fontFamily="Nunito" fontSize="0.78rem" color="text.secondary" mt="6px">
                  {each.phoneNumber}
                </Typography>
                {isSelected && (
                  <Box sx={{
                    mt: "10px", px: "10px", py: "4px", borderRadius: "100px",
                    backgroundColor: `${brand.primary}18`, display: "inline-block",
                  }}>
                    <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.7rem" color={brand.primary}>
                      Delivery address
                    </Typography>
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      )}

      <Button
        variant="outlined"
        startIcon={<AddRounded />}
        onClick={() => { dispatch(setPrevPage(pathname)); navigate("/customer/addresses/add"); }}
        sx={{
          borderRadius: "100px",
          fontFamily: "Nunito",
          fontWeight: 700,
          fontSize: "0.85rem",
          textTransform: "none",
          borderColor: brand.primary,
          color: brand.primary,
          "&:hover": { backgroundColor: `${brand.primary}0A` },
        }}
      >
        Add New Address
      </Button>

      {/* Additional instructions */}
      <Box sx={{ mt: "28px", pt: "24px", borderTop: `1px solid ${borderColor}` }}>
        <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.85rem" mb="12px">
          Additional Instructions
        </Typography>
        <TextField
          placeholder="Notes for delivery (optional)…"
          multiline
          minRows={3}
          fullWidth
          defaultValue={deliveryInstructions}
          onBlur={(e) => dispatch(setInstructions(e.target.value))}
          onChange={(e) => dispatch(setInstructions(e.target.value))}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              fontFamily: "Nunito",
              fontSize: "0.88rem",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default DeliveryDetails;
