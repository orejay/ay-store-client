import { Box, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import about from "../assets/about.PNG";

const AboutSection = () => {
  const isMediumScreen = useMediaQuery("(max-width: 768px)");
  const isSmallScreen = useMediaQuery("(max-width:450px)");
  return (
    <Box
      display="flex"
      flexDirection="column"
      py="50px"
      alignItems="center"
      sx={{
        minHeight: "100vh",
        width: "100%",
      }}
      id="about"
    >
      <Box
        sx={{
          width: "90%",
          display: "flex",
          mb: "70px",
          mt: "40px",
          ml: isMediumScreen ? "" : "10%",
        }}
      >
        <Box
          sx={{
            width: "2px",
            height: "50px",
            mr: "9px",
            backgroundColor: "#676769",
            borderRadius: "2px",
          }}
        ></Box>
        <Box>
          <Typography fontFamily="Nunito" fontWeight="bold" color="GrayText">
            About
          </Typography>
          <Typography
            variant="h5"
            fontWeight="bold"
            fontFamily="Playfair Display"
          >
            Our Company
          </Typography>
        </Box>
      </Box>
      <Box
        display="flex"
        width="90%"
        sx={{ flexDirection: isSmallScreen ? "column-reverse" : "" }}
      >
        <Box
          width={!isSmallScreen ? "50%" : "100%"}
          pl={isMediumScreen ? "" : "13%"}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <Typography fontFamily="Nunito" fontSize="14px" fontWeight="bold">
            Welcome to our beauty shop, where we believe in the power of
            transformation and self-expression. At our shop, we offer a wide
            range of beauty services designed to enhance your natural beauty and
            boost your confidence. Our team of skilled professionals is
            passionate about providing personalized care and delivering
            exceptional results. Whether you're preparing for a special occasion
            or simply looking for some well-deserved self-care, our dedicated
            team is here to cater to your unique needs and help you achieve your
            desired look. Visit us today and let us be your trusted partner in
            your beauty journey, helping you look and feel your absolute best.
          </Typography>
          <Link to="/about" className="text-sm text-primary mt-3">
            Discover
          </Link>
        </Box>

        <Box
          width={isSmallScreen ? "90%" : "50%"}
          mb={isSmallScreen ? "25px" : ""}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            sx={{
              content: "''",
              top: "-10%",
              left: "-10%",
              width: "310px",
              height: "305px",
              borderRadius: "30% 70% 50% 30% / 10% 30% 50% 70%",
              borderImageSlice: "1",
              border: "2px solid #Dfeaec",
              boxSizing: "border-box",
            }}
          >
            <Box
              component="img"
              alt="about-img"
              src={about}
              sx={{
                objectFit: "cover",
                width: "300px",
                height: "300px",
                position: "relative",
                overflow: "hidden",
                borderRadius: "50% / 10% 30% 50% 70%",
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AboutSection;
