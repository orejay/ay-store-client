import {
  AddShoppingCartRounded,
  CheckBox,
  CheckBoxOutlineBlankRounded,
  CheckBoxRounded,
  CloseRounded,
  RemoveShoppingCartRounded,
  TuneRounded,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  Slider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Footer from "components/Footer";
import Header from "components/Header";
import React, { useState, useEffect, useMemo, useRef } from "react";
import perfumery from "../../assets/perfumery.jpg";
import { RootState, useAppDispatch } from "store";
import { useSelector } from "react-redux";
import { setCart, setCategories } from "state";

function priceText(price: number) {
  return `$${price}`;
}

function ratingText(rating: number) {
  return `${rating}`;
}

interface ProductData {
  name: string;
  price: number;
  rating: number;
  discount: number;
  quantity: number;
  imageName: string;
  imagePath: string;
  description: string;
  category: string;
  _id: string;
}

const cats = ["Skin", "Face", "Lips", "Perfumery", "Household", "Decorative"];

const Shop = () => {
  const isMediumScreen = useMediaQuery("(max-width: 768px)");
  const isSmallScreen = useMediaQuery("(max-width: 450px)");
  const [data, setData] = useState<ProductData[]>([]);
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const imageUrl = process.env.REACT_APP_IMAGE_URL;
  const [priceRange, setPriceRange] = useState<number[]>([0, 100000]);
  const [hovered, setHovered] = useState("");
  const dispatch = useAppDispatch();
  const cart = useSelector((state: RootState) => state.global.cart);
  const categoryList = useSelector(
    (state: RootState) => state.global.categories
  );
  const [discount, setDiscount] = useState(false);
  const [rating, setRating] = useState<number[]>([0, 5]);

  const formatNumberWithCommas = (number: string) => {
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleRatingChange = (event: Event, newValue: number | number[]) => {
    setRating(newValue as number[]);
  };

  const handlePriceRangeChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    setPriceRange(newValue as number[]);
  };

  const getProducts = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/get/products/filter?category=${categoryList.join(
          ","
        )}&priceRange=${priceRange[0]}-${priceRange[1]}&rating=${rating[0]}-${
          rating[1]
        }&discount=${discount}`
      );
      const jsonData = await response.json();
      setData(jsonData.products);
      console.log(jsonData.products);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   getProducts();

  //   return () => {
  //     dispatch(setCategories([]));
  //   };
  // }, []);

  useMemo(() => {
    getProducts();
  }, [categoryList, priceRange, discount, rating]);

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
        <Box
          display="flex"
          width="74%"
          justifyContent="start"
          gap="20px"
          my="15px"
          ml="auto"
          mr="0"
        >
          {categoryList?.map((each, index) => (
            <Box display="flex" alignItems="center" gap="3px">
              <Typography key={index} fontFamily="Nunito">
                {each}
              </Typography>
              <CloseRounded
                sx={{ fontSize: "17px", cursor: "pointer" }}
                onClick={() => {
                  dispatch(
                    setCategories(
                      categoryList.filter((item) => item !== each.toLowerCase())
                    )
                  );
                }}
              />
            </Box>
          ))}
        </Box>
        <Box
          width={isMediumScreen ? "95%" : "90%"}
          display="flex"
          justifyContent="space-between"
        >
          <Box
            sx={{
              width: isMediumScreen ? "30%" : "19%",
              py: "2%",
              px: "3%",
              boxShadow: "2px 2px 7px #E0E0E0",
              backgroundColor: "white",
              borderRadius: "5px",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              width="50%"
              mx="auto"
            >
              <Typography fontFamily="Nunito" fontWeight="bold">
                Filter
              </Typography>
              <TuneRounded sx={{ fontSize: "20px" }} />
            </Box>
            <Box>
              <Typography
                fontFamily="Nunito"
                color="secondary"
                fontWeight="bold"
                textAlign="center"
                mt="10px"
              >
                Choose Category
              </Typography>
              <Box>
                {cats.map((each, index) => (
                  <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    width="50%"
                  >
                    <IconButton
                      onClick={() => {
                        if (!categoryList.includes(each.toLowerCase())) {
                          dispatch(
                            setCategories([...categoryList, each.toLowerCase()])
                          );
                        } else {
                          dispatch(
                            setCategories(
                              categoryList.filter(
                                (item) => item !== each.toLowerCase()
                              )
                            )
                          );
                        }
                      }}
                    >
                      {!categoryList.includes(each.toLowerCase()) ? (
                        <CheckBoxOutlineBlankRounded />
                      ) : (
                        <CheckBoxRounded sx={{ color: "#Ed981b" }} />
                      )}
                    </IconButton>
                    <Typography fontFamily="Nunito" fontWeight="bold">
                      {each}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box my="15px">
              <Typography
                fontFamily="Nunito"
                textAlign="center"
                fontWeight="bold"
              >
                Price Range
              </Typography>
              <Slider
                getAriaLabel={() => "Price range"}
                value={priceRange}
                step={500}
                max={100000}
                onChange={handlePriceRangeChange}
                valueLabelDisplay="auto"
                getAriaValueText={priceText}
              />
              <Typography textAlign="center" fontFamily="Nunito">
                ${priceRange[0]} - ${priceRange[1]}
              </Typography>
            </Box>
            <Box>
              <Typography
                fontFamily="Nunito"
                textAlign="center"
                fontWeight="bold"
              >
                Rating
              </Typography>
              <Slider
                getAriaLabel={() => "Rating range"}
                value={rating}
                step={0.5}
                max={5}
                onChange={handleRatingChange}
                valueLabelDisplay="auto"
                getAriaValueText={ratingText}
              />
              <Typography textAlign="center" fontFamily="Nunito">
                {rating[0]} - {rating[1]}
              </Typography>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              width="50%"
              my="15px"
            >
              <IconButton onClick={() => setDiscount(!discount)}>
                {!discount ? (
                  <CheckBoxOutlineBlankRounded />
                ) : (
                  <CheckBoxRounded sx={{ color: "#Ed981b" }} />
                )}
              </IconButton>
              <Typography fontFamily="Nunito" fontWeight="bold">
                Discount
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              width: isMediumScreen ? "65%" : "77%",
              display: "grid",
              gridTemplateColumns: isSmallScreen
                ? "repeat(2,1fr)"
                : isMediumScreen
                ? "repeat(2,1fr)"
                : "repeat(4,1fr)",
              gap: "45px",
              gridAutoRows: "350px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
            gap="15px"
          >
            {data?.map((each) => (
              <Box
                key={each._id}
                sx={{
                  boxShadow: "2px 2px 7px #E0E0E0",
                  borderRadius: "5px",
                  height: "350px",
                }}
                onMouseEnter={() => setHovered(each._id)}
                onMouseLeave={() => setHovered("")}
              >
                {each.discount > 0 && (
                  <Box
                    sx={{
                      backgroundColor: "#Ed981b",
                      p: "2px",
                      borderRadius: "4px",
                      width: "35px",
                      height: "35px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "absolute",
                      transform: "rotate(45deg)",
                      mt: "15px",
                      ml: "15px",
                    }}
                  >
                    <Typography
                      fontFamily="Nunito"
                      fontWeight="bold"
                      fontSize="12px"
                      color="white"
                      sx={{ transform: "rotate(-45deg)" }}
                    >
                      -{each.discount}%
                    </Typography>
                  </Box>
                )}
                <Box
                  component="img"
                  alt="product-img"
                  src={`${imageUrl}/uploads/${each.imageName}`}
                  width="100%"
                  height="55%"
                  sx={{
                    borderRadius: "5px 5px 0 0",
                    objectFit: "cover",
                    zIndex: 1,
                  }}
                />
                <Box textAlign="center" mt="15px">
                  <Typography fontFamily="Nunito" fontWeight="bold">
                    {each.name[0].toUpperCase()}
                    {each.name.slice(1)}
                  </Typography>
                  <Typography
                    fontFamily="Playfair Display"
                    fontSize="14px"
                    color="secondary"
                    fontWeight="bold"
                    my="5px"
                  >
                    {each.category[0].toUpperCase()}
                    {each.category.slice(1)}
                  </Typography>
                  <Typography
                    fontFamily="Nunito"
                    color="secondary"
                    my="7px"
                    fontSize="12px"
                  >
                    {each.description}
                  </Typography>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    width="80%"
                    mx="auto"
                    sx={{
                      transition: "0.5s ease-in",
                    }}
                  >
                    <Typography
                      fontFamily="Nunito"
                      fontWeight="bold"
                      color="primary"
                      my="10px"
                    >
                      $
                      {formatNumberWithCommas(
                        (each.price * ((100 - each.discount) / 100)).toFixed(2)
                      )}
                    </Typography>
                    {!cart.some((item) => item._id === each._id) ? (
                      <IconButton
                        onClick={() => {
                          dispatch(
                            setCart([...cart, { ...each, quantity: 1 }])
                          );
                        }}
                      >
                        <AddShoppingCartRounded
                          color="primary"
                          sx={{
                            visibility: isMediumScreen
                              ? "visible"
                              : !isMediumScreen
                              ? hovered === each._id
                                ? "visible"
                                : "hidden"
                              : "visible",
                            opacity: hovered === each._id ? 1 : 0,
                            transition: "0.5s ease-in",
                          }}
                        />
                      </IconButton>
                    ) : (
                      <IconButton
                        onClick={() =>
                          dispatch(
                            setCart(
                              cart.filter((item) => item._id !== each._id)
                            )
                          )
                        }
                      >
                        <RemoveShoppingCartRounded
                          color="primary"
                          sx={{
                            visibility:
                              hovered === each._id ? "visible" : "hidden",
                            opacity: hovered === each._id ? 1 : 0,
                            transition: "0.5s ease-in",
                          }}
                        />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Shop;
