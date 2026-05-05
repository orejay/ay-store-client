import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  InputAdornment,
  IconButton,
  Alert,
  LinearProgress,
} from "@mui/material";
import {
  VisibilityOff,
  Visibility,
  CheckCircleRounded,
} from "@mui/icons-material";
import blueLogo from "../../assets/Blue-logo-icon.png";
import whiteLogo from "../../assets/White-logo-icon.png";
import Header from "components/Header";
import { Link, useNavigate } from "react-router-dom";
import Footer from "components/Footer";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { brand } from "../../theme";
import { isValidEmail } from "../../utils/validate";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  _id: string;
  token: string;
}

const SignIn = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UserData | null>(null);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const prevPage = useSelector((state: RootState) => state.global.prevPage);
  const navigate = useNavigate();
  const [body, setBody] = useState({ password: "", email: "" });
  const [emailTouched, setEmailTouched] = useState(false);

  const borderColor = isDark ? "#27272E" : "#EBEBEB";
  const emailError =
    emailTouched && body.email.length > 0 && !isValidEmail(body.email);

  const signIn = async () => {
    setEmailTouched(true);
    if (body.email && !isValidEmail(body.email)) return;
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const jsonData = await response.json();
      if (response.status === 404)
        setError("No account found with this email.");
      else if (response.status === 401)
        setError("Incorrect password. Please try again.");
      else if (response.ok) {
        setData(jsonData.userData);
        setIsSignedIn(true);
        localStorage.setItem("token", jsonData.userData.token);
        localStorage.setItem("user", JSON.stringify(jsonData.userData));
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Unable to connect. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      setTimeout(() => {
        if (data?.role === "user") {
          prevPage === "" ? navigate("/customer/account") : navigate(prevPage);
        } else {
          navigate("/admin/account");
        }
      }, 2500);
    }
  }, [isSignedIn, navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Header />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pt: "90px",
          pb: "60px",
          px: "16px",
        }}
      >
        {isSignedIn ? (
          <Box
            sx={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
              maxWidth: "360px",
            }}
          >
            <Box
              sx={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${brand.primary}, #0038CC)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 12px 40px ${brand.primary}45`,
                animation: "pop 0.4s ease",
                "@keyframes pop": {
                  "0%": { transform: "scale(0.6)", opacity: 0 },
                  "100%": { transform: "scale(1)", opacity: 1 },
                },
              }}
            >
              <CheckCircleRounded sx={{ fontSize: "50px", color: "#fff" }} />
            </Box>
            <Box>
              <Typography
                variant="h4"
                fontFamily="Playfair Display"
                fontWeight={900}
                mb="8px"
              >
                Welcome back, {data?.firstName}!
              </Typography>
              <Typography
                fontFamily="Nunito"
                color="text.secondary"
                fontSize="0.95rem"
              >
                Taking you to your dashboard…
              </Typography>
            </Box>
            <LinearProgress
              color="primary"
              sx={{
                width: "180px",
                borderRadius: "100px",
                height: "5px",
                backgroundColor: `${brand.primary}25`,
              }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",
              maxWidth: "460px",
              backgroundColor: isDark ? "#18181C" : "#fff",
              borderRadius: "20px",
              border: `1px solid ${borderColor}`,
              boxShadow: isDark
                ? "0 8px 48px rgba(0,0,0,0.45)"
                : "0 8px 48px rgba(0,0,0,0.08)",
              p: { xs: "28px 24px", md: "44px 40px" },
            }}
          >
            {/* Brand mark */}
            <Box sx={{ mb: "32px", display: "flex", justifyContent: "center" }}>
              <Box
                component="img"
                src={isDark ? whiteLogo : blueLogo}
                alt="Fashionero"
                sx={{ height: "72px", width: "auto", display: "block" }}
              />
            </Box>

            <Typography
              variant="h5"
              fontFamily="Playfair Display"
              fontWeight={700}
              mb="6px"
            >
              Sign In
            </Typography>
            <Typography
              fontFamily="Nunito"
              color="text.secondary"
              fontSize="0.9rem"
              mb="28px"
            >
              Welcome back! Enter your credentials to continue.
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: "20px",
                  borderRadius: "10px",
                  fontFamily: "Nunito",
                  fontSize: "0.85rem",
                }}
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}

            <TextField
              label="Email address"
              type="email"
              fullWidth
              required
              value={body.email}
              onChange={(e) =>
                setBody((b) => ({ ...b, email: e.target.value }))
              }
              onBlur={() => setEmailTouched(true)}
              error={emailError}
              helperText={emailError ? "Enter a valid email address" : ""}
              FormHelperTextProps={{ style: { fontFamily: "Nunito" } }}
              sx={{ mb: "16px" }}
            />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              value={body.password}
              onChange={(e) =>
                setBody((b) => ({ ...b, password: e.target.value }))
              }
              onKeyDown={(e) => e.key === "Enter" && signIn()}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      size="small"
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff sx={{ fontSize: "19px" }} />
                      ) : (
                        <Visibility sx={{ fontSize: "19px" }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: "10px" }}
            />

            <Box
              sx={{ display: "flex", justifyContent: "flex-end", mb: "28px" }}
            >
              <Link
                to="/forgot-password"
                style={{
                  color: brand.secondary,
                  fontFamily: "Nunito",
                  fontSize: "0.83rem",
                  fontStyle: "italic",
                  fontWeight: 600,
                }}
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={signIn}
              disabled={loading}
              sx={{
                py: "14px",
                fontSize: "1rem",
                mb: "22px",
                letterSpacing: "0.02em",
              }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </Button>

            <Typography
              fontFamily="Nunito"
              fontSize="0.88rem"
              textAlign="center"
              color="text.secondary"
            >
              Don't have an account?{" "}
              <Link
                to="/signup"
                style={{ color: brand.primary, fontWeight: 700 }}
              >
                Create account
              </Link>
            </Typography>
          </Box>
        )}
      </Box>
      <Footer />
    </Box>
  );
};

export default SignIn;
