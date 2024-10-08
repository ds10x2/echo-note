import React, { useState } from "react";
import { ToggleContainer, Toggle } from "./ToggleButton.style";

const ToggleButton = ({ isOn, onChange }) => {
  const handleToggle = () => {
    onChange();
  };

  return (
    <ToggleContainer onClick={handleToggle} isOn={isOn}>
      <Toggle isOn={isOn} />
    </ToggleContainer>
  );
};

export default ToggleButton;
