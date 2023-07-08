import {
  CheckBoxOutlineBlankRounded,
  CheckBoxRounded,
  Close,
} from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  InputLabel,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "store";
import { setAddresses } from "state";

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

interface BodyState {
  contactName: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
}

const EditAddress = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const addressList = useSelector((state: RootState) => state.global.addresses);
  const [isDefault, setIsDefault] = useState<boolean>(addressList[0].isDefault);
  const [closeModal, setCloseModal] = useState<boolean>(true);
  const [edited, setEdited] = useState<boolean>(false);
  const [expired, setExpired] = useState<boolean>(false);
  const user: UserData | null = JSON.parse(
    localStorage.getItem("user") || "null"
  ) as UserData | null;
  const [body, setBody] = useState<BodyState>({
    contactName: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    country: "",
    isDefault: false,
  });
  const dispatch = useAppDispatch();

  const editAddress = async () => {
    try {
      console.log(body);
      console.log(JSON.stringify(body));
      const response = await fetch(
        `${baseUrl}/edit/addresses/${addressList[0]._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(body),
        }
      );
      console.log(response);
      const jsonData = await response.json();
      console.log(jsonData);

      if (response.status === 401) setExpired(true);

      if (response.ok) {
        setEdited(true);
        setCloseModal(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {
        <CSSTransition
          in={!closeModal}
          timeout={1000}
          classNames="fade"
          unmountOnExit
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: "5px",
              backgroundColor: edited ? "#00C98D" : "#ff5316",
              pl: "30px",
              pr: "10px",
              width: "100%",
            }}
          >
            <Typography
              fontFamily="Nunito"
              sx={{
                color: "white",
                fontStyle: "italic",
              }}
            >
              {edited
                ? "Address Updated Successfully!"
                : "Something Went Wrong!"}
            </Typography>
            <IconButton
              onClick={() => {
                setCloseModal(true);
              }}
            >
              <Close sx={{ color: "white" }} />
            </IconButton>
          </Box>
        </CSSTransition>
      }
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: "30px",
          pt: "20px",
          width: "90%",
        }}
      >
        <FormControl variant="outlined" sx={{ mb: "20px" }}>
          <InputLabel color="secondary">Contact Name</InputLabel>
          <Input
            required
            type="text"
            defaultValue={addressList[0].contactName}
            color="secondary"
            onChange={(e) =>
              setBody((body) => ({
                ...body,
                contactName: e.target.value,
              }))
            }
          />
        </FormControl>
        <FormControl variant="outlined" sx={{ mb: "20px" }}>
          <InputLabel color="secondary">Contact Phone Number</InputLabel>
          <Input
            required
            type="tel"
            defaultValue={addressList[0].phoneNumber}
            color="secondary"
            onChange={(e) =>
              setBody((body) => ({
                ...body,
                phoneNumber: e.target.value,
              }))
            }
          />
        </FormControl>
        <FormControl
          variant="outlined"
          sx={{ mb: "20px", gridColumn: "span 2" }}
        >
          <InputLabel color="secondary" sx={{}}>
            Address
          </InputLabel>
          <Input
            required
            type="text"
            defaultValue={addressList[0].address}
            color="secondary"
            onChange={(e) =>
              setBody((body) => ({ ...body, address: e.target.value }))
            }
          />
        </FormControl>
        <FormControl variant="outlined" sx={{ mb: "20px" }}>
          <InputLabel color="secondary">Country</InputLabel>
          <Input
            required
            type="text"
            defaultValue={addressList[0].country}
            color="secondary"
            onChange={(e) =>
              setBody((body) => ({ ...body, country: e.target.value }))
            }
          />
        </FormControl>
        <FormControl variant="outlined" sx={{ mb: "20px" }}>
          <InputLabel color="secondary">State</InputLabel>
          <Input
            required
            type="text"
            defaultValue={addressList[0].state}
            color="secondary"
            onChange={(e) =>
              setBody((body) => ({ ...body, state: e.target.value }))
            }
          />
        </FormControl>
        <FormControl variant="outlined" sx={{ mb: "20px" }}>
          <InputLabel color="secondary">City</InputLabel>
          <Input
            required
            defaultValue={addressList[0].city}
            type="text"
            color="secondary"
            onChange={(e) =>
              setBody((body) => ({ ...body, city: e.target.value }))
            }
          />
        </FormControl>

        <Box sx={{ gridColumn: "span 2" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={() => {
                setIsDefault(!isDefault);
                setBody((body) => ({ ...body, isDefault: !isDefault }));
              }}
            >
              {isDefault ? (
                <CheckBoxRounded sx={{ color: "#Ed981b" }} />
              ) : (
                <CheckBoxOutlineBlankRounded />
              )}
            </IconButton>
            <Typography
              fontFamily="Nunito"
              fontWeight="bold"
              sx={{ ml: "10px" }}
            >
              Set as default address
            </Typography>
          </Box>
        </Box>
        <Button
          onClick={editAddress}
          variant="contained"
          sx={{ borderRadius: "20px", mt: "15px", width: "40%" }}
        >
          <Typography color="#ffffff">Confirm</Typography>
        </Button>
      </Box>
    </Box>
  );
};

export default EditAddress;
