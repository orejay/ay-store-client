import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Toast from "components/Toast";
import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import PasswordStrengthMeter from "components/PasswordStrengthMeter";
import { brand } from "../../theme";

interface BodyState {
  password: string;
  oldPassword: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  id: string;
  token: string;
}

const ChangePassword = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const borderColor = isDark ? "#27272E" : "#EBEBEB";
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });
  const showToast = (message: string, severity: "success" | "error") => setToast({ open: true, message, severity });
  const [checkPass, setCheckPass] = useState("");
  const [newPasswordTouched, setNewPasswordTouched] = useState(false);

  const user: UserData | null = JSON.parse(
    localStorage.getItem("user") || "null"
  ) as UserData | null;

  const [body, setBody] = useState<BodyState>({ password: "", oldPassword: "" });

  const changePassword = async () => {
    try {
      const response = await fetch(`${baseUrl}/auth/password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(body),
      });
      const jsonData = await response.json();

      if (response.status === 401 && jsonData.message === "Incorrect password!") {
        showToast("Current password is incorrect.", "error");
      } else if (response.ok) {
        showToast("Password changed successfully!", "success");
        setBody({ password: "", oldPassword: "" });
        setCheckPass("");
      } else {
        showToast("Something went wrong!", "error");
      }
    } catch {
      showToast("Something went wrong!", "error");
    }
  };

  const passwordMismatch = checkPass.length >= 3 && checkPass !== body.password;
  const newPasswordTooShort = newPasswordTouched && body.password.length > 0 && body.password.length < 6;
  const isDisabled =
    !body.oldPassword || !body.password || !checkPass || passwordMismatch || body.password.length < 6;

  return (
    <Box sx={{ p: { xs: "16px", md: "28px" } }}>
      {/* Page header */}
      <Box sx={{ pb: "20px", borderBottom: `1px solid ${borderColor}`, mb: "24px" }}>
        <Typography fontFamily="Playfair Display" fontWeight={900} fontSize="1.3rem">
          Change Password
        </Typography>
        <Typography fontFamily="Nunito" fontSize="0.82rem" color="text.secondary" mt="2px">
          Keep your account secure with a strong password
        </Typography>
      </Box>

      <Toast open={toast.open} message={toast.message} severity={toast.severity} onClose={() => setToast((t) => ({ ...t, open: false }))} />

      {/* Security tip */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          p: "14px",
          borderRadius: "12px",
          backgroundColor: `${brand.secondary}0D`,
          border: `1px solid ${brand.secondary}28`,
          mb: "28px",
        }}
      >
        <LockOutlined
          sx={{ fontSize: "18px", color: brand.secondary, mt: "1px", flexShrink: 0 }}
        />
        <Typography fontFamily="Nunito" fontSize="0.82rem" color="text.secondary" lineHeight={1.65}>
          Use at least 8 characters with a mix of letters, numbers, and symbols for a strong password.
        </Typography>
      </Box>

      {/* Form */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          maxWidth: { xs: "100%", sm: "480px" },
        }}
      >
        <TextField
          label="Current Password"
          type={showOldPassword ? "text" : "password"}
          value={body.oldPassword}
          onChange={(e) => setBody((b) => ({ ...b, oldPassword: e.target.value }))}
          fullWidth
          inputProps={{ style: { fontFamily: "Nunito" } }}
          InputLabelProps={{ style: { fontFamily: "Nunito" } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  edge="end"
                  size="small"
                >
                  {showOldPassword ? (
                    <VisibilityOff sx={{ fontSize: "18px" }} />
                  ) : (
                    <Visibility sx={{ fontSize: "18px" }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box>
          <TextField
            label="New Password"
            type={showPassword ? "text" : "password"}
            value={body.password}
            onChange={(e) => setBody((b) => ({ ...b, password: e.target.value }))}
            onBlur={() => setNewPasswordTouched(true)}
            error={newPasswordTooShort}
            helperText={newPasswordTooShort ? "Password must be at least 6 characters" : ""}
            fullWidth
            inputProps={{ style: { fontFamily: "Nunito" } }}
            InputLabelProps={{ style: { fontFamily: "Nunito" } }}
            FormHelperTextProps={{ style: { fontFamily: "Nunito" } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? (
                      <VisibilityOff sx={{ fontSize: "18px" }} />
                    ) : (
                      <Visibility sx={{ fontSize: "18px" }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <PasswordStrengthMeter password={body.password} />
        </Box>

        <TextField
          label="Confirm New Password"
          type={showConfirm ? "text" : "password"}
          value={checkPass}
          error={passwordMismatch}
          helperText={passwordMismatch ? "Passwords don't match" : ""}
          onChange={(e) => setCheckPass(e.target.value)}
          fullWidth
          inputProps={{ style: { fontFamily: "Nunito" } }}
          InputLabelProps={{ style: { fontFamily: "Nunito" } }}
          FormHelperTextProps={{ style: { fontFamily: "Nunito" } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirm(!showConfirm)}
                  edge="end"
                  size="small"
                >
                  {showConfirm ? (
                    <VisibilityOff sx={{ fontSize: "18px" }} />
                  ) : (
                    <Visibility sx={{ fontSize: "18px" }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ mt: "28px" }}>
        <Button
          variant="contained"
          onClick={changePassword}
          disabled={isDisabled}
          sx={{ px: "32px", py: "10px", fontSize: "0.9rem" }}
        >
          Update Password
        </Button>
      </Box>
    </Box>
  );
};

export default ChangePassword;
