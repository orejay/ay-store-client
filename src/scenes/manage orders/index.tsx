import React, { useState, useEffect } from "react";
import {
  Box, Button, Chip, Collapse, FormControl, IconButton, MenuItem,
  Select, Typography, useTheme, useMediaQuery,
} from "@mui/material";
import {
  ExpandMoreRounded, ExpandLessRounded, LocalShippingOutlined,
  LocationOnOutlined, PhoneRounded,
} from "@mui/icons-material";
import { brand } from "../../theme";

const ORDER_STATUSES = ["new", "processing", "shipped", "delivered", "completed"];

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  new: { bg: `${brand.primary}18`, color: brand.primary },
  processing: { bg: "#F59E0B18", color: "#F59E0B" },
  shipped: { bg: `${brand.secondary}18`, color: brand.secondary },
  delivered: { bg: "#10B98118", color: "#10B981" },
  completed: { bg: "#10B98118", color: "#10B981" },
};

interface AddressData {
  _id: string; contactName: string; phoneNumber: string;
  address: string; city: string; state: string; country: string;
}

interface ProductData {
  name: string; quantity: number; price: number;
  discount: number; category: string; _id: string;
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

interface UserData {
  token: string;
}

const OrderCard = ({
  each,
  onStatusUpdate,
  isDark,
  borderColor,
}: {
  each: OrdersData;
  onStatusUpdate: (id: string, status: string) => void;
  isDark: boolean;
  borderColor: string;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(each.status);
  const statusStyle = STATUS_STYLE[each.status] || STATUS_STYLE.new;
  const fmt = (n: number) => "₦" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const total = (each.order || []).reduce((acc, item) => {
    const p = item?.product?.price ?? 0;
    const q = item?.quantity ?? 1;
    const d = item?.product?.discount ?? 0;
    return acc + p * q * ((100 - d) / 100);
  }, 0);

  return (
    <Box
      sx={{
        borderRadius: "14px",
        border: `1px solid ${borderColor}`,
        backgroundColor: isDark ? "#09090D" : "#FFFFFF",
        overflow: "hidden",
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
          backgroundColor: isDark ? "#0C0C10" : "#FAFAFA",
        }}
      >
        <Box>
          <Typography fontFamily="Nunito" fontSize="0.7rem" color="text.disabled" mb="2px">
            ORDER ID
          </Typography>
          <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.8rem" sx={{ letterSpacing: "0.03em" }}>
            #{each._id.slice(-10).toUpperCase()}
          </Typography>
        </Box>
        <Chip
          label={each.status.charAt(0).toUpperCase() + each.status.slice(1)}
          size="small"
          sx={{
            backgroundColor: statusStyle.bg,
            color: statusStyle.color,
            fontFamily: "Nunito",
            fontWeight: 700,
            fontSize: "0.72rem",
          }}
        />
      </Box>

      {/* Card body */}
      <Box sx={{ px: "16px", py: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {/* Address */}
        <Box sx={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
          <LocationOnOutlined sx={{ fontSize: "16px", color: "text.disabled", mt: "1px", flexShrink: 0 }} />
          <Typography fontFamily="Nunito" fontSize="0.83rem" color="text.secondary">
            {each.address?.address}, {each.address?.city}, {each.address?.state}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <PhoneRounded sx={{ fontSize: "16px", color: "text.disabled", flexShrink: 0 }} />
          <Typography fontFamily="Nunito" fontSize="0.83rem" color="text.secondary">
            {each.address?.phoneNumber}
          </Typography>
        </Box>

        {/* Total */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "4px" }}>
          <Typography fontFamily="Nunito" fontSize="0.78rem" color="text.secondary">
            {(each.order || []).length} item{(each.order || []).length !== 1 ? "s" : ""}
          </Typography>
          <Typography fontFamily="Playfair Display" fontWeight={900} fontSize="1rem" color="primary">
            {fmt(total)}
          </Typography>
        </Box>
      </Box>

      {/* Actions */}
      {each.status !== "completed" && (
        <Box sx={{ px: "16px", py: "10px", borderTop: `1px solid ${borderColor}`, display: "flex", gap: "10px", alignItems: "center" }}>
          <FormControl size="small" sx={{ flex: 1 }}>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              sx={{ fontFamily: "Nunito", fontSize: "0.85rem", borderRadius: "10px" }}
            >
              {ORDER_STATUSES.map((s) => (
                <MenuItem key={s} value={s} sx={{ fontFamily: "Nunito", fontSize: "0.85rem", textTransform: "capitalize" }}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            size="small"
            onClick={() => onStatusUpdate(each._id, selectedStatus)}
            sx={{ fontFamily: "Nunito", fontWeight: 700, borderRadius: "10px", whiteSpace: "nowrap", px: "16px" }}
          >
            Update
          </Button>
        </Box>
      )}

      {/* Expand items */}
      <Box
        onClick={() => setExpanded(!expanded)}
        sx={{
          px: "16px", py: "8px",
          borderTop: `1px solid ${borderColor}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          "&:hover": { backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB" },
          transition: "background 0.15s",
        }}
      >
        <Typography fontFamily="Nunito" fontSize="0.78rem" fontWeight={600} color="text.secondary">
          {expanded ? "Hide items" : "View items"}
        </Typography>
        {expanded ? (
          <ExpandLessRounded sx={{ fontSize: "18px", color: "text.secondary" }} />
        ) : (
          <ExpandMoreRounded sx={{ fontSize: "18px", color: "text.secondary" }} />
        )}
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ px: "16px", pb: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {(each.order || []).map((item, i) => {
            const lineTotal = (item?.product?.price ?? 0) * (item?.quantity ?? 1) * ((100 - (item?.product?.discount ?? 0)) / 100);
            return (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: "8px",
                  borderBottom: i < (each.order || []).length - 1 ? `1px solid ${borderColor}` : "none",
                }}
              >
                <Box>
                  <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.85rem">
                    {item?.product?.name ? `${item.product.name[0].toUpperCase()}${item.product.name.slice(1)}` : "Unknown"}
                  </Typography>
                  <Typography fontFamily="Nunito" fontSize="0.75rem" color="text.secondary">
                    Qty: {item?.quantity ?? 1}
                  </Typography>
                </Box>
                <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.88rem" color="primary">
                  {fmt(lineTotal)}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Collapse>
    </Box>
  );
};

const ManageOrders = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const borderColor = isDark ? "#27272E" : "#EBEBEB";
  const isSmall = useMediaQuery("(max-width:600px)");

  const [tab, setTab] = useState("new");
  const [data, setData] = useState<OrdersData[]>([]);
  const [total, setTotal] = useState(0);

  const user: UserData | null = JSON.parse(localStorage.getItem("user") || "null");
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const getAllOrders = async (status: string) => {
    try {
      const res = await fetch(`${baseUrl}/get/allorders/${status}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const json = await res.json();
      const orders = json.orders ?? (Array.isArray(json) ? json : []);
      setData(orders);
      setTotal(json.total ?? orders.length);
    } catch { /* silent */ }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`${baseUrl}/edit/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user?.token}` },
        body: JSON.stringify({ status }),
      });
      getAllOrders(tab);
    } catch { /* silent */ }
  };

  useEffect(() => {
    getAllOrders(tab);
  }, []);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ px: { xs: "16px", md: "24px" }, py: "13px", borderBottom: `1px solid ${borderColor}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography fontFamily="Playfair Display" fontWeight={900} fontSize="1.3rem">
            Manage Orders
          </Typography>
          <Typography fontFamily="Nunito" fontSize="0.78rem" color="text.secondary">
            {total} order{total !== 1 ? "s" : ""}
          </Typography>
        </Box>
        <LocalShippingOutlined sx={{ fontSize: "22px", color: "text.disabled" }} />
      </Box>

      {/* Status tabs */}
      <Box
        sx={{
          px: { xs: "16px", md: "24px" },
          py: "12px",
          borderBottom: `1px solid ${borderColor}`,
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        {ORDER_STATUSES.map((s) => {
          const isActive = tab === s;
          return (
            <Box
              key={s}
              onClick={() => { setTab(s); getAllOrders(s); }}
              sx={{
                px: "14px", py: "6px",
                borderRadius: "100px",
                cursor: "pointer",
                fontFamily: "Nunito",
                fontWeight: isActive ? 700 : 500,
                fontSize: "0.82rem",
                backgroundColor: isActive ? brand.primary : isDark ? "rgba(255,255,255,0.05)" : "#F3F4F6",
                color: isActive ? "#fff" : "text.secondary",
                transition: "all 0.15s",
                "&:hover": { backgroundColor: isActive ? brand.primary : `${brand.primary}12`, color: isActive ? "#fff" : brand.primary },
                textTransform: "capitalize",
              }}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Box>
          );
        })}
      </Box>

      {/* Orders grid */}
      <Box sx={{ p: { xs: "16px", md: "24px" } }}>
        {data.length === 0 ? (
          <Box sx={{ textAlign: "center", py: "60px" }}>
            <LocalShippingOutlined sx={{ fontSize: "48px", color: "text.disabled", mb: "12px" }} />
            <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.95rem" mb="4px">
              No {tab} orders
            </Typography>
            <Typography fontFamily="Nunito" fontSize="0.82rem" color="text.secondary">
              Orders with "{tab}" status will appear here.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: isSmall ? "1fr" : "repeat(2, 1fr)",
              gap: "16px",
            }}
          >
            {data.map((each) => (
              <OrderCard
                key={each._id}
                each={each}
                onStatusUpdate={updateStatus}
                isDark={isDark}
                borderColor={borderColor}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ManageOrders;
