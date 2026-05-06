import React, { useState } from "react";
import {
  Box, Button, Checkbox, FormControlLabel,
  IconButton, MenuItem, TextField, Typography, useTheme, useMediaQuery,
} from "@mui/material";
import {
  AddRounded, ArrowBackRounded, CloseRounded, DeleteRounded, DriveFolderUploadRounded,
} from "@mui/icons-material";
import Toast from "components/Toast";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { CATEGORIES, GENDERS } from "constants/productOptions";
import { ProductVariant } from "state";
import { brand } from "../../theme";

interface BodyState {
  name: string; price: string; discount: string; category: string;
  supply: string; description: string; gender: string; brand: string;
  tags: string; featured: boolean;
}

interface UserData { token: string; }

interface VariantRow { _id?: string; size: string; color: string; stock: string; }

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.78rem" letterSpacing="0.06em"
    color="text.secondary" sx={{ textTransform: "uppercase", mb: "12px" }}>
    {children}
  </Typography>
);

const EditProduct = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const borderColor = isDark ? "#27272E" : "#EBEBEB";
  const isSmall = useMediaQuery("(max-width:450px)");
  const isMedium = useMediaQuery("(max-width:768px)");

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const imageUrl = import.meta.env.VITE_IMAGE_URL;

  const products = useSelector((state: RootState) => state.global.products);
  const product = products[0];
  const user: UserData | null = JSON.parse(localStorage.getItem("user") || "null");

  const [newImages, setNewImages] = useState<File[]>([]);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });
  const showToast = (message: string, severity: "success" | "error") => setToast({ open: true, message, severity });
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState<VariantRow[]>(
    (product?.variants || []).map((v: ProductVariant) => ({
      _id: v._id, size: v.size, color: v.color, stock: String(v.stock),
    }))
  );
  const [body, setBody] = useState<BodyState>({
    name: product?.name || "",
    price: String(product?.price || ""),
    discount: String(product?.discount || ""),
    category: product?.category || "",
    supply: String(product?.supply || ""),
    description: product?.description || "",
    gender: product?.gender || "none",
    brand: product?.brand || "",
    tags: product?.tags?.join(", ") || "",
    featured: product?.featured || false,
  });

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages((prev) => [...prev, ...files].slice(0, 10));
  };

  const addVariant = () => setVariants((v) => [...v, { size: "", color: "", stock: "" }]);
  const removeVariant = (i: number) => setVariants((v) => v.filter((_, idx) => idx !== i));
  const updateVariant = (i: number, field: keyof VariantRow, value: string) =>
    setVariants((v) => v.map((vr, idx) => idx === i ? { ...vr, [field]: value } : vr));

  const upload = async () => {
    if (!product) return;
    setLoading(true);
    try {
      const formData = new FormData();
      newImages.forEach((img) => formData.append("image", img));
      formData.append("name", body.name);
      formData.append("price", body.price);
      formData.append("discount", body.discount || "0");
      formData.append("category", body.category);
      formData.append("supply", body.supply);
      formData.append("description", body.description);
      formData.append("gender", body.gender);
      formData.append("brand", body.brand);
      formData.append("tags", body.tags);
      formData.append("featured", String(body.featured));
      formData.append("variants", JSON.stringify(
        variants.map((v) => ({ ...(v._id ? { _id: v._id } : {}), size: v.size, color: v.color, stock: Number(v.stock) }))
      ));

      const res = await fetch(`${baseUrl}/edit/products/${product._id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${user?.token}` },
        body: formData,
      });

      if (res.ok) {
        showToast("Product updated successfully!", "success");
      } else {
        showToast("Failed to update product. Please try again.", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const existingImages: string[] = product?.images?.length
    ? product.images
    : product?.imageName ? [product.imageName] : [];

  const cols = isSmall ? "1fr" : isMedium ? "repeat(2, 1fr)" : "repeat(4, 1fr)";

  return (
    <Box>
      {/* Header */}
      <Box sx={{ px: { xs: "16px", md: "24px" }, py: "10px", borderBottom: `1px solid ${borderColor}`, display: "flex", alignItems: "center", gap: "8px" }}>
        <Link to="/admin/catalog">
          <IconButton size="small">
            <ArrowBackRounded sx={{ fontSize: "20px" }} />
          </IconButton>
        </Link>
        <Box>
          <Typography fontFamily="Playfair Display" fontWeight={900} fontSize="1.3rem">
            Edit Product
          </Typography>
          <Typography fontFamily="Nunito" fontSize="0.78rem" color="text.secondary" sx={{ textTransform: "capitalize" }}>
            {product?.name || ""}
          </Typography>
        </Box>
      </Box>

      <Toast open={toast.open} message={toast.message} severity={toast.severity} onClose={() => setToast((t) => ({ ...t, open: false }))} />

      <Box sx={{ p: { xs: "16px", md: "24px" }, display: "flex", flexDirection: "column", gap: "28px" }}>

        {/* Basic info */}
        <Box>
          <SectionLabel>Basic Information</SectionLabel>
          <Box sx={{ display: "grid", gridTemplateColumns: cols, gap: "16px" }}>
            <TextField label="Product Name" required value={body.name}
              onChange={(e) => setBody((b) => ({ ...b, name: e.target.value }))}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
            <TextField label="Brand" value={body.brand}
              onChange={(e) => setBody((b) => ({ ...b, brand: e.target.value }))}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
            <TextField label="Price (₦)" required type="number" value={body.price}
              onChange={(e) => setBody((b) => ({ ...b, price: e.target.value }))}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
            <TextField label="Discount %" type="number" value={body.discount}
              onChange={(e) => setBody((b) => ({ ...b, discount: e.target.value }))}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
            <TextField label="Category" required select value={body.category}
              onChange={(e) => setBody((b) => ({ ...b, category: e.target.value }))}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}>
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>
              ))}
            </TextField>
            <TextField label="Gender" select value={body.gender}
              onChange={(e) => setBody((b) => ({ ...b, gender: e.target.value }))}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}>
              {GENDERS.map((g) => (
                <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>
              ))}
            </TextField>
            <TextField label="Supply (leave 0 if using variants)" type="number" value={body.supply}
              onChange={(e) => setBody((b) => ({ ...b, supply: e.target.value }))}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={body.featured}
                    onChange={(e) => setBody((b) => ({ ...b, featured: e.target.checked }))}
                    sx={{ color: brand.primary, "&.Mui-checked": { color: brand.primary } }}
                  />
                }
                label={<Typography fontFamily="Nunito" fontWeight={600} fontSize="0.88rem">Featured product</Typography>}
              />
            </Box>
            <TextField label="Description" required multiline rows={3} value={body.description}
              onChange={(e) => setBody((b) => ({ ...b, description: e.target.value }))}
              sx={{ gridColumn: isSmall ? "span 1" : "span 2", "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
            <TextField label="Tags (comma-separated)" value={body.tags}
              onChange={(e) => setBody((b) => ({ ...b, tags: e.target.value }))}
              placeholder="e.g. summer, sale, new arrival"
              sx={{ gridColumn: isSmall ? "span 1" : "span 2", "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
          </Box>
        </Box>

        {/* Current images */}
        {existingImages.length > 0 && (
          <Box>
            <SectionLabel>Current Images</SectionLabel>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {existingImages.map((name, i) => (
                <Box key={i} component="img" src={`${imageUrl}/uploads/${name}`} alt=""
                  sx={{ width: "88px", height: "88px", objectFit: "cover", borderRadius: "10px", border: `1px solid ${borderColor}` }} />
              ))}
            </Box>
          </Box>
        )}

        {/* Add new images */}
        <Box>
          <SectionLabel>Add / Replace Images</SectionLabel>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {newImages.map((file, i) => (
              <Box key={i} sx={{ position: "relative", width: "88px", height: "88px" }}>
                <Box component="img" src={URL.createObjectURL(file)} alt=""
                  sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px", border: `1px solid ${borderColor}` }} />
                <IconButton size="small" onClick={() => setNewImages((prev) => prev.filter((_, idx) => idx !== i))}
                  sx={{ position: "absolute", top: -8, right: -8, backgroundColor: "#fff", p: "3px", boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}>
                  <CloseRounded sx={{ fontSize: "14px", color: "#EF4444" }} />
                </IconButton>
              </Box>
            ))}
            <label htmlFor="edit-product-upload" style={{ cursor: "pointer" }}>
              <Box sx={{
                width: "88px", height: "88px",
                border: `2px dashed ${brand.primary}60`,
                borderRadius: "10px",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                color: brand.primary,
                "&:hover": { backgroundColor: `${brand.primary}08`, borderColor: brand.primary },
                transition: "all 0.15s",
              }}>
                <DriveFolderUploadRounded sx={{ fontSize: "26px" }} />
                <Typography fontFamily="Nunito" fontSize="0.7rem" fontWeight={600} mt="4px">Add</Typography>
              </Box>
            </label>
          </Box>
          <input hidden multiple type="file" id="edit-product-upload" accept="image/*" onChange={handleImages} />
        </Box>

        {/* Variants */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: "12px", mb: "12px" }}>
            <SectionLabel>Variants</SectionLabel>
            <Button size="small" variant="outlined" startIcon={<AddRounded />} onClick={addVariant}
              sx={{ fontFamily: "Nunito", fontWeight: 700, borderRadius: "10px", mb: "12px" }}>
              Add Variant
            </Button>
          </Box>

          {variants.length > 0 && (
            <Box>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 100px 40px", gap: "10px", mb: "8px", px: "4px" }}>
                {["Size", "Color", "Stock", ""].map((h) => (
                  <Typography key={h} fontFamily="Nunito" fontSize="0.72rem" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase" }}>
                    {h}
                  </Typography>
                ))}
              </Box>
              {variants.map((v, i) => (
                <Box key={i} sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 100px 40px", gap: "10px", mb: "8px", alignItems: "center" }}>
                  <TextField size="small" placeholder="e.g. M" value={v.size}
                    onChange={(e) => updateVariant(i, "size", e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }} />
                  <TextField size="small" placeholder="e.g. Red" value={v.color}
                    onChange={(e) => updateVariant(i, "color", e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }} />
                  <TextField size="small" type="number" placeholder="0" value={v.stock}
                    onChange={(e) => updateVariant(i, "stock", e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }} />
                  <IconButton size="small" onClick={() => removeVariant(i)}
                    sx={{ "&:hover": { backgroundColor: "rgba(239,68,68,0.08)", color: "#EF4444" } }}>
                    <DeleteRounded sx={{ fontSize: "18px" }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Submit */}
        <Box>
          <Button
            variant="contained"
            size="large"
            onClick={upload}
            disabled={loading}
            sx={{
              fontFamily: "Nunito", fontWeight: 700, borderRadius: "12px",
              px: "32px", py: "12px",
              background: `linear-gradient(135deg, ${brand.primary}, #0038CC)`,
            }}
          >
            {loading ? "Saving…" : "Save Changes"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EditProduct;
