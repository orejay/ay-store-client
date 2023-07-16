import { ManageAccountsRounded } from "@mui/icons-material";
import { Box, Button, Card, Typography } from "@mui/material";
import Footer from "components/Footer";
import Header from "components/Header";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
  contactName: string;
  phoneNumber: string;
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
        `${baseUrl}/get/addresses/default/${user?.id}`
      );
      const jsonData = await response.json();
      setData(jsonData);
      console.log(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Box>
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
        <Card sx={{ border: "1px solid #E0E0E0", borderRadius: "5px" }}>
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
            <Box display="flex" justifyContent="end">
              <Button
                variant="contained"
                sx={{ px: "20px", borderRadius: "20px" }}
              >
                <Link
                  to="/customer/account/management"
                  className="w-full h-full"
                >
                  <Typography
                    color="#FFFFFF"
                    fontWeight="bold"
                    fontFamily="Nunito"
                    fontSize="12px"
                  >
                    Edit Details
                  </Typography>
                </Link>
              </Button>
            </Box>
          </Box>
        </Card>
        <Card sx={{ border: "1px solid #E0E0E0", borderRadius: "5px" }}>
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
              {data[0]?.address ? (
                <Box sx={{}}>
                  <Typography fontSize="15px" pb="2px" fontFamily="Nunito">
                    {data[0].address}
                  </Typography>
                  <Typography fontSize="15px" pb="2px" fontFamily="Nunito">
                    {data[0].city}, {data[0].state}
                  </Typography>
                  <Typography fontSize="15px" pb="4px" fontFamily="Nunito">
                    {data[0].country}
                  </Typography>
                  <Typography fontSize="14px" pb="8px" fontFamily="Nunito">
                    {data[0].phoneNumber}
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography
                    fontWeight="bold"
                    fontFamily="Nunito"
                    fontStyle="italic"
                    fontSize="16px"
                  >
                    No Default Address is Set
                  </Typography>
                  <Box display="flex" justifyContent="end">
                    <Button
                      variant="contained"
                      sx={{ px: "20px", mt: "15px", borderRadius: "20px" }}
                    >
                      <Link to="/customer/addresses" className="w-full h-full">
                        <Typography
                          color="#FFFFFF"
                          fontWeight="bold"
                          fontFamily="Nunito"
                          fontSize="12px"
                        >
                          Set Default Address
                        </Typography>
                      </Link>
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Card>
      </Box>
    </Box>
  );
};

export default Account;
