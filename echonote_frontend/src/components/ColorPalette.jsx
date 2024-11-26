import { useState, useEffect, useRef } from "react";
import { Colorful } from "@uiw/react-color";
import * as St from "@components/styles/ColorPalette.style";
import canvasStore from "@stores/canvasStore";

const ColorPalette = ({ value, onChange }) => {
  // const [color, setColor] = useState(strokeColor);
  const [showPalette, setShowPalette] = useState(false);
  const paletteRef = useRef(null);
  const { strokeColor, setStrokeColor } = canvasStore();

  const togglePalette = () => {
    setShowPalette(!showPalette);
  };

  // 외부 클릭 감지
  const handleClickOutside = (event) => {
    if (paletteRef.current && !paletteRef.current.contains(event.target)) {
      setShowPalette(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (onChange && strokeColor) {
      onChange(strokeColor);
    }
  }, [strokeColor, onChange]);

  return (
    <St.ColorPaletteContainer>
      <St.ColorSelectionBtn
        color={strokeColor}
        onClick={togglePalette}
      ></St.ColorSelectionBtn>

      {showPalette && (
        <St.ColorPalette ref={paletteRef}>
          <Colorful
            color={strokeColor}
            onChange={(newColor) => {
              // setColor(newColor.hexa);
              setStrokeColor(newColor.hexa);
            }}
          />
        </St.ColorPalette>
      )}
    </St.ColorPaletteContainer>
  );
};

export default ColorPalette;
