import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import { ExpandMoreRounded } from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";

const orderStatus = ["new", "processing", "shipped", "delivered", "completed"];

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
  product: ProductData;
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

const ManageOrders = () => {
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState("new");
  const [ordersStatus, setOrdersStatus] = useState("");
  const user: UserData | null = JSON.parse(
    localStorage.getItem("user") || "null"
  ) as UserData | null;
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [data, setData] = useState<OrdersData[]>([]);
  const token = user?.token;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const updateStatus = async (id: string) => {
    try {
      const response = await fetch(`${baseUrl}/edit/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: ordersStatus,
        }),
      });
      const jsonData = await response.json();
      getAllOrders(tab);
      console.log(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getAllOrders = async (status: string) => {
    try {
      const response = await fetch(`${baseUrl}/get/allorders/${status}`, {
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

  useEffect(() => {
    getAllOrders(tab);
  }, []);

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
          Manage Orders ({data?.length})
        </Typography>
      </Box>
      <Box sx={{ p: "20px", width: "100%", height: "100%" }}>
        <Box sx={{ mt: "20px", px: "3%", width: "50%" }}>
          <FormControl variant="standard" sx={{ width: "50%" }}>
            <InputLabel color="secondary">Category</InputLabel>
            <Select
              onChange={(e) => {
                setTab(e.target.value as string);
                getAllOrders(e.target.value);
              }}
              defaultValue="new"
            >
              {orderStatus.map((each, index) => (
                <MenuItem key={index} value={each.toLowerCase()}>
                  {each}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box
          sx={{
            mt: "30px",
            px: "3%",
            display: "grid",
            gap: "20px",
            gridTemplateColumns: "repeat(2,1fr)",
            overflow: "auto",
            maxHeight: "80vh",
            pb: "15px",
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
          {data.length > 0 &&
            data?.map((each) => (
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
                  {each.status !== "completed" && (
                    <FlexBetween sx={{ width: "50%", alignItems: "end" }}>
                      <FormControl variant="standard" sx={{ width: "50%" }}>
                        <InputLabel color="secondary">Set Status</InputLabel>
                        <Select
                          onChange={(e) => {
                            setOrdersStatus(e.target.value as string);
                          }}
                          defaultValue={each.status}
                        >
                          {orderStatus.map((each, index) => (
                            <MenuItem key={index} value={each.toLowerCase()}>
                              {each}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Button onClick={() => updateStatus(each._id)}>
                        Update
                      </Button>
                    </FlexBetween>
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
                    <Typography fontWeight="bold" fontFamily="Playfair Display">
                      ITEMS:
                    </Typography>
                    {each.order.map((each) => (
                      <Box display="flex" mt="10px">
                        <Typography fontWeight="bold">
                          Product: {each.product.name},
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
      </Box>
    </Box>
  );
};

export default ManageOrders;
