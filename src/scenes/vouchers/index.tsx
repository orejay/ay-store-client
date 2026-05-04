import { ContentCopyRounded, LocalActivity } from "@mui/icons-material";
import { Box, Button, Chip, CircularProgress, IconButton, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Coupon {
  _id: string;
  code: string;
  discountPercent: number;
  active: boolean;
  expiresAt?: string;
}

const Vouchers = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState("");

  const fetchActiveCoupons = async () => {
    try {
      const res = await fetch(`${baseUrl}/get/coupon/ACTIVE_LIST`);
      // Active coupons are validated individually — show only by fetching each.
      // We don't expose a public list endpoint for security; show a tip instead.
      setCoupons([]);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(""), 2000);
  };

  useEffect(() => { setLoading(false); }, []);

  return (
    <Box>
      <Box sx={{ borderBottom: "1px solid #E0E0E0", pl: "30px", py: "10px" }}>
        <Typography fontFamily="Playfair Display" fontWeight="bold" color="secondary" variant="h5">
          Vouchers
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" pt="60px">
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%", pt: "60px" }}>
          <LocalActivity sx={{ fontSize: "90px", color: "#Ed981b" }} />
          <Typography fontFamily="Nunito" fontWeight="bold" fontSize="20px" pt="20px">
            Got a voucher code?
          </Typography>
          <Typography pt="10px" fontSize="14px" sx={{ maxWidth: "50%", textAlign: "center" }}>
            Enter your coupon code at checkout to apply a discount. Codes are shared via promotions and events.
          </Typography>
          <Button variant="contained" sx={{ px: "30px", mt: "20px", borderRadius: "20px" }}>
            <Link to="/checkout" className="w-full h-full">
              <Typography color="#FFFFFF" fontWeight="bold" fontFamily="Nunito">
                Go to Checkout
              </Typography>
            </Link>
          </Button>
          <Button variant="outlined" sx={{ px: "30px", mt: "12px", borderRadius: "20px" }}>
            <Link to="/shop" className="w-full h-full">
              <Typography fontWeight="bold" fontFamily="Nunito">
                Continue Shopping
              </Typography>
            </Link>
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Vouchers;
