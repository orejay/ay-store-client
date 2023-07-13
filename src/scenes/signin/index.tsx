import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { VisibilityOff, Visibility, Warning } from "@mui/icons-material";
import Header from "components/Header";
import { Link, useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import React, { useState, useEffect } from "react";
import Footer from "components/Footer";

interface BodyState {
  password: string;
  email: string;
}

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
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isUser, setIsUser] = useState<boolean>(true);
  const [wrongPass, setWrongPass] = useState<boolean>(false);
  const [data, setData] = useState<UserData | null>(null);
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [body, setBody] = useState<BodyState>({
    password: "",
    email: "",
  });

  const signIn = async () => {
    try {
      console.log(body);
      console.log(JSON.stringify(body));
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const jsonData = await response.json();

      if (response.status === 404) setIsUser(false);
      if (response.status === 401) setWrongPass(true);

      if (response.ok) {
        setData(jsonData.userData);
        setIsSignedIn(true);
        localStorage.setItem("token", jsonData.userData.token);
        localStorage.setItem("user", JSON.stringify(jsonData.userData));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      setTimeout(() => {
        data?.role === "user"
          ? navigate("/customer/account")
          : navigate("/admin/account");
      }, 3000);
    }
  }, [isSignedIn, navigate]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Header />
      <Box
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CSSTransition
          in={!isSignedIn}
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
              Sign In
            </Typography>
            <CSSTransition
              in={!isUser || wrongPass}
              timeout={1000}
              classNames="elastic-bounce"
              unmountOnExit
            >
              <Typography
                fontStyle="italic"
                fontFamily="Nunito"
                sx={{
                  backgroundColor: "#ff5316",
                  p: "5px 5px 5px 10px",
                  borderRadius: "5px",
                  mb: "20px",
                  color: "white",
                }}
              >
                {!isUser
                  ? "User does not exist!"
                  : wrongPass
                  ? "Incorrect password!"
                  : ""}
              </Typography>
            </CSSTransition>

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
              <InputLabel color="secondary">Password</InputLabel>
              <Input
                required
                type={showPassword ? "text" : "password"}
                color="secondary"
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
            <Box
              display="flex"
              justifyContent="space-between"
              sx={{ width: "100%" }}
            >
              <Typography fontSize="14px" fontStyle="italic">
                Don't have an account?
              </Typography>
              <Link
                to="/signup"
                className="underline italic text-sm text-secondary"
              >
                Signup
              </Link>
            </Box>
            <Button
              variant="contained"
              sx={{ borderRadius: "20px", mt: "15px" }}
              onClick={signIn}
            >
              <Typography color="#ffffff">Sign In</Typography>
            </Button>
          </Box>
        </CSSTransition>
        <CSSTransition
          in={isSignedIn}
          timeout={1000}
          classNames="elastic-bounce"
          unmountOnExit
        >
          <Typography
            variant="h4"
            fontFamily="Playfair Display"
            fontWeight="bold"
          >
            Welcome! {data?.firstName}
          </Typography>
        </CSSTransition>
      </Box>
      <Footer />
    </Box>
  );
};

export default SignIn;
