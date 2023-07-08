import {
  Box,
  Button,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React from "react";

const cats = ["Skin", "Face", "Lips", "Perfumery", "Household", "Decorative"];

const AddProduct = () => {
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
      <Box display="flex" justifyContent="center">
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
              // onChange={(e) =>
              //   setBody((body) => ({
              //     ...body,
              //     contactName: e.target.value,
              //   }))
              // }
            />
          </FormControl>
          <FormControl variant="outlined" sx={{ mb: "20px" }}>
            <InputLabel color="secondary">Price</InputLabel>
            <Input
              required
              type="text"
              color="secondary"
              // onChange={(e) =>
              //   setBody((body) => ({
              //     ...body,
              //     contactName: e.target.value,
              //   }))
              // }
            />
          </FormControl>
          <FormControl variant="outlined" sx={{ mb: "20px" }}>
            <InputLabel color="secondary">Discount</InputLabel>
            <Input
              required
              type="text"
              color="secondary"
              // onChange={(e) =>
              //   setBody((body) => ({
              //     ...body,
              //     contactName: e.target.value,
              //   }))
              // }
            />
          </FormControl>
          <FormControl variant="standard" sx={{ mb: "20px" }}>
            <InputLabel color="secondary">Category</InputLabel>
            <Select>
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
              // onChange={(e) =>
              //   setBody((body) => ({
              //     ...body,
              //     contactName: e.target.value,
              //   }))
              // }
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
              // onChange={(e) =>
              //   setBody((body) => ({ ...body, password: e.target.value }))
              // }
            />
          </FormControl>

          <Box sx={{ gridColumn: "span 2" }}>
            <input
              required
              type="file"
              accept="image/*"
              className="grid-cols-2"
              color="secondary"
            />
          </Box>
          <Box display="flex" alignItems="center">
            <Button
              // onClick={addAddress}
              variant="contained"
              sx={{ borderRadius: "20px", width: "70%" }}
            >
              <Typography color="#ffffff">Confirm</Typography>
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddProduct;
