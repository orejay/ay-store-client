import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import {
  AddBusinessRounded,
  AdminPanelSettings,
  EditRounded,
  FavoriteBorderRounded,
  InboxRounded,
  Key,
  LocalActivityOutlined,
  LogoutRounded,
  MailRounded,
  ManageAccountsRounded,
  MenuBook,
  PeopleRounded,
  SettingsSuggest,
  StoreRounded,
  LocalShippingRounded,
  ConfirmationNumberRounded,
} from "@mui/icons-material";
import Footer from "components/Footer";
import Header from "components/Header";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { brand } from "../../theme";

const userItems = [
  { text: "My Account", link: "/customer/account", icon: <ManageAccountsRounded sx={{ fontSize: "18px" }} /> },
  { text: "Orders", link: "/customer/orders", icon: <InboxRounded sx={{ fontSize: "18px" }} /> },
  { text: "Inbox", link: "/customer/inbox", icon: <MailRounded sx={{ fontSize: "18px" }} /> },
  { text: "Saved Items", link: "/customer/saved", icon: <FavoriteBorderRounded sx={{ fontSize: "18px" }} /> },
  { text: "Voucher", link: "/customer/vouchers", icon: <LocalActivityOutlined sx={{ fontSize: "18px" }} /> },
  { text: "Account Management", link: "/customer/account/management", icon: <SettingsSuggest sx={{ fontSize: "18px" }} /> },
  { text: "Change Password", link: "/customer/password", icon: <Key sx={{ fontSize: "18px" }} /> },
  { text: "Address Book", link: "/customer/addresses", icon: <MenuBook sx={{ fontSize: "18px" }} /> },
];

const adminItems = [
  { text: "Manage Account", link: "/admin/account", icon: <AdminPanelSettings sx={{ fontSize: "18px" }} /> },
  { text: "Add Product", link: "/admin/products/add", icon: <AddBusinessRounded sx={{ fontSize: "18px" }} /> },
  { text: "Catalog", link: "/admin/catalog", icon: <StoreRounded sx={{ fontSize: "18px" }} /> },
  { text: "Manage Users", link: "/admin/users", icon: <PeopleRounded sx={{ fontSize: "18px" }} /> },
  { text: "Manage Orders", link: "/admin/orders", icon: <LocalShippingRounded sx={{ fontSize: "18px" }} /> },
  { text: "Vouchers", link: "/admin/vouchers", icon: <ConfirmationNumberRounded sx={{ fontSize: "18px" }} /> },
  { text: "Edit Information", link: "/admin/account/management", icon: <EditRounded sx={{ fontSize: "18px" }} /> },
  { text: "Change Password", link: "/admin/password", icon: <Key sx={{ fontSize: "18px" }} /> },
];

interface UserData {
  firstName: string; lastName: string; email: string;
  phoneNumber: string; role: string; id: string; token: string;
}

const Layout = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const isMobile = useMediaQuery("(max-width:768px)");
  const user: UserData | null = JSON.parse(localStorage.getItem("user") || "null");
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const borderColor = isDark ? "#27272E" : "#EBEBEB";
  const panelBg = isDark ? "#16161A" : "#FFFFFF";

  const auth = async () => {
    try {
      const res = await fetch(`${baseUrl}/auth/authenticate`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.status === 401) { localStorage.removeItem("user"); navigate("/signin"); }
    } catch { /* silent */ }
  };

  useEffect(() => { auth(); setActive(pathname); }, [pathname]);

  const items = user?.role === "user" ? userItems : adminItems;

  const Sidebar = () => (
    <Box
      sx={{
        backgroundColor: panelBg,
        border: `1px solid ${borderColor}`,
        borderRadius: isMobile ? "0" : "16px",
        display: "flex",
        flexDirection: isMobile ? "row" : "column",
        overflowX: isMobile ? "auto" : "visible",
        minWidth: isMobile ? "0" : "220px",
        width: isMobile ? "100%" : "220px",
        flexShrink: 0,
      }}
    >
      {!isMobile && (
        <Box sx={{ px: "20px", py: "20px", borderBottom: `1px solid ${borderColor}` }}>
          <Typography
            fontFamily="Playfair Display"
            fontWeight={900}
            fontSize="0.9rem"
            color={brand.primary}
            letterSpacing="-0.01em"
          >
            {user?.role === "user" ? "My Account" : "Admin Panel"}
          </Typography>
          <Typography fontFamily="Nunito" fontSize="0.78rem" color="text.secondary" mt="2px">
            {user?.firstName} {user?.lastName}
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "row" : "column",
          p: isMobile ? "0" : "8px",
          gap: isMobile ? "0" : "2px",
          flex: 1,
          minWidth: isMobile ? "max-content" : "auto",
        }}
      >
        {items.map(({ text, link, icon }, index) => {
          const isActive = active === link;
          return (
            <Tooltip key={link} title={isMobile ? text : ""} placement="bottom">
              <Link to={link}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: isMobile ? "0" : "10px",
                    px: isMobile ? "16px" : "12px",
                    py: isMobile ? "12px" : "10px",
                    borderRadius: isMobile ? "0" : "10px",
                    borderBottom: isMobile ? `2px solid ${isActive ? brand.primary : "transparent"}` : "none",
                    backgroundColor: !isMobile && isActive ? `${brand.primary}12` : "transparent",
                    color: isActive ? brand.primary : theme.palette.text.secondary,
                    transition: "all 0.15s ease",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    "&:hover": {
                      backgroundColor: !isMobile ? `${brand.primary}08` : "transparent",
                      color: brand.primary,
                    },
                  }}
                >
                  <Box sx={{ flexShrink: 0 }}>{icon}</Box>
                  {!isMobile && (
                    <Typography
                      fontFamily="Nunito"
                      fontWeight={isActive ? 700 : 500}
                      fontSize="0.875rem"
                    >
                      {text}
                    </Typography>
                  )}
                </Box>
              </Link>
            </Tooltip>
          );
        })}
      </Box>

      {!isMobile && (
        <>
          <Divider sx={{ borderColor }} />
          <Box sx={{ p: "8px" }}>
            <Box
              onClick={() => { localStorage.removeItem("user"); navigate("/signin"); }}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                px: "12px",
                py: "10px",
                borderRadius: "10px",
                cursor: "pointer",
                color: theme.palette.text.secondary,
                "&:hover": { backgroundColor: "rgba(239,68,68,0.08)", color: "#EF4444" },
                transition: "all 0.15s",
              }}
            >
              <LogoutRounded sx={{ fontSize: "18px" }} />
              <Typography fontFamily="Nunito" fontWeight={500} fontSize="0.875rem">
                Sign Out
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: "100vh" }}>
      <Header />
      <Box
        sx={{
          pt: { xs: "60px", md: "68px" },
          pb: "80px",
          px: { xs: "0", md: "40px" },
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "0" : "20px",
          alignItems: isMobile ? "stretch" : "flex-start",
          maxWidth: "1200px",
          mx: "auto",
          mt: { xs: "0", md: "24px" },
        }}
      >
        <Sidebar />

        {/* Main content area */}
        <Box
          sx={{
            flex: 1,
            borderRadius: isMobile ? "0" : "16px",
            border: `1px solid ${isDark ? "#27272E" : "#EBEBEB"}`,
            backgroundColor: isDark ? "#16161A" : "#FFFFFF",
            minHeight: isMobile ? "60vh" : "70vh",
            overflow: "hidden",
          }}
        >
          <Outlet />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
