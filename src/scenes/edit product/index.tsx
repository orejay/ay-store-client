import {
  ArrowBackRounded,
  Close,
  DriveFolderUploadRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import { useSelector } from "react-redux";
import { useAppDispatch, RootState } from "store";
import { Link } from "react-router-dom";

const cats = ["Skin", "Face", "Lips", "Perfumery", "Household", "Decorative"];
interface BodyState {
  name: string;
  price: string;
  discount: string;
  category: string;
  supply: string;
  description: string;
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

const EditProduct = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [expired, setExpired] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [closeModal, setCloseModal] = useState<boolean>(true);
  const [added, setAdded] = useState<boolean>(false);
  const products = useSelector((state: RootState) => state.global.products);
  const user: UserData | null = JSON.parse(
    localStorage.getItem("user") || "null"
  ) as UserData | null;
  const [body, setBody] = useState<BodyState>({
    name: "",
    price: "",
    discount: "",
    category: "",
    supply: "",
    description: "",
  });

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const file = e.target.files && e.target.files[0];
    setSelectedImage(file || null);
  };

  const upload = async (id: string) => {
    try {
      const formData = new FormData();
      if (selectedImage) formData.append("image", selectedImage);
      formData.append("name", body.name);
      formData.append("price", body.price);
      formData.append("discount", body.discount);
      formData.append("category", body.category);
      formData.append("supply", body.supply);
      formData.append("description", body.description);
      const response = await fetch(`${baseUrl}/edit/products/${id}`, {
        method: "PATCH",
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
          "Content-Length": formData.toString().length.toString(),
        },
        body: formData,
      });
      console.log(response);
      const jsonData = await response.json();
      console.log(jsonData);

      if (response.status === 401) setExpired(true);

      if (response.ok) {
        setAdded(true);
        setCloseModal(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          borderBottom: "1px solid #E0E0E0",
          px: "30px",
          py: "3px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box display="flex" alignItems="center">
          <IconButton sx={{}} onClick={() => setCloseModal(true)}>
            <Link to="/admin/catalog">
              <ArrowBackRounded />
            </Link>
          </IconButton>
          <Typography
            fontFamily="Playfair Display"
            fontWeight="bold"
            color="secondary"
            variant="h5"
          >
            Edit Product
          </Typography>
        </Box>
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
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "30px",
            pt: "20px",
            width: "90%",
          }}
        >
          <FormControl variant="outlined" sx={{ mb: "20px" }}>
            <InputLabel color="secondary">Product Name</InputLabel>
            <Input
              required
              type="text"
              defaultValue={products.length > 0 ? products[0].name : ""}
              color="secondary"
              onChange={(e) =>
                setBody((body) => ({
                  ...body,
                  name: e.target.value,
                }))
              }
            />
          </FormControl>
          <FormControl variant="outlined" sx={{ mb: "20px" }}>
            <InputLabel color="secondary">Price</InputLabel>
            <Input
              required
              type="text"
              defaultValue={products.length > 0 ? products[0].price : ""}
              color="secondary"
              onChange={(e) =>
                setBody((body) => ({
                  ...body,
                  price: e.target.value,
                }))
              }
            />
          </FormControl>
          <FormControl variant="outlined" sx={{ mb: "20px" }}>
            <InputLabel color="secondary">Discount</InputLabel>
            <Input
              required
              type="text"
              defaultValue={products.length > 0 ? products[0].discount : ""}
              color="secondary"
              onChange={(e) =>
                setBody((body) => ({
                  ...body,
                  discount: e.target.value,
                }))
              }
            />
          </FormControl>
          <FormControl variant="standard" sx={{ mb: "20px" }}>
            <InputLabel color="secondary">Category</InputLabel>
            <Select
              onChange={(e) =>
                setBody((body) => ({
                  ...body,
                  category: e.target.value as string,
                }))
              }
              defaultValue={products.length > 0 ? products[0].category : ""}
            >
              {cats.map((each, index) => (
                <MenuItem key={index} value={each.toLowerCase()}>
                  {each}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" sx={{ mb: "20px" }}>
            <InputLabel color="secondary">Supply</InputLabel>
            <Input
              required
              type="text"
              defaultValue={products.length > 0 ? products[0].supply : ""}
              color="secondary"
              onChange={(e) =>
                setBody((body) => ({
                  ...body,
                  supply: e.target.value,
                }))
              }
            />
          </FormControl>
          <FormControl
            variant="outlined"
            sx={{ mb: "20px", gridColumn: "span 2" }}
          >
            <InputLabel color="secondary">Description</InputLabel>
            <Input
              required
              type="text"
              defaultValue={products.length > 0 ? products[0].description : ""}
              color="secondary"
              multiline
              onChange={(e) =>
                setBody((body) => ({ ...body, description: e.target.value }))
              }
            />
          </FormControl>

          <Box sx={{ gridColumn: "span 2" }}>
            <label
              htmlFor="upload"
              className="flex items-center cursor-pointer"
            >
              <DriveFolderUploadRounded
                sx={{
                  fontSize: "70px",
                  color: "#Ed981b",
                  mr: "5px",
                  transform: "rotate(-10deg)",
                  transformOrigin: "left",
                }}
              />
              <Typography
                fontWeight="bold"
                fontFamily="Nunito"
                color={!selectedImage ? "secondary" : "primary"}
              >
                {!selectedImage ? "Upload Image" : `${selectedImage.name}`}
              </Typography>
            </label>
            <input
              hidden
              required
              type="file"
              name="upload"
              id="upload"
              accept="image/*"
              className="grid-cols-2"
              color="secondary"
              onChange={(e) => handleImage(e)}
            />
          </Box>
          <Box display="flex" alignItems="center">
            <Button
              onClick={() => upload(products[0]._id)}
              variant="contained"
              sx={{ borderRadius: "20px", width: "70%" }}
            >
              <Typography color="#ffffff">Upload</Typography>
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EditProduct;
