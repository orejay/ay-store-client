import {
  ArrowBackRounded,
  CheckBoxOutlineBlankRounded,
  CheckBoxRounded,
  Close,
  DeleteOutlineRounded,
  DeleteRounded,
  EditRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { setAddresses } from "state";
import { useAppDispatch, RootState } from "store";
import { useSelector } from "react-redux";
import AddAddress from "components/AddAddress";
import EditAddress from "components/EditAddress";

interface BodyState {
  contactName: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
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

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  id: string;
  token: string;
}

const AddressBook = () => {
  const { pathname } = useLocation();
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [data, setData] = useState<AddressData[]>([]);
  const [closeModal, setCloseModal] = useState<boolean>(true);
  const [added, setAdded] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<string>("");
  const [deleted, setDeleted] = useState<boolean>(false);
  const [newDefault, setNewDefault] = useState<boolean>(false);
  const addressList = useSelector((state: RootState) => state.global.addresses);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const prevPage = useSelector((state: RootState) => state.global.prevPage);
  const user: UserData | null = JSON.parse(
    localStorage.getItem("user") || "null"
  ) as UserData | null;

  useEffect(() => {
    getAddresses();
  }, [pathname]);

  const deleteAddress = async (id: string) => {
    try {
      setCloseModal(true);
      const response = await fetch(`${baseUrl}/edit/addresses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (response.ok) {
        setDeleted(true);
        setCloseModal(false);
      }
      const jsonData = await response.json();
      getAddresses();
      console.log(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const makeDefault = async (id: string) => {
    try {
      setCloseModal(true);
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
        setNewDefault(true);
        setCloseModal(false);
      }
      const jsonData = await response.json();
      getAddresses();
      console.log(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
      console.log(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          borderBottom: "1px solid #E0E0E0",
          pl: pathname === "/customer/addresses" ? "30px" : "10px",
          pr: "30px",
          py: pathname === "/customer/addresses" ? "13px" : "5px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          display="flex"
          gap="15px"
          sx={{
            alignItems: "center",
          }}
        >
          {pathname === "/customer/addresses/add" ||
          pathname === "/customer/addresses/edit" ? (
            <IconButton sx={{}} onClick={() => setCloseModal(true)}>
              <Link to={prevPage !== "" ? prevPage : `/customer/addresses`}>
                <ArrowBackRounded />
              </Link>
            </IconButton>
          ) : (
            ""
          )}
          <Typography
            fontFamily="Playfair Display"
            fontWeight="bold"
            color="secondary"
            variant="h5"
          >
            Address Book
          </Typography>
        </Box>
        <Button variant="contained" sx={{ px: "20px", borderRadius: "20px" }}>
          <Link to="/customer/addresses/add" className="w-full h-full">
            <Typography
              color="#FFFFFF"
              fontWeight="bold"
              fontFamily="Nunito"
              fontSize="12px"
            >
              Add New Address
            </Typography>
          </Link>
        </Button>
      </Box>
      <Box>
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
                backgroundColor: deleted || newDefault ? "#00C98D" : "#ff5316",
                pl: "30px",
                pr: "10px",
              }}
            >
              <Typography
                fontFamily="Nunito"
                sx={{
                  color: "white",
                  fontStyle: "italic",
                }}
              >
                {added
                  ? "Address Added Successfully!"
                  : deleted
                  ? "Address Deleted Successfully"
                  : newDefault
                  ? "Default Address Updated Successfully!"
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
            display: "flex",
            justifyContent: "center",
          }}
        >
          {pathname === "/customer/addresses" ? (
            <Box
              sx={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: "repeat(2,1fr)",
                gridAutoRows: "210px",
                gap: "30px",
                p: "30px",
              }}
            >
              {data
                ? data
                    .filter((item) => item.isDefault === true)
                    .map((each) => (
                      <Card
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
                          <Typography
                            fontSize="15px"
                            pb="2px"
                            fontFamily="Nunito"
                          >
                            {each.address}
                          </Typography>
                          <Typography
                            fontSize="15px"
                            pb="2px"
                            fontFamily="Nunito"
                          >
                            {each.city}, {each.state}
                          </Typography>
                          <Typography
                            fontSize="15px"
                            pb="4px"
                            fontFamily="Nunito"
                          >
                            {each.country}
                          </Typography>
                          <Typography
                            fontSize="14px"
                            pb="8px"
                            fontFamily="Nunito"
                          >
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
                              Set as default
                            </Typography>
                          </Button>
                          <Box>
                            {confirm !== each._id ? (
                              <Box>
                                <IconButton
                                  onClick={() => {
                                    dispatch(setAddresses([each]));
                                    navigate("/customer/addresses/edit");
                                  }}
                                >
                                  <EditRounded sx={{ color: "#Ed981b" }} />
                                </IconButton>
                                <IconButton
                                  onClick={() => {
                                    setConfirm(each._id);
                                  }}
                                >
                                  <DeleteOutlineRounded
                                    sx={{ color: "#Ed981b" }}
                                  />
                                </IconButton>
                              </Box>
                            ) : (
                              <Box gap="5px" display="flex" alignItems="center">
                                <Typography
                                  fontFamily="Nunito"
                                  fontStyle="italic"
                                  sx={{ color: "#Ed981b" }}
                                >
                                  Confirm?
                                </Typography>
                                <Button
                                  variant="contained"
                                  onClick={() => {
                                    deleteAddress(each._id);
                                  }}
                                  sx={{
                                    backgroundColor: "#ff5316",
                                    borderRadius: "20px",
                                    "&:hover": {
                                      backgroundColor: "#ff5316",
                                    },
                                  }}
                                >
                                  <Typography
                                    fontSize="12px"
                                    fontStyle="italic"
                                    fontWeight="bold"
                                    sx={{
                                      color: "white",
                                    }}
                                  >
                                    Yes
                                  </Typography>
                                </Button>
                                <Button
                                  variant="contained"
                                  onClick={() => {
                                    setConfirm("");
                                  }}
                                  sx={{
                                    backgroundColor: "#00C98D",
                                    borderRadius: "20px",
                                    display: "flex",
                                    alignItems: "center",
                                    "&:hover": {
                                      backgroundColor: "#00C98D",
                                    },
                                  }}
                                >
                                  <Typography
                                    fontSize="12px"
                                    fontStyle="italic"
                                    fontWeight="bold"
                                    sx={{
                                      color: "white",
                                    }}
                                  >
                                    No
                                  </Typography>
                                </Button>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Card>
                    ))
                : ""}
              {data
                ? data
                    .filter((item) => item.isDefault === false)
                    .map((each) => (
                      <Card
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
                          <Typography
                            fontSize="15px"
                            pb="2px"
                            fontFamily="Nunito"
                          >
                            {each.address}
                          </Typography>
                          <Typography
                            fontSize="15px"
                            pb="2px"
                            fontFamily="Nunito"
                          >
                            {each.city}, {each.state}
                          </Typography>
                          <Typography
                            fontSize="15px"
                            pb="4px"
                            fontFamily="Nunito"
                          >
                            {each.country}
                          </Typography>
                          <Typography
                            fontSize="14px"
                            pb="8px"
                            fontFamily="Nunito"
                          >
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
                              Set as default
                            </Typography>
                          </Button>
                          <Box>
                            {confirm !== each._id ? (
                              <Box>
                                <IconButton
                                  onClick={() => {
                                    dispatch(setAddresses([each]));
                                    navigate("/customer/addresses/edit");
                                  }}
                                >
                                  <EditRounded sx={{ color: "#Ed981b" }} />
                                </IconButton>
                                <IconButton
                                  onClick={() => {
                                    setConfirm(each._id);
                                  }}
                                >
                                  <DeleteOutlineRounded
                                    sx={{ color: "#Ed981b" }}
                                  />
                                </IconButton>
                              </Box>
                            ) : (
                              <Box gap="5px" display="flex" alignItems="center">
                                <Typography
                                  fontFamily="Nunito"
                                  fontStyle="italic"
                                  sx={{ color: "#Ed981b" }}
                                >
                                  Confirm?
                                </Typography>
                                <Button
                                  variant="contained"
                                  onClick={() => {
                                    deleteAddress(each._id);
                                  }}
                                  sx={{
                                    backgroundColor: "#ff5316",
                                    borderRadius: "20px",
                                    "&:hover": {
                                      backgroundColor: "#ff5316",
                                    },
                                  }}
                                >
                                  <Typography
                                    fontSize="12px"
                                    fontStyle="italic"
                                    fontWeight="bold"
                                    sx={{
                                      color: "white",
                                    }}
                                  >
                                    Yes
                                  </Typography>
                                </Button>
                                <Button
                                  variant="contained"
                                  onClick={() => {
                                    setConfirm("");
                                  }}
                                  sx={{
                                    backgroundColor: "#00C98D",
                                    borderRadius: "20px",
                                    display: "flex",
                                    alignItems: "center",
                                    "&:hover": {
                                      backgroundColor: "#00C98D",
                                    },
                                  }}
                                >
                                  <Typography
                                    fontSize="12px"
                                    fontStyle="italic"
                                    fontWeight="bold"
                                    sx={{
                                      color: "white",
                                    }}
                                  >
                                    No
                                  </Typography>
                                </Button>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Card>
                    ))
                : ""}
            </Box>
          ) : pathname === "/customer/addresses/add" ? (
            <AddAddress />
          ) : (
            <EditAddress />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AddressBook;
