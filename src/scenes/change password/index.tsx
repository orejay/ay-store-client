import { Close, Visibility, VisibilityOff } from "@mui/icons-material";
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
import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";

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
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [wrongPass, setWrongPass] = useState<boolean>(false);
  const [closeModal, setCloseModal] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordChanged, setPasswordChanged] = useState<boolean>(false);
  const [passwordMatch, setPasswordMatch] = useState<boolean>(false);
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [checkPass, setCheckPass] = useState<string>("");
  const user: UserData | null = JSON.parse(
    localStorage.getItem("user") || "null"
  ) as UserData | null;
  const [body, setBody] = useState<BodyState>({
    password: "",
    oldPassword: "",
  });

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

      if (
        response.status === 401 &&
        jsonData.message === "Incorrect password!"
      ) {
        setWrongPass(true);
        setCloseModal(false);
      }

      if (response.ok) {
        setPasswordChanged(true);
        setWrongPass(false);
        setCloseModal(false);
        setBody((body) => ({ ...body, oldPassword: "" }));
        setBody((body) => ({ ...body, password: "" }));
        setCheckPass("");
      }
      console.log(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          borderBottom: "1px solid #E0E0E0",
          px: "30px",
          py: "13px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          fontFamily="Playfair Display"
          fontWeight="bold"
          color="secondary"
          variant="h5"
        >
          Change Password
        </Typography>
      </Box>
      {
        <CSSTransition
          in={!closeModal}
          timeout={1000}
          classNames="fade"
          unmountOnExit
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: "5px",
              backgroundColor: !wrongPass ? "#00C98D" : "#ff5316",
              pl: "70px",
              pr: "10px",
            }}
          >
            <Typography
              fontFamily="Nunito"
              sx={{
                color: "white",
                fontStyle: "italic",
              }}
            >
              {!wrongPass
                ? "Password Changed Successfully!"
                : "Old password is incorrect!"}
            </Typography>
            <IconButton
              onClick={() => {
                setCloseModal(true);
              }}
            >
              <Close sx={{ color: "white" }} />
            </IconButton>
          </Box>
        </CSSTransition>
      }
      <Box
        sx={{
          gap: "20px",
          pl: "30px",
          pt: "20px",
        }}
      >
        <Box
          sx={{
            width: "90%",
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: "30px",
          }}
        >
          <FormControl variant="outlined" sx={{ mb: "20px" }}>
            <InputLabel color="secondary">Old Password</InputLabel>
            <Input
              required
              type={showOldPassword ? "text" : "password"}
              color="secondary"
              value={body.oldPassword}
              onChange={(e) =>
                setBody((body) => ({ ...body, oldPassword: e.target.value }))
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <FormControl variant="outlined" sx={{ mb: "20px" }}>
            <InputLabel color="secondary">New Password</InputLabel>
            <Input
              required
              type={showPassword ? "text" : "password"}
              value={body.password}
              color={
                passwordMatch === false && checkPass !== ""
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
          {passwordMatch === false &&
          checkPass !== "" &&
          checkPass.length >= 3 ? (
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
              value={checkPass}
              color={
                passwordMatch === false && body.password !== ""
                  ? "warning"
                  : "secondary"
              }
              onChange={(e) => {
                setCheckPass(e.target.value);
                e.target.value.length >= 3 && e.target.value === body.password
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
          <Box sx={{ columnSpan: "all" }}></Box>
          <Button
            variant="contained"
            sx={{ borderRadius: "20px", mt: "15px", width: "40%" }}
            onClick={changePassword}
          >
            <Typography color="#ffffff">Confirm</Typography>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ChangePassword;
