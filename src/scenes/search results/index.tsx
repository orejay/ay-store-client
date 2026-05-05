import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  AddShoppingCartRounded,
  FavoriteBorderRounded,
  FavoriteRounded,
  RemoveShoppingCartRounded,
  SearchRounded,
} from "@mui/icons-material";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "store";
import { setCart, setWishlist } from "state";
import Header from "components/Header";
import Footer from "components/Footer";
import Pagination from "components/Pagination";
import { brand } from "../../theme";

interface ProductData {
  _id: string;
  name: string;
  price: number;
  discount: number;
  supply: number;
  imageName: string;
  category: string;
  rating: number;
}

const fmt = (n: number) =>
  "₦" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const SearchResults = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isSmall = useMediaQuery("(max-width:480px)");
  const isMobile = useMediaQuery("(max-width:768px)");

  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const imageUrl = import.meta.env.VITE_IMAGE_URL;

  const dispatch = useAppDispatch();
  const cart = useSelector((state: RootState) => state.global.cart);
  const wishlist = useSelector((state: RootState) => state.global.wishlist);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [data, setData] = useState<ProductData[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState("");

  const LIMIT = 20;

  useEffect(() => {
    if (!user?.token) return;
    fetch(`${baseUrl}/get/wishlist`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((r) => r.json())
      .then((d) =>
        dispatch(setWishlist((d.products || []).map((p: any) => p._id)))
      )
      .catch(() => {});
  }, []);

  // Reset to page 1 when query changes
  useEffect(() => {
    setPage(1);
  }, [q]);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    fetch(
      `${baseUrl}/get/products/search?name=${encodeURIComponent(q)}&page=${page}&limit=${LIMIT}`
    )
      .then((r) => r.json())
      .then((d) => {
        setData(d.products ?? []);
        setTotal(d.total ?? 0);
        setTotalPages(d.totalPages ?? 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [q, page]);

  const toggleWishlist = async (productId: string) => {
    if (!user?.token) return;
    await fetch(`${baseUrl}/post/wishlist/${productId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${user.token}` },
    });
    dispatch(
      setWishlist(
        wishlist.includes(productId)
          ? wishlist.filter((id) => id !== productId)
          : [...wishlist, productId]
      )
    );
  };

  const borderColor = isDark ? "#27272E" : "#EBEBEB";

  return (
    <Box
      sx={{ backgroundColor: theme.palette.background.default, minHeight: "100vh" }}
    >
      <Header />

      <Box sx={{ pt: { xs: "60px", md: "68px" }, pb: "80px" }}>
        {/* Page header */}
        <Box
          sx={{
            px: { xs: "16px", md: "40px" },
            py: "20px",
            borderBottom: `1px solid ${borderColor}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: "4px" }}>
            <SearchRounded sx={{ fontSize: "20px", color: "text.disabled" }} />
            <Typography
              fontFamily="Playfair Display"
              fontWeight={900}
              fontSize={{ xs: "1.2rem", md: "1.5rem" }}
            >
              {q ? `"${q}"` : "Search"}
            </Typography>
          </Box>
          <Typography fontFamily="Nunito" fontSize="0.82rem" color="text.secondary">
            {loading
              ? "Searching…"
              : q
              ? `${total} result${total !== 1 ? "s" : ""}${totalPages > 1 ? ` · page ${page} of ${totalPages}` : ""}`
              : "Enter a search term to find products"}
          </Typography>
        </Box>

        <Box sx={{ px: { xs: "16px", md: "40px" }, pt: "24px" }}>
          {loading ? (
            /* Skeleton placeholders */
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: isSmall
                  ? "repeat(2, 1fr)"
                  : isMobile
                  ? "repeat(2, 1fr)"
                  : "repeat(4, 1fr)",
                gap: { xs: "12px", md: "16px" },
              }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <Box key={i}>
                  <Box
                    sx={{
                      borderRadius: "12px",
                      paddingTop: "125%",
                      backgroundColor: isDark ? "#1C1C20" : "#F3F4F6",
                      mb: "12px",
                      animation: "pulse 1.5s ease-in-out infinite",
                      "@keyframes pulse": {
                        "0%, 100%": { opacity: 1 },
                        "50%": { opacity: 0.5 },
                      },
                    }}
                  />
                  <Box
                    sx={{
                      height: "14px",
                      borderRadius: "6px",
                      backgroundColor: isDark ? "#1C1C20" : "#F3F4F6",
                      mb: "6px",
                      width: "80%",
                    }}
                  />
                  <Box
                    sx={{
                      height: "12px",
                      borderRadius: "6px",
                      backgroundColor: isDark ? "#1C1C20" : "#F3F4F6",
                      width: "40%",
                    }}
                  />
                </Box>
              ))}
            </Box>
          ) : data.length === 0 ? (
            <Box sx={{ textAlign: "center", py: "80px" }}>
              <SearchRounded
                sx={{ fontSize: "52px", color: "text.disabled", mb: "16px" }}
              />
              <Typography
                fontFamily="Playfair Display"
                fontWeight={700}
                fontSize="1.3rem"
                mb="8px"
              >
                No results found
              </Typography>
              <Typography
                fontFamily="Nunito"
                fontSize="0.88rem"
                color="text.secondary"
                sx={{ maxWidth: "320px", mx: "auto" }}
              >
                {q
                  ? `We couldn't find anything matching "${q}". Try different keywords.`
                  : "Start typing to search for products."}
              </Typography>
            </Box>
          ) : (
            <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: isSmall
                  ? "repeat(2, 1fr)"
                  : isMobile
                  ? "repeat(2, 1fr)"
                  : "repeat(4, 1fr)",
                gap: { xs: "12px", md: "16px" },
              }}
            >
              {data.map((each) => {
                const discountedPrice =
                  each.price * ((100 - each.discount) / 100);
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
                    {/* Image */}
                    <Box
                      sx={{
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: "12px",
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
                            transition:
                              "transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)",
                            transform: isHovered ? "scale(1.08)" : "scale(1)",
                          }}
                        />
                      </Link>

                      {/* Discount pill */}
                      {each.discount > 0 && each.supply > 0 && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: "12px",
                            left: "12px",
                            zIndex: 2,
                            backgroundColor: brand.secondary,
                            color: "#fff",
                            fontFamily: "Nunito",
                            fontWeight: 800,
                            fontSize: "0.68rem",
                            px: "9px",
                            py: "3px",
                            borderRadius: "100px",
                          }}
                        >
                          -{each.discount}%
                        </Box>
                      )}

                      {/* Wishlist */}
                      {user?.token && (
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(each._id);
                          }}
                          sx={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            zIndex: 3,
                            width: "32px",
                            height: "32px",
                            backgroundColor: inWishlist
                              ? "#e53935"
                              : "rgba(255,255,255,0.92)",
                            backdropFilter: "blur(6px)",
                            "&:hover": {
                              backgroundColor: inWishlist ? "#C62828" : "#fff",
                            },
                            transition: "background 0.2s",
                          }}
                        >
                          {inWishlist ? (
                            <FavoriteRounded
                              sx={{ fontSize: "15px", color: "#fff" }}
                            />
                          ) : (
                            <FavoriteBorderRounded
                              sx={{ fontSize: "15px", color: "#374151" }}
                            />
                          )}
                        </IconButton>
                      )}

                      {/* Out of stock */}
                      {each.supply === 0 && (
                        <Box
                          sx={{
                            position: "absolute",
                            inset: 0,
                            zIndex: 2,
                            background: "rgba(0,0,0,0.42)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            fontFamily="Nunito"
                            fontWeight={700}
                            color="#fff"
                            fontSize="0.8rem"
                            sx={{
                              px: "14px",
                              py: "5px",
                              border: "1px solid rgba(255,255,255,0.55)",
                              borderRadius: "100px",
                            }}
                          >
                            Out of Stock
                          </Typography>
                        </Box>
                      )}

                      {/* Slide-up add to bag — desktop hover */}
                      {each.supply > 0 && (
                        <Box
                          onClick={() =>
                            inCart
                              ? dispatch(
                                  setCart(
                                    cart.filter((i) => i._id !== each._id)
                                  )
                                )
                              : dispatch(
                                  setCart([...cart, { ...each, quantity: 1 }])
                                )
                          }
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
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
                            transform: isHovered
                              ? "translateY(0)"
                              : "translateY(100%)",
                            transition:
                              "transform 0.28s cubic-bezier(0.34,1.56,0.64,1)",
                          }}
                        >
                          {inCart ? (
                            <RemoveShoppingCartRounded
                              sx={{ fontSize: "15px", color: "#fff" }}
                            />
                          ) : (
                            <AddShoppingCartRounded
                              sx={{ fontSize: "15px", color: "#fff" }}
                            />
                          )}
                          <Typography
                            fontFamily="Nunito"
                            fontWeight={700}
                            fontSize="0.78rem"
                            color="#fff"
                            letterSpacing="0.06em"
                            sx={{ textTransform: "uppercase" }}
                          >
                            {inCart ? "Remove" : "Add to Bag"}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Info */}
                    <Box sx={{ px: "2px" }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "8px",
                          mb: "4px",
                        }}
                      >
                        <Link
                          to={`/products/${each._id}`}
                          style={{ flex: 1, minWidth: 0 }}
                        >
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
                            {each.name[0].toUpperCase()}
                            {each.name.slice(1)}
                          </Typography>
                        </Link>

                        {/* Mobile cart button */}
                        {each.supply > 0 && (
                          <IconButton
                            size="small"
                            onClick={() =>
                              inCart
                                ? dispatch(
                                    setCart(
                                      cart.filter((i) => i._id !== each._id)
                                    )
                                  )
                                : dispatch(
                                    setCart([...cart, { ...each, quantity: 1 }])
                                  )
                            }
                            sx={{
                              display: { xs: "flex", md: "none" },
                              flexShrink: 0,
                              backgroundColor: inCart
                                ? brand.primary
                                : isDark
                                ? "rgba(255,255,255,0.08)"
                                : "#F3F4F6",
                              color: inCart ? "#fff" : theme.palette.text.secondary,
                              width: "30px",
                              height: "30px",
                              "&:hover": {
                                backgroundColor: brand.primary,
                                color: "#fff",
                              },
                            }}
                          >
                            {inCart ? (
                              <RemoveShoppingCartRounded
                                sx={{ fontSize: "14px" }}
                              />
                            ) : (
                              <AddShoppingCartRounded
                                sx={{ fontSize: "14px" }}
                              />
                            )}
                          </IconButton>
                        )}
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <Typography
                          fontFamily="Nunito"
                          fontWeight={800}
                          fontSize="0.95rem"
                          color="primary"
                        >
                          {fmt(discountedPrice)}
                        </Typography>
                        {each.discount > 0 && (
                          <Typography
                            fontFamily="Nunito"
                            fontSize="0.78rem"
                            color="text.disabled"
                            sx={{ textDecoration: "line-through" }}
                          >
                            {fmt(each.price)}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={(p) => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
            </>
          )}
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default SearchResults;
