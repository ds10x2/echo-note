import { useState, useEffect, useRef } from "react";
import { Sketch } from '@uiw/react-color';
import * as St from "@components/styles/ColorPalette.style";

const ColorPalette = ({ value, onChange }) => {
  const [color, setColor] = useState(value || "#000000FF");  // hexa 기본값 설정
  const [showPalette, setShowPalette] = useState(false);
  const paletteRef = useRef(null);

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
    if (onChange && color) {
      onChange(color);
    }
  }, [color, onChange]);

  return (
    <St.ColorPaletteContainer>
      <St.ColorSelectionBtn
        color={color}
        onClick={togglePalette}
      ></St.ColorSelectionBtn>

      {showPalette && (
        <St.ColorPalette ref={paletteRef}>
          <Sketch
            color={color}
            onChange={(newColor) => {
              setColor(newColor.hexa);
            }}
          />
        </St.ColorPalette>
      )}
    </St.ColorPaletteContainer>
  );
};

export default ColorPalette;
