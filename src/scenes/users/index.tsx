import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import { ExpandMoreRounded } from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  id: string;
  token: string;
  _id: string;
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

const Users = () => {
  const isSmallScreen = useMediaQuery("(max-width:450px)");
  const user: UserData | null = JSON.parse(
    localStorage.getItem("user") || "null"
  ) as UserData | null;
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [data, setData] = useState<UserData[]>([]);
  const [expanded, setExpanded] = useState(false);
  const token = user?.token;

  const getAllUsers = async () => {
    try {
      const response = await fetch(`${baseUrl}/get/users`, {
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

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    getAllUsers();
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
          Manage Users ({data?.length})
        </Typography>
      </Box>
      <Box sx={{ p: "20px", width: "100%", height: "100%" }}>
        <Box
          sx={{
            mt: "30px",
            px: "3%",
            display: "grid",
            gridTemplateColumns: isSmallScreen ? "1fr" : "repeat(2,1fr)",
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
                  Name:{" "}
                </Typography>
                <Typography fontSize="14px" fontStyle="italic" ml="5px">
                  {each.firstName} {each.lastName}
                </Typography>
              </Box>
              <Box display="flex" sx={{}}>
                <Typography fontSize="15px" fontWeight="bold">
                  Contact:{" "}
                </Typography>
                <Typography fontSize="14px" fontStyle="italic" ml="5px">
                  {each.phoneNumber}
                </Typography>
              </Box>
              <Box display="flex" sx={{}}>
                <Typography fontSize="15px" fontWeight="bold">
                  Email:{" "}
                </Typography>
                <Typography fontSize="14px" fontStyle="italic" ml="5px">
                  {each.email}
                </Typography>
              </Box>
              <Box display="flex" sx={{}}>
                <Typography fontSize="15px" fontWeight="bold">
                  Role:{" "}
                </Typography>
                <Typography fontSize="14px" fontStyle="italic" ml="5px">
                  {each.role}
                </Typography>
              </Box>
              <CardActions disableSpacing>
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
                <CardContent></CardContent>
              </Collapse>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Users;
