import React, { useEffect, useState } from "react";
import { Box, Button, Divider, Typography, useTheme } from "@mui/material";
import { PrintRounded, ArrowBackRounded } from "@mui/icons-material";
import { useParams, useLocation, Link } from "react-router-dom";
import { brand } from "../../theme";

interface ProductData {
  name: string; price: number; discount: number; category: string; _id: string;
}
interface OrderItem { product: ProductData; quantity: number; }
interface AddressData {
  contactName: string; phoneNumber: string; address: string;
  city: string; state: string; country: string;
}
interface OrderData {
  _id: string; order: OrderItem[]; address: AddressData;
  price: string; discountAmount: number; couponCode: string | null;
  shippingMethod: string; shippingFee: number;
  status: string; createdAt: string; instructions: string;
}

const fmt = (n: number) => "₦" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const cap = (s?: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "—";

const OrderInvoice = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const borderColor = isDark ? "#27272E" : "#EBEBEB";
  const { id } = useParams<{ id: string }>();
  const { state: locationState } = useLocation();

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");

  const [order, setOrder] = useState<OrderData | null>(
    (locationState as any)?.order ?? null
  );
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (order) return;
    const fetch_ = async () => {
      try {
        const res = await fetch(`${baseUrl}/get/orders/${id}`, {
          headers: { Authorization: `Bearer ${storedUser?.token}` },
        });
        if (res.ok) setOrder(await res.json());
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <Typography fontFamily="Nunito" color="text.secondary">Loading…</Typography>
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: "16px" }}>
        <Typography fontFamily="Nunito" fontWeight={700}>Order not found.</Typography>
        <Link to="/customer/orders">
          <Button variant="outlined" startIcon={<ArrowBackRounded />} sx={{ fontFamily: "Nunito", fontWeight: 700, borderRadius: "100px" }}>
            Back to Orders
          </Button>
        </Link>
      </Box>
    );
  }

  const items = order.order ?? [];
  const subtotal = items.reduce((acc, i) => {
    const price = i?.product?.price ?? 0;
    const disc = i?.product?.discount ?? 0;
    return acc + price * i.quantity * ((100 - disc) / 100);
  }, 0);
  const shippingFee = order.shippingFee ?? 1500;
  const discountAmount = order.discountAmount ?? 0;
  const grandTotal = parseFloat(order.price) || (subtotal - discountAmount + shippingFee);
  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })
    : "—";

  return (
    <Box
      sx={{
        backgroundColor: isDark ? "#09090D" : "#F4F5F7",
        minHeight: "100vh",
        py: { xs: "24px", md: "48px" },
        px: { xs: "16px", md: "24px" },
      }}
    >
      {/* Toolbar — hidden on print */}
      <Box
        className="no-print"
        sx={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          maxWidth: "720px", mx: "auto", mb: "20px",
        }}
      >
        <Link to="/customer/orders">
          <Button
            variant="outlined"
            startIcon={<ArrowBackRounded />}
            sx={{ fontFamily: "Nunito", fontWeight: 700, borderRadius: "100px", fontSize: "0.85rem" }}
          >
            Orders
          </Button>
        </Link>
        <Button
          variant="contained"
          startIcon={<PrintRounded />}
          onClick={() => window.print()}
          sx={{
            fontFamily: "Nunito", fontWeight: 700, borderRadius: "100px", fontSize: "0.85rem",
            background: `linear-gradient(135deg, ${brand.primary} 0%, #0038CC 100%)`,
          }}
        >
          Print / Save PDF
        </Button>
      </Box>

      {/* Invoice card */}
      <Box
        id="invoice-body"
        sx={{
          maxWidth: "720px", mx: "auto",
          backgroundColor: isDark ? "#18181C" : "#FFFFFF",
          borderRadius: "20px",
          border: `1px solid ${borderColor}`,
          overflow: "hidden",
          boxShadow: isDark ? "0 12px 40px rgba(0,0,0,0.5)" : "0 12px 40px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header band */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${brand.primary} 0%, #0038CC 100%)`,
            px: "32px", py: "28px",
            display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            flexWrap: "wrap", gap: "16px",
          }}
        >
          <Box>
            <Typography fontFamily="Playfair Display" fontWeight={900} fontSize="1.6rem" color="#fff">
              Fashionero
            </Typography>
            <Typography fontFamily="Nunito" fontSize="0.82rem" sx={{ color: "rgba(255,255,255,0.75)" }}>
              Premium Fashion & Lifestyle
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography fontFamily="Nunito" fontWeight={800} fontSize="1rem" color="#fff">
              INVOICE
            </Typography>
            <Typography fontFamily="Nunito" fontSize="0.82rem" sx={{ color: "rgba(255,255,255,0.8)" }}>
              #{order._id.slice(-8).toUpperCase()}
            </Typography>
            <Typography fontFamily="Nunito" fontSize="0.78rem" sx={{ color: "rgba(255,255,255,0.65)", mt: "2px" }}>
              {orderDate}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ px: "32px", py: "28px", display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Bill to */}
          {order.address && (
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <Box>
                <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.72rem" color="text.disabled"
                  letterSpacing="0.08em" textTransform="uppercase" mb="8px">
                  Bill To
                </Typography>
                <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.9rem">
                  {order.address.contactName || `${storedUser?.firstName} ${storedUser?.lastName}`}
                </Typography>
                <Typography fontFamily="Nunito" fontSize="0.83rem" color="text.secondary" lineHeight={1.6}>
                  {order.address.address}<br />
                  {order.address.city}, {order.address.state}<br />
                  {order.address.country}
                </Typography>
              </Box>
              <Box>
                <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.72rem" color="text.disabled"
                  letterSpacing="0.08em" textTransform="uppercase" mb="8px">
                  Shipping Details
                </Typography>
                <Typography fontFamily="Nunito" fontSize="0.83rem" color="text.secondary" lineHeight={1.6}>
                  {cap(order.shippingMethod)} Delivery<br />
                  {order.shippingMethod === "express" ? "1–2 business days" : "3–5 business days"}<br />
                  {order.address.phoneNumber}
                </Typography>
              </Box>
            </Box>
          )}

          <Divider sx={{ borderColor }} />

          {/* Items table header */}
          <Box>
            <Box
              sx={{
                display: "grid", gridTemplateColumns: "1fr auto auto auto",
                gap: "8px", pb: "8px", borderBottom: `1px solid ${borderColor}`,
              }}
            >
              {["Item", "Qty", "Unit Price", "Total"].map((h) => (
                <Typography key={h} fontFamily="Nunito" fontWeight={700} fontSize="0.72rem"
                  color="text.disabled" letterSpacing="0.06em" textTransform="uppercase"
                  sx={{ textAlign: h !== "Item" ? "right" : "left" }}>
                  {h}
                </Typography>
              ))}
            </Box>

            {items.map((item, i) => {
              const price = item?.product?.price ?? 0;
              const disc = item?.product?.discount ?? 0;
              const unitPrice = price * ((100 - disc) / 100);
              const lineTotal = unitPrice * item.quantity;
              return (
                <Box
                  key={i}
                  sx={{
                    display: "grid", gridTemplateColumns: "1fr auto auto auto",
                    gap: "8px", py: "12px",
                    borderBottom: i < items.length - 1 ? `1px solid ${borderColor}` : "none",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.88rem">
                      {cap(item?.product?.name)}
                    </Typography>
                    <Typography fontFamily="Nunito" fontSize="0.75rem" color="text.secondary">
                      {cap(item?.product?.category)}
                      {disc > 0 && ` · ${disc}% off`}
                    </Typography>
                  </Box>
                  <Typography fontFamily="Nunito" fontSize="0.85rem" sx={{ textAlign: "right" }}>
                    {item.quantity}
                  </Typography>
                  <Typography fontFamily="Nunito" fontSize="0.85rem" sx={{ textAlign: "right" }}>
                    {fmt(unitPrice)}
                  </Typography>
                  <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.85rem" color="primary" sx={{ textAlign: "right" }}>
                    {fmt(lineTotal)}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          {/* Totals */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Box sx={{ width: "260px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography fontFamily="Nunito" fontSize="0.85rem" color="text.secondary">Subtotal</Typography>
                <Typography fontFamily="Nunito" fontSize="0.85rem">{fmt(subtotal)}</Typography>
              </Box>
              {discountAmount > 0 && (
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography fontFamily="Nunito" fontSize="0.85rem" color="success.main">
                    Discount {order.couponCode ? `(${order.couponCode})` : ""}
                  </Typography>
                  <Typography fontFamily="Nunito" fontSize="0.85rem" color="success.main">
                    -{fmt(discountAmount)}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography fontFamily="Nunito" fontSize="0.85rem" color="text.secondary">
                  Shipping ({cap(order.shippingMethod)})
                </Typography>
                <Typography fontFamily="Nunito" fontSize="0.85rem">{fmt(shippingFee)}</Typography>
              </Box>
              <Divider sx={{ borderColor }} />
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography fontFamily="Nunito" fontWeight={800} fontSize="0.95rem">Total</Typography>
                <Typography fontFamily="Playfair Display" fontWeight={900} fontSize="1.25rem" color="primary">
                  {fmt(grandTotal)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {order.instructions && (
            <>
              <Divider sx={{ borderColor }} />
              <Box>
                <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.72rem" color="text.disabled"
                  letterSpacing="0.08em" textTransform="uppercase" mb="6px">
                  Notes
                </Typography>
                <Typography fontFamily="Nunito" fontSize="0.85rem" color="text.secondary">
                  {order.instructions}
                </Typography>
              </Box>
            </>
          )}

          {/* Footer */}
          <Divider sx={{ borderColor }} />
          <Box sx={{ textAlign: "center", pb: "4px" }}>
            <Typography fontFamily="Nunito" fontSize="0.78rem" color="text.disabled">
              Thank you for shopping with Fashionero · fashionero.com
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; }
          #invoice-body { box-shadow: none !important; border: none !important; border-radius: 0 !important; }
        }
      `}</style>
    </Box>
  );
};

export default OrderInvoice;
