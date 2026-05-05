import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  AttachMoneyRounded,
  DashboardRounded,
  GroupRounded,
  PersonAddRounded,
  ShoppingBagRounded,
  WarningAmberRounded,
} from "@mui/icons-material";
import { brand } from "../../theme";

const ORDER_STATUS_COLORS: Record<string, string> = {
  new: brand.primary,
  processing: brand.warning,
  shipped: brand.secondary,
  delivered: brand.success,
  completed: brand.success,
};

const fmt = (n: number) =>
  "₦" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  accent: string;
  isDark: boolean;
  borderColor: string;
}

const StatCard = ({ label, value, sub, icon, accent, isDark, borderColor }: StatCardProps) => (
  <Box
    sx={{
      flex: "1 1 200px",
      borderRadius: "14px",
      border: `1px solid ${borderColor}`,
      backgroundColor: isDark ? "#0C0C10" : "#FAFAFA",
      p: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    }}
  >
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <Typography fontFamily="Nunito" fontSize="0.72rem" fontWeight={700} color="text.disabled" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </Typography>
      <Box sx={{ color: accent, display: "flex", alignItems: "center" }}>{icon}</Box>
    </Box>
    <Typography fontFamily="Playfair Display" fontWeight={900} fontSize="1.6rem" sx={{ color: accent, lineHeight: 1.1 }}>
      {value}
    </Typography>
    {sub && (
      <Typography fontFamily="Nunito" fontSize="0.75rem" color="text.secondary">
        {sub}
      </Typography>
    )}
  </Box>
);

interface DashboardData {
  revenue: { total: number; thisMonth: number };
  ordersByStatus: Record<string, number>;
  topProducts: { name: string; totalSold: number; price: number; category: string }[];
  totalUsers: number;
  newUsersThisMonth: number;
  lowStockProducts: { _id: string; name: string; supply: number; category: string; price: number }[];
  recentOrders: {
    _id: string;
    status: string;
    price: string;
    createdAt: string;
    order: { product: { name: string } | null; quantity: number }[];
    address: { city: string; state: string } | null;
  }[];
}

