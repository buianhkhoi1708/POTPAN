// Nhóm 9 - IE307.Q12
import React from "react";
import LogoIcon from "../assets/images/logo.svg"

interface AppLogo {
  width: number,
  height: number,
}

const AppLogo = ({width, height} : AppLogo) => {

  return (
        <LogoIcon width={width} height={height} />
  );
};

export default AppLogo;