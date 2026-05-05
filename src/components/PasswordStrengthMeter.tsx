import React from "react";
import { Box, Typography } from "@mui/material";
import { passwordStrength, STRENGTH_CONFIG } from "../utils/validate";

const PasswordStrengthMeter = ({ password }: { password: string }) => {
  const score = passwordStrength(password);
  if (!password) return null;
  const { label, color } = STRENGTH_CONFIG[score];

  return (
    <Box sx={{ mt: "8px" }}>
      <Box sx={{ display: "flex", gap: "4px", mb: "5px" }}>
        {([1, 2, 3, 4] as const).map((level) => (
          <Box
            key={level}
            sx={{
              flex: 1,
              height: "4px",
              borderRadius: "100px",
              backgroundColor: score >= level ? color : "divider",
              transition: "background-color 0.25s",
            }}
          />
        ))}
      </Box>
      <Typography
        fontFamily="Nunito"
        fontSize="0.75rem"
        fontWeight={600}
        sx={{ color, transition: "color 0.25s" }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default PasswordStrengthMeter;
