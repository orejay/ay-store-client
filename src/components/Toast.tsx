import React from "react";
import { Alert, Snackbar } from "@mui/material";

interface ToastProps {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
  onClose: () => void;
}

const Toast = ({ open, message, severity, onClose }: ToastProps) => (
  <Snackbar
    open={open}
    autoHideDuration={4000}
    onClose={onClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
  >
    <Alert
      onClose={onClose}
      severity={severity}
      variant="filled"
      sx={{
        fontFamily: "Nunito",
        fontWeight: 600,
        fontSize: "0.875rem",
        borderRadius: "10px",
        minWidth: "280px",
      }}
    >
      {message}
    </Alert>
  </Snackbar>
);

export default Toast;
