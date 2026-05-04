import React, { useState } from "react";
import {
  Box, Button, TextField, Typography, useTheme,
  InputAdornment, IconButton, Alert, CircularProgress,
} from "@mui/material";
import { VisibilityOffRounded, VisibilityRounded, LockResetRounded, CheckCircleRounded, StorefrontRounded } from "@mui/icons-material";
import Footer from "components/Footer";
import Header from "components/Header";
import { Link, useNavigate } from "react-router-dom";
import { brand } from "../../theme";

const ResetPassword = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const borderColor = isDark ? "#27272E" : "#EBEBEB";
  const mismatch = confirm.length > 0 && confirm !== password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setStatus("error"); setMessage("Passwords do not match."); return; }
    if (password.length < 6) { setStatus("error"); setMessage("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("Password reset successfully!");
      } else {
        setStatus("error");
        setMessage(data.message || "Invalid or expired token.");
      }
    } catch {
      setStatus("error");
      setMessage("Unable to reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: theme.palette.background.default }}>
      <Header />
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", pt: "90px", pb: "60px", px: "16px" }}>

        <Box sx={{
          width: "100%", maxWidth: "460px",
          backgroundColor: isDark ? "#16161A" : "#fff",
          borderRadius: "20px",
          border: `1px solid ${borderColor}`,
          boxShadow: isDark ? "0 8px 48px rgba(0,0,0,0.45)" : "0 8px 48px rgba(0,0,0,0.08)",
          p: { xs: "28px 24px", md: "44px 40px" },
        }}>
          {/* Brand mark */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: "32px" }}>
            <Box sx={{
              width: "38px", height: "38px", borderRadius: "10px",
              background: `linear-gradient(135deg, ${brand.primary}, #D4800A)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 4px 12px ${brand.primary}40`,
            }}>
              <StorefrontRounded sx={{ fontSize: "20px", color: "#fff" }} />
            </Box>
            <Typography fontFamily="Playfair Display" fontWeight={900} fontSize="1.15rem">
              AY Store
            </Typography>
          </Box>

          {status === "success" ? (
            <Box sx={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
              <Box sx={{
                width: "72px", height: "72px", borderRadius: "50%",
                background: `linear-gradient(135deg, ${brand.primary}, #D4800A)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 12px 32px ${brand.primary}40`,
              }}>
                <CheckCircleRounded sx={{ fontSize: "38px", color: "#fff" }} />
              </Box>
              <Typography variant="h5" fontFamily="Playfair Display" fontWeight={700}>
                Password Reset!
              </Typography>
              <Typography fontFamily="Nunito" color="text.secondary" fontSize="0.9rem" textAlign="center">
                Your password has been updated. You can now sign in with your new password.
              </Typography>
              <Button variant="contained" fullWidth size="large" onClick={() => navigate("/signin")} sx={{ py: "14px", mt: "8px" }}>
                Sign In
              </Button>
            </Box>
          ) : (
            <>
              <Box sx={{ display: "flex", alignItems: "center", gap: "12px", mb: "24px" }}>
                <Box sx={{
                  width: "42px", height: "42px", borderRadius: "10px",
                  backgroundColor: `${brand.primary}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <LockResetRounded sx={{ fontSize: "22px", color: brand.primary }} />
                </Box>
                <Box>
                  <Typography variant="h5" fontFamily="Playfair Display" fontWeight={700} mb="2px">
                    Reset Password
                  </Typography>
                  <Typography fontFamily="Nunito" color="text.secondary" fontSize="0.85rem">
                    Enter the reset code from your email.
                  </Typography>
                </Box>
              </Box>

              {status === "error" && (
                <Alert severity="error" sx={{ mb: "20px", borderRadius: "10px", fontFamily: "Nunito", fontSize: "0.85rem" }} onClose={() => setStatus("idle")}>
                  {message}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  label="Reset Code"
                  fullWidth
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  sx={{ mb: "16px" }}
                  placeholder="Paste your reset code here"
                />
                <TextField
                  label="New Password"
                  type={showPw ? "text" : "password"}
                  fullWidth
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPw(!showPw)} size="small" edge="end">
                          {showPw ? <VisibilityOffRounded sx={{ fontSize: "19px" }} /> : <VisibilityRounded sx={{ fontSize: "19px" }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: "16px" }}
                />
                <TextField
                  label="Confirm New Password"
                  type={showPw ? "text" : "password"}
                  fullWidth
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  error={mismatch}
                  helperText={mismatch ? "Passwords don't match" : ""}
                  sx={{ mb: "28px" }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading || mismatch}
                  sx={{ py: "14px", fontSize: "1rem", mb: "22px" }}
                >
                  {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Reset Password"}
                </Button>
              </form>
            </>
          )}

          <Typography fontFamily="Nunito" fontSize="0.87rem" textAlign="center" color="text.secondary">
            <Link to="/forgot-password" style={{ color: brand.secondary, fontWeight: 600 }}>
              ← Back to Forgot Password
            </Link>
          </Typography>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default ResetPassword;
