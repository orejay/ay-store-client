import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  IconButton,
  Typography,
  InputBase,
  Badge,
  Divider,
  Button,
  useTheme,
  Tooltip,
  Fade,
} from "@mui/material";
import {
  SearchRounded,
  ShoppingBagOutlined,
  CloseRounded,
  DeleteOutlineRounded,
  LightModeRounded,
  DarkModeRounded,
  PersonOutlineRounded,
  LogoutRounded,
  ArrowForwardRounded,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "store";
import { setCart, setShowCart, setShowSearches, setThemeMode } from "state";
import { brand } from "../theme";

interface ProductData {
  name: string;
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

const nav = [
  { label: "Shop", path: "/shop" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const PCHeader = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const searchRef = useRef<HTMLDivElement>(null);

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const imageUrl = import.meta.env.VITE_IMAGE_URL;
  const user: UserData | null = JSON.parse(
    localStorage.getItem("user") || "null",
  );

  const cart = useSelector((state: RootState) => state.global.cart);
  const showCart = useSelector((state: RootState) => state.global.showCart);
  const showSearches = useSelector(
    (state: RootState) => state.global.showSearches,
  );
  const themeMode = useSelector((state: RootState) => state.global.themeMode);

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<ProductData[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);

  const formatNum = (n: string) => n.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const cartTotal = cart.reduce(
    (acc, item) =>
      acc + item.price * item.quantity * ((100 - item.discount) / 100),
    0,
  );

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/signin");
  };

  const search = async (val: string) => {
    if (val.length < 2) {
      setSearchResults([]);
      dispatch(setShowSearches(false));
      return;
    }
    try {
      const res = await fetch(`${baseUrl}/get/products/search?name=${val}`);
      const data = await res.json();
      setSearchResults(data.products || []);
      dispatch(setShowSearches(true));
    } catch {
      /* silent */
    }
  };

  useEffect(() => {
    dispatch(setShowSearches(false));
    setSearchText("");
    setSearchResults([]);
  }, [pathname]);

  const glassStyle = {
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    backgroundColor: isDark ? "rgba(12,12,14,0.88)" : "rgba(255,255,255,0.88)",
    borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
  };

  const accountPath =
    user?.role === "user" ? "/customer/account" : "/admin/account";

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        ...glassStyle,
        px: { md: "32px", lg: "64px" },
        py: "0",
        height: "68px",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Logo */}
      <Link to="/" style={{ flexShrink: 0 }}>
        <Typography
          sx={{
            fontFamily: "Playfair Display",
            fontWeight: 900,
            fontSize: "1.5rem",
            color: brand.primary,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          FASHIONERO
        </Typography>
      </Link>

      {/* Nav links */}
      <Box
        sx={{ display: "flex", alignItems: "center", gap: "4px", ml: "40px" }}
      >
        {nav.map(({ label, path }) => {
          const isActive = pathname === path || pathname.startsWith(path + "/");
          return (
            <Link key={path} to={path}>
              <Box
                sx={{
                  px: "14px",
                  py: "6px",
                  borderRadius: "100px",
                  fontFamily: "Nunito",
                  fontWeight: isActive ? 800 : 600,
                  fontSize: "0.9rem",
                  color: isActive ? brand.primary : theme.palette.text.primary,
                  backgroundColor: isActive
                    ? `${brand.primary}14`
                    : "transparent",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: `${brand.primary}0D`,
                    color: brand.primary,
                  },
                }}
              >
                {label}
              </Box>
            </Link>
          );
        })}
      </Box>

      {/* Spacer */}
      <Box sx={{ flex: 1 }} />

      {/* Search bar */}
      <Box ref={searchRef} sx={{ position: "relative", mr: "12px" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            px: "14px",
            py: "7px",
            borderRadius: "100px",
            border: `1.5px solid ${searchFocused ? brand.primary : isDark ? "rgba(255,255,255,0.12)" : "#E5E7EB"}`,
            backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#F9FAFB",
            transition: "all 0.2s ease",
            width: searchFocused ? "240px" : "180px",
          }}
        >
          <SearchRounded
            sx={{
              fontSize: "18px",
              color: theme.palette.text.secondary,
              flexShrink: 0,
            }}
          />
          <InputBase
            placeholder="Search products…"
            value={searchText}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            onChange={(e) => {
              setSearchText(e.target.value);
              search(e.target.value);
            }}
            sx={{
              fontFamily: "Nunito",
              fontSize: "0.88rem",
              flex: 1,
              "& input": { p: 0 },
            }}
          />
          {searchText && (
            <IconButton
              size="small"
              sx={{ p: "2px" }}
              onClick={() => {
                setSearchText("");
                setSearchResults([]);
                dispatch(setShowSearches(false));
              }}
            >
              <CloseRounded sx={{ fontSize: "14px" }} />
            </IconButton>
          )}
        </Box>

        {/* Search dropdown */}
        {showSearches && (
          <Box
            className="slide-down"
            sx={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              width: "280px",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: isDark
                ? "0 8px 32px rgba(0,0,0,0.5)"
                : "0 8px 32px rgba(0,0,0,0.12)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#EBEBEB"}`,
              backgroundColor: isDark ? "#1A1A1F" : "#FFFFFF",
              zIndex: 200,
            }}
          >
            {searchResults.length > 0 ? (
              searchResults.map((item) => (
                <Link
                  key={item._id}
                  to={`/products/${item._id}`}
                  onClick={() => {
                    dispatch(setShowSearches(false));
                    setSearchText("");
                  }}
                >
                  <Box
                    sx={{
                      px: "16px",
                      py: "10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      "&:hover": {
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.05)"
                          : "#F9FAFB",
                      },
                      transition: "background 0.15s",
                    }}
                  >
                    <SearchRounded
                      sx={{
                        fontSize: "15px",
                        color: theme.palette.text.secondary,
                      }}
                    />
                    <Typography fontFamily="Nunito" fontSize="0.88rem">
                      {item.name}
                    </Typography>
                  </Box>
                </Link>
              ))
            ) : (
              <Box sx={{ px: "16px", py: "14px" }}>
                <Typography
                  fontFamily="Nunito"
                  fontSize="0.85rem"
                  color="text.secondary"
                >
                  No results for "{searchText}"
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Right side icons */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {/* Theme toggle */}
        <Tooltip title={isDark ? "Light mode" : "Dark mode"} arrow>
          <IconButton
            onClick={() => dispatch(setThemeMode(isDark ? "light" : "dark"))}
            size="small"
            sx={{ color: theme.palette.text.secondary, p: "8px" }}
          >
            {isDark ? (
              <LightModeRounded sx={{ fontSize: "20px" }} />
            ) : (
              <DarkModeRounded sx={{ fontSize: "20px" }} />
            )}
          </IconButton>
        </Tooltip>

        {/* Auth */}
        {!user ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              ml: "8px",
            }}
          >
            <Link to="/signin">
              <Typography
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  color: theme.palette.text.primary,
                  px: "10px",
                  py: "6px",
                  borderRadius: "100px",
                  transition: "color 0.2s",
                  "&:hover": { color: brand.primary },
                }}
              >
                Sign In
              </Typography>
            </Link>
            <Link to="/signup">
              <Box
                sx={{
                  px: "16px",
                  py: "7px",
                  borderRadius: "100px",
                  background: `linear-gradient(135deg, ${brand.primary} 0%, #D4800A 100%)`,
                  color: "white",
                  fontFamily: "Nunito",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  transition: "opacity 0.2s, transform 0.2s",
                  "&:hover": { opacity: 0.9, transform: "translateY(-1px)" },
                }}
              >
                Sign Up
              </Box>
            </Link>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              ml: "4px",
            }}
          >
            <Tooltip
              title={user.role === "user" ? "My Account" : "Admin Panel"}
              arrow
            >
              <Link to={accountPath}>
                <IconButton
                  size="small"
                  sx={{ color: brand.secondary, p: "8px" }}
                >
                  <PersonOutlineRounded sx={{ fontSize: "22px" }} />
                </IconButton>
              </Link>
            </Tooltip>
            <Tooltip title="Sign Out" arrow>
              <IconButton
                size="small"
                onClick={logout}
                sx={{ color: theme.palette.text.secondary, p: "8px" }}
              >
                <LogoutRounded sx={{ fontSize: "19px" }} />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {/* Cart */}
        <Tooltip title="Cart" arrow>
          <IconButton
            onClick={() => {
              dispatch(setShowCart(!showCart));
              dispatch(setShowSearches(false));
            }}
            sx={{
              ml: "4px",
              color: showCart ? brand.primary : theme.palette.text.primary,
              backgroundColor: showCart ? `${brand.primary}14` : "transparent",
              p: "8px",
              transition: "all 0.2s",
            }}
          >
            <Badge
              badgeContent={cart.length}
              color="primary"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "10px",
                  height: "16px",
                  minWidth: "16px",
                  fontFamily: "Nunito",
                  fontWeight: 800,
                },
              }}
            >
              <ShoppingBagOutlined sx={{ fontSize: "22px" }} />
            </Badge>
          </IconButton>
        </Tooltip>
      </Box>

      {/* Cart panel */}
      {showCart && (
        <Box
          className="slide-down"
          sx={{
            position: "fixed",
            top: "68px",
            right: "16px",
            width: "340px",
            maxHeight: "80vh",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: isDark
              ? "0 16px 48px rgba(0,0,0,0.6)"
              : "0 16px 48px rgba(0,0,0,0.14)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#EBEBEB"}`,
            backgroundColor: isDark ? "#1A1A1F" : "#FFFFFF",
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Cart header */}
          <Box
            sx={{
              px: "20px",
              py: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: `1px solid ${isDark ? "#27272E" : "#F3F4F6"}`,
            }}
          >
            <Typography
              fontFamily="Playfair Display"
              fontWeight={700}
              fontSize="1.05rem"
            >
              My Bag ({cart.length})
            </Typography>
            <IconButton
              size="small"
              onClick={() => dispatch(setShowCart(false))}
              sx={{ color: theme.palette.text.secondary }}
            >
              <CloseRounded sx={{ fontSize: "18px" }} />
            </IconButton>
          </Box>

          {cart.length === 0 ? (
            <Box sx={{ p: "32px", textAlign: "center" }}>
              <ShoppingBagOutlined
                sx={{
                  fontSize: "48px",
                  color: theme.palette.text.disabled,
                  mb: "12px",
                }}
              />
              <Typography
                fontFamily="Nunito"
                fontWeight={700}
                color="text.secondary"
              >
                Your bag is empty
              </Typography>
              <Typography
                fontFamily="Nunito"
                fontSize="0.82rem"
                color="text.secondary"
                mt="4px"
              >
                Add items to get started
              </Typography>
            </Box>
          ) : (
            <>
              {/* Cart items */}
              <Box sx={{ overflowY: "auto", flex: 1, px: "16px", py: "8px" }}>
                {cart.map((item, i) => (
                  <Box
                    key={item._id}
                    sx={{
                      py: "12px",
                      borderBottom:
                        i < cart.length - 1
                          ? `1px solid ${isDark ? "#27272E" : "#F3F4F6"}`
                          : "none",
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box
                      component="img"
                      src={`${imageUrl}/uploads/${item.imageName}`}
                      alt={item.name}
                      sx={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "8px",
                        objectFit: "cover",
                        flexShrink: 0,
                        backgroundColor: isDark ? "#27272E" : "#F3F4F6",
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        fontFamily="Nunito"
                        fontWeight={700}
                        fontSize="0.88rem"
                        noWrap
                      >
                        {item.name[0].toUpperCase()}
                        {item.name.slice(1)}
                      </Typography>
                      <Typography
                        fontFamily="Nunito"
                        fontSize="0.78rem"
                        color="text.secondary"
                      >
                        {item.category}
                      </Typography>
                      <Typography
                        fontFamily="Nunito"
                        fontWeight={700}
                        fontSize="0.88rem"
                        color="primary"
                        mt="4px"
                      >
                        {item.quantity} × $
                        {formatNum(
                          (item.price * ((100 - item.discount) / 100)).toFixed(
                            2,
                          ),
                        )}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() =>
                        dispatch(
                          setCart(cart.filter((c) => c._id !== item._id)),
                        )
                      }
                      sx={{
                        color: theme.palette.text.secondary,
                        p: "4px",
                        "&:hover": { color: brand.error ?? "#EF4444" },
                      }}
                    >
                      <DeleteOutlineRounded sx={{ fontSize: "17px" }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>

              {/* Cart footer */}
              <Box
                sx={{
                  px: "20px",
                  py: "16px",
                  borderTop: `1px solid ${isDark ? "#27272E" : "#F3F4F6"}`,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: "14px",
                  }}
                >
                  <Typography fontFamily="Nunito" fontWeight={700}>
                    Total
                  </Typography>
                  <Typography
                    fontFamily="Nunito"
                    fontWeight={800}
                    color="primary"
                    fontSize="1.05rem"
                  >
                    ${formatNum(cartTotal.toFixed(2))}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  endIcon={<ArrowForwardRounded />}
                  onClick={() => {
                    navigate("/checkout");
                    dispatch(setShowCart(false));
                  }}
                  sx={{ borderRadius: "100px", py: "10px", fontSize: "0.9rem" }}
                >
                  Checkout
                </Button>
              </Box>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default PCHeader;
