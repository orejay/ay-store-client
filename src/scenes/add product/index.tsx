import { AddAPhotoRounded, AddRounded, Close, DeleteRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";
import { CATEGORIES, GENDERS } from "constants/productOptions";

interface BodyState {
  name: string;
  price: string;
  discount: string;
  category: string;
  supply: string;
  description: string;
  gender: string;
  brand: string;
  tags: string;
  featured: boolean;
}

interface Variant {
  size: string;
  color: string;
  stock: string;
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

const AddProduct = () => {
  const isSmallScreen = useMediaQuery("(max-width:450px)");
  const isMediumScreen = useMediaQuery("(max-width:768px)");
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [closeModal, setCloseModal] = useState<boolean>(true);
  const [added, setAdded] = useState<boolean>(false);
  const [variants, setVariants] = useState<Variant[]>([]);
  const user: UserData | null = JSON.parse(localStorage.getItem("user") || "null") as UserData | null;
  const [body, setBody] = useState<BodyState>({
    name: "",
    price: "",
    discount: "",
    category: "",
    supply: "",
    description: "",
    gender: "none",
    brand: "",
    tags: "",
    featured: false,
  });

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages((prev) => [...prev, ...files].slice(0, 10));
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addVariant = () => setVariants((v) => [...v, { size: "", color: "", stock: "" }]);
  const removeVariant = (i: number) => setVariants((v) => v.filter((_, idx) => idx !== i));
  const updateVariant = (i: number, field: keyof Variant, value: string) => {
    setVariants((v) => v.map((vr, idx) => idx === i ? { ...vr, [field]: value } : vr));
  };

  const upload = async () => {
    try {
      if (selectedImages.length === 0) return;
      const formData = new FormData();
      selectedImages.forEach((img) => formData.append("images", img));
      formData.append("name", body.name);
      formData.append("price", body.price);
      formData.append("discount", body.discount);
      formData.append("category", body.category);
      formData.append("supply", body.supply);
      formData.append("description", body.description);
      formData.append("gender", body.gender);
      formData.append("brand", body.brand);
      formData.append("tags", body.tags);
      formData.append("featured", String(body.featured));
      if (variants.length > 0) {
        formData.append("variants", JSON.stringify(
          variants.map((v) => ({ size: v.size, color: v.color, stock: Number(v.stock) }))
        ));
      }

      const response = await fetch(`${baseUrl}/post/products`, {
        method: "POST",
        headers: { Authorization: `Bearer ${user?.token}` },
        body: formData,
      });

      if (response.ok) {
        setAdded(true);
        setCloseModal(false);
        setSelectedImages([]);
        setVariants([]);
        setBody({ name: "", price: "", discount: "", category: "", supply: "", description: "", gender: "none", brand: "", tags: "", featured: false });
      } else {
        setAdded(false);
        setCloseModal(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const cols = isSmallScreen ? "1fr" : isMediumScreen ? "repeat(2,1fr)" : "repeat(4,1fr)";

  return (
    <Box>
      <Box sx={{ borderBottom: "1px solid #E0E0E0", px: "30px", py: "13px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography fontFamily="Playfair Display" fontWeight="bold" color="secondary" variant="h5">
          Add Product
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center">
        <CSSTransition in={!closeModal} timeout={1000} classNames="fade" unmountOnExit>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: "5px", backgroundColor: added ? "#00C98D" : "#ff5316", pl: "30px", pr: "10px", width: "100%" }}>
            <Typography fontFamily="Nunito" sx={{ color: "white", fontStyle: "italic" }}>
              {added ? "Product Added Successfully!" : "Something Went Wrong!"}
            </Typography>
            <IconButton onClick={() => setCloseModal(true)}>
              <Close sx={{ color: "white" }} />
            </IconButton>
          </Box>
        </CSSTransition>

        <Box sx={{ display: "grid", gridTemplateColumns: cols, gap: "30px", pt: "20px", width: "90%" }}>
          <FormControl variant="outlined" sx={{ mb: "20px" }}>
            <InputLabel color="secondary">Product Name</InputLabel>
            <Input required type="text" color="secondary" onChange={(e) => setBody((b) => ({ ...b, name: e.target.value }))} />
          </FormControl>

          <FormControl variant="outlined" sx={{ mb: "20px" }}>
            <InputLabel color="secondary">Brand</InputLabel>
            <Input type="text" color="secondary" onChange={(e) => setBody((b) => ({ ...b, brand: e.target.value }))} />
          </FormControl>

          <FormControl variant="outlined" sx={{ mb: "20px" }}>
            <InputLabel color="secondary">Price</InputLabel>
            <Input required type="text" color="secondary" onChange={(e) => setBody((b) => ({ ...b, price: e.target.value }))} />
          </FormControl>

          <FormControl variant="outlined" sx={{ mb: "20px" }}>
            <InputLabel color="secondary">Discount %</InputLabel>
            <Input required type="text" color="secondary" onChange={(e) => setBody((b) => ({ ...b, discount: e.target.value }))} />
          </FormControl>

          <FormControl variant="standard" sx={{ mb: "20px" }}>
            <InputLabel color="secondary">Category</InputLabel>
            <Select onChange={(e) => setBody((b) => ({ ...b, category: e.target.value as string }))}>
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="standard" sx={{ mb: "20px" }}>
            <InputLabel color="secondary">Gender</InputLabel>
            <Select value={body.gender} onChange={(e) => setBody((b) => ({ ...b, gender: e.target.value as string }))}>
              {GENDERS.map((g) => (
                <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="outlined" sx={{ mb: "20px" }}>
            <InputLabel color="secondary">Supply (no variants)</InputLabel>
            <Input required type="text" color="secondary" onChange={(e) => setBody((b) => ({ ...b, supply: e.target.value }))} />
          </FormControl>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FormControlLabel
              control={<Checkbox checked={body.featured} onChange={(e) => setBody((b) => ({ ...b, featured: e.target.checked }))} sx={{ color: "#Ed981b", "&.Mui-checked": { color: "#Ed981b" } }} />}
              label={<Typography fontFamily="Nunito" fontWeight="bold">Featured</Typography>}
            />
          </Box>

          <FormControl variant="outlined" sx={{ mb: "20px", gridColumn: isSmallScreen ? "span 1" : "span 2" }}>
            <InputLabel color="secondary">Description</InputLabel>
            <Input required type="text" color="secondary" multiline onChange={(e) => setBody((b) => ({ ...b, description: e.target.value }))} />
          </FormControl>

          <FormControl variant="outlined" sx={{ mb: "20px", gridColumn: isSmallScreen ? "span 1" : "span 2" }}>
            <InputLabel color="secondary">Tags (comma-separated)</InputLabel>
            <Input type="text" color="secondary" placeholder="e.g. summer, new arrival, sale" onChange={(e) => setBody((b) => ({ ...b, tags: e.target.value }))} />
          </FormControl>

          {/* Multi-image upload */}
          <Box sx={{ gridColumn: isSmallScreen ? "span 1" : `span ${isMediumScreen ? 2 : 4}` }}>
            <Typography fontFamily="Nunito" fontWeight="bold" mb="8px">
              Images ({selectedImages.length}/10)
            </Typography>
            <Box display="flex" flexWrap="wrap" gap="10px" mb="10px">
              {selectedImages.map((file, i) => (
                <Box key={i} sx={{ position: "relative", width: "80px", height: "80px" }}>
                  <Box component="img" src={URL.createObjectURL(file)} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "6px" }} />
                  <IconButton size="small" onClick={() => removeImage(i)} sx={{ position: "absolute", top: -8, right: -8, backgroundColor: "white", p: "2px" }}>
                    <Close sx={{ fontSize: "14px", color: "red" }} />
                  </IconButton>
                </Box>
              ))}
              {selectedImages.length < 10 && (
                <label htmlFor="upload" style={{ cursor: "pointer" }}>
                  <Box sx={{ width: "80px", height: "80px", border: "2px dashed #Ed981b", borderRadius: "6px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#Ed981b" }}>
                    <AddAPhotoRounded sx={{ fontSize: "28px" }} />
                    <Typography fontSize="10px" fontFamily="Nunito">Add</Typography>
                  </Box>
                </label>
              )}
            </Box>
            <input hidden multiple type="file" name="upload" id="upload" accept="image/*" onChange={handleImages} />
          </Box>

          {/* Variants */}
          <Box sx={{ gridColumn: isSmallScreen ? "span 1" : `span ${isMediumScreen ? 2 : 4}` }}>
            <Box display="flex" alignItems="center" gap="10px" mb="10px">
              <Typography fontFamily="Nunito" fontWeight="bold">Variants (optional)</Typography>
              <Button size="small" variant="outlined" startIcon={<AddRounded />} onClick={addVariant} sx={{ borderRadius: "20px", textTransform: "none" }}>
                Add Variant
              </Button>
            </Box>
            {variants.length > 0 && (
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 80px 40px", gap: "10px", mb: "8px" }}>
                <Typography fontFamily="Nunito" fontSize="12px" fontWeight="bold">Size</Typography>
                <Typography fontFamily="Nunito" fontSize="12px" fontWeight="bold">Color</Typography>
                <Typography fontFamily="Nunito" fontSize="12px" fontWeight="bold">Stock</Typography>
                <Box />
              </Box>
            )}
            {variants.map((v, i) => (
              <Box key={i} sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 80px 40px", gap: "10px", mb: "8px", alignItems: "center" }}>
                <Input placeholder="e.g. M, L, XL" value={v.size} onChange={(e) => updateVariant(i, "size", e.target.value)} />
                <Input placeholder="e.g. Red" value={v.color} onChange={(e) => updateVariant(i, "color", e.target.value)} />
                <Input placeholder="0" type="number" value={v.stock} onChange={(e) => updateVariant(i, "stock", e.target.value)} />
                <IconButton size="small" onClick={() => removeVariant(i)}>
                  <DeleteRounded sx={{ fontSize: "18px", color: "#d32f2f" }} />
                </IconButton>
              </Box>
            ))}
          </Box>

          <Box display="flex" alignItems="center" sx={{ gridColumn: isSmallScreen ? "span 1" : `span ${isMediumScreen ? 2 : 4}` }}>
            <Button onClick={upload} variant="contained" sx={{ borderRadius: "20px", width: isSmallScreen ? "100%" : "30%" }}>
              <Typography color="#ffffff">Upload Product</Typography>
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddProduct;
