import {
  AddBusinessRounded,
  AdminPanelSettings,
  EditRounded,
  FavoriteBorderRounded,
  InboxRounded,
  Key,
  LocalActivityOutlined,
  MailRounded,
  ManageAccountsRounded,
  MenuBook,
  PeopleRounded,
  SettingsSuggest,
  StoreRounded,
} from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
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
  const user: UserData | null = JSON.parse(
    localStorage.getItem("user") || "null"
  ) as UserData | null;
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const token = user?.token;

  const auth = async () => {
    try {
      const response = await fetch(`${baseUrl}/auth/authenticate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 401) logout();
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/signin");
  };

  useEffect(() => {
    auth();
    setActive(pathname);
  }, [pathname]);

  return (
    <Box>
      <Header />
      <Box
        pt="150px"
        pb="80px"
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box width="90%" display="flex" justifyContent="space-between">
          <Box
            sx={{
              width: "20%",
              height: "100vh",
              boxShadow: "2px 2px 7px #E0E0E0",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              backgroundColor: "white",
              borderRadius: "5px",
            }}
          >
            {user?.role === "user" ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateRows: `repeat(${userItems.length},50px)`,
                }}
              >
                {userItems.map((each, index) => (
                  <Link
                    key={index}
                    to={`${each.link}`}
                    className={`flex items-center hover:bg-hov Nunito pl-5 ${
                      each.link === active ? "bg-active" : ""
                    } ${index === 4 ? "border-b border-active" : ""}`}
                  >
                    {each.icon}
                    <span
                      className={`Nunito ${
                        index <= 4 ? "font-bold" : "text-base"
                      } ml-4`}
                    >
                      {each.text}
                    </span>
                  </Link>
                ))}
              </Box>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateRows: `repeat(${userItems.length},50px)`,
                }}
              >
                {adminItems.map((each, index) => (
                  <Link
                    key={index}
                    to={`${each.link}`}
                    className={`flex items-center hover:bg-hov Nunito pl-5 ${
                      each.link === active ? "bg-active" : ""
                    }`}
                  >
                    {each.icon}
                    <span className="Nunito font-bold ml-4">{each.text}</span>
                  </Link>
                ))}
              </Box>
            )}
            <Box
              sx={{
                borderTop: "1px solid #E0E0E0",
                display: "flex",
                justifyContent: "center",
                height: "50px",
              }}
            >
              <Button sx={{ width: "100%" }}>Log Out</Button>
            </Box>
          </Box>
          <Box
            sx={{
              backgroundColor: "white",
              width: "78%",
              height: "100vh",
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
