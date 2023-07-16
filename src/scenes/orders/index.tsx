import { ExpandMoreRounded, ShoppingCart } from "@mui/icons-material";
import {
  Box,
  Typography,
  Button,
  Card,
  CardActions,
  Collapse,
  CardContent,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import FlexBetween from "components/FlexBetween";

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
interface ProductData {
  name: string;
  quantity: number;
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

interface OrderData {
  productId: ProductData;
  quantity: number;
}

interface OrdersData {
  _id: string;
  order: OrderData[];
  address: AddressData;
  instructions: string;
  userId: string;
  status: string;
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const Orders = () => {
  const [expanded, setExpanded] = useState(false);
  const [toCancel, setToCancel] = useState("");
  const user: UserData | null = JSON.parse(
    localStorage.getItem("user") || "null"
  ) as UserData | null;
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [data, setData] = useState<OrdersData[]>([]);
  const token = user?.token;
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    getOrders();
  }, []);

  const cancelOrder = async (id: string) => {
    try {
      const response = await fetch(`${baseUrl}/edit/orders/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const jsonData = await response.json();
      if (response.ok) getOrders();
      console.log(jsonData);
    } catch (error) {
      console.error("Error canceling order", error);
    }
  };

  const getOrders = async () => {
    try {
      const response = await fetch(`${baseUrl}/get/orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
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
      <Box sx={{ borderBottom: "1px solid #E0E0E0", pl: "30px", py: "10px" }}>
        <Typography
          fontFamily="Playfair Display"
          fontWeight="bold"
          color="secondary"
          variant="h5"
        >
          Orders
        </Typography>
      </Box>
      {data && (
        <Box sx={{ p: "20px" }}>
          {data?.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2,1fr)",
                // gridAutoRows: "180px",
                gap: "20px",
                overflow: "auto",
                maxHeight: "80vh",
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
              {data?.map((each) => (
                <Card
                  key={each._id}
                  sx={{
                    borderRadius: "5px",
                    // border: "1px solid #E0E0E0",
                    backgroundColor: "#f7f7f7",
                    gridColumn: "span 1",
                    p: "15px",
                  }}
                >
                  <Box display="flex" sx={{}}>
                    <Typography fontSize="15px" fontWeight="bold">
                      Order:{" "}
                    </Typography>
                    <Typography fontSize="14px" fontStyle="italic" ml="5px">
                      {each._id}
                    </Typography>
                  </Box>
                  <Box display="flex" sx={{}}>
                    <Typography fontSize="15px" fontWeight="bold">
                      Status:{" "}
                    </Typography>
                    <Typography fontSize="14px" fontStyle="italic" ml="5px">
                      {each.status}
                    </Typography>
                  </Box>
                  <Box display="flex" sx={{}}>
                    <Typography fontSize="15px" fontWeight="bold">
                      Address:{" "}
                    </Typography>
                    <Typography fontSize="14px" fontStyle="italic" ml="5px">
                      {each.address.address}
                    </Typography>
                  </Box>
                  <Box display="flex" sx={{}}>
                    <Typography fontSize="15px" fontWeight="bold">
                      Contact:{" "}
                    </Typography>
                    <Typography fontSize="14px" fontStyle="italic" ml="5px">
                      {each.address.phoneNumber}
                    </Typography>
                  </Box>
                  <CardActions disableSpacing>
                    {each.status === "new" && toCancel !== each._id ? (
                      <Button onClick={() => setToCancel(each._id)}>
                        <Typography fontWeight="bold" textTransform="none">
                          Cancel Order
                        </Typography>
                      </Button>
                    ) : toCancel === each._id ? (
                      <FlexBetween gap="10px">
                        <Typography
                          fontWeight="bold"
                          fontStyle="italic"
                          color="primary"
                        >
                          Confirm
                        </Typography>
                        <Button
                          variant="contained"
                          sx={{ borderRadius: "20px" }}
                          color="warning"
                          onClick={() => cancelOrder(each._id)}
                        >
                          <Typography color="white" fontSize="12px">
                            Yes
                          </Typography>
                        </Button>
                        <Button
                          onClick={() => setToCancel("")}
                          variant="contained"
                          sx={{ borderRadius: "20px" }}
                          color="success"
                        >
                          <Typography color="white" fontSize="12px">
                            No
                          </Typography>
                        </Button>
                      </FlexBetween>
                    ) : (
                      ""
                    )}
                    <ExpandMore
                      expand={expanded}
                      onClick={handleExpandClick}
                      aria-expanded={expanded}
                      aria-label="show more"
                    >
                      <ExpandMoreRounded />
                    </ExpandMore>
                  </CardActions>
                  <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                      <Typography
                        fontWeight="bold"
                        fontFamily="Playfair Display"
                      >
                        ITEMS:
                      </Typography>
                      {each.order.map((each) => (
                        <Box display="flex" mt="10px">
                          <Typography fontWeight="bold">
                            Product: {each.productId.name},
                          </Typography>
                          <Typography fontWeight="bold" ml="5px">
                            Quantity: {each.quantity}
                          </Typography>
                        </Box>
                      ))}
                    </CardContent>
                  </Collapse>
                </Card>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                pt: "50px",
              }}
            >
              <ShoppingCart
                sx={{
                  fontSize: "90px",
                  color: "#Ed981b",
                  transform: "rotate(-15deg)",
                }}
              />
              <Typography
                fontFamily="Nunito"
                fontWeight="bold"
                fontSize="20px"
                pt="20px"
              >
                You have placed no orders yet!
              </Typography>
              <Typography
                pt="10px"
                fontSize="14px"
                sx={{ maxWidth: "40%", textAlign: "center" }}
              >
                All your orders will be saved here for you to access their state
                anytime.
              </Typography>
              <Button
                variant="contained"
                sx={{ px: "30px", mt: "15px", borderRadius: "20px" }}
              >
                <Link to="/shop" className="w-full h-full">
                  <Typography
                    color="#FFFFFF"
                    fontWeight="bold"
                    fontFamily="Nunito"
                  >
                    Continue Shopping
                  </Typography>
                </Link>
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Orders;
