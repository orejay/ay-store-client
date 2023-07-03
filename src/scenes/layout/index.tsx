import {
  FavoriteBorderRounded,
  InboxRounded,
  LocalActivityOutlined,
  MailRounded,
  ManageAccountsRounded,
} from "@mui/icons-material";
import { Box } from "@mui/material";
import Footer from "components/Footer";
import Header from "components/Header";
import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const navItems = [
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
];

const Layout = () => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  return (
    <Box>
      <Header />
      <Box
        pt="150px"
        mb="80px"
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
              width: "19%",
              height: "100vh",
              py: "2%",
              boxShadow: "2px 2px 7px #E0E0E0",
              display: "grid",
              gridTemplateRows: `repeat(${navItems.length},50px)`,
              backgroundColor: "white",
              borderRadius: "5px",
            }}
          >
            {navItems.map((each, index) => (
              <Link
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
          <Outlet />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
