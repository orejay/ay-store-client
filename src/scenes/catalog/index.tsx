import { Close, DeleteOutlineRounded, EditRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  InputLabel,
  Select,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { useAppDispatch, RootState } from "store";
import { useSelector } from "react-redux";
import { setProducts } from "state";

interface ProductData {
  name: string;
  price: number;
  rating: number;
  discount: number;
  imageName: string;
  imagePath: string;
  description: string;
  category: string;
  supply: number;
  _id: string;
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

const Catalog = () => {
  const [added, setAdded] = useState<boolean>(false);
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [data, setData] = useState<ProductData[]>([]);
  const imageUrl = process.env.REACT_APP_IMAGE_URL;
  const [confirm, setConfirm] = useState<string>("");
  const [deleted, setDeleted] = useState<boolean>(false);
  const [closeModal, setCloseModal] = useState<boolean>(true);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user: UserData | null = JSON.parse(
    localStorage.getItem("user") || "null"
  ) as UserData | null;

  useEffect(() => {
    getProducts();
  }, []);

  const deleteProduct = async (id: string) => {
    try {
      setCloseModal(true);
      const response = await fetch(`${baseUrl}/edit/products/${id}`, {
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
      getProducts();
      console.log(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getProducts = async () => {
    try {
      const response = await fetch(`${baseUrl}/get/products`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const jsonData = await response.json();
      setData(jsonData.products);
      console.log(jsonData.products);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          borderBottom: "1px solid #E0E0E0",
          px: "5%",
          py: "13px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          fontFamily="Playfair Display"
          fontWeight="bold"
          color="secondary"
          variant="h5"
        >
          Catalog
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center">
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
                backgroundColor: added ? "#00C98D" : "#ff5316",
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
                {added
                  ? "Product Added Successfully!"
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
            overflow: "hidden",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gridAutoRows: "180px",
              gap: "20px",
              py: "20px",
              width: "90%",
              maxHeight: "100%",
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "0.4em",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "gray",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "darkgray",
              },
            }}
          >
            {data
              ? data.map((each) => (
                  <Box
                    sx={{
                      // border: "1px solid #E0E0E0",
                      boxShadow: "3px 3px 10px #E0E0E0",
                      borderRadius: "5px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${imageUrl}/uploads/${each.imageName})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <Box
                      sx={{
                        pl: "20px",
                        py: "8px",
                      }}
                    >
                      <Typography
                        fontFamily="Playfair Display"
                        fontWeight="bold"
                        sx={{
                          textTransform: "capitalize",
                          textShadow: "1px 1px 1px rgba(7, 116, 136, 1)",
                        }}
                        color="primary"
                      >
                        {each.name}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "baseline",
                      }}
                    >
                      <Box sx={{ pl: "20px", pt: "10px" }}>
                        <Typography
                          fontStyle="italic"
                          fontFamily="Nunito"
                          fontSize="14px"
                          fontWeight="bold"
                          color="white"
                        >
                          Category: {each.category}
                        </Typography>
                        <Typography
                          fontStyle="italic"
                          fontFamily="Nunito"
                          fontSize="14px"
                          fontWeight="bold"
                          color="white"
                        >
                          Supply: {each.supply}
                        </Typography>
                      </Box>
                      <Box></Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        p: "5px",
                      }}
                    >
                      <Box>
                        {confirm !== each._id ? (
                          <Box>
                            <IconButton
                              onClick={() => {
                                dispatch(setProducts([each]));
                                navigate("/admin/products/edit");
                              }}
                            >
                              <EditRounded sx={{ color: "#Ed981b" }} />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                setConfirm(each._id);
                              }}
                            >
                              <DeleteOutlineRounded sx={{ color: "#Ed981b" }} />
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
                                deleteProduct(each._id);
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
                  </Box>
                ))
              : ""}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Catalog;
