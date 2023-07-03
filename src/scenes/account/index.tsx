import { ManageAccountsRounded } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import Footer from "components/Footer";
import Header from "components/Header";
import React, { useEffect, useState } from "react";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  id: string;
  token: string;
}

interface AddressData {
  _id: string;
  user: string;
  isDefault: boolean;
  address: string;
  city: string;
  state: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  __v: string;
}

const Account = () => {
  const user: UserData | null = JSON.parse(
    localStorage.getItem("user") || "null"
  ) as UserData | null;
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [data, setData] = useState<AddressData[]>([]);
  console.log(user);

  useEffect(() => {
    getAddress();
  }, []);

  const getAddress = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/get/address/default/${user?.id}`
      );
      const jsonData = await response.json();
      setData(jsonData);
      console.log(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        width: "78%",
        borderRadius: "5px",
        boxShadow: "2px 2px 7px #E0E0E0",
      }}
    >
      <Box sx={{ borderBottom: "1px solid #E0E0E0", pl: "30px", py: "10px" }}>
        <Typography
          fontFamily="Playfair Display"
          fontWeight="bold"
          color="secondary"
          variant="h5"
        >
          My Account
        </Typography>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gridAutoRows: "200px",
          gap: "20px",
          p: "20px",
        }}
      >
        <Box sx={{ border: "1px solid #E0E0E0", borderRadius: "5px" }}>
          <Box
            sx={{ borderBottom: "1px solid #E0E0E0", pl: "20px", py: "8px" }}
          >
            <Typography
              fontFamily="Playfair Display"
              fontWeight="bold"
              sx={{ textTransform: "capitalize" }}
            >
              ACCOUNT DETAILS
            </Typography>
          </Box>
          <Box sx={{ p: "20px" }}>
            <Typography fontSize="20px" fontWeight="bold" fontFamily="Nunito">
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography
              fontSize="15px"
              pt="10px"
              fontWeight="bold"
              fontFamily="Nunito"
            >
              {user?.email}
            </Typography>
            <Typography fontSize="13px" pt="8px" fontFamily="Nunito">
              {user?.phoneNumber}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ border: "1px solid #E0E0E0", borderRadius: "5px" }}>
          <Box
            sx={{ borderBottom: "1px solid #E0E0E0", pl: "20px", py: "8px" }}
          >
            <Typography
              fontFamily="Playfair Display"
              fontWeight="bold"
              sx={{ textTransform: "capitalize" }}
            >
              ADDRESS BOOK
            </Typography>
          </Box>
          {data && (
            <Box sx={{ p: "20px" }}>
              <Typography
                fontSize="17px"
                fontWeight="bold"
                pb="8px"
                fontFamily="Nunito"
              >
                Default address
              </Typography>
              <Typography
                fontSize="15px"
                fontStyle="italic"
                fontFamily="Nunito"
              >
                {data[0]?.address}, {data[0]?.city}, {data[0]?.state},{" "}
                {data[0]?.country}.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Account;
