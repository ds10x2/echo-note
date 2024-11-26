import { useState } from "react";

export const useToggle = (initialState = false) => {
  const [isOpened, setIsOpened] = useState(initialState);

  const toggle = () => {
    setIsOpened(!isOpened);
  };

  return {
    isOpened,
    toggle,
  };
};
