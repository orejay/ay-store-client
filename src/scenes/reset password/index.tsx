import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Typography,
} from "@mui/material";
import { VisibilityOffRounded, VisibilityRounded } from "@mui/icons-material";
import Footer from "components/Footer";
import Header from "components/Header";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setStatus("error");
      setMessage("Password must be at least 6 characters.");
      return;
    }
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
    <Box>
      <Header />
      <Box
        sx={{
          pt: "120px",
          pb: "80px",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "420px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "2px 2px 12px #E0E0E0",
            p: "36px",
          }}
        >
          <Typography
            variant="h5"
            fontFamily="Playfair Display"
            fontWeight="bold"
            color="secondary"
            mb="8px"
          >
            Reset Password
          </Typography>
          <Typography fontFamily="Nunito" fontSize="14px" color="text.secondary" mb="24px">
            Enter the reset code from your email and your new password.
          </Typography>

          {status === "success" ? (
            <Box display="flex" flexDirection="column" gap="16px">
              <Typography
                fontFamily="Nunito"
                fontSize="14px"
                sx={{ backgroundColor: "#e8f5e9", p: "12px", borderRadius: "6px" }}
              >
                {message}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{ borderRadius: "20px", textTransform: "none" }}
                onClick={() => navigate("/signin")}
              >
                <Typography color="white" fontFamily="Nunito" fontWeight="bold">
                  Sign In
                </Typography>
              </Button>
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth variant="outlined" sx={{ mb: "20px" }}>
                <InputLabel color="secondary">Reset Code</InputLabel>
                <Input
                  required
                  color="secondary"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
              </FormControl>

              <FormControl fullWidth variant="outlined" sx={{ mb: "20px" }}>
                <InputLabel color="secondary">New Password</InputLabel>
                <Input
                  required
                  type={showPw ? "text" : "password"}
                  color="secondary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPw(!showPw)} size="small">
                        {showPw ? <VisibilityOffRounded /> : <VisibilityRounded />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>

              <FormControl fullWidth variant="outlined" sx={{ mb: "20px" }}>
                <InputLabel color="secondary">Confirm New Password</InputLabel>
                <Input
                  required
                  type={showPw ? "text" : "password"}
                  color="secondary"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </FormControl>

              {status === "error" && (
                <Typography
                  fontFamily="Nunito"
                  fontSize="13px"
                  sx={{ color: "#d32f2f", mb: "12px" }}
                >
                  {message}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ borderRadius: "20px", textTransform: "none" }}
              >
                <Typography color="white" fontFamily="Nunito" fontWeight="bold">
                  {loading ? "Resetting…" : "Reset Password"}
                </Typography>
              </Button>
            </form>
          )}

          <Typography
            fontFamily="Nunito"
            fontSize="13px"
            textAlign="center"
            mt="20px"
            sx={{ cursor: "pointer", color: "#077488" }}
            onClick={() => navigate("/forgot-password")}
          >
            Back to Forgot Password
          </Typography>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default ResetPassword;
