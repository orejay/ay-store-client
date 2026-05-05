import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  Collapse,
  Divider,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ExpandMoreRounded,
  ShoppingBagOutlined,
  LocationOnOutlined,
  LocalShippingOutlined,
  ReceiptLongOutlined,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { brand } from "../../theme";

interface AddressData {
  _id: string;
  contactName: string;
  phoneNumber: string;
  user: string;
  isDefault: boolean;
  address: string;
  city: string;
  state: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  __v: string;
}
interface ProductData {
  name: string;
  quantity: number;
  price: number;
  rating: number;
  discount: number;
  imageName: string;
  imagePath: string;
  description: string;
  category: string;
  supply: number;
  _id: string;
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
interface OrderData {
  product: ProductData;
  quantity: number;
}
interface OrdersData {
  _id: string;
  order: OrderData[];
  address: AddressData;
  instructions: string;
  userId: string;
  status: string;
}

const statusConfig: Record<
  string,
  { label: string; color: "warning" | "info" | "success" | "error" | "default" }
> = {
  new: { label: "New", color: "warning" },
  processing: { label: "Processing", color: "info" },
  shipped: { label: "Shipped", color: "info" },
  delivered: { label: "Delivered", color: "success" },
  cancelled: { label: "Cancelled", color: "error" },
};

const OrderCard = ({
  order,
  isDark,
  borderColor,
  onCancel,
}: {
  order: OrdersData;
  isDark: boolean;
  borderColor: string;
  onCancel: (id: string) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const cfg = statusConfig[order?.status] ?? { label: order?.status ?? "—", color: "default" as const };

  const fmt = (n: number) => n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const capName = (name?: string) =>
    name ? name.charAt(0).toUpperCase() + name.slice(1) : "Unknown item";

  const items = order?.order ?? [];

  const orderTotal = items.reduce((acc, i) => {
    const price = i?.product?.price ?? 0;
    const qty = i?.quantity ?? 1;
    const discount = i?.product?.discount ?? 0;
    return acc + price * qty * ((100 - discount) / 100);
  }, 0);

  const itemNames = items
    .map((o) => capName(o?.product?.name))
    .join(", ") || "—";

  return (
    <Box
      sx={{
        borderRadius: "16px",
        border: `1px solid ${borderColor}`,
        backgroundColor: isDark ? "#09090D" : "#FFFFFF",
        overflow: "hidden",
        transition: "box-shadow 0.25s ease",
        "&:hover": {
          boxShadow: isDark ? "0 8px 28px rgba(0,0,0,0.5)" : "0 8px 28px rgba(0,0,0,0.08)",
        },
      }}
    >
      {/* Card header */}
      <Box
        sx={{
          px: "18px", py: "14px",
          borderBottom: `1px solid ${borderColor}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: "8px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ReceiptLongOutlined sx={{ fontSize: "15px", color: "text.secondary" }} />
          <Typography fontFamily="Nunito" fontSize="0.78rem" color="text.secondary" fontWeight={600}>
            #{order?._id?.slice(-8)?.toUpperCase() ?? "—"}
          </Typography>
        </Box>
        <Chip label={cfg.label} color={cfg.color} size="small"
          sx={{ fontFamily: "Nunito", fontWeight: 700, fontSize: "0.72rem" }} />
      </Box>

      {/* Card body */}
      <Box sx={{ p: "18px" }}>
        {/* Item count + total */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: "14px" }}>
          <Box>
            <Typography fontFamily="Nunito" fontWeight={800} fontSize="1rem" mb="2px">
              {items.length} {items.length === 1 ? "item" : "items"}
            </Typography>
            <Typography fontFamily="Nunito" fontSize="0.8rem" color="text.secondary">
              {itemNames}
            </Typography>
          </Box>
          <Typography fontFamily="Playfair Display" fontWeight={900} fontSize="1.05rem" color="primary">
            ${fmt(orderTotal)}
          </Typography>
        </Box>

        {/* Delivery address */}
        {order?.address && (
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: "8px", mb: "14px" }}>
            <LocationOnOutlined sx={{ fontSize: "15px", color: brand.secondary, mt: "2px", flexShrink: 0 }} />
            <Typography fontFamily="Nunito" fontSize="0.82rem" color="text.secondary" lineHeight={1.55}>
              {[order?.address?.address, order?.address?.city, order?.address?.state]
                .filter(Boolean).join(", ")}
              {order?.address?.phoneNumber ? ` · ${order.address.phoneNumber}` : ""}
            </Typography>
          </Box>
        )}

        {/* Actions row */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            {order?.status === "new" && !confirming && (
              <Button size="small" color="error" variant="outlined"
                sx={{ borderRadius: "100px", fontFamily: "Nunito", fontWeight: 700, fontSize: "0.78rem", py: "4px" }}
                onClick={() => setConfirming(true)}>
                Cancel Order
              </Button>
            )}
            {confirming && (
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.82rem" color="text.secondary">
                  Confirm cancel?
                </Typography>
                <Button size="small" variant="contained" color="error"
                  sx={{ borderRadius: "100px", fontFamily: "Nunito", fontWeight: 700, fontSize: "0.76rem", py: "3px", minWidth: "auto", px: "12px" }}
                  onClick={() => { onCancel(order._id); setConfirming(false); }}>
                  Yes
                </Button>
                <Button size="small" variant="outlined"
                  sx={{ borderRadius: "100px", fontFamily: "Nunito", fontWeight: 700, fontSize: "0.76rem", py: "3px", minWidth: "auto", px: "12px" }}
                  onClick={() => setConfirming(false)}>
                  No
                </Button>
              </Box>
            )}
          </Box>
          <IconButton size="small" onClick={() => setExpanded(!expanded)}
            sx={{ transition: "transform 0.25s ease", transform: expanded ? "rotate(180deg)" : "rotate(0deg)", color: "text.secondary" }}>
            <ExpandMoreRounded sx={{ fontSize: "20px" }} />
          </IconButton>
        </Box>

        {/* Expanded items */}
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Divider sx={{ borderColor, my: "14px" }} />
          <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.78rem" color="text.secondary"
            letterSpacing="0.06em" textTransform="uppercase" mb="12px">
            Order Items
          </Typography>
          {items.map((item, i) => {
            const price = item?.product?.price ?? 0;
            const qty = item?.quantity ?? 1;
            const discount = item?.product?.discount ?? 0;
            const lineTotal = price * qty * ((100 - discount) / 100);
            return (
              <Box key={i} sx={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                py: "10px",
                borderBottom: i < items.length - 1 ? `1px solid ${borderColor}` : "none",
              }}>
                <Box>
                  <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.88rem">
                    {capName(item?.product?.name)}
                  </Typography>
                  <Typography fontFamily="Nunito" fontSize="0.76rem" color="text.secondary">
                    {item?.product?.category ?? "—"} · Qty {item?.quantity ?? 1}
                  </Typography>
                </Box>
                <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.88rem" color="primary">
                  ${fmt(lineTotal)}
                </Typography>
              </Box>
            );
          })}
        </Collapse>
      </Box>
    </Box>
  );
};

const Orders = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery("(max-width:600px)");
  const user: UserData | null = JSON.parse(
    localStorage.getItem("user") || "null",
  );
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [data, setData] = useState<OrdersData[]>([]);
  const borderColor = isDark ? "#27272E" : "#EBEBEB";

  const getOrders = async () => {
    try {
      const response = await fetch(`${baseUrl}/get/orders`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const jsonData = await response.json();
      setData(jsonData);
    } catch {
      /* silent */
    }
  };

  const cancelOrder = async (id: string) => {
    try {
      const response = await fetch(`${baseUrl}/edit/orders/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (response.ok) getOrders();
    } catch {
      /* silent */
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <Box sx={{ p: { xs: "16px", md: "28px" } }}>
      {/* Page header */}
      <Box
        sx={{
          pb: "20px",
          borderBottom: `1px solid ${borderColor}`,
          mb: "24px",
        }}
      >
        <Typography
          fontFamily="Playfair Display"
          fontWeight={900}
          fontSize="1.3rem"
        >
          My Orders
        </Typography>
        <Typography
          fontFamily="Nunito"
          fontSize="0.82rem"
          color="text.secondary"
          mt="2px"
        >
          Track and manage your order history
        </Typography>
      </Box>

      {data.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)",
            gap: "16px",
          }}
        >
          {data.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              isDark={isDark}
              borderColor={borderColor}
              onCancel={cancelOrder}
            />
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: "60px",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: `${brand.primary}12`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: "20px",
            }}
          >
            <ShoppingBagOutlined
              sx={{ fontSize: "38px", color: brand.primary }}
            />
          </Box>
          <Typography
            fontFamily="Playfair Display"
            fontWeight={700}
            fontSize="1.3rem"
            mb="10px"
          >
            No orders yet
          </Typography>
          <Typography
            fontFamily="Nunito"
            color="text.secondary"
            fontSize="0.9rem"
            mb="28px"
            sx={{ maxWidth: "340px" }}
          >
            When you place an order, it will appear here. All your order details
            and status updates are saved in one place.
          </Typography>
          <Link to="/shop">
            <Button variant="contained" sx={{ px: "32px", py: "12px" }}>
              Start Shopping
            </Button>
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default Orders;