const AdminDashboard = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const borderColor = isDark ? "#27272E" : "#EBEBEB";
  const isMd = useMediaQuery("(min-width:720px)");

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${baseUrl}/get/dashboard`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        const json = await res.json();
        setData(json);
      } catch { /* silent */ } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalOrders = data
    ? Object.values(data.ordersByStatus).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          px: { xs: "16px", md: "24px" },
          py: "13px",
          borderBottom: `1px solid ${borderColor}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography fontFamily="Playfair Display" fontWeight={900} fontSize="1.3rem">
            Dashboard
          </Typography>
          <Typography fontFamily="Nunito" fontSize="0.78rem" color="text.secondary">
            Store overview
          </Typography>
        </Box>
        <DashboardRounded sx={{ fontSize: "22px", color: "text.disabled" }} />
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: "80px" }}>
          <CircularProgress size={32} />
        </Box>
      ) : !data ? (
        <Box sx={{ textAlign: "center", py: "60px" }}>
          <Typography fontFamily="Nunito" color="text.secondary">Failed to load dashboard.</Typography>
        </Box>
      ) : (
        <Box sx={{ p: { xs: "16px", md: "24px" }, display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Stat cards */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            <StatCard
              label="Total Revenue"
              value={fmt(data.revenue.total)}
              sub={`${fmt(data.revenue.thisMonth)} this month`}
              icon={<AttachMoneyRounded sx={{ fontSize: "20px" }} />}
              accent={brand.success}
              isDark={isDark}
              borderColor={borderColor}
            />
            <StatCard
              label="Total Orders"
              value={String(totalOrders)}
              sub={`${data.ordersByStatus.new} new`}
              icon={<ShoppingBagRounded sx={{ fontSize: "20px" }} />}
              accent={brand.primary}
              isDark={isDark}
              borderColor={borderColor}
            />
            <StatCard
              label="Total Customers"
              value={String(data.totalUsers)}
              sub={`${data.newUsersThisMonth} joined this month`}
              icon={<GroupRounded sx={{ fontSize: "20px" }} />}
              accent={brand.secondary}
              isDark={isDark}
              borderColor={borderColor}
            />
            <StatCard
              label="New This Month"
              value={String(data.newUsersThisMonth)}
              sub="new customers"
              icon={<PersonAddRounded sx={{ fontSize: "20px" }} />}
              accent={brand.warning}
              isDark={isDark}
              borderColor={borderColor}
            />
          </Box>

          {/* Orders by status */}
          <Box
            sx={{
              borderRadius: "14px",
              border: `1px solid ${borderColor}`,
              backgroundColor: isDark ? "#0C0C10" : "#FAFAFA",
              p: "20px",
            }}
          >
            <Typography fontFamily="Playfair Display" fontWeight={700} fontSize="1rem" mb="14px">
              Orders by Status
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {Object.entries(data.ordersByStatus).map(([status, count]) => (
                <Box
                  key={status}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                    minWidth: "80px",
                    p: "12px 16px",
                    borderRadius: "10px",
                    border: `1px solid ${borderColor}`,
                    backgroundColor: isDark ? "#18181C" : "#fff",
                  }}
                >
                  <Typography fontFamily="Playfair Display" fontWeight={900} fontSize="1.4rem" sx={{ color: ORDER_STATUS_COLORS[status] || brand.primary }}>
                    {count}
                  </Typography>
                  <Typography fontFamily="Nunito" fontSize="0.72rem" fontWeight={700} color="text.secondary" sx={{ textTransform: "capitalize" }}>
                    {status}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Top products + Low stock side by side on md+ */}
          <Box sx={{ display: "flex", flexDirection: isMd ? "row" : "column", gap: "16px" }}>

            {/* Top-selling products */}
            <Box
              sx={{
                flex: 1,
                borderRadius: "14px",
                border: `1px solid ${borderColor}`,
                backgroundColor: isDark ? "#0C0C10" : "#FAFAFA",
                overflow: "hidden",
              }}
            >
              <Box sx={{ px: "20px", py: "14px", borderBottom: `1px solid ${borderColor}` }}>
                <Typography fontFamily="Playfair Display" fontWeight={700} fontSize="1rem">
                  Top-Selling Products
                </Typography>
              </Box>
              {data.topProducts.length === 0 ? (
                <Typography fontFamily="Nunito" fontSize="0.82rem" color="text.secondary" sx={{ p: "20px" }}>
                  No sales data yet.
                </Typography>
              ) : (
                data.topProducts.map((p, i) => (
                  <Box
                    key={i}
                    sx={{
                      px: "20px",
                      py: "12px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: i < data.topProducts.length - 1 ? `1px solid ${borderColor}` : "none",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <Typography
                        fontFamily="Playfair Display"
                        fontWeight={900}
                        fontSize="1rem"
                        sx={{ color: brand.primary, minWidth: "20px" }}
                      >
                        {i + 1}
                      </Typography>
                      <Box>
                        <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.88rem" sx={{ textTransform: "capitalize" }}>
                          {p.name}
                        </Typography>
                        <Typography fontFamily="Nunito" fontSize="0.72rem" color="text.secondary" sx={{ textTransform: "capitalize" }}>
                          {p.category}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.85rem" color={brand.success}>
                        {p.totalSold} sold
                      </Typography>
                      <Typography fontFamily="Nunito" fontSize="0.72rem" color="text.secondary">
                        {fmt(p.price)} each
                      </Typography>
                    </Box>
                  </Box>
                ))
              )}
            </Box>

            {/* Low-stock warning */}
            <Box
              sx={{
                flex: 1,
                borderRadius: "14px",
                border: `1px solid ${borderColor}`,
                backgroundColor: isDark ? "#0C0C10" : "#FAFAFA",
                overflow: "hidden",
              }}
            >
              <Box sx={{ px: "20px", py: "14px", borderBottom: `1px solid ${borderColor}`, display: "flex", alignItems: "center", gap: "8px" }}>
                <WarningAmberRounded sx={{ fontSize: "16px", color: brand.warning }} />
                <Typography fontFamily="Playfair Display" fontWeight={700} fontSize="1rem">
                  Low Stock
                </Typography>
              </Box>
              {data.lowStockProducts.length === 0 ? (
                <Typography fontFamily="Nunito" fontSize="0.82rem" color="text.secondary" sx={{ p: "20px" }}>
                  All products are well-stocked.
                </Typography>
              ) : (
                data.lowStockProducts.map((p, i) => (
                  <Box
                    key={p._id}
                    sx={{
                      px: "20px",
                      py: "12px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: i < data.lowStockProducts.length - 1 ? `1px solid ${borderColor}` : "none",
                    }}
                  >
                    <Box>
                      <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.88rem" sx={{ textTransform: "capitalize" }}>
                        {p.name}
                      </Typography>
                      <Typography fontFamily="Nunito" fontSize="0.72rem" color="text.secondary" sx={{ textTransform: "capitalize" }}>
                        {p.category}
                      </Typography>
                    </Box>
                    <Chip
                      label={p.supply === 0 ? "Out of stock" : `${p.supply} left`}
                      size="small"
                      sx={{
                        backgroundColor: p.supply === 0 ? `${brand.error}18` : `${brand.warning}18`,
                        color: p.supply === 0 ? brand.error : brand.warning,
                        fontFamily: "Nunito",
                        fontWeight: 700,
                        fontSize: "0.72rem",
                      }}
                    />
                  </Box>
                ))
              )}
            </Box>
          </Box>

          {/* Recent orders */}
          <Box
            sx={{
              borderRadius: "14px",
              border: `1px solid ${borderColor}`,
              backgroundColor: isDark ? "#0C0C10" : "#FAFAFA",
              overflow: "hidden",
            }}
          >
            <Box sx={{ px: "20px", py: "14px", borderBottom: `1px solid ${borderColor}` }}>
              <Typography fontFamily="Playfair Display" fontWeight={700} fontSize="1rem">
                Recent Orders
              </Typography>
            </Box>
            {data.recentOrders.length === 0 ? (
              <Typography fontFamily="Nunito" fontSize="0.82rem" color="text.secondary" sx={{ p: "20px" }}>
                No orders yet.
              </Typography>
            ) : (
              data.recentOrders.map((order, i) => {
                const statusColor = ORDER_STATUS_COLORS[order.status] || brand.primary;
                const itemCount = order.order?.length ?? 0;
                const firstItem = order.order?.[0]?.product?.name ?? "—";
                return (
                  <Box
                    key={order._id}
                    sx={{
                      px: "20px",
                      py: "12px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "8px",
                      borderBottom: i < data.recentOrders.length - 1 ? `1px solid ${borderColor}` : "none",
                    }}
                  >
                    <Box>
                      <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.85rem">
                        #{order._id.slice(-8).toUpperCase()}
                      </Typography>
                      <Typography fontFamily="Nunito" fontSize="0.72rem" color="text.secondary" sx={{ textTransform: "capitalize" }}>
                        {firstItem}{itemCount > 1 ? ` +${itemCount - 1} more` : ""}
                        {order.address ? ` · ${order.address.city}, ${order.address.state}` : ""}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.88rem">
                        {fmt(parseFloat(order.price) || 0)}
                      </Typography>
                      <Chip
                        label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        size="small"
                        sx={{
                          backgroundColor: `${statusColor}18`,
                          color: statusColor,
                          fontFamily: "Nunito",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                        }}
                      />
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>

        </Box>
      )}
    </Box>
  );
};

export default AdminDashboard;
