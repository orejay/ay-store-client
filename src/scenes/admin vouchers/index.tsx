import { AddRounded, LocalActivityRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  Input,
  InputLabel,
  Switch,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";

interface Coupon {
  _id: string;
  code: string;
  discountPercent: number;
  active: boolean;
  expiresAt?: string;
  createdAt: string;
}

const AdminVouchers = () => {
  const isSmallScreen = useMediaQuery("(max-width:450px)");
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", discountPercent: "", expiresAt: "" });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const fetchCoupons = async () => {
    try {
      const res = await fetch(`${baseUrl}/get/coupons`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const createCoupon = async () => {
    setFormError("");
    setFormSuccess("");
    if (!form.code.trim() || !form.discountPercent) {
      setFormError("Code and discount % are required.");
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
        setFormSuccess("Coupon created!");
        setForm({ code: "", discountPercent: "", expiresAt: "" });
        setShowForm(false);
        fetchCoupons();
      } else {
        setFormError(data.message || "Could not create coupon.");
      }
    } catch {
      setFormError("Server error.");
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
    } catch {
      // silent
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  return (
    <Box>
      <Box sx={{ borderBottom: "1px solid #E0E0E0", px: "30px", py: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography fontFamily="Playfair Display" fontWeight="bold" color="secondary" variant="h5">
          Vouchers
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddRounded />}
          onClick={() => { setShowForm(!showForm); setFormError(""); setFormSuccess(""); }}
          sx={{ borderRadius: "20px", textTransform: "none" }}
        >
          <Typography color="white" fontFamily="Nunito" fontWeight="bold" fontSize="13px">
            New Coupon
          </Typography>
        </Button>
      </Box>

      {showForm && (
        <Box sx={{ m: "20px", p: "20px", boxShadow: "2px 2px 7px #E0E0E0", borderRadius: "8px", maxWidth: "480px" }}>
          <Typography fontFamily="Nunito" fontWeight="bold" mb="16px">Create Coupon</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", mb: "16px" }}>
            <FormControl variant="outlined">
              <InputLabel color="secondary">Code</InputLabel>
              <Input
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                placeholder="e.g. SAVE20"
              />
            </FormControl>
            <FormControl variant="outlined">
              <InputLabel color="secondary">Discount %</InputLabel>
              <Input
                type="number"
                value={form.discountPercent}
                onChange={(e) => setForm((f) => ({ ...f, discountPercent: e.target.value }))}
                placeholder="1-100"
              />
            </FormControl>
          </Box>
          <FormControl variant="outlined" fullWidth sx={{ mb: "16px" }}>
            <InputLabel color="secondary" shrink>Expires At (optional)</InputLabel>
            <Input
              type="date"
              value={form.expiresAt}
              onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
              sx={{ mt: "16px" }}
            />
          </FormControl>
          {formError && <Typography fontSize="13px" color="error" mb="8px">{formError}</Typography>}
          {formSuccess && <Typography fontSize="13px" sx={{ color: "#2e7d32" }} mb="8px">{formSuccess}</Typography>}
          <Box display="flex" gap="12px">
            <Button variant="contained" onClick={createCoupon} disabled={creating} sx={{ borderRadius: "20px", textTransform: "none" }}>
              <Typography color="white" fontFamily="Nunito" fontWeight="bold" fontSize="13px">
                {creating ? "Creating..." : "Create"}
              </Typography>
            </Button>
            <Button variant="outlined" onClick={() => setShowForm(false)} sx={{ borderRadius: "20px", textTransform: "none" }}>
              Cancel
            </Button>
          </Box>
        </Box>
      )}

      <Box sx={{ p: "20px" }}>
        {loading ? (
          <Box display="flex" justifyContent="center" pt="40px">
            <CircularProgress color="primary" />
          </Box>
        ) : coupons.length === 0 ? (
          <Box display="flex" flexDirection="column" alignItems="center" pt="60px">
            <LocalActivityRounded sx={{ fontSize: "80px", color: "#Ed981b" }} />
            <Typography fontFamily="Nunito" fontWeight="bold" fontSize="18px" pt="16px">
              No coupons yet
            </Typography>
            <Typography fontSize="14px" color="text.secondary" mt="8px">
              Click "New Coupon" to create your first discount code.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: isSmallScreen ? "1fr" : "repeat(auto-fill, minmax(280px,1fr))", gap: "16px" }}>
            {coupons.map((coupon) => (
              <Box key={coupon._id} sx={{ boxShadow: "2px 2px 7px #E0E0E0", borderRadius: "8px", p: "16px" }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb="8px">
                  <Typography fontFamily="Nunito" fontWeight="bold" fontSize="18px" letterSpacing="2px">
                    {coupon.code}
                  </Typography>
                  <Chip
                    label={coupon.active ? "Active" : "Inactive"}
                    size="small"
                    sx={{ backgroundColor: coupon.active ? "#e8f5e9" : "#fbe9e7", color: coupon.active ? "#2e7d32" : "#d32f2f", fontFamily: "Nunito", fontWeight: "bold" }}
                  />
                </Box>
                <Typography fontFamily="Nunito" fontSize="14px" color="text.secondary" mb="4px">
                  {coupon.discountPercent}% off
                </Typography>
                {coupon.expiresAt && (
                  <Typography fontFamily="Nunito" fontSize="12px" color="text.secondary" mb="4px">
                    Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
                  </Typography>
                )}
                <Typography fontFamily="Nunito" fontSize="12px" color="text.secondary" mb="12px">
                  Created: {new Date(coupon.createdAt).toLocaleDateString()}
                </Typography>
                <Box display="flex" alignItems="center" gap="8px">
                  <Switch
                    size="small"
                    checked={coupon.active}
                    onChange={() => toggleActive(coupon._id)}
                    color="primary"
                  />
                  <Typography fontFamily="Nunito" fontSize="13px">
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
