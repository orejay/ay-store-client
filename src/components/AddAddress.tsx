import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import Toast from "components/Toast";
import { brand } from "../theme";
import { isValidPhone } from "../utils/validate";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  id: string;
  token: string;
}

interface BodyState {
  contactName: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
}

const AddAddress = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [isDefault, setIsDefault] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });
  const showToast = (message: string, severity: "success" | "error") => setToast({ open: true, message, severity });
  const [phoneTouched, setPhoneTouched] = useState(false);

  const user: UserData | null = JSON.parse(
    localStorage.getItem("user") || "null"
  ) as UserData | null;

  const [body, setBody] = useState<BodyState>({
    contactName: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    country: "",
    isDefault: false,
  });

  const phoneError = phoneTouched && body.phoneNumber.length > 0 && !isValidPhone(body.phoneNumber);

  const addAddress = async () => {
    try {
      const response = await fetch(`${baseUrl}/post/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        showToast("Address added successfully!", "success");
        setBody({
          contactName: "",
          phoneNumber: "",
          address: "",
          city: "",
          state: "",
          country: "",
          isDefault: false,
        });
        setIsDefault(false);
      } else {
        showToast("Something went wrong!", "error");
      }
    } catch {
      showToast("Something went wrong!", "error");
    }
  };

  const fieldSx = {
    "& .MuiInputBase-input": { fontFamily: "Nunito" },
    "& .MuiInputLabel-root": { fontFamily: "Nunito" },
  };

  return (
    <Box sx={{ p: { xs: "16px", md: "24px" } }}>
      <Toast open={toast.open} message={toast.message} severity={toast.severity} onClose={() => setToast((t) => ({ ...t, open: false }))} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
          gap: "18px",
        }}
      >
        <TextField
          label="Contact Name"
          value={body.contactName}
          onChange={(e) => setBody((b) => ({ ...b, contactName: e.target.value }))}
          fullWidth
          sx={fieldSx}
        />
        <TextField
          label="Phone Number"
          type="tel"
          value={body.phoneNumber}
          onChange={(e) => setBody((b) => ({ ...b, phoneNumber: e.target.value }))}
          onBlur={() => setPhoneTouched(true)}
          error={phoneError}
          helperText={phoneError ? "Enter a valid phone number" : ""}
          FormHelperTextProps={{ style: { fontFamily: "Nunito" } }}
          fullWidth
          sx={fieldSx}
        />
        <TextField
          label="Street Address"
          value={body.address}
          onChange={(e) => setBody((b) => ({ ...b, address: e.target.value }))}
          fullWidth
          sx={{ ...fieldSx, gridColumn: { sm: "span 2" } }}
        />
        <TextField
          label="Country"
          value={body.country}
          onChange={(e) => setBody((b) => ({ ...b, country: e.target.value }))}
          fullWidth
          sx={fieldSx}
        />
        <TextField
          label="State"
          value={body.state}
          onChange={(e) => setBody((b) => ({ ...b, state: e.target.value }))}
          fullWidth
          sx={fieldSx}
        />
        <TextField
          label="City"
          value={body.city}
          onChange={(e) => setBody((b) => ({ ...b, city: e.target.value }))}
          fullWidth
          sx={fieldSx}
        />

        <Box sx={{ gridColumn: { sm: "span 2" } }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isDefault}
                onChange={(e) => {
                  setIsDefault(e.target.checked);
                  setBody((b) => ({ ...b, isDefault: e.target.checked }));
                }}
                sx={{
                  color: "text.disabled",
                  "&.Mui-checked": { color: brand.primary },
                }}
              />
            }
            label={
              <Typography fontFamily="Nunito" fontWeight={600} fontSize="0.88rem">
                Set as default address
              </Typography>
            }
          />
        </Box>

        <Box sx={{ gridColumn: { sm: "span 2" }, pt: "4px" }}>
          <Button
            variant="contained"
            onClick={addAddress}
            disabled={
              !body.contactName ||
              !body.phoneNumber ||
              !body.address ||
              !body.city ||
              !body.state ||
              !body.country ||
              phoneError
            }
            sx={{ px: "32px", py: "10px", fontSize: "0.9rem" }}
          >
            Save Address
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddAddress;
