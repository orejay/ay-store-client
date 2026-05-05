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
  Grid,
} from "@mui/material";
import {
  VisibilityOff,
  Visibility,
  CheckCircleRounded,
} from "@mui/icons-material";
import blueLogo from "../../assets/Blue-logo-icon.png";
import whiteLogo from "../../assets/White-logo-icon.png";
import Header from "components/Header";
import PasswordStrengthMeter from "components/PasswordStrengthMeter";
import { Link, useNavigate } from "react-router-dom";
import Footer from "components/Footer";
import { brand } from "../../theme";
import { isValidEmail, isValidPhone } from "../../utils/validate";

interface BodyState {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  phoneNumber: string;
}

const SignUp = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const [body, setBody] = useState<BodyState>({
    firstName: "",
    lastName: "",
    password: "",
    email: "",
    phoneNumber: "",
  });
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phoneNumber: false,
    password: false,
  });

  const borderColor = isDark ? "#27272E" : "#EBEBEB";
  const passwordMismatch =
    confirmPassword.length > 0 && confirmPassword !== body.password;

  const touch = (field: keyof typeof touched) =>
    setTouched((t) => ({ ...t, [field]: true }));

  const emailError = touched.email && !isValidEmail(body.email);
  const phoneError =
    touched.phoneNumber &&
    body.phoneNumber.length > 0 &&
    !isValidPhone(body.phoneNumber);
  const firstNameError =
    touched.firstName && body.firstName.trim().length === 0;
  const lastNameError = touched.lastName && body.lastName.trim().length === 0;
  const passwordError =
    touched.password && body.password.length > 0 && body.password.length < 6;

  const signUp = async () => {
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      password: true,
    });
    if (
      !body.firstName.trim() ||
      !body.lastName.trim() ||
      !body.email ||
      !body.phoneNumber ||
      !body.password
    )
      return;
    if (!isValidEmail(body.email)) return;
    if (body.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (body.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const jsonData = await response.json();
      if (response.ok) {
        setIsSignedUp(true);
      } else {
        setError(jsonData.message || "Registration failed. Please try again.");
      }
    } catch {
      setError("Unable to connect. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSignedUp) {
      setTimeout(() => navigate("/signin"), 2800);
    }
  }, [isSignedUp, navigate]);

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
          pt: "100px",
          pb: "60px",
          px: "16px",
        }}
      >
        {isSignedUp ? (
          <Box
            sx={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
              maxWidth: "380px",
            }}
          >
            <Box
              sx={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${brand.success}, #059669)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 12px 40px ${brand.success}45`,
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
                Account Created!
              </Typography>
              <Typography
                fontFamily="Nunito"
                color="text.secondary"
                fontSize="0.95rem"
              >
                Welcome to Fashionero. Redirecting you to sign in…
              </Typography>
            </Box>
            <LinearProgress
              color="secondary"
              sx={{
                width: "180px",
                borderRadius: "100px",
                height: "5px",
                backgroundColor: `${brand.secondary}25`,
              }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",
              maxWidth: "520px",
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
              Create Account
            </Typography>
            <Typography
              fontFamily="Nunito"
              color="text.secondary"
              fontSize="0.9rem"
              mb="28px"
            >
              Join thousands of style lovers. It's free!
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

            <Grid container spacing={2} sx={{ mb: "16px" }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  type="text"
                  fullWidth
                  required
                  value={body.firstName}
                  onChange={(e) =>
                    setBody((b) => ({ ...b, firstName: e.target.value }))
                  }
                  onBlur={() => touch("firstName")}
                  error={firstNameError}
                  helperText={firstNameError ? "First name is required" : ""}
                  FormHelperTextProps={{ style: { fontFamily: "Nunito" } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  type="text"
                  fullWidth
                  required
                  value={body.lastName}
                  onChange={(e) =>
                    setBody((b) => ({ ...b, lastName: e.target.value }))
                  }
                  onBlur={() => touch("lastName")}
                  error={lastNameError}
                  helperText={lastNameError ? "Last name is required" : ""}
                  FormHelperTextProps={{ style: { fontFamily: "Nunito" } }}
                />
              </Grid>
            </Grid>

            <TextField
              label="Email address"
              type="email"
              fullWidth
              required
              value={body.email}
              onChange={(e) =>
                setBody((b) => ({ ...b, email: e.target.value }))
              }
              onBlur={() => touch("email")}
              error={emailError}
              helperText={emailError ? "Enter a valid email address" : ""}
              FormHelperTextProps={{ style: { fontFamily: "Nunito" } }}
              sx={{ mb: "16px" }}
            />
            <TextField
              label="Phone Number"
              type="tel"
              fullWidth
              required
              value={body.phoneNumber}
              onChange={(e) =>
                setBody((b) => ({ ...b, phoneNumber: e.target.value }))
              }
              onBlur={() => touch("phoneNumber")}
              error={phoneError}
              helperText={phoneError ? "Enter a valid phone number" : ""}
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
              onBlur={() => touch("password")}
              error={passwordError}
              helperText={
                passwordError ? "Password must be at least 6 characters" : ""
              }
              FormHelperTextProps={{ style: { fontFamily: "Nunito" } }}
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
              sx={{ mb: "4px" }}
            />
            <PasswordStrengthMeter password={body.password} />

            <TextField
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={passwordMismatch}
              helperText={passwordMismatch ? "Passwords don't match" : ""}
              FormHelperTextProps={{ style: { fontFamily: "Nunito" } }}
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
              sx={{ mt: "16px", mb: "28px" }}
            />

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={signUp}
              disabled={loading || passwordMismatch}
              sx={{
                py: "14px",
                fontSize: "1rem",
                mb: "22px",
                letterSpacing: "0.02em",
              }}
            >
              {loading ? "Creating account…" : "Create Account"}
            </Button>

            <Typography
              fontFamily="Nunito"
              fontSize="0.88rem"
              textAlign="center"
              color="text.secondary"
            >
              Already have an account?{" "}
              <Link
                to="/signin"
                style={{ color: brand.primary, fontWeight: 700 }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        )}
      </Box>
      <Footer />
    </Box>
  );
};

export default SignUp;
