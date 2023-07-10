import {
  AddPhotoAlternateRounded,
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
import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";

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

const AddProduct = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [expired, setExpired] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [closeModal, setCloseModal] = useState<boolean>(true);
  const [added, setAdded] = useState<boolean>(false);
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

  const upload = async () => {
    try {
      if (!selectedImage) {
        console.log("No image selected");
        return;
      }
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("name", body.name);
      formData.append("price", body.price);
      formData.append("discount", body.discount);
      formData.append("category", body.category);
      formData.append("supply", body.supply);
      formData.append("description", body.description);
      const response = await fetch(`${baseUrl}/post/products`, {
        method: "POST",
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
    <Box
      sx={{
        backgroundColor: "white",
        width: "78%",
        borderRadius: "5px",
        boxShadow: "2px 2px 7px #E0E0E0",
      }}
    >
      <Box
        sx={{
          borderBottom: "1px solid #E0E0E0",
          px: "30px",
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
          Add Product
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
              onClick={upload}
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

export default AddProduct;
