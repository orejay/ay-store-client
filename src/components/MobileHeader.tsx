import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  IconButton,
  InputBase,
  Badge,
  Button,
  Divider,
  Typography,
  useTheme,
  Tooltip,
} from "@mui/material";
import {
  MenuRounded,
  CloseRounded,
  SearchRounded,
  ShoppingBagOutlined,
  LightModeRounded,
  DarkModeRounded,
  PersonOutlineRounded,
  LogoutRounded,
  ArrowForwardRounded,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "store";
import {
  setCloseModal,
  setModalMessage,
  setShowSearches,
  setThemeMode,
} from "state";
import { brand } from "../theme";
import blueLogoFull from "../assets/Blue-logo-full.png";
import whiteLogoFull from "../assets/White-logo-full.png";

interface ProductData {
  name: string;
  _id: string;
}
interface UserData {
  firstName: string;
  lastName: string;
  role: string;
  token: string;
  id: string;
}

const nav = [
  { label: "Shop", path: "/shop" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const MobileHeader = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const user: UserData | null = JSON.parse(
    localStorage.getItem("user") || "null",
  );
  const cart = useSelector((state: RootState) => state.global.cart);
  const showSearches = useSelector(
    (state: RootState) => state.global.showSearches,
  );
  const themeMode = useSelector((state: RootState) => state.global.themeMode);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<ProductData[]>([]);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/signin");
    setDrawerOpen(false);
  };
  const accountPath =
    user?.role === "user" ? "/customer/account" : "/admin/account";

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
    setDrawerOpen(false);
    dispatch(setShowSearches(false));
    setSearchText("");
    setSearchResults([]);
  }, [pathname]);

  const glassStyle = {
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    backgroundColor: isDark ? "rgba(12,12,14,0.90)" : "rgba(255,255,255,0.90)",
    borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          ...glassStyle,
          height: "60px",
          display: "flex",
          alignItems: "center",
          px: "12px",
          gap: "8px",
        }}
      >
        {/* Hamburger */}
        <IconButton
          onClick={() => setDrawerOpen(true)}
          size="small"
          sx={{ color: theme.palette.text.primary }}
        >
          <MenuRounded />
        </IconButton>

        {/* Logo — centered */}
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Link to="/">
            <Box
              component="img"
              src={isDark ? whiteLogoFull : blueLogoFull}
              alt="Fashionero"
              sx={{ height: "26px", width: "auto", display: "block" }}
            />
          </Link>
        </Box>

        {/* Right: theme toggle + cart */}
        <IconButton
          size="small"
          onClick={() => dispatch(setThemeMode(isDark ? "light" : "dark"))}
          sx={{ color: theme.palette.text.secondary }}
        >
          {isDark ? (
            <LightModeRounded sx={{ fontSize: "19px" }} />
          ) : (
            <DarkModeRounded sx={{ fontSize: "19px" }} />
          )}
        </IconButton>

        <IconButton
          size="small"
          onClick={() => {
            if (cart.length > 0) navigate("/checkout");
            else {
              dispatch(setModalMessage("Your cart is empty!"));
              dispatch(setCloseModal(false));
            }
          }}
          sx={{ color: theme.palette.text.primary }}
        >
          <Badge
            badgeContent={cart.length}
            color="primary"
            sx={{
              "& .MuiBadge-badge": {
                fontSize: "9px",
                height: "15px",
                minWidth: "15px",
                fontFamily: "Nunito",
                fontWeight: 800,
              },
            }}
          >
            <ShoppingBagOutlined sx={{ fontSize: "21px" }} />
          </Badge>
        </IconButton>
      </Box>

      {/* Navigation Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: "80vw",
            maxWidth: "320px",
            backgroundColor: isDark ? "#09090D" : "#FFFFFF",
            borderRight: `1px solid ${isDark ? "#27272E" : "#EBEBEB"}`,
            p: "0",
          },
        }}
      >
        {/* Drawer header */}
        <Box
          sx={{
            px: "20px",
            py: "18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: `1px solid ${isDark ? "#27272E" : "#F3F4F6"}`,
          }}
        >
          <Link to="/" onClick={() => setDrawerOpen(false)}>
            <Box
              component="img"
              src={isDark ? whiteLogoFull : blueLogoFull}
              alt="Fashionero"
              sx={{ height: "28px", width: "auto", display: "block" }}
            />
          </Link>
          <IconButton
            size="small"
            onClick={() => setDrawerOpen(false)}
            sx={{ color: theme.palette.text.secondary }}
          >
            <CloseRounded sx={{ fontSize: "20px" }} />
          </IconButton>
        </Box>

        {/* Search */}
        <Box sx={{ px: "16px", py: "14px", position: "relative" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              px: "14px",
              py: "9px",
              borderRadius: "100px",
              border: `1.5px solid ${isDark ? "rgba(255,255,255,0.12)" : "#E5E7EB"}`,
              backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#F9FAFB",
            }}
          >
            <SearchRounded
              sx={{ fontSize: "17px", color: theme.palette.text.secondary }}
            />
            <InputBase
              placeholder="Search products…"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                search(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchText.trim()) {
                  navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
                  dispatch(setShowSearches(false));
                  setDrawerOpen(false);
                }
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
                <CloseRounded sx={{ fontSize: "13px" }} />
              </IconButton>
            )}
          </Box>

          {showSearches && (
            <Box
              sx={{
                position: "absolute",
                top: "calc(100% - 2px)",
                left: "16px",
                right: "16px",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                border: `1px solid ${isDark ? "#27272E" : "#EBEBEB"}`,
                backgroundColor: isDark ? "#1A1A1F" : "#FFFFFF",
                zIndex: 10,
              }}
            >
              {searchResults.length > 0 ? (
                <>
                  {searchResults.slice(0, 5).map((item) => (
                    <Link
                      key={item._id}
                      to={`/products/${item._id}`}
                      onClick={() => setDrawerOpen(false)}
                    >
                      <Box
                        sx={{
                          px: "14px",
                          py: "10px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          "&:hover": {
                            backgroundColor: isDark
                              ? "rgba(255,255,255,0.05)"
                              : "#F9FAFB",
                          },
                        }}
                      >
                        <SearchRounded
                          sx={{
                            fontSize: "14px",
                            color: theme.palette.text.secondary,
                          }}
                        />
                        <Typography fontFamily="Nunito" fontSize="0.85rem">
                          {item.name}
                        </Typography>
                      </Box>
                    </Link>
                  ))}
                  <Link
                    to={`/search?q=${encodeURIComponent(searchText)}`}
                    onClick={() => { setDrawerOpen(false); dispatch(setShowSearches(false)); }}
                  >
                    <Box
                      sx={{
                        px: "14px",
                        py: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#F3F4F6"}`,
                        "&:hover": {
                          backgroundColor: isDark
                            ? "rgba(255,255,255,0.05)"
                            : "#F9FAFB",
                        },
                      }}
                    >
                      <Typography
                        fontFamily="Nunito"
                        fontWeight={700}
                        fontSize="0.82rem"
                        color={brand.primary}
                      >
                        View all results
                      </Typography>
                    </Box>
                  </Link>
                </>
              ) : (
                <Box sx={{ px: "14px", py: "12px" }}>
                  <Typography
                    fontFamily="Nunito"
                    fontSize="0.82rem"
                    color="text.secondary"
                  >
                    No results for "{searchText}"
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>

        <Divider sx={{ borderColor: isDark ? "#27272E" : "#F3F4F6" }} />

        {/* Nav links */}
        <Box sx={{ px: "12px", py: "12px" }}>
          {nav.map(({ label, path }) => {
            const isActive = pathname === path;
            return (
              <Link key={path} to={path} onClick={() => setDrawerOpen(false)}>
                <Box
                  sx={{
                    px: "14px",
                    py: "12px",
                    borderRadius: "10px",
                    fontFamily: "Nunito",
                    fontWeight: isActive ? 800 : 600,
                    fontSize: "1rem",
                    color: isActive
                      ? brand.primary
                      : theme.palette.text.primary,
                    backgroundColor: isActive
                      ? `${brand.primary}12`
                      : "transparent",
                    mb: "2px",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      backgroundColor: `${brand.primary}0A`,
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

        <Divider sx={{ borderColor: isDark ? "#27272E" : "#F3F4F6" }} />

        {/* Auth section */}
        <Box sx={{ px: "16px", py: "16px" }}>
          {!user ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link to="/signin" onClick={() => setDrawerOpen(false)}>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ borderRadius: "100px", py: "9px" }}
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setDrawerOpen(false)}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ borderRadius: "100px", py: "9px" }}
                >
                  Sign Up
                </Button>
              </Link>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link to={accountPath} onClick={() => setDrawerOpen(false)}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    px: "14px",
                    py: "10px",
                    borderRadius: "10px",
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.04)"
                      : "#F9FAFB",
                    border: `1px solid ${isDark ? "#27272E" : "#EBEBEB"}`,
                  }}
                >
                  <PersonOutlineRounded
                    sx={{ fontSize: "20px", color: brand.secondary }}
                  />
                  <Box>
                    <Typography
                      fontFamily="Nunito"
                      fontWeight={700}
                      fontSize="0.9rem"
                    >
                      {user.firstName}
                    </Typography>
                    <Typography
                      fontFamily="Nunito"
                      fontSize="0.75rem"
                      color="text.secondary"
                    >
                      {user.role === "user" ? "My Account" : "Admin Panel"}
                    </Typography>
                  </Box>
                </Box>
              </Link>
              <Button
                variant="outlined"
                color="error"
                onClick={logout}
                startIcon={<LogoutRounded />}
                sx={{
                  borderRadius: "100px",
                  py: "9px",
                  borderColor: "error.main",
                }}
              >
                Sign Out
              </Button>
            </Box>
          )}
        </Box>

        {/* Theme toggle at bottom */}
        <Box
          sx={{
            position: "absolute",
            bottom: "20px",
            left: "16px",
            right: "16px",
          }}
        >
          <Box
            onClick={() => dispatch(setThemeMode(isDark ? "light" : "dark"))}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              px: "14px",
              py: "10px",
              borderRadius: "10px",
              border: `1px solid ${isDark ? "#27272E" : "#EBEBEB"}`,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#F9FAFB",
              },
              transition: "background 0.15s",
            }}
          >
            {isDark ? (
              <LightModeRounded
                sx={{ fontSize: "18px", color: brand.primary }}
              />
            ) : (
              <DarkModeRounded
                sx={{ fontSize: "18px", color: brand.secondary }}
              />
            )}
            <Typography fontFamily="Nunito" fontWeight={600} fontSize="0.88rem">
              {isDark ? "Light mode" : "Dark mode"}
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default MobileHeader;
