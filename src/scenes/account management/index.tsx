import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  InputLabel,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

interface BodyState {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
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

const AccManagement = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [closeModal, setCloseModal] = useState<boolean>(true);
  const [updatedMessage, setUpdatedMessage] = useState<string>(
    "Details Updated Successfully!"
  );
  const [updated, setUpdated] = useState<boolean>(false);
  const firstNameRef = useRef(null);
  const user: UserData | null = JSON.parse(
    localStorage.getItem("user") || "null"
  ) as UserData | null;
  const [body, setBody] = useState<BodyState>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const editDetails = async () => {
    try {
      console.log(body);
      console.log(JSON.stringify(body));
      const response = await fetch(`${baseUrl}/edit/user`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(body),
      });
      const jsonData = await response.json();
      if (response.ok) {
        setUpdatedMessage("Details Updated Successfully!");
        setCloseModal(false);
        setUpdated(true);
        console.log(jsonData.userData);
        localStorage.setItem("user", JSON.stringify(jsonData.userData));
      } else {
        setUpdatedMessage(jsonData.message);
        setUpdated(false);
        setCloseModal(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setUpdated(false);
      setUpdatedMessage("Something went wrong!");
    }
  };

  return (
    <Box>
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
          Account Management
        </Typography>
      </Box>
      <Box sx={{}}>
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
                backgroundColor: updated ? "#00C98D" : "#ff5316",
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
                {/* {updated ? updatedMessage : "Something Went Wrong!"} */}
                {updatedMessage}
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
            pl: "30px",
            pt: "20px",
            width: "90%",
          }}
        >
          <FormControl variant="outlined" sx={{ mb: "20px" }}>
            <InputLabel color="secondary">First Name</InputLabel>
            <Input
              required
              type="text"
              color="secondary"
              defaultValue={user?.firstName}
              onChange={(e) =>
                setBody((body) => ({ ...body, firstName: e.target.value }))
              }
            />
          </FormControl>
          <FormControl variant="outlined" sx={{ mb: "20px" }}>
            <InputLabel color="secondary">Last Name</InputLabel>
            <Input
              required
              type="text"
              defaultValue={user?.lastName}
              color="secondary"
              onChange={(e) =>
                setBody((body) => ({ ...body, lastName: e.target.value }))
              }
            />
          </FormControl>
          <FormControl variant="outlined" sx={{ mb: "20px" }}>
            <InputLabel color="secondary">Email</InputLabel>
            <Input
              required
              type="email"
              defaultValue={user?.email}
              color="secondary"
              onChange={(e) =>
                setBody((body) => ({ ...body, email: e.target.value }))
              }
            />
          </FormControl>
          <FormControl variant="outlined" sx={{ mb: "20px" }}>
            <InputLabel color="secondary">Phone Number</InputLabel>
            <Input
              required
              type="tel"
              defaultValue={user?.phoneNumber}
              color="secondary"
              onChange={(e) =>
                setBody((body) => ({ ...body, phoneNumber: e.target.value }))
              }
            />
          </FormControl>
          <Button
            variant="contained"
            sx={{ borderRadius: "20px", mt: "15px", width: "40%" }}
            onClick={editDetails}
            disabled={
              body.lastName === "" &&
              body.firstName === "" &&
              body.email === "" &&
              body.phoneNumber === ""
                ? true
                : false
            }
          >
            <Typography color="#ffffff">Confirm</Typography>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AccManagement;
