import { MoonLoader } from "react-spinners";
import * as St from "@components/common/LoadingIcon.style";
import { theme } from "@/shared/styles/theme";

const LoadingIcon = ({ text }) => {
  return (
    <St.LoadingIconContainer>
      <MoonLoader color={theme.colors.main} speedMultiplier={0.8} />
      <St.LoadingText>{text}</St.LoadingText>
    </St.LoadingIconContainer>
  );
};

export default LoadingIcon;
