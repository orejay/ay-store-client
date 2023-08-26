import {
  Box,
  Button,
  useTheme,
  IconButton,
  Typography,
  TextField,
  Divider,
  ListItem,
  List,
  useMediaQuery,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import FlexBetween from "./FlexBetween";
import {
  BorderRight,
  CloseRounded,
  DeleteOutlineRounded,
  DeleteRounded,
  KeyboardArrowDownRounded,
  MenuRounded,
  PermIdentityRounded,
  SearchRounded,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { useAppDispatch, RootState } from "store";
import { setCart, setShowCart, setShowSearches } from "state";

interface ProductData {
  name: string;
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

const nav = ["About", "Shop", "Contact"];

const Header = () => {
  const isMediumScreen = useMediaQuery("(max-width:768px)");
  const isSmallScreen = useMediaQuery("(max-width:450px)");
  const theme = useTheme();
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const user: UserData | null = JSON.parse(
    localStorage.getItem("user") || "null"
  ) as UserData | null;
  const [searchText, setSearchText] = useState("");
  const [active, setActive] = useState("");
  const [data, setData] = useState<ProductData[]>([]);
  const showSearches = useSelector(
    (state: RootState) => state.global.showSearches
  );
  const showCart = useSelector((state: RootState) => state.global.showCart);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const cart = useSelector((state: RootState) => state.global.cart);

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  const formatNumberWithCommas = (number: string) => {
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/signin");
  };

  const total = () => {
    let x = 0;
    for (let i = 0; i < cart.length; i++) {
      console.log(cart[i]);
      x += cart[i].price * ((100 - cart[i].discount) / 100);
    }
    return x;
  };

  const search = async () => {
    try {
      console.log(searchText);
      const response = await fetch(
        `${baseUrl}/get/products/search?name=${searchText}`
      );
      const jsonData = await response.json();
      setData(jsonData.products);
      console.log(jsonData.products);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Box
      py="15px"
      px="60px"
      width="100vw"
      sx={{
        position: "fixed",
        backgroundColor: theme.palette.background.default,
        zIndex: "100",
      }}
    >
      {isMediumScreen && (
        <Box>
          <IconButton>
            <MenuRounded />
          </IconButton>
        </Box>
      )}
      <FlexBetween>
        <Box>
          <h1 className="Nunito text-primary font-bold">
            <Link to="/">BEAUTY</Link>
          </h1>
        </Box>

        <FlexBetween width="20%" gap="15px">
          {nav.map((each, index) => (
            <Link
              to={`/${each.toLowerCase()}`}
              className={`Nunito font-semibold ${
                active === each.toLowerCase() ? "text-primary" : "text-drk"
              }`}
            >
              {each}
            </Link>
          ))}
        </FlexBetween>

        {!user ? (
          <FlexBetween gap="20px">
            <Typography
              fontFamily="Nunito"
              fontWeight="bold"
              color={`${active === "signin" ? "primary" : ""}`}
            >
              <Link to="/signin" className={`hover:text-gry`}>
                Sign In
              </Link>
            </Typography>
            <Button
              variant="outlined"
              color={`${active === "signup" ? "primary" : "secondary"}`}
              sx={{ borderRadius: "20px", px: "20px" }}
            >
              <Typography
                fontFamily="Nunito"
                fontWeight="bold"
                color={`${active === "signup" ? "primary" : "secondary"}`}
                sx={{ textTransform: "none" }}
              >
                <Link to="/signup">Sign Up</Link>
              </Typography>
            </Button>
          </FlexBetween>
        ) : (
          <FlexBetween gap="20px">
            <Box display="flex">
              <Typography
                fontFamily="Nunito"
                fontWeight="bold"
                color="secondary"
              >
                <Link to="/customer/account" className={`hover:text-gry`}>
                  Hi, {user.firstName}
                  <PermIdentityRounded sx={{ ml: "3px" }} />
                </Link>
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="primary"
              sx={{ borderRadius: "20px", px: "20px" }}
              onClick={logout}
            >
              <Typography
                fontFamily="Nunito"
                fontWeight="bold"
                color="primary"
                sx={{ textTransform: "none" }}
              >
                <Link to="/signin">Sign Out</Link>
              </Typography>
            </Button>
          </FlexBetween>
        )}
        <FlexBetween gap="5px" backGround="green">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TextField
              variant="standard"
              color="secondary"
              placeholder="search..."
              onChange={(e) => {
                setSearchText(e.target.value);
                dispatch(setShowCart(false));
                if (e.target.value.length > 1) {
                  search();
                  dispatch(setShowSearches(true));
                }
              }}
            />
            <IconButton onClick={search}>
              <SearchRounded />
            </IconButton>
          </Box>
          {data?.length > 0 && showSearches === true ? (
            <ul
              style={{
                backgroundColor: "white",
                position: "absolute",
                width: "200px",
                top: 60,
                padding: "1% 0",
                borderRadius: "5px",
              }}
            >
              {data.map((each) => (
                <Link
                  key={each._id}
                  to={`/products/${each.name}`}
                  className="w-full h-full pl-3 Nunito font-semibold py-2 hover:bg-hov transition-all ease-in-out duration-400 block"
                >
                  {each.name}
                </Link>
              ))}
            </ul>
          ) : showSearches && searchText.length > 0 ? (
            <div
              style={{
                backgroundColor: "white",
                position: "absolute",
                width: "200px",
                top: 60,
                padding: "1% 0",
                borderRadius: "5px",
              }}
            >
              <span className="pl-3 Nunito font-semibold">
                No results found...
              </span>
            </div>
          ) : (
            ""
          )}
          <Box
            sx={{
              backgroundColor: showCart ? "white" : "",
              borderRadius: "20px 20px 0 0",
            }}
          >
            <Box
              p="10px"
              sx={{ cursor: "pointer", zIndex: "100" }}
              onClick={() => {
                dispatch(setShowCart(!showCart));
                dispatch(setShowSearches(false));
              }}
            >
              {cart?.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "50%",
                    position: "absolute",
                    width: "14px",
                    height: "14px",
                    backgroundColor: "#F4f7fc",
                    ml: "12px",
                    mb: "10px",
                  }}
                >
                  <Typography fontSize="12px" fontWeight="bold" color="primary">
                    {cart?.length}
                  </Typography>
                </Box>
              )}
              <ShoppingCartOutlined />
            </Box>
          </Box>
          {showCart && cart?.length > 0 ? (
            <Box
              sx={{
                backgroundColor: "white",
                position: "absolute",
                maxHeight: "83vh",
                width: "300px",
                top: 60,
                padding: "1% 0",
                borderRadius: "5px",
                px: "15px",
              }}
            >
              <Box width="100%" sx={{ display: "flex", justifyContent: "end" }}>
                <IconButton onClick={() => dispatch(setShowCart(false))}>
                  <CloseRounded sx={{ color: "#ff5316", fontWeight: "bold" }} />
                </IconButton>
              </Box>
              <Box
                sx={{
                  overflow: "auto",
                  maxHeight: "50vh",
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
                {cart.map((each) => (
                  <Box
                    sx={{
                      py: "10px",
                      borderBottom: "2px solid #E0E0E0",
                      "& hover": { bgcolor: "#F0F0F0" },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box sx={{ mb: "7px" }}>
                        <Typography
                          fontWeight="bold"
                          fontSize="17px"
                          fontFamily="Nunito"
                        >
                          {each.name}
                        </Typography>
                        <Typography
                          fontFamily="Playfair Display"
                          fontWeight="bold"
                          fontSize="14px"
                          color="secondary"
                        >
                          {each.category}
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={() =>
                          dispatch(
                            setCart(
                              cart.filter((item) => item._id !== each._id)
                            )
                          )
                        }
                      >
                        <DeleteOutlineRounded sx={{ color: "#Ed981b" }} />
                      </IconButton>
                    </Box>
                    <Typography fontSize="13px" fontStyle="italic" mb="10px">
                      {each.description.slice(0, 30)}...
                    </Typography>

                    <Typography
                      fontFamily="Playfair Display"
                      fontWeight="bold"
                      fontSize="14px"
                    >
                      {each.quantity} x{" "}
                      {formatNumberWithCommas(
                        (each.price * ((100 - each.discount) / 100)).toFixed(2)
                      )}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    py: "20px",
                  }}
                >
                  <Typography fontWeight="bold" fontFamily="Nunito">
                    Total
                  </Typography>
                  <Typography fontFamily="Nunito" fontWeight="bold">
                    ${formatNumberWithCommas(total().toFixed(2))}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                color="primary"
                sx={{
                  borderRadius: "20px",
                  width: "100%",
                  textTransform: "none",
                  borderWidth: "2px",
                  transition: "ease-in-out 0.2s",
                }}
                onClick={() => {
                  navigate("/checkout");
                  dispatch(setShowCart(false));
                }}
              >
                <Typography fontFamily="Nunito" fontWeight="bold">
                  Checkout
                </Typography>
              </Button>
            </Box>
          ) : showCart && cart.length < 1 ? (
            <Box
              sx={{
                backgroundColor: "white",
                position: "absolute",
                width: "300px",
                top: 60,
                padding: "1% 0",
                borderRadius: "5px",
                px: "15px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Box
                width="100%"
                sx={{ display: "flex", justifyContent: "end", pr: "5px" }}
              >
                <IconButton onClick={() => dispatch(setShowCart(false))}>
                  <CloseRounded sx={{ color: "#ff5316", fontWeight: "bold" }} />
                </IconButton>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  py: "5px",
                }}
              >
                <Typography
                  fontFamily="Playfair Display"
                  color="secondary"
                  fontWeight="bold"
                  fontStyle="italic"
                >
                  Your cart is empty...
                </Typography>
              </Box>
            </Box>
          ) : (
            ""
          )}
        </FlexBetween>
      </FlexBetween>
    </Box>
  );
};

export default Header;
