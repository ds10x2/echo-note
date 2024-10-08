import React, { useState, useRef, useEffect } from "react";
import * as St from "@components/styles/DrawingEditor.style";
import {
  FaEraser,
  FaUndo,
  FaRedo,
  FaTrash,
  FaSync,
  FaPen,
} from "react-icons/fa";
import { MdOutlineLineWeight } from "react-icons/md";
import ColorPalette from "@components/ColorPalette";

const DrawingToolBar = ({
  eraseMode,
  strokeWidth,
  eraserWidth,
  strokeColor,
  onPenClick,
  onEraserClick,
  onStrokeWidthChange,
  onEraserWidthChange,
  onStrokeColorChange,
  onUndoChange,
  onRedoChange,
  onClearChange,
  onReadOnlyChange,
}) => {
  const [activeTool, setActiveTool] = useState("pen");
  const [showSlider, setShowSlider] = useState(false);
  const strokeWidthRef = useRef(null);
  const buttonRefs = {
    pen: useRef(null),
    eraser: useRef(null),
    wave: useRef(null),
  };

  // 외부 클릭 감지 핸들러
  const handleClickOutside = (event) => {
    // 슬라이더와 관련된 버튼이 아닌 경우만 슬라이더를 닫음
    if (
      strokeWidthRef.current &&
      !strokeWidthRef.current.contains(event.target) &&
      !Object.values(buttonRefs).some((ref) =>
        ref.current.contains(event.target)
      )
    ) {
      setShowSlider(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    onReadOnlyChange(showSlider);
  }, [showSlider, onReadOnlyChange]);

  // 펜 클릭 핸들러
  const handlePenClick = () => {
    setActiveTool("pen");
    setShowSlider(false);
    onPenClick();
  };

  // 지우개 클릭 핸들러
  const handleEraserClick = () => {
    setActiveTool("eraser");
    setShowSlider(false);
    onEraserClick();
  };

  const handleWaveClick = () => {
    setShowSlider((prevShowSlider) => {
      const newShowSlider = !prevShowSlider;
      return newShowSlider;
    });
  };

  const handleIncrease = () => {
    if (activeTool === "pen") {
      onStrokeWidthChange({ target: { value: strokeWidth + 1 } });
    } else {
      onEraserWidthChange({ target: { value: eraserWidth + 1 } });
    }
  };

  const handleDecrease = () => {
    if (activeTool === "pen") {
      onStrokeWidthChange({ target: { value: strokeWidth - 1 } });
    } else {
      onEraserWidthChange({ target: { value: eraserWidth - 1 } });
    }
  };

  return (
    <St.DrawingToolContainer>
      <ColorPalette value={strokeColor} onChange={onStrokeColorChange} />

      {/* 펜 아이콘 */}
      <St.IconButton onClick={handlePenClick} ref={buttonRefs.pen}>
        <FaPen color={activeTool === "pen" ? "gray" : "black"} />
      </St.IconButton>

      {/* 지우개 아이콘 */}
      <St.IconButton onClick={handleEraserClick} ref={buttonRefs.eraser}>
        <FaEraser color={activeTool === "eraser" ? "gray" : "black"} />
      </St.IconButton>

      <St.IconButton onClick={handleWaveClick} ref={buttonRefs.wave}>
        <MdOutlineLineWeight color={showSlider ? "gray" : "black"} />
      </St.IconButton>

      {showSlider && (
        <St.SliderContainer>
          <St.SliderIndicator
            activeTool={activeTool}
            strokeWidth={strokeWidth}
            eraserWidth={eraserWidth}
            strokeColor={strokeColor}
          >
            {activeTool === "pen" ? strokeWidth : eraserWidth}
          </St.SliderIndicator>

          <St.SliderPopup ref={strokeWidthRef}>
            <St.SliderButton onClick={handleDecrease}>-</St.SliderButton>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={activeTool === "pen" ? strokeWidth : eraserWidth}
              onChange={
                activeTool === "pen" ? onStrokeWidthChange : onEraserWidthChange
              }
            />
            <St.SliderButton onClick={handleIncrease}>+</St.SliderButton>
          </St.SliderPopup>
        </St.SliderContainer>
      )}

      <St.Divider />

      {/* undo, redo, clear */}
      <St.IconButton onClick={onUndoChange}>
        <FaUndo />
      </St.IconButton>
      <St.IconButton onClick={onRedoChange}>
        <FaRedo />
      </St.IconButton>
      <St.IconButton onClick={onClearChange}>
        <FaTrash />
      </St.IconButton>
    </St.DrawingToolContainer>
  );
};

export default DrawingToolBar;