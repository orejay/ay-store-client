import React, { useEffect, useState } from "react";
import {
  Box, Button, Chip, CircularProgress, Collapse, Switch,
  TextField, Typography, useTheme, useMediaQuery,
} from "@mui/material";
import { AddRounded, ConfirmationNumberRounded } from "@mui/icons-material";
import Toast from "components/Toast";
import { brand } from "../../theme";

interface Coupon {
  _id: string;
  code: string;
  discountPercent: number;
  active: boolean;
  expiresAt?: string;
  createdAt: string;
}

const AdminVouchers = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const borderColor = isDark ? "#27272E" : "#EBEBEB";
  const isSmall = useMediaQuery("(max-width:500px)");

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", discountPercent: "", expiresAt: "" });
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });
  const showToast = (message: string, severity: "success" | "error") => setToast({ open: true, message, severity });

  const fetchCoupons = async () => {
    try {
      const res = await fetch(`${baseUrl}/get/coupons`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  const createCoupon = async () => {
    if (!form.code.trim() || !form.discountPercent) {
      showToast("Code and discount % are required.", "error");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch(`${baseUrl}/post/coupon`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user?.token}` },
        body: JSON.stringify({
          code: form.code.toUpperCase(),
          discountPercent: Number(form.discountPercent),
          expiresAt: form.expiresAt || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Coupon created successfully!", "success");
        setForm({ code: "", discountPercent: "", expiresAt: "" });
        setShowForm(false);
        fetchCoupons();
      } else {
        showToast(data.message || "Could not create coupon.", "error");
      }
    } catch {
      showToast("Server error. Please try again.", "error");
    } finally {
      setCreating(false);
    }
  };

  const toggleActive = async (couponId: string) => {
    try {
      await fetch(`${baseUrl}/edit/coupon/${couponId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setCoupons((prev) => prev.map((c) => c._id === couponId ? { ...c, active: !c.active } : c));
    } catch { /* silent */ }
  };

  useEffect(() => { fetchCoupons(); }, []);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ px: { xs: "16px", md: "24px" }, py: "13px", borderBottom: `1px solid ${borderColor}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography fontFamily="Playfair Display" fontWeight={900} fontSize="1.3rem">
            Vouchers
          </Typography>
          <Typography fontFamily="Nunito" fontSize="0.78rem" color="text.secondary">
            Manage discount codes
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddRounded />}
          onClick={() => setShowForm(!showForm)}
          sx={{ fontFamily: "Nunito", fontWeight: 700, fontSize: "0.8rem", borderRadius: "10px" }}
        >
          New Coupon
        </Button>
      </Box>

      <Toast open={toast.open} message={toast.message} severity={toast.severity} onClose={() => setToast((t) => ({ ...t, open: false }))} />

      {/* Create form */}
      <Collapse in={showForm}>
        <Box
          sx={{
            mx: { xs: "16px", md: "24px" },
            mt: "16px",
            p: "20px",
            borderRadius: "14px",
            border: `1px solid ${borderColor}`,
            backgroundColor: isDark ? "#09090D" : "#FAFAFA",
          }}
        >
          <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.95rem" mb="16px">
            Create Coupon
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: isSmall ? "1fr" : "1fr 1fr", gap: "16px", mb: "16px" }}>
            <TextField
              label="Code"
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
              placeholder="e.g. SAVE20"
              size="small"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
            <TextField
              label="Discount %"
              type="number"
              value={form.discountPercent}
              onChange={(e) => setForm((f) => ({ ...f, discountPercent: e.target.value }))}
              placeholder="1–100"
              size="small"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
          </Box>
          <TextField
            label="Expires At (optional)"
            type="date"
            value={form.expiresAt}
            onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{ mb: "16px", "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
          />
          <Box sx={{ display: "flex", gap: "10px" }}>
            <Button
              variant="contained"
              onClick={createCoupon}
              disabled={creating}
              sx={{ fontFamily: "Nunito", fontWeight: 700, borderRadius: "10px", px: "20px" }}
            >
              {creating ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : "Create"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => setShowForm(false)}
              sx={{ fontFamily: "Nunito", fontWeight: 700, borderRadius: "10px", px: "20px", borderColor }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Collapse>

      {/* List */}
      <Box sx={{ p: { xs: "16px", md: "24px" } }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", pt: "48px" }}>
            <CircularProgress />
          </Box>
        ) : coupons.length === 0 ? (
          <Box sx={{ textAlign: "center", py: "60px" }}>
            <ConfirmationNumberRounded sx={{ fontSize: "48px", color: "text.disabled", mb: "12px" }} />
            <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.95rem" mb="4px">
              No coupons yet
            </Typography>
            <Typography fontFamily="Nunito" fontSize="0.82rem" color="text.secondary">
              Click "New Coupon" to create your first discount code.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: isSmall ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" }}>
            {coupons.map((coupon) => (
              <Box
                key={coupon._id}
                sx={{
                  borderRadius: "14px",
                  border: `1px solid ${coupon.active ? brand.primary + "40" : borderColor}`,
                  backgroundColor: isDark ? "#09090D" : "#FFFFFF",
                  overflow: "hidden",
                  boxShadow: coupon.active
                    ? `0 4px 16px ${brand.primary}14`
                    : isDark ? "0 2px 8px rgba(0,0,0,0.35)" : "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                {/* Card header */}
                <Box
                  sx={{
                    px: "16px", py: "12px",
                    borderBottom: `1px solid ${borderColor}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: coupon.active
                      ? isDark ? `${brand.primary}10` : `${brand.primary}06`
                      : "transparent",
                  }}
                >
                  <Typography fontFamily="Nunito" fontWeight={800} fontSize="1rem" letterSpacing="2px">
                    {coupon.code}
                  </Typography>
                  <Chip
                    label={coupon.active ? "Active" : "Inactive"}
                    size="small"
                    sx={{
                      fontFamily: "Nunito",
                      fontWeight: 700,
                      fontSize: "0.7rem",
                      backgroundColor: coupon.active ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.1)",
                      color: coupon.active ? "#10B981" : "#EF4444",
                    }}
                  />
                </Box>

                {/* Card body */}
                <Box sx={{ px: "16px", py: "12px" }}>
                  <Typography fontFamily="Nunito" fontWeight={800} fontSize="1.3rem" color="primary" mb="4px">
                    {coupon.discountPercent}% off
                  </Typography>
                  {coupon.expiresAt && (
                    <Typography fontFamily="Nunito" fontSize="0.78rem" color="text.secondary" mb="2px">
                      Expires: {new Date(coupon.expiresAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                    </Typography>
                  )}
                  <Typography fontFamily="Nunito" fontSize="0.75rem" color="text.disabled">
                    Created: {new Date(coupon.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                  </Typography>
                </Box>

                {/* Toggle */}
                <Box
                  sx={{
                    px: "16px", py: "8px",
                    borderTop: `1px solid ${borderColor}`,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Switch
                    size="small"
                    checked={coupon.active}
                    onChange={() => toggleActive(coupon._id)}
                    color="primary"
                  />
                  <Typography fontFamily="Nunito" fontSize="0.82rem" fontWeight={600}>
                    {coupon.active ? "Deactivate" : "Activate"}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdminVouchers;
