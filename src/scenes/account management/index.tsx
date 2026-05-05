import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  Alert,
  Collapse,
  Avatar,
  Divider,
} from "@mui/material";
import { brand } from "../../theme";
import { isValidEmail, isValidPhone } from "../../utils/validate";

interface BodyState {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
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

const AccManagement = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const borderColor = isDark ? "#27272E" : "#EBEBEB";
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("Details Updated Successfully!");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">("success");
  const user: UserData | null = JSON.parse(
    localStorage.getItem("user") || "null"
  ) as UserData | null;
  const [body, setBody] = useState<BodyState>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const [touched, setTouched] = useState({ email: false, phoneNumber: false });
  const touch = (field: "email" | "phoneNumber") =>
    setTouched((t) => ({ ...t, [field]: true }));

  const emailError = touched.email && body.email.length > 0 && !isValidEmail(body.email);
  const phoneError = touched.phoneNumber && body.phoneNumber.length > 0 && !isValidPhone(body.phoneNumber);

  const editDetails = async () => {
    try {
      const response = await fetch(`${baseUrl}/edit/user`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(body),
      });
      const jsonData = await response.json();
      if (response.ok) {
        setAlertMessage("Details updated successfully!");
        setAlertSeverity("success");
        localStorage.setItem("user", JSON.stringify(jsonData.userData));
      } else {
        setAlertMessage(jsonData.message || "Something went wrong!");
        setAlertSeverity("error");
      }
      setShowAlert(true);
    } catch {
      setAlertMessage("Something went wrong!");
      setAlertSeverity("error");
      setShowAlert(true);
    }
  };

  const isDisabled =
    (!body.firstName && !body.lastName && !body.email && !body.phoneNumber) ||
    emailError || phoneError;

  return (
    <Box sx={{ p: { xs: "16px", md: "28px" } }}>
      {/* Page header */}
      <Box sx={{ pb: "20px", borderBottom: `1px solid ${borderColor}`, mb: "24px" }}>
        <Typography fontFamily="Playfair Display" fontWeight={900} fontSize="1.3rem">
          Account Management
        </Typography>
        <Typography fontFamily="Nunito" fontSize="0.82rem" color="text.secondary" mt="2px">
          Update your personal information
        </Typography>
      </Box>

      {/* Notification */}
      <Collapse in={showAlert}>
        <Alert
          severity={alertSeverity}
          onClose={() => setShowAlert(false)}
          sx={{ mb: "22px", borderRadius: "10px", fontFamily: "Nunito", fontWeight: 600 }}
        >
          {alertMessage}
        </Alert>
      </Collapse>

      {/* Avatar + name */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "14px", mb: "24px" }}>
        <Avatar
          sx={{
            width: 60,
            height: 60,
            bgcolor: `${brand.primary}18`,
            color: brand.primary,
            fontFamily: "Playfair Display",
            fontWeight: 900,
            fontSize: "1.5rem",
          }}
        >
          {user?.firstName?.[0]?.toUpperCase()}
        </Avatar>
        <Box>
          <Typography fontFamily="Nunito" fontWeight={800} fontSize="1rem">
            {user?.firstName} {user?.lastName}
          </Typography>
          <Box
            sx={{
              display: "inline-block",
              px: "8px",
              py: "2px",
              borderRadius: "100px",
              backgroundColor: `${brand.secondary}18`,
              mt: "3px",
            }}
          >
            <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.7rem" color={brand.secondary}>
              {user?.role === "user" ? "Customer" : "Admin"}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: "24px" }} />

      {/* Form grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
          gap: "18px",
        }}
      >
        <TextField
          label="First Name"
          defaultValue={user?.firstName}
          onChange={(e) => setBody((b) => ({ ...b, firstName: e.target.value }))}
          fullWidth
          inputProps={{ style: { fontFamily: "Nunito" } }}
          InputLabelProps={{ style: { fontFamily: "Nunito" } }}
        />
        <TextField
          label="Last Name"
          defaultValue={user?.lastName}
          onChange={(e) => setBody((b) => ({ ...b, lastName: e.target.value }))}
          fullWidth
          inputProps={{ style: { fontFamily: "Nunito" } }}
          InputLabelProps={{ style: { fontFamily: "Nunito" } }}
        />
        <TextField
          label="Email"
          type="email"
          defaultValue={user?.email}
          onChange={(e) => setBody((b) => ({ ...b, email: e.target.value }))}
          onBlur={() => touch("email")}
          error={emailError}
          helperText={emailError ? "Enter a valid email address" : ""}
          fullWidth
          inputProps={{ style: { fontFamily: "Nunito" } }}
          InputLabelProps={{ style: { fontFamily: "Nunito" } }}
          FormHelperTextProps={{ style: { fontFamily: "Nunito" } }}
        />
        <TextField
          label="Phone Number"
          type="tel"
          defaultValue={user?.phoneNumber}
          onChange={(e) => setBody((b) => ({ ...b, phoneNumber: e.target.value }))}
          onBlur={() => touch("phoneNumber")}
          error={phoneError}
          helperText={phoneError ? "Enter a valid phone number" : ""}
          fullWidth
          inputProps={{ style: { fontFamily: "Nunito" } }}
          InputLabelProps={{ style: { fontFamily: "Nunito" } }}
          FormHelperTextProps={{ style: { fontFamily: "Nunito" } }}
        />
      </Box>

      <Box sx={{ mt: "28px" }}>
        <Button
          variant="contained"
          onClick={editDetails}
          disabled={isDisabled}
          sx={{ px: "32px", py: "10px", fontSize: "0.9rem" }}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default AccManagement;
