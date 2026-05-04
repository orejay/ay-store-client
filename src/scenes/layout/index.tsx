import {
  AddBusinessRounded,
  AdminPanelSettings,
  EditRounded,
  FavoriteBorderRounded,
  InboxRounded,
  Key,
  LocalActivityOutlined,
  LocalShippingRounded,
  MailRounded,
  ManageAccountsRounded,
  MenuBook,
  PeopleRounded,
  SettingsSuggest,
  StoreRounded,
} from "@mui/icons-material";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import Footer from "components/Footer";
import Header from "components/Header";
import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const userItems = [
  {
    text: "My Account",
    link: "/customer/account",
    icon: <ManageAccountsRounded />,
  },
  {
    text: "Orders",
    link: "/customer/orders",
    icon: <InboxRounded />,
  },
  {
    text: "Inbox",
    link: "/customer/inbox",
    icon: <MailRounded />,
  },
  {
    text: "Saved Items",
    link: "/customer/saved",
    icon: <FavoriteBorderRounded />,
  },
  {
    text: "Voucher",
    link: "/customer/vouchers",
    icon: <LocalActivityOutlined />,
  },
  {
    text: "Account Management",
    link: "/customer/account/management",
    icon: <SettingsSuggest />,
  },
  {
    text: "Change Password",
    link: "/customer/password",
    icon: <Key />,
  },
  {
    text: "Address Book",
    link: "/customer/addresses",
    icon: <MenuBook />,
  },
];

const adminItems = [
  {
    text: "Manage Account",
    link: "/admin/account",
    icon: <AdminPanelSettings />,
  },
  {
    text: "Add Product",
    link: "/admin/products/add",
    icon: <AddBusinessRounded />,
  },
  {
    text: "Catalog",
    link: "/admin/catalog",
    icon: <StoreRounded />,
  },
  {
    text: "Manage Users",
    link: "/admin/users",
    icon: <PeopleRounded />,
  },
  {
    text: "Manage Orders",
    link: "/admin/orders",
    icon: <LocalShippingRounded />,
  },
  {
    text: "Edit Information",
    link: "/admin/account/management",
    icon: <EditRounded />,
  },
  {
    text: "Change Password",
    link: "/admin/password",
    icon: <Key />,
  },
];

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  id: string;
  token: string;
}

const Layout = () => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const isMediumScreen = useMediaQuery("(max-width:768px)");
  const user: UserData | null = JSON.parse(
    localStorage.getItem("user") || "null"
  ) as UserData | null;
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const token = user?.token;

  const auth = async () => {
    try {
      const response = await fetch(`${baseUrl}/auth/authenticate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 401) signout();
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const signout = () => {
    localStorage.removeItem("user");
    navigate("/signin");
  };

  useEffect(() => {
    auth();
    setActive(pathname);
  }, [pathname]);

  const items = user?.role === "user" ? userItems : adminItems;

  return (
    <Box>
      <Header />
      <Box
        pt={isMediumScreen ? "70px" : "120px"}
        pb="80px"
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          width="95%"
          sx={{
            display: "flex",
            flexDirection: isMediumScreen ? "column" : "row",
            justifyContent: "space-between",
            gap: isMediumScreen ? "16px" : "0",
          }}
        >
          {/* Sidebar */}
          <Box
            sx={{
              width: isMediumScreen ? "100%" : "20%",
              boxShadow: "2px 2px 7px #E0E0E0",
              display: "flex",
              flexDirection: isMediumScreen ? "row" : "column",
              justifyContent: "space-between",
              backgroundColor: "white",
              borderRadius: "5px",
              overflowX: isMediumScreen ? "auto" : "visible",
            }}
          >
            <Box
              sx={{
                display: isMediumScreen ? "flex" : "grid",
                gridTemplateRows: !isMediumScreen
                  ? `repeat(${items.length},50px)`
                  : undefined,
                flexDirection: isMediumScreen ? "row" : undefined,
                minWidth: isMediumScreen ? "max-content" : undefined,
              }}
            >
              {items.map((each, index) => (
                <Link
                  key={index}
                  to={`${each.link}`}
                  className={`flex items-center hover:bg-hov Nunito ${
                    isMediumScreen ? "px-4 py-3" : "pl-5"
                  } whitespace-nowrap ${
                    each.link === active ? "bg-active" : ""
                  } ${
                    !isMediumScreen && index === 4 ? "border-b border-active" : ""
                  }`}
                >
                  {each.icon}
                  <span
                    className={`Nunito ${
                      !isMediumScreen && index <= 4 ? "font-bold" : "text-base"
                    } ml-2 md:ml-4`}
                  >
                    {each.text}
                  </span>
                </Link>
              ))}
            </Box>
            {!isMediumScreen && (
              <Box
                sx={{
                  borderTop: "1px solid #E0E0E0",
                  display: "flex",
                  justifyContent: "center",
                  height: "50px",
                }}
              >
                <Button sx={{ width: "100%" }} onClick={signout}>
                  Log Out
                </Button>
              </Box>
            )}
          </Box>

          {/* Main content */}
          <Box
            sx={{
              backgroundColor: "white",
              width: isMediumScreen ? "100%" : "78%",
              minHeight: isMediumScreen ? "60vh" : "100vh",
              borderRadius: "5px",
              boxShadow: "2px 2px 7px #E0E0E0",
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
