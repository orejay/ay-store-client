import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Collapse,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { brand } from "../theme";

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

const EditAddress = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const addressList = useSelector((state: RootState) => state.global.addresses);

  const [isDefault, setIsDefault] = useState(addressList[0].isDefault);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">("success");

  const user: UserData | null = JSON.parse(
    localStorage.getItem("user") || "null"
  ) as UserData | null;

  const [body, setBody] = useState<BodyState>({
    contactName: addressList[0].contactName,
    phoneNumber: addressList[0].phoneNumber,
    address: addressList[0].address,
    city: addressList[0].city,
    state: addressList[0].state,
    country: addressList[0].country,
    isDefault: addressList[0].isDefault,
  });

  const editAddress = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/edit/addresses/${addressList[0]._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(body),
        }
      );
      if (response.ok) {
        setAlertMessage("Address updated successfully!");
        setAlertSeverity("success");
      } else {
        setAlertMessage("Something went wrong!");
        setAlertSeverity("error");
      }
      setShowAlert(true);
    } catch {
      setAlertMessage("Something went wrong!");
      setAlertSeverity("error");
      setShowAlert(true);
    }
  };

  const fieldSx = {
    "& .MuiInputBase-input": { fontFamily: "Nunito" },
    "& .MuiInputLabel-root": { fontFamily: "Nunito" },
  };

  return (
    <Box sx={{ p: { xs: "16px", md: "24px" } }}>
      {/* Alert */}
      <Collapse in={showAlert}>
        <Alert
          severity={alertSeverity}
          onClose={() => setShowAlert(false)}
          sx={{ mb: "20px", borderRadius: "10px", fontFamily: "Nunito", fontWeight: 600 }}
        >
          {alertMessage}
        </Alert>
      </Collapse>

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
            onClick={editAddress}
            sx={{ px: "32px", py: "10px", fontSize: "0.9rem" }}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EditAddress;
