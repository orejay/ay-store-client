import React, { useState, useEffect } from "react";
import {
  Box, Button, Chip, Collapse, FormControl, IconButton, MenuItem,
  Select, TextField, Typography, useTheme, useMediaQuery,
} from "@mui/material";
import {
  CalendarTodayRounded, CloseRounded, ExpandMoreRounded, ExpandLessRounded,
  LocalShippingOutlined, LocationOnOutlined, PhoneRounded,
} from "@mui/icons-material";
import { brand } from "../../theme";
import Pagination from "components/Pagination";

const ORDER_STATUSES = ["new", "processing", "shipped", "delivered", "completed"];

const TABS = [
  { key: "all", label: "All Orders" },
  { key: "new", label: "New" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "completed", label: "Completed" },
] as const;

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  new:        { bg: `${brand.primary}18`,  color: brand.primary },
  processing: { bg: "#F59E0B18",           color: "#F59E0B" },
  shipped:    { bg: `${brand.secondary}18`, color: brand.secondary },
  delivered:  { bg: "#10B98118",           color: "#10B981" },
  completed:  { bg: "#10B98118",           color: "#10B981" },
};

const fmt = (n: number) => "₦" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });

interface AddressData {
  _id: string; contactName: string; phoneNumber: string;
  address: string; city: string; state: string; country: string;
}
interface ProductData {
  name: string; price: number; discount: number; category: string; _id: string;
}
interface OrderData { product: ProductData; quantity: number; }
interface OrdersData {
  _id: string;
  order: OrderData[];
  address: AddressData;
  instructions: string;
  userId: string;
  status: string;
  createdAt: string;
}
interface UserData { token: string; }

