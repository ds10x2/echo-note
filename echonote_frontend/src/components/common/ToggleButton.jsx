import React, { useState } from "react";
import { ToggleContainer, Toggle } from "./ToggleButton.style";

const ToggleButton = () => {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    setIsOn(!isOn);
  };

  return (
    <ToggleContainer onClick={handleToggle} isOn={isOn}>
      <Toggle isOn={isOn} />
    </ToggleContainer>
  );
};

export default ToggleButton;
