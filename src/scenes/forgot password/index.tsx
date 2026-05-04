import { Box, Button, Input, InputLabel, FormControl, Typography } from "@mui/material";
import Footer from "components/Footer";
import Header from "components/Header";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
        setMessage(data.resetToken
          ? `Reset token: ${data.resetToken}`
          : "Check your email for a reset link."
        );
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
            Forgot Password
          </Typography>
          <Typography fontFamily="Nunito" fontSize="14px" color="text.secondary" mb="24px">
            Enter your account email and we'll send you a reset link.
          </Typography>

          {status === "success" ? (
            <Box>
              <Typography
                fontFamily="Nunito"
                fontSize="14px"
                sx={{
                  backgroundColor: "#e8f5e9",
                  p: "12px",
                  borderRadius: "6px",
                  wordBreak: "break-all",
                  mb: "16px",
                }}
              >
                {message}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{ borderRadius: "20px", textTransform: "none" }}
                onClick={() => navigate("/reset-password")}
              >
                <Typography color="white" fontFamily="Nunito" fontWeight="bold">
                  Enter Reset Code
                </Typography>
              </Button>
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth variant="outlined" sx={{ mb: "24px" }}>
                <InputLabel color="secondary">Email address</InputLabel>
                <Input
                  type="email"
                  required
                  color="secondary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  {loading ? "Sending…" : "Send Reset Link"}
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
            onClick={() => navigate("/signin")}
          >
            Back to Sign In
          </Typography>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default ForgotPassword;
