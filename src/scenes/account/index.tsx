import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import {
  EmailOutlined,
  LocalPhoneOutlined,
  LocationOnOutlined,
  PersonOutlineRounded,
  EditOutlined,
  AddRounded,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { brand } from "../../theme";

interface UserData {
  firstName: string; lastName: string; email: string;
  phoneNumber: string; role: string; id: string; token: string;
}

interface AddressData {
  _id: string; contactName: string; phoneNumber: string;
  user: string; isDefault: boolean; address: string;
  city: string; state: string; country: string;
  createdAt: string; updatedAt: string; __v: string;
}

const Account = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery("(max-width:600px)");
  const user: UserData | null = JSON.parse(localStorage.getItem("user") || "null");
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const borderColor = isDark ? "#27272E" : "#EBEBEB";

  useEffect(() => {
    fetch(`${baseUrl}/get/addresses/default/${user?.id}`)
      .then((r) => r.json())
      .then((d) => setAddresses(d))
      .catch(() => {});
  }, []);

  const defaultAddress = addresses[0];

  return (
    <Box sx={{ p: { xs: "16px", md: "28px" } }}>
      {/* Page title */}
      <Box sx={{ pb: "20px", borderBottom: `1px solid ${borderColor}`, mb: "24px" }}>
        <Typography fontFamily="Playfair Display" fontWeight={900} fontSize="1.3rem">
          My Account
        </Typography>
        <Typography fontFamily="Nunito" fontSize="0.82rem" color="text.secondary" mt="2px">
          Manage your profile and delivery details
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
          gap: "16px",
        }}
      >
        {/* Account details card */}
        <Box
          sx={{
            borderRadius: "14px",
            border: `1px solid ${borderColor}`,
            backgroundColor: isDark ? "#09090D" : "#FFFFFF",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              px: "18px", py: "14px",
              borderBottom: `1px solid ${borderColor}`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}
          >
            <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.8rem"
              letterSpacing="0.06em" color="text.secondary" sx={{ textTransform: "uppercase" }}>
              Account Details
            </Typography>
            <Link to="/customer/account/management">
              <Box sx={{
                display: "flex", alignItems: "center", gap: "5px",
                color: brand.primary, cursor: "pointer",
              }}>
                <EditOutlined sx={{ fontSize: "14px" }} />
                <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.75rem" color={brand.primary}>
                  Edit
                </Typography>
              </Box>
            </Link>
          </Box>

          <Box sx={{ p: "18px" }}>
            {/* Avatar */}
            <Box sx={{ display: "flex", alignItems: "center", gap: "14px", mb: "20px" }}>
              <Box
                sx={{
                  width: "52px", height: "52px", borderRadius: "50%",
                  backgroundColor: `${brand.primary}20`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Typography
                  fontFamily="Playfair Display"
                  fontWeight={900}
                  fontSize="1.1rem"
                  color={brand.primary}
                >
                  {user?.firstName?.[0]?.toUpperCase()}
                </Typography>
              </Box>
              <Box>
                <Typography fontFamily="Nunito" fontWeight={800} fontSize="1rem">
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Box sx={{
                  display: "inline-block", px: "8px", py: "2px", borderRadius: "100px",
                  backgroundColor: `${brand.secondary}18`, mt: "3px",
                }}>
                  <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.7rem" color={brand.secondary}>
                    {user?.role === "user" ? "Customer" : "Admin"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ borderColor, mb: "16px" }} />

            {[
              { icon: <EmailOutlined sx={{ fontSize: "15px" }} />, value: user?.email },
              { icon: <LocalPhoneOutlined sx={{ fontSize: "15px" }} />, value: user?.phoneNumber || "Not set" },
            ].map(({ icon, value }) => (
              <Box key={value} sx={{ display: "flex", alignItems: "center", gap: "10px", mb: "12px" }}>
                <Box sx={{ color: theme.palette.text.disabled, flexShrink: 0 }}>{icon}</Box>
                <Typography fontFamily="Nunito" fontSize="0.88rem" color="text.secondary">
                  {value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Address book card */}
        <Box
          sx={{
            borderRadius: "14px",
            border: `1px solid ${borderColor}`,
            backgroundColor: isDark ? "#09090D" : "#FFFFFF",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              px: "18px", py: "14px",
              borderBottom: `1px solid ${borderColor}`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}
          >
            <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.8rem"
              letterSpacing="0.06em" color="text.secondary" sx={{ textTransform: "uppercase" }}>
              Default Address
            </Typography>
            <Link to="/customer/addresses">
              <Box sx={{ display: "flex", alignItems: "center", gap: "5px", color: brand.primary }}>
                <EditOutlined sx={{ fontSize: "14px" }} />
                <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.75rem" color={brand.primary}>
                  Manage
                </Typography>
              </Box>
            </Link>
          </Box>

          <Box sx={{ p: "18px" }}>
            {defaultAddress ? (
              <>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: "10px", mb: "12px" }}>
                  <LocationOnOutlined sx={{ fontSize: "18px", color: brand.primary, mt: "1px", flexShrink: 0 }} />
                  <Box>
                    <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.9rem" mb="4px">
                      {defaultAddress.contactName}
                    </Typography>
                    <Typography fontFamily="Nunito" fontSize="0.85rem" color="text.secondary" lineHeight={1.65}>
                      {defaultAddress.address}<br />
                      {defaultAddress.city}, {defaultAddress.state}<br />
                      {defaultAddress.country}
                    </Typography>
                    <Typography fontFamily="Nunito" fontSize="0.8rem" color="text.secondary" mt="6px">
                      {defaultAddress.phoneNumber}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{
                  display: "inline-block", px: "10px", py: "4px", borderRadius: "100px",
                  backgroundColor: `${brand.primary}15`,
                }}>
                  <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.72rem" color={brand.primary}>
                    Default delivery address
                  </Typography>
                </Box>
              </>
            ) : (
              <Box sx={{ textAlign: "center", py: "24px" }}>
                <LocationOnOutlined sx={{ fontSize: "32px", color: theme.palette.text.disabled, mb: "8px" }} />
                <Typography fontFamily="Nunito" fontWeight={600} color="text.secondary" fontSize="0.88rem">
                  No default address set
                </Typography>
                <Link to="/customer/addresses/add">
                  <Button
                    variant="contained"
                    startIcon={<AddRounded />}
                    size="small"
                    sx={{ mt: "14px", borderRadius: "100px", fontFamily: "Nunito", fontWeight: 700 }}
                  >
                    Add Address
                  </Button>
                </Link>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Account;
