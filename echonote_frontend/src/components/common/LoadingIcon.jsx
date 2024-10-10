import React from "react";
import { MoonLoader } from "react-spinners";
import * as St from "@components/common/LoadingIcon.style";

const LoadingIcon = () => {
  return (
    <St.LoadingIconContainer>
      <St.LoadingText>PDF를 가져오고 있어요</St.LoadingText>
      <MoonLoader color="#FF900D" />
    </St.LoadingIconContainer>
  );
};

export default LoadingIcon;
