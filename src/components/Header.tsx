import { Box, useMediaQuery } from "@mui/material";
import React from "react";

import PCHeader from "./PCHeader";
import MobileHeader from "./MobileHeader";

const Header = () => {
  const isMediumScreen = useMediaQuery("(max-width:768px)");

  return <Box>{isMediumScreen ? <MobileHeader /> : <PCHeader />}</Box>;
};

export default Header;
