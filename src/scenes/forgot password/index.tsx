import React, { useState } from "react";
import {
  Box, Button, TextField, Typography, useTheme, Alert, CircularProgress,
} from "@mui/material";
import { MarkEmailReadRounded } from "@mui/icons-material";
import blueLogoFull from "../../assets/Blue-logo-full.png";
import whiteLogoFull from "../../assets/White-logo-full.png";
import Footer from "components/Footer";
import Header from "components/Header";
import { Link, useNavigate } from "react-router-dom";
import { brand } from "../../theme";

const ForgotPassword = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const borderColor = isDark ? "#27272E" : "#EBEBEB";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.resetToken ? `Reset token: ${data.resetToken}` : "Check your email for a reset link.");
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong.");
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
          backgroundColor: isDark ? "#18181C" : "#fff",
          borderRadius: "20px",
          border: `1px solid ${borderColor}`,
          boxShadow: isDark ? "0 8px 48px rgba(0,0,0,0.45)" : "0 8px 48px rgba(0,0,0,0.08)",
          p: { xs: "28px 24px", md: "44px 40px" },
        }}>
          {/* Brand mark */}
          <Box sx={{ mb: "32px" }}>
            <Box
              component="img"
              src={isDark ? whiteLogoFull : blueLogoFull}
              alt="Fashionero"
              sx={{ height: "32px", width: "auto", display: "block" }}
            />
          </Box>

          {status === "success" ? (
            <Box sx={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
              <Box sx={{
                width: "72px", height: "72px", borderRadius: "50%",
                backgroundColor: `${brand.secondary}18`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <MarkEmailReadRounded sx={{ fontSize: "38px", color: brand.secondary }} />
              </Box>
              <Typography variant="h5" fontFamily="Playfair Display" fontWeight={700}>
                Check Your Email
              </Typography>
              <Typography fontFamily="Nunito" color="text.secondary" fontSize="0.9rem" textAlign="center">
                We've sent password reset instructions to <strong>{email}</strong>
              </Typography>
              {message.startsWith("Reset token:") && (
                <Box sx={{
                  backgroundColor: isDark ? "#1E2A1F" : "#F0FAF4",
                  border: `1px solid ${isDark ? "#2D4A2F" : "#BBF7D0"}`,
                  borderRadius: "10px", p: "14px", width: "100%",
                }}>
                  <Typography fontFamily="Nunito" fontSize="0.82rem" color="text.secondary" mb="4px">Reset Token</Typography>
                  <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.9rem" sx={{ wordBreak: "break-all" }}>
                    {message.replace("Reset token: ", "")}
                  </Typography>
                </Box>
              )}
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => navigate("/reset-password")}
                sx={{ py: "14px", mt: "8px" }}
              >
                Enter Reset Code
              </Button>
            </Box>
          ) : (
            <>
              <Typography variant="h5" fontFamily="Playfair Display" fontWeight={700} mb="6px">
                Forgot Password?
              </Typography>
              <Typography fontFamily="Nunito" color="text.secondary" fontSize="0.9rem" mb="28px">
                Enter your account email and we'll send you a reset link.
              </Typography>

              {status === "error" && (
                <Alert severity="error" sx={{ mb: "20px", borderRadius: "10px", fontFamily: "Nunito", fontSize: "0.85rem" }} onClose={() => setStatus("idle")}>
                  {message}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  label="Email address"
                  type="email"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: "24px" }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{ py: "14px", fontSize: "1rem", mb: "22px" }}
                >
                  {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Send Reset Link"}
                </Button>
              </form>
            </>
          )}

          <Typography fontFamily="Nunito" fontSize="0.87rem" textAlign="center" color="text.secondary" mt="8px">
            Remember your password?{" "}
            <Link to="/signin" style={{ color: brand.primary, fontWeight: 700 }}>
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default ForgotPassword;
