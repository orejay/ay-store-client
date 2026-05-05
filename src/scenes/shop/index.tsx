import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  InputBase,
  FormControl,
  MenuItem,
  Select,
  Slider,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  Drawer,
  Button,
} from "@mui/material";
import {
  AddShoppingCartRounded,
  RemoveShoppingCartRounded,
  FavoriteBorderRounded,
  FavoriteRounded,
  CloseRounded,
  TuneRounded,
  StarRounded,
  CheckRounded,
} from "@mui/icons-material";
import Footer from "components/Footer";
import Header from "components/Header";
import Pagination from "components/Pagination";
import { RootState, useAppDispatch } from "store";
import { useSelector } from "react-redux";
import { setCart, setCategories, setWishlist } from "state";
import { CATEGORIES, GENDERS } from "constants/productOptions";
import { brand } from "../../theme";
import { Link } from "react-router-dom";

interface ProductData {
  name: string; price: number; rating: number; discount: number;
  quantity: number; supply: number; imageName: string; imagePath: string;
  description: string; category: string; gender?: string; brand?: string;
  tags?: string[]; featured?: boolean; _id: string;
}

const fmt = (n: string) => "₦" + n.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const Shop = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery("(max-width:768px)");
  const isSmall = useMediaQuery("(max-width:480px)");

  const [data, setData] = useState<ProductData[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hovered, setHovered] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const LIMIT = 20;

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const imageUrl = import.meta.env.VITE_IMAGE_URL;

  const dispatch = useAppDispatch();
  const cart = useSelector((state: RootState) => state.global.cart);
  const categoryList = useSelector((state: RootState) => state.global.categories);
  const wishlist = useSelector((state: RootState) => state.global.wishlist);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [priceRange, setPriceRange] = useState<number[]>([0, 100000]);
  const [discount, setDiscount] = useState(false);
  const [rating, setRating] = useState<number[]>([0, 5]);
  const [gender, setGender] = useState("all");
  const [brandInput, setBrandInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [sort, setSort] = useState("newest");

  const borderColor = isDark ? "#27272E" : "#EBEBEB";
  const panelBg = isDark ? "#18181C" : "#FFFFFF";

  useEffect(() => {
    if (!user?.token) return;
    fetch(`${baseUrl}/get/wishlist`, { headers: { Authorization: `Bearer ${user.token}` } })
      .then((r) => r.json())
      .then((d) => dispatch(setWishlist((d.products || []).map((p: any) => p._id))))
      .catch(() => {});
  }, []);

  const toggleWishlist = async (productId: string) => {
    if (!user?.token) return;
    await fetch(`${baseUrl}/post/wishlist/${productId}`, {
      method: "POST", headers: { Authorization: `Bearer ${user.token}` },
    });
    dispatch(setWishlist(
      wishlist.includes(productId)
        ? wishlist.filter((id) => id !== productId)
        : [...wishlist, productId]
    ));
  };

  // Reset to page 1 whenever any filter changes
  useEffect(() => {
    setPage(1);
  }, [categoryList, priceRange, discount, rating, gender, brandInput, tagInput, sort]);

  // Fetch products when page or filters change
  useEffect(() => {
    const params = new URLSearchParams({
      category: categoryList.join(","),
      priceRange: `${priceRange[0]}-${priceRange[1]}`,
      rating: `${rating[0]}-${rating[1]}`,
      discount: String(discount),
      sort,
      page: String(page),
      limit: String(LIMIT),
    });
    if (gender !== "all") params.set("gender", gender);
    if (brandInput.trim()) params.set("brand", brandInput.trim());
    if (tagInput.trim()) params.set("tags", tagInput.trim());

    fetch(`${baseUrl}/get/products/filter?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d.products || []);
        setTotal(d.total ?? 0);
        setTotalPages(d.totalPages ?? 1);
      })
      .catch(() => {});
  }, [categoryList, priceRange, discount, rating, gender, brandInput, tagInput, sort, page]);

  /* ── Filter panel (shared between drawer and sidebar) ── */
  const FilterPanel = () => (
    <Box sx={{ p: "20px", display: "flex", flexDirection: "column", gap: "24px" }}>
      <Typography fontFamily="Nunito" fontWeight={800} fontSize="1rem">Filters</Typography>

      {/* Categories */}
      <Box>
        <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.78rem"
          letterSpacing="0.07em" color="text.secondary" mb="12px"
          sx={{ textTransform: "uppercase" }}>
          Category
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {CATEGORIES.map((cat) => {
            const active = categoryList.includes(cat.value);
            return (
              <Chip
                key={cat.value}
                label={cat.label}
                size="small"
                onClick={() =>
                  dispatch(setCategories(
                    active
                      ? categoryList.filter((i) => i !== cat.value)
                      : [...categoryList, cat.value]
                  ))
                }
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: active ? 700 : 500,
                  fontSize: "0.78rem",
                  backgroundColor: active ? `${brand.primary}18` : isDark ? "rgba(255,255,255,0.06)" : "#F3F4F6",
                  color: active ? brand.primary : "text.secondary",
                  border: `1px solid ${active ? brand.primary : "transparent"}`,
                  cursor: "pointer",
                  "&:hover": { backgroundColor: `${brand.primary}12` },
                }}
                icon={active ? <CheckRounded style={{ fontSize: "13px", color: brand.primary }} /> : undefined}
              />
            );
          })}
        </Box>
      </Box>

      <Divider sx={{ borderColor }} />

      {/* Gender */}
      <Box>
        <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.78rem"
          letterSpacing="0.07em" color="text.secondary" mb="10px"
          sx={{ textTransform: "uppercase" }}>
          Gender
        </Typography>
        <FormControl fullWidth size="small">
          <Select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            sx={{ fontFamily: "Nunito", fontSize: "0.88rem", borderRadius: "10px" }}
          >
            <MenuItem value="all">All</MenuItem>
            {GENDERS.map((g) => (
              <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Brand */}
      <Box>
        <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.78rem"
          letterSpacing="0.07em" color="text.secondary" mb="10px"
          sx={{ textTransform: "uppercase" }}>
          Brand
        </Typography>
        <Box sx={{
          display: "flex", alignItems: "center", gap: "8px", px: "12px", py: "8px",
          borderRadius: "10px", border: `1px solid ${borderColor}`,
          backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB",
        }}>
          <InputBase
            placeholder="Search brand…"
            value={brandInput}
            onChange={(e) => setBrandInput(e.target.value)}
            sx={{ fontFamily: "Nunito", fontSize: "0.85rem", flex: 1 }}
          />
          {brandInput && (
            <IconButton size="small" sx={{ p: "2px" }} onClick={() => setBrandInput("")}>
              <CloseRounded sx={{ fontSize: "13px" }} />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Tag */}
      <Box>
        <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.78rem"
          letterSpacing="0.07em" color="text.secondary" mb="10px"
          sx={{ textTransform: "uppercase" }}>
          Tag
        </Typography>
        <Box sx={{
          display: "flex", alignItems: "center", gap: "8px", px: "12px", py: "8px",
          borderRadius: "10px", border: `1px solid ${borderColor}`,
          backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB",
        }}>
          <InputBase
            placeholder="e.g. sale, summer…"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            sx={{ fontFamily: "Nunito", fontSize: "0.85rem", flex: 1 }}
          />
          {tagInput && (
            <IconButton size="small" sx={{ p: "2px" }} onClick={() => setTagInput("")}>
              <CloseRounded sx={{ fontSize: "13px" }} />
            </IconButton>
          )}
        </Box>
      </Box>

      <Divider sx={{ borderColor }} />

      {/* Price range */}
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: "8px" }}>
          <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.78rem"
            letterSpacing="0.07em" color="text.secondary" sx={{ textTransform: "uppercase" }}>
            Price Range
          </Typography>
          <Typography fontFamily="Nunito" fontSize="0.78rem" color={brand.primary} fontWeight={700}>
            {fmt(String(priceRange[0]))} – {fmt(String(priceRange[1]))}
          </Typography>
        </Box>
        <Slider
          value={priceRange}
          step={500}
          max={100000}
          onChange={(_, v) => setPriceRange(v as number[])}
          valueLabelDisplay="auto"
          getAriaLabel={() => "Price range"}
        />
      </Box>

      {/* Rating */}
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: "8px" }}>
          <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.78rem"
            letterSpacing="0.07em" color="text.secondary" sx={{ textTransform: "uppercase" }}>
            Rating
          </Typography>
          <Typography fontFamily="Nunito" fontSize="0.78rem" color={brand.primary} fontWeight={700}>
            {rating[0]} – {rating[1]} ★
          </Typography>
        </Box>
        <Slider
          value={rating}
          step={0.5}
          max={5}
          onChange={(_, v) => setRating(v as number[])}
          valueLabelDisplay="auto"
          getAriaLabel={() => "Rating range"}
        />
      </Box>

      {/* Discount toggle */}
      <Box
        onClick={() => setDiscount(!discount)}
        sx={{
          display: "flex", alignItems: "center", gap: "10px", cursor: "pointer",
          px: "14px", py: "10px", borderRadius: "10px",
          backgroundColor: discount ? `${brand.primary}10` : isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB",
          border: `1px solid ${discount ? brand.primary : borderColor}`,
          transition: "all 0.18s",
        }}
      >
        <Box sx={{
          width: "18px", height: "18px", borderRadius: "5px",
          border: `2px solid ${discount ? brand.primary : theme.palette.text.disabled}`,
          backgroundColor: discount ? brand.primary : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.18s",
        }}>
          {discount && <CheckRounded sx={{ fontSize: "12px", color: "#fff" }} />}
        </Box>
        <Typography fontFamily="Nunito" fontWeight={600} fontSize="0.88rem"
          color={discount ? brand.primary : "text.primary"}>
          On Sale only
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: "100vh" }}>
      <Header />

      {/* Mobile filter drawer */}
      <Drawer
        anchor="left"
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        PaperProps={{
          sx: {
            width: "300px",
            backgroundColor: panelBg,
            borderRight: `1px solid ${borderColor}`,
          },
        }}
      >
        <Box sx={{
          px: "20px", py: "16px", display: "flex",
          justifyContent: "space-between", alignItems: "center",
          borderBottom: `1px solid ${borderColor}`,
        }}>
          <Typography fontFamily="Nunito" fontWeight={800}>Filter Products</Typography>
          <IconButton size="small" onClick={() => setFilterOpen(false)}>
            <CloseRounded sx={{ fontSize: "20px" }} />
          </IconButton>
        </Box>
        <Box sx={{ overflowY: "auto", flex: 1 }}>
          <FilterPanel />
        </Box>
      </Drawer>

      <Box sx={{ pt: { xs: "60px", md: "68px" }, pb: "80px" }}>
        {/* Page header bar */}
        <Box
          sx={{
            px: { xs: "16px", md: "40px" },
            py: "20px",
            borderBottom: `1px solid ${borderColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <Box>
            <Typography fontFamily="Playfair Display" fontWeight={900} fontSize={{ xs: "1.3rem", md: "1.6rem" }}>
              Shop
            </Typography>
            <Typography fontFamily="Nunito" fontSize="0.82rem" color="text.secondary">
              {total} product{total !== 1 ? "s" : ""}{totalPages > 1 ? ` · page ${page} of ${totalPages}` : ""}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Active category chips */}
            {categoryList.length > 0 && (
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: "6px", flexWrap: "wrap" }}>
                {categoryList.map((cat) => (
                  <Chip
                    key={cat}
                    label={cat}
                    size="small"
                    onDelete={() => dispatch(setCategories(categoryList.filter((c) => c !== cat)))}
                    sx={{ fontFamily: "Nunito", fontSize: "0.78rem", backgroundColor: `${brand.primary}15`, color: brand.primary }}
                  />
                ))}
              </Box>
            )}

            {/* Sort */}
            <FormControl size="small" sx={{ minWidth: "150px" }}>
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                sx={{ fontFamily: "Nunito", fontSize: "0.85rem", borderRadius: "10px" }}
              >
                <MenuItem value="newest">Newest</MenuItem>
                <MenuItem value="top_rated">Top Rated</MenuItem>
                <MenuItem value="price_asc">Price: Low → High</MenuItem>
                <MenuItem value="price_desc">Price: High → Low</MenuItem>
              </Select>
            </FormControl>

            {/* Mobile filter button */}
            {isMobile && (
              <IconButton
                onClick={() => setFilterOpen(true)}
                sx={{
                  border: `1px solid ${borderColor}`,
                  borderRadius: "10px",
                  p: "8px",
                  color: theme.palette.text.primary,
                }}
              >
                <TuneRounded sx={{ fontSize: "20px" }} />
              </IconButton>
            )}
          </Box>
        </Box>

        <Box sx={{ display: "flex", px: { xs: "0", md: "40px" }, pt: "24px", gap: "24px" }}>
          {/* Desktop filter sidebar */}
          {!isMobile && (
            <Box
              sx={{
                width: "240px",
                flexShrink: 0,
                borderRadius: "14px",
                border: `1px solid ${borderColor}`,
                backgroundColor: panelBg,
                alignSelf: "flex-start",
                position: "sticky",
                top: "88px",
                maxHeight: "calc(100vh - 108px)",
                overflowY: "auto",
              }}
            >
              <FilterPanel />
            </Box>
          )}

          {/* Product grid */}
          <Box sx={{ flex: 1, px: { xs: "16px", md: "0" } }}>
            {data.length === 0 ? (
              <Box sx={{ textAlign: "center", py: "80px" }}>
                <Typography fontFamily="Playfair Display" fontWeight={700} fontSize="1.3rem" color="text.secondary">
                  No products found
                </Typography>
                <Typography fontFamily="Nunito" fontSize="0.88rem" color="text.disabled" mt="8px">
                  Try adjusting your filters
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: isSmall
                    ? "repeat(2, 1fr)"
                    : isMobile
                    ? "repeat(2, 1fr)"
                    : "repeat(3, 1fr)",
                  gap: { xs: "12px", md: "16px" },
                }}
              >
                {data.map((each) => {
                  const discountedPrice = each.price * ((100 - each.discount) / 100);
                  const inCart = cart.some((item) => item._id === each._id);
                  const inWishlist = wishlist.includes(each._id);
                  const isHovered = hovered === each._id;

                  return (
                    <Box
                      key={each._id}
                      onMouseEnter={() => setHovered(each._id)}
                      onMouseLeave={() => setHovered("")}
                      sx={{ position: "relative", cursor: "pointer" }}
                    >
                      {/* ── Image block ── */}
                      <Box
                        sx={{
                          position: "relative",
                          overflow: "hidden",
                          borderRadius: "12px",
                          /* 4:5 portrait ratio — fashion standard */
                          paddingTop: "125%",
                          backgroundColor: isDark ? "#1C1C20" : "#F3F4F6",
                          mb: "12px",
                        }}
                      >
                        <Link to={`/products/${each._id}`}>
                          <Box
                            component="img"
                            src={`${imageUrl}/uploads/${each.imageName}`}
                            alt={each.name}
                            sx={{
                              position: "absolute",
                              inset: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)",
                              transform: isHovered ? "scale(1.08)" : "scale(1)",
                            }}
                          />
                        </Link>

                        {/* Discount pill */}
                        {each.discount > 0 && each.supply > 0 && (
                          <Box
                            sx={{
                              position: "absolute", top: "12px", left: "12px", zIndex: 2,
                              backgroundColor: brand.secondary,
                              color: "#fff",
                              fontFamily: "Nunito", fontWeight: 800, fontSize: "0.68rem",
                              px: "9px", py: "3px", borderRadius: "100px",
                              letterSpacing: "0.02em",
                            }}
                          >
                            -{each.discount}%
                          </Box>
                        )}

                        {/* Wishlist */}
                        {user?.token && (
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); toggleWishlist(each._id); }}
                            sx={{
                              position: "absolute", top: "8px", right: "8px", zIndex: 3,
                              width: "32px", height: "32px",
                              backgroundColor: inWishlist ? "#e53935" : "rgba(255,255,255,0.92)",
                              backdropFilter: "blur(6px)",
                              "&:hover": { backgroundColor: inWishlist ? "#C62828" : "#fff" },
                              transition: "background 0.2s",
                            }}
                          >
                            {inWishlist
                              ? <FavoriteRounded sx={{ fontSize: "15px", color: "#fff" }} />
                              : <FavoriteBorderRounded sx={{ fontSize: "15px", color: "#374151" }} />}
                          </IconButton>
                        )}

                        {/* Out of stock */}
                        {each.supply === 0 && (
                          <Box
                            sx={{
                              position: "absolute", inset: 0, zIndex: 2,
                              background: "rgba(0,0,0,0.42)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                          >
                            <Typography
                              fontFamily="Nunito" fontWeight={700} color="#fff" fontSize="0.8rem"
                              sx={{ px: "14px", py: "5px", border: "1px solid rgba(255,255,255,0.55)", borderRadius: "100px", letterSpacing: "0.04em" }}
                            >
                              Out of Stock
                            </Typography>
                          </Box>
                        )}

                        {/* Slide-up "Add to bag" CTA — desktop hover */}
                        {each.supply > 0 && (
                          <Box
                            onClick={() =>
                              inCart
                                ? dispatch(setCart(cart.filter((i) => i._id !== each._id)))
                                : dispatch(setCart([...cart, { ...each, quantity: 1 }]))
                            }
                            sx={{
                              position: "absolute",
                              bottom: 0, left: 0, right: 0,
                              zIndex: 3,
                              display: { xs: "none", md: "flex" },
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "8px",
                              py: "13px",
                              background: inCart
                                ? "rgba(239,68,68,0.92)"
                                : "rgba(0,0,0,0.82)",
                              backdropFilter: "blur(4px)",
                              cursor: "pointer",
                              transform: isHovered ? "translateY(0)" : "translateY(100%)",
                              transition: "transform 0.28s cubic-bezier(0.34,1.56,0.64,1)",
                            }}
                          >
                            {inCart
                              ? <RemoveShoppingCartRounded sx={{ fontSize: "15px", color: "#fff" }} />
                              : <AddShoppingCartRounded sx={{ fontSize: "15px", color: "#fff" }} />}
                            <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.78rem" color="#fff" letterSpacing="0.06em" sx={{ textTransform: "uppercase" }}>
                              {inCart ? "Remove" : "Add to Bag"}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* ── Info below image ── */}
                      <Box sx={{ px: "2px" }}>
                        {/* Name row */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", mb: "4px" }}>
                          <Link to={`/products/${each._id}`} style={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              fontFamily="Nunito"
                              fontWeight={600}
                              fontSize={{ xs: "0.85rem", md: "0.9rem" }}
                              lineHeight={1.35}
                              sx={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                "&:hover": { color: brand.primary },
                                transition: "color 0.15s",
                              }}
                            >
                              {each.name[0].toUpperCase()}{each.name.slice(1)}
                            </Typography>
                          </Link>

                          {/* Mobile cart button */}
                          {each.supply > 0 && (
                            <IconButton
                              size="small"
                              onClick={() =>
                                inCart
                                  ? dispatch(setCart(cart.filter((i) => i._id !== each._id)))
                                  : dispatch(setCart([...cart, { ...each, quantity: 1 }]))
                              }
                              sx={{
                                display: { xs: "flex", md: "none" },
                                flexShrink: 0,
                                backgroundColor: inCart ? brand.primary : isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6",
                                color: inCart ? "#fff" : theme.palette.text.secondary,
                                width: "30px", height: "30px",
                                "&:hover": { backgroundColor: brand.primary, color: "#fff" },
                              }}
                            >
                              {inCart
                                ? <RemoveShoppingCartRounded sx={{ fontSize: "14px" }} />
                                : <AddShoppingCartRounded sx={{ fontSize: "14px" }} />}
                            </IconButton>
                          )}
                        </Box>

                        {/* Price row */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Typography fontFamily="Nunito" fontWeight={800} fontSize="0.95rem" color="primary">
                            {fmt(discountedPrice.toFixed(2))}
                          </Typography>
                          {each.discount > 0 && (
                            <Typography fontFamily="Nunito" fontSize="0.78rem" color="text.disabled" sx={{ textDecoration: "line-through" }}>
                              {fmt(String(each.price))}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}
            <Pagination page={page} totalPages={totalPages} onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Shop;
