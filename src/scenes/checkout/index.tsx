import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputBase,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowBackRounded,
  ArrowForwardRounded,
  CheckRounded,
  LocalOfferOutlined,
} from "@mui/icons-material";
import CheckoutCart from "components/CheckoutCart";
import DeliveryDetails from "components/DeliveryDetails";
import Footer from "components/Footer";
import Header from "components/Header";
import PaystackPayment from "components/PaystackPayment";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setCoupon, clearCoupon, setPrevPage, setShipping } from "state";
import { RootState, useAppDispatch } from "store";
import { brand } from "../../theme";

interface UserData {
  firstName: string; lastName: string; email: string;
  phoneNumber: string; role: string; id: string; token: string;
}

const steps = ["My Bag", "Delivery", "Confirm"];

const Checkout = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery("(max-width:768px)");
  const cart = useSelector((state: RootState) => state.global.cart);
  const deliveryAddress = useSelector((state: RootState) => state.global.deliveryAddress);
  const couponCode = useSelector((state: RootState) => state.global.couponCode);
  const couponDiscount = useSelector((state: RootState) => state.global.couponDiscount);
  const shippingMethod = useSelector((state: RootState) => state.global.shippingMethod);
  const shippingFee = useSelector((state: RootState) => state.global.shippingFee);

  const SHIPPING_OPTIONS = [
    { method: "standard" as const, label: "Standard", duration: "3–5 business days", fee: 1500 },
    { method: "express" as const, label: "Express", duration: "1–2 business days", fee: 3500 },
  ];

  const [tab, setTab] = useState(0);
  const [couponInput, setCouponInput] = useState(couponCode);
  const [couponError, setCouponError] = useState("");
  const [couponApplying, setCouponApplying] = useState(false);

  const user: UserData | null = JSON.parse(localStorage.getItem("user") || "null");
  const { pathname } = useLocation();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const borderColor = isDark ? "#27272E" : "#EBEBEB";
  const panelBg = isDark ? "#18181C" : "#FFFFFF";

  const fmt = (n: string) => "₦" + n.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const subtotal = cart.reduce((acc, i) => acc + i.price * i.quantity * ((100 - i.discount) / 100), 0);
  const discountedSubtotal = couponDiscount > 0 ? subtotal * ((100 - couponDiscount) / 100) : subtotal;
  const total = discountedSubtotal + shippingFee;

  const auth = async () => {
    try {
      const res = await fetch(`${baseUrl}/auth/authenticate`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.status === 401) { dispatch(setPrevPage(pathname)); localStorage.removeItem("user"); navigate("/signin"); }
    } catch { /* silent */ }
  };

  useEffect(() => {
    auth();
    if (cart.length < 1) navigate("/");
  }, []);

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponApplying(true);
    setCouponError("");
    try {
      const res = await fetch(`${baseUrl}/get/coupon/${couponInput.trim()}`);
      const data = await res.json();
      if (res.ok) {
        dispatch(setCoupon({ code: data.code, discount: data.discountPercent }));
      } else {
        dispatch(clearCoupon());
        setCouponError(data.message || "Invalid coupon.");
      }
    } catch {
      setCouponError("Could not validate coupon.");
    } finally {
      setCouponApplying(false);
    }
  };

  /* ── Order summary sidebar ── */
  const OrderSummary = () => (
    <Box
      sx={{
        borderRadius: "16px",
        border: `1px solid ${borderColor}`,
        backgroundColor: panelBg,
        p: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        alignSelf: "flex-start",
        position: { md: "sticky" },
        top: { md: "88px" },
      }}
    >
      {tab > 0 && (
        <IconButton
          size="small"
          onClick={() => setTab(tab - 1)}
          sx={{ alignSelf: "flex-start", color: brand.primary, border: `1px solid ${brand.primary}30`, borderRadius: "10px", p: "6px" }}
        >
          <ArrowBackRounded sx={{ fontSize: "18px" }} />
        </IconButton>
      )}

      <Typography fontFamily="Nunito" fontWeight={800} fontSize="1rem">Order Summary</Typography>

      {/* Subtotal */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography fontFamily="Nunito" fontSize="0.88rem" color="text.secondary">Subtotal</Typography>
        <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.88rem">
          {fmt(subtotal.toFixed(2))}
        </Typography>
      </Box>

      {/* Shipping selector */}
      <Box>
        <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.82rem" color="text.secondary" mb="8px">
          Shipping Method
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {SHIPPING_OPTIONS.map((opt) => {
            const selected = shippingMethod === opt.method;
            return (
              <Box
                key={opt.method}
                onClick={() => dispatch(setShipping({ method: opt.method, fee: opt.fee }))}
                sx={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  px: "12px", py: "10px", borderRadius: "10px", cursor: "pointer",
                  border: `1.5px solid ${selected ? brand.primary : borderColor}`,
                  backgroundColor: selected ? `${brand.primary}08` : "transparent",
                  transition: "all 0.15s",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Box sx={{
                    width: "16px", height: "16px", borderRadius: "50%", flexShrink: 0,
                    border: `2px solid ${selected ? brand.primary : borderColor}`,
                    backgroundColor: selected ? brand.primary : "transparent",
                    transition: "all 0.15s",
                  }} />
                  <Box>
                    <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.83rem"
                      color={selected ? brand.primary : "text.primary"}>
                      {opt.label}
                    </Typography>
                    <Typography fontFamily="Nunito" fontSize="0.72rem" color="text.secondary">
                      {opt.duration}
                    </Typography>
                  </Box>
                </Box>
                <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.83rem"
                  color={selected ? brand.primary : "text.secondary"}>
                  {fmt(opt.fee.toFixed(2))}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Coupon input */}
      <Box>
        <Box
          sx={{
            display: "flex", gap: "8px", alignItems: "center",
            border: `1.5px solid ${borderColor}`,
            borderRadius: "100px", overflow: "hidden",
            backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB",
            pr: "4px",
            "&:focus-within": { borderColor: brand.primary },
            transition: "border-color 0.2s",
          }}
        >
          <LocalOfferOutlined sx={{ fontSize: "16px", ml: "12px", color: theme.palette.text.disabled }} />
          <InputBase
            placeholder="Coupon code"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
            sx={{ flex: 1, fontFamily: "Nunito", fontSize: "0.85rem", py: "8px" }}
          />
          <Button
            size="small"
            onClick={applyCoupon}
            disabled={couponApplying}
            sx={{
              borderRadius: "100px",
              fontFamily: "Nunito",
              fontWeight: 700,
              fontSize: "0.78rem",
              color: brand.primary,
              minWidth: "54px",
              py: "5px",
            }}
          >
            {couponApplying ? <CircularProgress size={12} /> : "Apply"}
          </Button>
        </Box>
        {couponError && (
          <Typography fontSize="0.75rem" color="error" mt="6px" fontFamily="Nunito">{couponError}</Typography>
        )}
        {couponCode && couponDiscount > 0 && (
          <Typography fontSize="0.75rem" color="success.main" mt="6px" fontFamily="Nunito">
            {couponCode} — {couponDiscount}% off applied!
          </Typography>
        )}
      </Box>

      {couponDiscount > 0 && (
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography fontFamily="Nunito" fontSize="0.85rem" color="success.main">Discount</Typography>
          <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.85rem" color="success.main">
            -{couponDiscount}%
          </Typography>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography fontFamily="Nunito" fontSize="0.85rem" color="text.secondary">Shipping</Typography>
        <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.85rem">
          {fmt(shippingFee.toFixed(2))}
        </Typography>
      </Box>

      <Divider sx={{ borderColor }} />

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography fontFamily="Nunito" fontWeight={700}>Total</Typography>
        <Typography fontFamily="Playfair Display" fontWeight={900} fontSize="1.2rem" color="primary">
          {fmt(total.toFixed(2))}
        </Typography>
      </Box>

      {tab < 2 && (
        <Button
          variant="contained"
          fullWidth
          endIcon={<ArrowForwardRounded />}
          onClick={() => setTab(tab + 1)}
          sx={{
            borderRadius: "100px",
            py: "12px",
            fontFamily: "Nunito",
            fontWeight: 700,
            background: `linear-gradient(135deg, ${brand.primary} 0%, #0038CC 100%)`,
            boxShadow: `0 6px 20px ${brand.primary}35`,
          }}
        >
          {tab === 0 ? "Proceed to Delivery" : "Review Order"}
        </Button>
      )}
    </Box>
  );

  /* ── Confirm panel (tab 2 right side) ── */
  const ConfirmPanel = () => (
    <Box
      sx={{
        borderRadius: "16px",
        border: `1px solid ${borderColor}`,
        backgroundColor: panelBg,
        p: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        alignSelf: "flex-start",
        position: { md: "sticky" },
        top: { md: "88px" },
      }}
    >
      <IconButton
        size="small"
        onClick={() => setTab(1)}
        sx={{ alignSelf: "flex-start", color: brand.primary, border: `1px solid ${brand.primary}30`, borderRadius: "10px", p: "6px" }}
      >
        <ArrowBackRounded sx={{ fontSize: "18px" }} />
      </IconButton>

      <Typography fontFamily="Nunito" fontWeight={800} fontSize="1rem">Order Confirmation</Typography>

      {/* Total breakdown */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography fontFamily="Nunito" fontSize="0.83rem" color="text.secondary">Subtotal</Typography>
          <Typography fontFamily="Nunito" fontSize="0.83rem">{fmt(subtotal.toFixed(2))}</Typography>
        </Box>
        {couponDiscount > 0 && (
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography fontFamily="Nunito" fontSize="0.83rem" color="success.main">
              Coupon ({couponCode})
            </Typography>
            <Typography fontFamily="Nunito" fontSize="0.83rem" color="success.main">
              -{couponDiscount}%
            </Typography>
          </Box>
        )}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography fontFamily="Nunito" fontSize="0.83rem" color="text.secondary">
            Shipping ({shippingMethod === "express" ? "Express" : "Standard"})
          </Typography>
          <Typography fontFamily="Nunito" fontSize="0.83rem">{fmt(shippingFee.toFixed(2))}</Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor }} />

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography fontFamily="Nunito" fontWeight={700}>Total</Typography>
        <Typography fontFamily="Playfair Display" fontWeight={900} fontSize="1.2rem" color="primary">
          {fmt(total.toFixed(2))}
        </Typography>
      </Box>

      <Divider sx={{ borderColor }} />

      {/* Address summary */}
      <Box>
        <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.82rem" color="text.secondary" mb="6px">
          Deliver to
        </Typography>
        <Typography fontFamily="Nunito" fontSize="0.85rem" lineHeight={1.6}>
          {deliveryAddress?.address}, {deliveryAddress?.city}<br />
          {deliveryAddress?.state}, {deliveryAddress?.country}<br />
          {deliveryAddress?.phoneNumber}
        </Typography>
      </Box>

      <Divider sx={{ borderColor }} />

      <PaystackPayment />
    </Box>
  );

  /* ── Step items for confirm tab cart preview ── */
  const CartPreview = () => (
    <Box sx={{ borderRadius: "16px", border: `1px solid ${borderColor}`, backgroundColor: panelBg, overflow: "hidden" }}>
      {cart.map((each, i) => (
        <Box
          key={each._id}
          sx={{
            px: "16px", py: "12px",
            borderBottom: i < cart.length - 1 ? `1px solid ${borderColor}` : "none",
          }}
        >
          <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.9rem">
            {each.name[0].toUpperCase()}{each.name.slice(1)}
          </Typography>
          <Typography fontFamily="Nunito" fontSize="0.78rem" color="text.secondary">
            {each.category} · qty {each.quantity}
          </Typography>
          <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.88rem" color="primary" mt="2px">
            {fmt((each.price * each.quantity * ((100 - each.discount) / 100)).toFixed(2))}
          </Typography>
        </Box>
      ))}
    </Box>
  );

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: "100vh" }}>
      <Header />
      <Box sx={{ pt: { xs: "60px", md: "68px" }, pb: "80px" }}>

        {/* Step indicator */}
        <Box
          sx={{
            px: { xs: "20px", md: "60px" },
            py: "24px",
            borderBottom: `1px solid ${borderColor}`,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {steps.map((step, i) => (
            <React.Fragment key={step}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Box
                  onClick={() => tab > i && setTab(i)}
                  sx={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor:
                      tab > i ? brand.primary : tab === i ? `${brand.primary}20` : isDark ? "#27272E" : "#F3F4F6",
                    border: `2px solid ${tab >= i ? brand.primary : borderColor}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: tab > i ? "pointer" : "default",
                    transition: "all 0.2s",
                    flexShrink: 0,
                  }}
                >
                  {tab > i ? (
                    <CheckRounded sx={{ fontSize: "15px", color: "#fff" }} />
                  ) : (
                    <Typography
                      fontFamily="Nunito"
                      fontWeight={700}
                      fontSize="0.75rem"
                      color={tab === i ? brand.primary : "text.secondary"}
                    >
                      {i + 1}
                    </Typography>
                  )}
                </Box>
                <Typography
                  fontFamily="Nunito"
                  fontWeight={tab === i ? 700 : 500}
                  fontSize="0.88rem"
                  color={tab === i ? "text.primary" : "text.secondary"}
                  sx={{ display: { xs: i === tab ? "block" : "none", sm: "block" } }}
                >
                  {step}
                </Typography>
              </Box>
              {i < steps.length - 1 && (
                <Box
                  sx={{
                    flex: 1,
                    height: "2px",
                    backgroundColor: tab > i ? brand.primary : borderColor,
                    borderRadius: "1px",
                    transition: "background-color 0.3s",
                    mx: "4px",
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </Box>

        {/* Main content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: "20px",
            px: { xs: "16px", md: "60px" },
            pt: "28px",
            maxWidth: "1100px",
            mx: "auto",
          }}
        >
          {/* Left panel */}
          <Box
            sx={{
              flex: 2,
              borderRadius: "16px",
              border: `1px solid ${borderColor}`,
              backgroundColor: panelBg,
              overflow: "hidden",
            }}
          >
            {tab === 0 && <CheckoutCart />}
            {tab === 1 && <DeliveryDetails />}
            {tab === 2 && <CartPreview />}
          </Box>

          {/* Right panel */}
          <Box sx={{ flex: 1, minWidth: isMobile ? "auto" : "260px" }}>
            {tab < 2 ? <OrderSummary /> : <ConfirmPanel />}
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Checkout;
