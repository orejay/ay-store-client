import {
  Box,
  Button,
  FormControl,
  Input,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setDeliveryAddress, setInstructions } from "state";
import { RootState, useAppDispatch } from "store";

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

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  id: string;
  token: string;
}

const DeliveryDetails = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const deliveryAddress = useSelector(
    (state: RootState) => state.global.deliveryAddress
  );
  const [data, setData] = useState<AddressData[]>([]);
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const user: UserData | null = JSON.parse(
    localStorage.getItem("user") || "null"
  ) as UserData | null;

  const getAddresses = async () => {
    try {
      const response = await fetch(`${baseUrl}/get/addresses`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const jsonData = await response.json();
      setData(jsonData);
      let defaultAddress: AddressData[] = [];
      if (jsonData.length > 0) {
        defaultAddress = jsonData.filter(
          (item: AddressData) => item.isDefault === true
        );
      }
      dispatch(setDeliveryAddress(defaultAddress[0]));
      console.log(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const makeDefault = async (id: string) => {
    try {
      const response = await fetch(
        `${baseUrl}/edit/addresses/set-default/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.ok) {
      }
      const jsonData = await response.json();
      getAddresses();
      console.log(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getAddresses();
  }, []);

  return (
    <Box sx={{ p: "20px", pb: "50px" }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gridAutoRows: "220px",
          gap: "20px",
        }}
      >
        {data.length > 0
          ? data
              .filter((item) => item.isDefault === true)
              .map((each) => (
                <Box
                  key={each._id}
                  sx={{
                    border: "1px solid #E0E0E0",
                    borderRadius: "5px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      borderBottom: "1px solid #E0E0E0",
                      pl: "20px",
                      py: "8px",
                    }}
                  >
                    <Typography
                      fontFamily="Playfair Display"
                      fontWeight="bold"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {each.contactName}
                    </Typography>
                  </Box>

                  <Box sx={{ px: "20px", pt: "15px" }}>
                    <Typography fontSize="15px" pb="2px" fontFamily="Nunito">
                      {each.address}
                    </Typography>
                    <Typography fontSize="15px" pb="2px" fontFamily="Nunito">
                      {each.city}, {each.state}
                    </Typography>
                    <Typography fontSize="15px" pb="4px" fontFamily="Nunito">
                      {each.country}
                    </Typography>
                    <Typography fontSize="14px" pb="8px" fontFamily="Nunito">
                      {each.phoneNumber}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderTop: "1px solid #E0E0E0",
                      p: "5px",
                    }}
                  >
                    <Button disabled>
                      <Typography fontSize="14px" fontWeight="bold">
                        Delivery Address
                      </Typography>
                    </Button>
                  </Box>
                </Box>
              ))
          : ""}
        {data.length > 0
          ? data
              .filter((item) => item.isDefault !== true)
              .map((each) => (
                <Box
                  key={each._id}
                  sx={{
                    border: "1px solid #E0E0E0",
                    borderRadius: "5px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      borderBottom: "1px solid #E0E0E0",
                      pl: "20px",
                      py: "8px",
                    }}
                  >
                    <Typography
                      fontFamily="Playfair Display"
                      fontWeight="bold"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {each.contactName}
                    </Typography>
                  </Box>

                  <Box sx={{ px: "20px", pt: "15px" }}>
                    <Typography fontSize="15px" pb="2px" fontFamily="Nunito">
                      {each.address}
                    </Typography>
                    <Typography fontSize="15px" pb="2px" fontFamily="Nunito">
                      {each.city}, {each.state}
                    </Typography>
                    <Typography fontSize="15px" pb="4px" fontFamily="Nunito">
                      {each.country}
                    </Typography>
                    <Typography fontSize="14px" pb="8px" fontFamily="Nunito">
                      {each.phoneNumber}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderTop: "1px solid #E0E0E0",
                      p: "5px",
                    }}
                  >
                    <Button onClick={() => makeDefault(each._id)}>
                      <Typography fontSize="14px" fontWeight="bold">
                        {deliveryAddress === each
                          ? "Delivery Address"
                          : "Deliver Here"}
                      </Typography>
                    </Button>
                  </Box>
                </Box>
              ))
          : ""}
      </Box>
      <Button
        onClick={() => navigate("/customer/addresses/add")}
        variant="contained"
        sx={{ mt: "15px", borderRadius: "20px" }}
      >
        <Typography color="white" fontWeight="bold" textTransform="none">
          Add New Address
        </Typography>
      </Button>
      <Box sx={{ pt: "50px" }}>
        <Typography
          fontFamily="Playfair Display"
          fontWeight="bold"
          color="secondary"
        >
          Additional Information
        </Typography>
        <FormControl variant="outlined" sx={{ mt: "20px", width: "90%" }}>
          <InputLabel color="secondary" sx={{ fontStyle: "italic" }}>
            Additional instructions about your order...
          </InputLabel>
          <Input
            type="text"
            color="secondary"
            multiline
            onChange={(e) => dispatch(setInstructions(e.target.value))}
          />
        </FormControl>
      </Box>
    </Box>
  );
};

export default DeliveryDetails;
