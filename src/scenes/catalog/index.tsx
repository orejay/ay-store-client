import React, { useState, useEffect } from "react";
import {
  Box, Alert, Chip, Collapse, IconButton, Typography, useTheme, useMediaQuery,
} from "@mui/material";
import {
  DeleteOutlineRounded, EditRounded, StorefrontRounded,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "store";
import { setProducts } from "state";
import { brand } from "../../theme";

interface ProductData {
  name: string;
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

const fmt = (n: number) => "₦" + n.toLocaleString("en-NG", { minimumFractionDigits: 2 });

const Catalog = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const borderColor = isDark ? "#27272E" : "#EBEBEB";
  const isSmall = useMediaQuery("(max-width:450px)");
  const isMedium = useMediaQuery("(max-width:768px)");

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const imageUrl = import.meta.env.VITE_IMAGE_URL;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [data, setData] = useState<ProductData[]>([]);
  const [confirm, setConfirm] = useState("");
  const [alert, setAlert] = useState<{ msg: string; sev: "success" | "error" } | null>(null);

  const user: UserData | null = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const res = await fetch(`${baseUrl}/get/products`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const json = await res.json();
      setData(json.products || []);
    } catch { /* silent */ }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`${baseUrl}/edit/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.ok) {
        setAlert({ msg: "Product deleted successfully.", sev: "success" });
        setConfirm("");
        getProducts();
      } else {
        setAlert({ msg: "Could not delete product.", sev: "error" });
      }
    } catch {
      setAlert({ msg: "Network error. Please try again.", sev: "error" });
    }
  };

  const cols = isSmall ? "1fr" : isMedium ? "repeat(2,1fr)" : "repeat(3,1fr)";

  return (
    <Box>
      {/* Header */}
      <Box sx={{ px: { xs: "16px", md: "24px" }, py: "13px", borderBottom: `1px solid ${borderColor}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography fontFamily="Playfair Display" fontWeight={900} fontSize="1.3rem">
            Catalog
          </Typography>
          <Typography fontFamily="Nunito" fontSize="0.78rem" color="text.secondary">
            {data.length} product{data.length !== 1 ? "s" : ""}
          </Typography>
        </Box>
      </Box>

      {/* Alert */}
      <Collapse in={!!alert}>
        <Box sx={{ px: { xs: "16px", md: "24px" }, pt: "16px" }}>
          {alert && (
            <Alert
              severity={alert.sev}
              onClose={() => setAlert(null)}
              sx={{ borderRadius: "10px", fontFamily: "Nunito" }}
            >
              {alert.msg}
            </Alert>
          )}
        </Box>
      </Collapse>

      {/* Grid */}
      <Box sx={{ p: { xs: "16px", md: "24px" } }}>
        {data.length === 0 ? (
          <Box sx={{ textAlign: "center", py: "60px" }}>
            <StorefrontRounded sx={{ fontSize: "48px", color: "text.disabled", mb: "12px" }} />
            <Typography fontFamily="Nunito" fontWeight={700} fontSize="1rem" mb="4px">
              No products yet
            </Typography>
            <Typography fontFamily="Nunito" fontSize="0.85rem" color="text.secondary">
              Add your first product from the sidebar.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: cols, gap: "16px" }}>
            {data.map((each) => (
              <Box
                key={each._id}
                sx={{
                  borderRadius: "14px",
                  border: `1px solid ${borderColor}`,
                  backgroundColor: isDark ? "#09090D" : "#FFFFFF",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.35)" : "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                {/* Product image */}
                <Box
                  sx={{
                    height: "160px",
                    backgroundImage: `url(${imageUrl}/uploads/${each.imageName})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)",
                    }}
                  />
                  {each.discount > 0 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        backgroundColor: brand.secondary,
                        color: "#fff",
                        fontFamily: "Nunito",
                        fontWeight: 800,
                        fontSize: "0.7rem",
                        px: "8px",
                        py: "2px",
                        borderRadius: "100px",
                      }}
                    >
                      -{each.discount}%
                    </Box>
                  )}
                  {each.supply === 0 && (
                    <Chip
                      label="Out of stock"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        fontFamily: "Nunito",
                        fontWeight: 700,
                        fontSize: "0.68rem",
                        backgroundColor: "rgba(239,68,68,0.9)",
                        color: "#fff",
                      }}
                    />
                  )}
                </Box>

                {/* Info */}
                <Box sx={{ px: "14px", py: "12px", flex: 1 }}>
                  <Typography
                    fontFamily="Nunito"
                    fontWeight={600}
                    fontSize="0.7rem"
                    letterSpacing="0.04em"
                    color={brand.secondary}
                    mb="3px"
                    sx={{ textTransform: "uppercase" }}
                  >
                    {each.category}
                  </Typography>
                  <Typography
                    fontFamily="Nunito"
                    fontWeight={700}
                    fontSize="0.92rem"
                    mb="4px"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {each.name[0].toUpperCase()}{each.name.slice(1)}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "6px" }}>
                    <Typography fontFamily="Nunito" fontWeight={800} fontSize="0.95rem" color="primary">
                      {fmt(each.price * ((100 - each.discount) / 100))}
                    </Typography>
                    <Typography fontFamily="Nunito" fontSize="0.75rem" color="text.secondary">
                      Stock: {each.supply}
                    </Typography>
                  </Box>
                </Box>

                {/* Actions */}
                <Box sx={{ px: "12px", py: "8px", borderTop: `1px solid ${borderColor}`, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "4px" }}>
                  {confirm !== each._id ? (
                    <>
                      <IconButton
                        size="small"
                        onClick={() => {
                          dispatch(setProducts([each]));
                          navigate("/admin/products/edit");
                        }}
                        sx={{ color: brand.primary, "&:hover": { backgroundColor: `${brand.primary}12` } }}
                      >
                        <EditRounded sx={{ fontSize: "17px" }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => setConfirm(each._id)}
                        sx={{ color: theme.palette.text.secondary, "&:hover": { color: "#EF4444", backgroundColor: "rgba(239,68,68,0.08)" } }}
                      >
                        <DeleteOutlineRounded sx={{ fontSize: "17px" }} />
                      </IconButton>
                    </>
                  ) : (
                    <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Typography fontFamily="Nunito" fontSize="0.78rem" fontWeight={600} color="text.secondary" fontStyle="italic">
                        Delete?
                      </Typography>
                      <Box
                        onClick={() => deleteProduct(each._id)}
                        sx={{
                          px: "12px", py: "4px", borderRadius: "100px",
                          backgroundColor: "#EF4444", color: "#fff",
                          fontFamily: "Nunito", fontWeight: 700, fontSize: "0.75rem",
                          cursor: "pointer", "&:hover": { backgroundColor: "#DC2626" },
                        }}
                      >
                        Yes
                      </Box>
                      <Box
                        onClick={() => setConfirm("")}
                        sx={{
                          px: "12px", py: "4px", borderRadius: "100px",
                          border: `1px solid ${borderColor}`,
                          fontFamily: "Nunito", fontWeight: 600, fontSize: "0.75rem",
                          cursor: "pointer", color: "text.secondary",
                          "&:hover": { borderColor: brand.primary, color: brand.primary },
                        }}
                      >
                        No
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Catalog;
