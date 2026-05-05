import React from "react";
import {
  Box, Button, Typography, useTheme, Divider,
} from "@mui/material";
import {
  AdminPanelSettingsRounded, EmailRounded, PhoneRounded, EditRounded,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { brand } from "../../theme";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  id: string;
  token: string;
}

const AdminAccount = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const borderColor = isDark ? "#27272E" : "#EBEBEB";

  const user: UserData | null = JSON.parse(localStorage.getItem("user") || "null");

  const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: "12px", py: "12px" }}>
      <Box sx={{
        width: "36px", height: "36px", borderRadius: "10px",
        backgroundColor: `${brand.primary}12`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {icon}
      </Box>
      <Box>
        <Typography fontFamily="Nunito" fontSize="0.72rem" color="text.disabled" letterSpacing="0.04em">
          {label.toUpperCase()}
        </Typography>
        <Typography fontFamily="Nunito" fontWeight={600} fontSize="0.92rem">
          {value || "—"}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ px: { xs: "16px", md: "24px" }, py: "13px", borderBottom: `1px solid ${borderColor}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography fontFamily="Playfair Display" fontWeight={900} fontSize="1.3rem">
            My Account
          </Typography>
          <Typography fontFamily="Nunito" fontSize="0.78rem" color="text.secondary">
            Admin overview
          </Typography>
        </Box>
      </Box>

      <Box sx={{ p: { xs: "16px", md: "24px" }, display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Profile card */}
        <Box
          sx={{
            borderRadius: "16px",
            border: `1px solid ${borderColor}`,
            backgroundColor: isDark ? "#09090D" : "#FAFAFA",
            overflow: "hidden",
          }}
        >
          {/* Card header */}
          <Box
            sx={{
              px: "20px", py: "20px",
              background: `linear-gradient(135deg, ${brand.primary}18, ${brand.primary}08)`,
              borderBottom: `1px solid ${borderColor}`,
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <Box
              sx={{
                width: "56px", height: "56px", borderRadius: "50%",
                background: `linear-gradient(135deg, ${brand.primary}, #0038CC)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Typography fontFamily="Playfair Display" fontWeight={900} fontSize="1.4rem" color="#fff">
                {user?.firstName?.[0]?.toUpperCase() || "A"}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography fontFamily="Playfair Display" fontWeight={900} fontSize="1.1rem">
                {user?.firstName} {user?.lastName}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "6px", mt: "4px" }}>
                <AdminPanelSettingsRounded sx={{ fontSize: "14px", color: brand.primary }} />
                <Typography fontFamily="Nunito" fontSize="0.78rem" color={brand.primary} fontWeight={700}>
                  Administrator
                </Typography>
              </Box>
            </Box>
            <Link to="/admin/account/management">
              <Button
                variant="contained"
                size="small"
                startIcon={<EditRounded sx={{ fontSize: "14px" }} />}
                sx={{ fontFamily: "Nunito", fontWeight: 700, fontSize: "0.8rem", px: "16px", borderRadius: "10px" }}
              >
                Edit
              </Button>
            </Link>
          </Box>

          {/* Info rows */}
          <Box sx={{ px: "20px" }}>
            <InfoRow
              icon={<EmailRounded sx={{ fontSize: "16px", color: brand.primary }} />}
              label="Email"
              value={user?.email || ""}
            />
            <Divider sx={{ borderColor }} />
            <InfoRow
              icon={<PhoneRounded sx={{ fontSize: "16px", color: brand.primary }} />}
              label="Phone"
              value={user?.phoneNumber || ""}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminAccount;
