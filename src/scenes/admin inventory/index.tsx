import React, { useState, useEffect } from "react";
import {
  Box,
  Chip,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { EditRounded, Inventory2Rounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "store";
import { setProducts } from "state";
import { brand } from "../../theme";

interface ProductData {
  _id: string;
  name: string;
  category: string;
  price: number;
  discount: number;
  supply: number;
  imageName: string;
  variants?: { stock: number }[];
}

interface StoredUser {
  token: string;
}

const STOCK_STATUS = (supply: number) => {
  if (supply === 0) return { label: "Out of Stock", bg: "rgba(239,68,68,0.1)", color: "#EF4444" };
  if (supply <= 5)  return { label: "Low Stock",    bg: "rgba(245,158,11,0.1)", color: "#F59E0B" };
  return               { label: "In Stock",      bg: "rgba(16,185,129,0.1)", color: "#10B981" };
};

const fmt = (n: number) => "₦" + n.toLocaleString("en-NG", { minimumFractionDigits: 2 });

const Inventory = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const borderColor = isDark ? "#27272E" : "#EBEBEB";
  const isSmall = useMediaQuery("(max-width:600px)");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const storedUser: StoredUser | null = JSON.parse(
    localStorage.getItem("user") || "null"
  );
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const imageUrl = import.meta.env.VITE_IMAGE_URL;

  const [data, setData] = useState<ProductData[]>([]);
  const [filter, setFilter] = useState<"all" | "out" | "low" | "ok">("all");

  useEffect(() => {
    fetch(`${baseUrl}/get/products`, {
      headers: { Authorization: `Bearer ${storedUser?.token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        const products: ProductData[] = d.products ?? [];
        // Sort by supply ascending — lowest stock first
        products.sort((a, b) => a.supply - b.supply);
        setData(products);
      })
      .catch(() => {});
  }, []);

  const filtered = data.filter((p) => {
    if (filter === "out") return p.supply === 0;
    if (filter === "low") return p.supply > 0 && p.supply <= 5;
    if (filter === "ok")  return p.supply > 5;
    return true;
  });

  const outCount = data.filter((p) => p.supply === 0).length;
  const lowCount = data.filter((p) => p.supply > 0 && p.supply <= 5).length;

  const TABS = [
    { key: "all", label: `All (${data.length})` },
    { key: "out", label: `Out of Stock (${outCount})` },
    { key: "low", label: `Low Stock (${lowCount})` },
    { key: "ok",  label: `Healthy (${data.length - outCount - lowCount})` },
  ] as const;

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
            Inventory
          </Typography>
          <Typography fontFamily="Nunito" fontSize="0.78rem" color="text.secondary">
            {data.length} product{data.length !== 1 ? "s" : ""} · sorted by stock level
          </Typography>
        </Box>
        <Inventory2Rounded sx={{ fontSize: "22px", color: "text.disabled" }} />
      </Box>

      {/* Filter tabs */}
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
        {TABS.map(({ key, label }) => {
          const isActive = filter === key;
          return (
            <Box
              key={key}
              onClick={() => setFilter(key)}
              sx={{
                px: "14px",
                py: "6px",
                borderRadius: "100px",
                cursor: "pointer",
                fontFamily: "Nunito",
                fontWeight: isActive ? 700 : 500,
                fontSize: "0.82rem",
                backgroundColor: isActive
                  ? brand.primary
                  : isDark
                  ? "rgba(255,255,255,0.05)"
                  : "#F3F4F6",
                color: isActive ? "#fff" : "text.secondary",
                transition: "all 0.15s",
                "&:hover": {
                  backgroundColor: isActive ? brand.primary : `${brand.primary}12`,
                  color: isActive ? "#fff" : brand.primary,
                },
              }}
            >
              {label}
            </Box>
          );
        })}
      </Box>

      {/* Table */}
      <Box sx={{ p: { xs: "16px", md: "24px" } }}>
        {filtered.length === 0 ? (
          <Box sx={{ textAlign: "center", py: "60px" }}>
            <Inventory2Rounded sx={{ fontSize: "48px", color: "text.disabled", mb: "12px" }} />
            <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.95rem">
              No products in this category
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              borderRadius: "14px",
              border: `1px solid ${borderColor}`,
              overflow: "hidden",
            }}
          >
            {/* Column headers */}
            {!isSmall && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "2.5fr 1fr 1fr 0.8fr 0.5fr",
                  px: "16px",
                  py: "10px",
                  backgroundColor: isDark ? "#0C0C10" : "#FAFAFA",
                  borderBottom: `1px solid ${borderColor}`,
                }}
              >
                {["Product", "Category", "Price", "Stock", ""].map((col) => (
                  <Typography
                    key={col}
                    fontFamily="Nunito"
                    fontWeight={700}
                    fontSize="0.72rem"
                    color="text.disabled"
                    sx={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
                  >
                    {col}
                  </Typography>
                ))}
              </Box>
            )}

            {/* Rows */}
            {filtered.map((product, i) => {
              const status = STOCK_STATUS(product.supply);
              const discountedPrice = product.price * ((100 - product.discount) / 100);

              return (
                <Box
                  key={product._id}
                  sx={{
                    px: "16px",
                    py: "12px",
                    borderBottom: i < filtered.length - 1 ? `1px solid ${borderColor}` : "none",
                    borderLeft: `3px solid ${product.supply === 0 ? "#EF4444" : product.supply <= 5 ? "#F59E0B" : "transparent"}`,
                    "&:hover": {
                      backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#FAFAFA",
                    },
                    transition: "background 0.15s",
                    ...(isSmall
                      ? { display: "flex", flexDirection: "column" as const, gap: "8px" }
                      : {
                          display: "grid",
                          gridTemplateColumns: "2.5fr 1fr 1fr 0.8fr 0.5fr",
                          alignItems: "center",
                        }),
                  }}
                >
                  {/* Product name + thumbnail */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Box
                      component="img"
                      src={`${imageUrl}/uploads/${product.imageName}`}
                      alt={product.name}
                      sx={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "8px",
                        objectFit: "cover",
                        flexShrink: 0,
                        backgroundColor: isDark ? "#27272E" : "#F3F4F6",
                      }}
                    />
                    <Typography
                      fontFamily="Nunito"
                      fontWeight={600}
                      fontSize="0.875rem"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {product.name[0].toUpperCase()}{product.name.slice(1)}
                    </Typography>
                  </Box>

                  {/* Category */}
                  <Typography fontFamily="Nunito" fontSize="0.82rem" color="text.secondary"
                    sx={{ textTransform: "capitalize" }}>
                    {isSmall && <Box component="span" sx={{ fontWeight: 700, color: "text.primary", mr: "4px" }}>Category:</Box>}
                    {product.category}
                  </Typography>

                  {/* Price */}
                  <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.875rem" color="primary">
                    {isSmall && <Box component="span" sx={{ fontWeight: 700, color: "text.primary", mr: "4px", fontSize: "0.82rem" }}>Price:</Box>}
                    {fmt(discountedPrice)}
                  </Typography>

                  {/* Stock count + badge */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <Typography fontFamily="Nunito" fontWeight={800} fontSize="0.95rem"
                      color={product.supply === 0 ? "#EF4444" : product.supply <= 5 ? "#F59E0B" : "text.primary"}>
                      {product.supply}
                    </Typography>
                    <Chip
                      label={status.label}
                      size="small"
                      sx={{
                        backgroundColor: status.bg,
                        color: status.color,
                        fontFamily: "Nunito",
                        fontWeight: 700,
                        fontSize: "0.68rem",
                      }}
                    />
                  </Box>

                  {/* Edit action */}
                  <Box sx={{ display: "flex", justifyContent: isSmall ? "flex-end" : "center" }}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        dispatch(setProducts([product as any]));
                        navigate("/admin/products/edit");
                      }}
                      sx={{
                        color: brand.primary,
                        "&:hover": { backgroundColor: `${brand.primary}12` },
                      }}
                    >
                      <EditRounded sx={{ fontSize: "17px" }} />
                    </IconButton>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Inventory;
