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
  onResetChange,
  onReadOnlyChange,
}) => {
  const [activeTool, setActiveTool] = useState("pen");
  const [showSlider, setShowSlider] = useState(false);
  const strokeWidthRef = useRef(null);

  // 외부 클릭 감지 핸들러
  const handleClickOutside = (event) => {
    if (
      strokeWidthRef.current &&
      !strokeWidthRef.current.contains(event.target)
    ) {
      setShowSlider(false);
      onReadOnlyChange(false);
    }

    // event가 캔버스로 전달되지 않도록 중단
    event.preventDefault();
    event.stopPropagation();
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 펜 클릭 핸들러
  const handlePenClick = () => {
    setActiveTool("pen");
    setShowSlider(false);
    onReadOnlyChange(false);
    onPenClick();
  };

  // 지우개 클릭 핸들러
  const handleEraserClick = () => {
    setActiveTool("eraser");
    setShowSlider(false);
    onReadOnlyChange(false);
    onEraserClick();
  };

  const handleWaveClick = () => {
    if (activeTool === "pen" || activeTool === "eraser") {
      setShowSlider(!showSlider);
      onReadOnlyChange(!showSlider);
    }
  };

  return (
    <St.DrawingToolContainer>
      <ColorPalette value={strokeColor} onChange={onStrokeColorChange} />

      {/* 펜 아이콘 */}
      <St.IconButton onClick={handlePenClick}>
        <FaPen color={activeTool === "pen" ? "gray" : "black"} />
      </St.IconButton>

      {/* 지우개 아이콘 */}
      <St.IconButton onClick={handleEraserClick}>
        <FaEraser color={activeTool === "eraser" ? "gray" : "black"} />
      </St.IconButton>

      <St.IconButton onClick={handleWaveClick}>
        <MdOutlineLineWeight color={showSlider ? "gray" : "black"} />
      </St.IconButton>

      {showSlider && (
        <St.SliderPopup
          ref={strokeWidthRef}
          style={{
            "--thumb-size": `${Math.min(
              Math.max(
                Math.pow(
                  activeTool === "pen" ? strokeWidth : eraserWidth,
                  1.2
                ) * 1.15,
                10
              ),
              28
            )}px`,
          }}
        >
          <input
            type="range"
            className="form-range"
            min="1"
            max="20"
            step="1"
            value={activeTool === "pen" ? strokeWidth : eraserWidth}
            onChange={
              activeTool === "pen" ? onStrokeWidthChange : onEraserWidthChange
            }
          />
        </St.SliderPopup>
      )}

      {/* undo, redo, clear, reset */}
      <St.IconButton onClick={onUndoChange}>
        <FaUndo />
      </St.IconButton>
      <St.IconButton onClick={onRedoChange}>
        <FaRedo />
      </St.IconButton>
      <St.IconButton onClick={onClearChange}>
        <FaTrash />
      </St.IconButton>
      <St.IconButton onClick={onResetChange}>
        <FaSync />
      </St.IconButton>
    </St.DrawingToolContainer>
  );
};

export default DrawingToolBar;
