import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { MailOutlineRounded } from "@mui/icons-material";
import { brand } from "../../theme";

const Inbox = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const borderColor = isDark ? "#27272E" : "#EBEBEB";

  return (
    <Box sx={{ p: { xs: "16px", md: "28px" } }}>
      {/* Page header */}
      <Box sx={{ pb: "20px", borderBottom: `1px solid ${borderColor}`, mb: "24px" }}>
        <Typography fontFamily="Playfair Display" fontWeight={900} fontSize="1.3rem">
          Inbox
        </Typography>
        <Typography fontFamily="Nunito" fontSize="0.82rem" color="text.secondary" mt="2px">
          Messages and notifications from the store
        </Typography>
      </Box>

      {/* Empty state */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: "60px", textAlign: "center" }}>
        <Box sx={{
          width: "80px", height: "80px", borderRadius: "50%",
          backgroundColor: `${brand.secondary}12`,
          display: "flex", alignItems: "center", justifyContent: "center", mb: "20px",
        }}>
          <MailOutlineRounded sx={{ fontSize: "38px", color: brand.secondary }} />
        </Box>
        <Typography fontFamily="Playfair Display" fontWeight={700} fontSize="1.3rem" mb="10px">
          No messages yet
        </Typography>
        <Typography fontFamily="Nunito" color="text.secondary" fontSize="0.9rem" sx={{ maxWidth: "340px" }}>
          When we have updates, promotions, or news for you, they'll appear right here. Stay tuned!
        </Typography>
      </Box>
    </Box>
  );
};

export default Inbox;