const OrderCard = ({
  each, onStatusUpdate, isDark, borderColor,
}: {
  each: OrdersData;
  onStatusUpdate: (id: string, status: string) => void;
  isDark: boolean;
  borderColor: string;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(each.status);
  const statusStyle = STATUS_STYLE[each.status] ?? STATUS_STYLE.new;

  const total = (each.order ?? []).reduce((acc, item) => {
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
      {/* Header */}
      <Box
        sx={{
          px: "16px", py: "12px",
          borderBottom: `1px solid ${borderColor}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          backgroundColor: isDark ? "#0C0C10" : "#FAFAFA",
        }}
      >
        <Box>
          <Typography fontFamily="Nunito" fontSize="0.7rem" color="text.disabled" mb="2px">
            ORDER ID
          </Typography>
          <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.8rem" letterSpacing="0.03em">
            #{each._id.slice(-10).toUpperCase()}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Typography fontFamily="Nunito" fontSize="0.72rem" color="text.disabled">
            {each.createdAt ? fmtDate(each.createdAt) : ""}
          </Typography>
          <Chip
            label={each.status.charAt(0).toUpperCase() + each.status.slice(1)}
            size="small"
            sx={{
              backgroundColor: statusStyle.bg,
              color: statusStyle.color,
              fontFamily: "Nunito", fontWeight: 700, fontSize: "0.72rem",
            }}
          />
        </Box>
      </Box>

      {/* Body */}
      <Box sx={{ px: "16px", py: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
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
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "4px" }}>
          <Typography fontFamily="Nunito" fontSize="0.78rem" color="text.secondary">
            {(each.order ?? []).length} item{(each.order ?? []).length !== 1 ? "s" : ""}
          </Typography>
          <Typography fontFamily="Playfair Display" fontWeight={900} fontSize="1rem" color="primary">
            {fmt(total)}
          </Typography>
        </Box>
      </Box>

      {/* Status update */}
      {each.status !== "completed" && (
        <Box
          sx={{
            px: "16px", py: "10px",
            borderTop: `1px solid ${borderColor}`,
            display: "flex", gap: "10px", alignItems: "center",
          }}
        >
          <FormControl size="small" sx={{ flex: 1 }}>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              sx={{ fontFamily: "Nunito", fontSize: "0.85rem", borderRadius: "10px" }}
            >
              {ORDER_STATUSES.map((s) => (
                <MenuItem key={s} value={s}
                  sx={{ fontFamily: "Nunito", fontSize: "0.85rem", textTransform: "capitalize" }}>
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
          display: "flex", justifyContent: "space-between", alignItems: "center",
          cursor: "pointer",
          "&:hover": { backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB" },
          transition: "background 0.15s",
        }}
      >
        <Typography fontFamily="Nunito" fontSize="0.78rem" fontWeight={600} color="text.secondary">
          {expanded ? "Hide items" : "View items"}
        </Typography>
        {expanded
          ? <ExpandLessRounded sx={{ fontSize: "18px", color: "text.secondary" }} />
          : <ExpandMoreRounded sx={{ fontSize: "18px", color: "text.secondary" }} />}
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ px: "16px", pb: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {(each.order ?? []).map((item, i) => {
            const lineTotal = (item?.product?.price ?? 0) * (item?.quantity ?? 1)
              * ((100 - (item?.product?.discount ?? 0)) / 100);
            return (
              <Box key={i} sx={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                py: "8px",
                borderBottom: i < (each.order ?? []).length - 1 ? `1px solid ${borderColor}` : "none",
              }}>
                <Box>
                  <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.85rem">
                    {item?.product?.name
                      ? `${item.product.name[0].toUpperCase()}${item.product.name.slice(1)}`
                      : "Unknown"}
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

  const [filters, setFilters] = useState({ tab: "all", from: "", to: "", page: 1 });
  const [data, setData] = useState<OrdersData[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const user: UserData | null = JSON.parse(localStorage.getItem("user") || "null");
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const setTab  = (tab: string)  => setFilters((f) => ({ ...f, tab,  page: 1 }));
  const setFrom = (from: string) => setFilters((f) => ({ ...f, from, page: 1 }));
  const setTo   = (to: string)   => setFilters((f) => ({ ...f, to,   page: 1 }));
  const setPage = (page: number) => setFilters((f) => ({ ...f, page }));

  const clearDates = () => setFilters((f) => ({ ...f, from: "", to: "", page: 1 }));

  useEffect(() => {
    const { tab, from, to, page } = filters;
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (from) params.append("from", from);
    if (to)   params.append("to",   to);

    fetch(`${baseUrl}/get/allorders/${tab}?${params}`, {
      headers: { Authorization: `Bearer ${user?.token}` },
    })
      .then((r) => r.json())
      .then((json) => {
        const orders = json.orders ?? (Array.isArray(json) ? json : []);
        setData(orders);
        setTotal(json.total ?? orders.length);
        setTotalPages(json.totalPages ?? 1);
      })
      .catch(() => {});
  }, [filters]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`${baseUrl}/edit/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user?.token}` },
        body: JSON.stringify({ status }),
      });
      setFilters((f) => ({ ...f }));
    } catch { /* silent */ }
  };

  const hasDateFilter = filters.from || filters.to;

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          px: { xs: "16px", md: "24px" }, py: "13px",
          borderBottom: `1px solid ${borderColor}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}
      >
        <Box>
          <Typography fontFamily="Playfair Display" fontWeight={900} fontSize="1.3rem">
            Manage Orders
          </Typography>
          <Typography fontFamily="Nunito" fontSize="0.78rem" color="text.secondary">
            {total} order{total !== 1 ? "s" : ""}
            {hasDateFilter ? " (filtered by date)" : ""}
          </Typography>
        </Box>
        <LocalShippingOutlined sx={{ fontSize: "22px", color: "text.disabled" }} />
      </Box>

      {/* Status tabs */}
      <Box
        sx={{
          px: { xs: "16px", md: "24px" }, py: "12px",
          borderBottom: `1px solid ${borderColor}`,
          display: "flex", gap: "8px", flexWrap: "wrap",
        }}
      >
        {TABS.map(({ key, label }) => {
          const isActive = filters.tab === key;
          return (
            <Box
              key={key}
              onClick={() => setTab(key)}
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
              }}
            >
              {label}
            </Box>
          );
        })}
      </Box>

      {/* Date range filter */}
      <Box
        sx={{
          px: { xs: "16px", md: "24px" }, py: "12px",
          borderBottom: `1px solid ${borderColor}`,
          display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap",
        }}
      >
        <CalendarTodayRounded sx={{ fontSize: "16px", color: "text.disabled" }} />
        <TextField
          label="From"
          type="date"
          size="small"
          value={filters.from}
          onChange={(e) => setFrom(e.target.value)}
          InputLabelProps={{ shrink: true, style: { fontFamily: "Nunito" } }}
          inputProps={{ style: { fontFamily: "Nunito", fontSize: "0.85rem" } }}
          sx={{ width: "160px" }}
        />
        <TextField
          label="To"
          type="date"
          size="small"
          value={filters.to}
          onChange={(e) => setTo(e.target.value)}
          InputLabelProps={{ shrink: true, style: { fontFamily: "Nunito" } }}
          inputProps={{ style: { fontFamily: "Nunito", fontSize: "0.85rem" } }}
          sx={{ width: "160px" }}
        />
        {hasDateFilter && (
          <IconButton size="small" onClick={clearDates} sx={{ color: "text.secondary" }}>
            <CloseRounded sx={{ fontSize: "18px" }} />
          </IconButton>
        )}
      </Box>

      {/* Orders grid */}
      <Box sx={{ p: { xs: "16px", md: "24px" } }}>
        {data.length === 0 ? (
          <Box sx={{ textAlign: "center", py: "60px" }}>
            <LocalShippingOutlined sx={{ fontSize: "48px", color: "text.disabled", mb: "12px" }} />
            <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.95rem" mb="4px">
              No orders found
            </Typography>
            <Typography fontFamily="Nunito" fontSize="0.82rem" color="text.secondary">
              {hasDateFilter ? "Try a different date range." : `No ${filters.tab === "all" ? "" : filters.tab + " "}orders yet.`}
            </Typography>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: isSmall ? "1fr" : "repeat(2, 1fr)",
                gap: "16px",
                mb: "24px",
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
            <Pagination
              page={filters.page}
              totalPages={totalPages}
              onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default ManageOrders;
