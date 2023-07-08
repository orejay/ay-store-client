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
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { CSSTransition } from "react-transition-group";
import Header from "components/Header";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "components/Footer";

interface BodyState {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  phoneNumber: string;
}

const SignUp = () => {
  const [isSignedUp, setIsSignedUp] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true);
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [body, setBody] = useState<BodyState>({
    firstName: "",
    lastName: "",
    password: "",
    email: "",
    phoneNumber: "",
  });

  const signUp = async () => {
    try {
      console.log(body);
      console.log(JSON.stringify(body));
      const response = await fetch(`${baseUrl}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const jsonData = await response.json();
      if (response.ok) setIsSignedUp(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (isSignedUp) {
      setTimeout(() => {
        navigate("/signin");
      }, 3000); // Redirect after 3 seconds
    }
  }, [isSignedUp, navigate]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Header />
      <Box
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        py="150px"
      >
        <CSSTransition
          in={!isSignedUp}
          timeout={1000}
          classNames="fade"
          unmountOnExit
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              border: "2px solid #E0E0E0",
              borderRadius: "30px",
              width: "35%",
              p: "4%",
            }}
          >
            <Typography
              variant="h4"
              fontFamily="Playfair Display"
              fontWeight="bold"
              color="secondary"
              mb="35px"
            >
              Sign Up
            </Typography>
            <FormControl variant="outlined" sx={{ mb: "20px" }}>
              <InputLabel color="secondary">First Name</InputLabel>
              <Input
                required
                type="text"
                color="secondary"
                onChange={(e) =>
                  setBody((body) => ({ ...body, firstName: e.target.value }))
                }
              />
            </FormControl>
            <FormControl variant="outlined" sx={{ mb: "20px" }}>
              <InputLabel color="secondary">Last Name</InputLabel>
              <Input
                required
                type="text"
                color="secondary"
                onChange={(e) =>
                  setBody((body) => ({ ...body, lastName: e.target.value }))
                }
              />
            </FormControl>
            <FormControl variant="outlined" sx={{ mb: "20px" }}>
              <InputLabel color="secondary">Email</InputLabel>
              <Input
                required
                type="email"
                color="secondary"
                onChange={(e) =>
                  setBody((body) => ({ ...body, email: e.target.value }))
                }
              />
            </FormControl>
            <FormControl variant="outlined" sx={{ mb: "20px" }}>
              <InputLabel color="secondary">Phone Number</InputLabel>
              <Input
                required
                type="tel"
                color="secondary"
                onChange={(e) =>
                  setBody((body) => ({ ...body, phoneNumber: e.target.value }))
                }
              />
            </FormControl>
            <FormControl variant="outlined" sx={{ mb: "20px" }}>
              <InputLabel color="secondary">Password</InputLabel>
              <Input
                required
                type={showPassword ? "text" : "password"}
                color={
                  passwordMatch === false && body.password !== ""
                    ? "warning"
                    : "secondary"
                }
                onChange={(e) =>
                  setBody((body) => ({ ...body, password: e.target.value }))
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            {passwordMatch === false && body.password !== "" ? (
              <p className="text-sm italic text-warning mb-4 font-semibold Nunito">
                Passwords don't match!
              </p>
            ) : (
              ""
            )}
            <FormControl variant="outlined" sx={{ mb: "20px" }}>
              <InputLabel color="secondary">Confirm Password</InputLabel>
              <Input
                required
                type={showPassword ? "text" : "password"}
                color={
                  passwordMatch === false && body.password !== ""
                    ? "warning"
                    : "success"
                }
                onChange={(e) => {
                  e.target.value === body.password
                    ? setPasswordMatch(true)
                    : setPasswordMatch(false);
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Box
              display="flex"
              justifyContent="space-between"
              sx={{ width: "100%" }}
            >
              <Typography fontSize="14px" fontStyle="italic">
                Already have an account?
              </Typography>
              <Link
                to="/signin"
                className="underline italic text-sm text-secondary"
              >
                Signin
              </Link>
            </Box>
            <Button
              variant="contained"
              sx={{ borderRadius: "20px", mt: "15px" }}
              onClick={() => signUp()}
            >
              <Typography color="#ffffff">Sign Up</Typography>
            </Button>
          </Box>
        </CSSTransition>
        <CSSTransition
          in={isSignedUp}
          timeout={1000}
          classNames="fade"
          unmountOnExit
        >
          <Typography
            variant="h4"
            fontFamily="Playfair Display"
            fontWeight="bold"
          >
            Sign up successful!, please sign in to continue.
          </Typography>
        </CSSTransition>
      </Box>
      <Footer />
    </Box>
  );
};

export default SignUp;
