import React, { useState } from "react";
import {
  Box, Button, TextField, Typography, useTheme, useMediaQuery,
  Alert, CircularProgress, Divider,
} from "@mui/material";
import {
  EmailOutlined, LocalPhoneOutlined, LocationOnOutlined,
  AccessTimeOutlined, CheckCircleRounded, SendRounded,
} from "@mui/icons-material";
import Footer from "components/Footer";
import Header from "components/Header";
import { brand } from "../../theme";

const contactDetails = [
  {
    icon: <EmailOutlined sx={{ fontSize: "20px" }} />,
    label: "Email",
    value: "hello@fashionero.com",
  },
  {
    icon: <LocalPhoneOutlined sx={{ fontSize: "20px" }} />,
    label: "Phone",
    value: "+234 800 000 0000",
  },
  {
    icon: <LocationOnOutlined sx={{ fontSize: "20px" }} />,
    label: "Address",
    value: "Lagos Island, Lagos, Nigeria",
  },
  {
    icon: <AccessTimeOutlined sx={{ fontSize: "20px" }} />,
    label: "Business Hours",
    value: "Mon – Fri, 9 AM – 6 PM WAT",
  },
];

const Contact = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery("(max-width:900px)");

  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const borderColor = isDark ? "#27272E" : "#EBEBEB";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setLoading(true);
    // Simulate submission — wire up to real endpoint when ready
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: theme.palette.background.default }}>
      <Header />

      {/* Page hero */}
      <Box
        sx={{
          pt: { xs: "100px", md: "120px" },
          pb: { xs: "48px", md: "60px" },
          px: { xs: "24px", md: "10%" },
          background: isDark
            ? `linear-gradient(160deg, #1A1208 0%, #0C0C0E 60%)`
            : `linear-gradient(160deg, #FEF3E2 0%, #FFFFFF 60%)`,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{
          position: "absolute", top: "-60px", right: "-60px",
          width: "320px", height: "320px", borderRadius: "50%",
          background: `radial-gradient(circle, ${brand.primary}18 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <Box sx={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          backgroundColor: `${brand.primary}15`,
          border: `1px solid ${brand.primary}30`,
          borderRadius: "100px", px: "14px", py: "6px", mb: "20px",
        }}>
          <EmailOutlined sx={{ fontSize: "14px", color: brand.primary }} />
          <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.8rem" color={brand.primary}>
            Get in Touch
          </Typography>
        </Box>
        <Typography variant="h3" fontFamily="Playfair Display" fontWeight={900} mb="14px"
          sx={{ fontSize: { xs: "1.9rem", md: "2.6rem" } }}>
          We'd Love to Hear From You
        </Typography>
        <Typography fontFamily="Nunito" color="text.secondary" fontSize="1rem"
          sx={{ maxWidth: "480px", mx: "auto", lineHeight: 1.75 }}>
          Have a question, feedback, or just want to say hello? Fill out the form and our team will get back to you within 24 hours.
        </Typography>
      </Box>

      {/* Main content */}
      <Box
        sx={{
          flex: 1,
          px: { xs: "16px", md: "10%" },
          py: { xs: "48px", md: "64px" },
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "28px",
          maxWidth: "1100px",
          mx: "auto",
          width: "100%",
        }}
      >
        {/* Left: contact info */}
        <Box sx={{ flex: isMobile ? "none" : "0 0 300px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Info card */}
          <Box sx={{
            borderRadius: "18px",
            border: `1px solid ${borderColor}`,
            backgroundColor: isDark ? "#18181C" : "#FFFFFF",
            overflow: "hidden",
          }}>
            <Box sx={{
              background: `linear-gradient(135deg, ${brand.primary}, #0038CC)`,
              p: "24px",
            }}>
              <Typography fontFamily="Playfair Display" fontWeight={900} fontSize="1.2rem" color="#fff" mb="6px">
                FASHIONERO
              </Typography>
              <Typography fontFamily="Nunito" fontSize="0.88rem" sx={{ color: "rgba(255,255,255,0.8)" }}>
                Your trusted fashion destination
              </Typography>
            </Box>

            <Box sx={{ p: "20px", display: "flex", flexDirection: "column", gap: "0" }}>
              {contactDetails.map((item, i) => (
                <Box key={i}>
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: "14px", py: "16px" }}>
                    <Box sx={{
                      width: "38px", height: "38px", borderRadius: "10px", flexShrink: 0,
                      backgroundColor: `${brand.primary}15`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: brand.primary,
                    }}>
                      {item.icon}
                    </Box>
                    <Box>
                      <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.75rem"
                        color="text.secondary" textTransform="uppercase" letterSpacing="0.06em" mb="3px">
                        {item.label}
                      </Typography>
                      <Typography fontFamily="Nunito" fontSize="0.9rem" lineHeight={1.55}>
                        {item.value}
                      </Typography>
                    </Box>
                  </Box>
                  {i < contactDetails.length - 1 && <Divider sx={{ borderColor }} />}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Response time badge */}
          <Box sx={{
            borderRadius: "14px",
            border: `1px solid ${isDark ? "#27272E" : "#E0F2FE"}`,
            backgroundColor: isDark ? "#0C1218" : "#F0F9FF",
            p: "16px 20px",
            display: "flex", alignItems: "center", gap: "12px",
          }}>
            <AccessTimeOutlined sx={{ fontSize: "18px", color: brand.secondary, flexShrink: 0 }} />
            <Typography fontFamily="Nunito" fontSize="0.85rem" color="text.secondary" lineHeight={1.6}>
              We typically respond within{" "}
              <Box component="span" sx={{ fontWeight: 700, color: brand.secondary }}>24 hours</Box>{" "}
              on business days.
            </Typography>
          </Box>
        </Box>

        {/* Right: form */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{
            borderRadius: "18px",
            border: `1px solid ${borderColor}`,
            backgroundColor: isDark ? "#18181C" : "#fff",
            boxShadow: isDark ? "0 8px 40px rgba(0,0,0,0.4)" : "0 8px 40px rgba(0,0,0,0.07)",
            p: { xs: "24px", md: "40px" },
          }}>
            {sent ? (
              /* ── Success state ── */
              <Box sx={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "18px", py: "24px" }}>
                <Box sx={{
                  width: "80px", height: "80px", borderRadius: "50%",
                  background: `linear-gradient(135deg, ${brand.primary}, #0038CC)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 12px 36px ${brand.primary}40`,
                  animation: "pop 0.4s ease",
                  "@keyframes pop": { "0%": { transform: "scale(0.6)", opacity: 0 }, "100%": { transform: "scale(1)", opacity: 1 } },
                }}>
                  <CheckCircleRounded sx={{ fontSize: "44px", color: "#fff" }} />
                </Box>
                <Box>
                  <Typography variant="h5" fontFamily="Playfair Display" fontWeight={700} mb="10px">
                    Message Sent!
                  </Typography>
                  <Typography fontFamily="Nunito" color="text.secondary" fontSize="0.95rem" lineHeight={1.7} sx={{ maxWidth: "360px", mx: "auto" }}>
                    Thanks for reaching out, <strong>{form.name.split(" ")[0]}</strong>. We'll get back to you at <strong>{form.email}</strong> within 24 hours.
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", message: "" }); }}
                  sx={{ mt: "8px", borderRadius: "100px", fontFamily: "Nunito", fontWeight: 700, px: "28px" }}
                >
                  Send Another Message
                </Button>
              </Box>
            ) : (
              /* ── Form ── */
              <>
                <Typography variant="h5" fontFamily="Playfair Display" fontWeight={700} mb="6px">
                  Send a Message
                </Typography>
                <Typography fontFamily="Nunito" color="text.secondary" fontSize="0.9rem" mb="28px">
                  Fill in the details below and we'll be in touch soon.
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ mb: "20px", borderRadius: "10px", fontFamily: "Nunito", fontSize: "0.85rem" }} onClose={() => setError("")}>
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: "16px", mb: "16px" }}>
                    <TextField
                      label="Full Name"
                      type="text"
                      fullWidth
                      required
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    />
                    <TextField
                      label="Email Address"
                      type="email"
                      fullWidth
                      required
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    />
                  </Box>

                  <TextField
                    label="Phone Number (optional)"
                    type="tel"
                    fullWidth
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    sx={{ mb: "16px" }}
                  />

                  <TextField
                    label="Your Message"
                    type="text"
                    fullWidth
                    required
                    multiline
                    minRows={5}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    sx={{ mb: "28px" }}
                    placeholder="Tell us how we can help…"
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading}
                    endIcon={!loading && <SendRounded sx={{ fontSize: "18px" }} />}
                    sx={{ py: "14px", fontSize: "1rem" }}
                  >
                    {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Send Message"}
                  </Button>
                </form>
              </>
            )}
          </Box>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default Contact;
