import React, { useState, useRef, useEffect } from "react";
import * as St from "@components/styles/DrawingEditor.style";
import {
  FaEraser,
  FaUndo,
  FaRedo,
  FaTrash,
  FaSync,
  FaRulerVertical,
  FaPen,
} from "react-icons/fa";
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
  const [activeTool, setActiveTool] = useState(null);
  const [showSlider, setShowSlider] = useState(false);
  const strokeWidthRef = useRef(null);
  const eraserWidthRef = useRef(null);

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
    if (activeTool === "pen") {
      setShowSlider(true);
      onReadOnlyChange(true);
    } else {
      setActiveTool("pen");
      setShowSlider(false);
      onReadOnlyChange(false);
      onPenClick();
    }
  };

  // 지우개 클릭 핸들러
  const handleEraserClick = () => {
    if (activeTool === "eraser") {
      setShowSlider(true);
      onReadOnlyChange(true);
    } else {
      setActiveTool("eraser");
      setShowSlider(false);
      onReadOnlyChange(false);
      onEraserClick();
    }
  };

  return (
    <St.DrawingToolContainer>
      <ColorPalette value={strokeColor} onChange={onStrokeColorChange} />

      {/* pen */}
      <St.IconButton onClick={handlePenClick}>
        <FaPen />
      </St.IconButton>

      {showSlider && activeTool === "pen" && (
        <St.PenSliderPopup ref={strokeWidthRef}>
          <label>Pen Thickness</label>
          <input
            type="range"
            className="form-range"
            min="1"
            max="20"
            step="1"
            value={strokeWidth}
            onChange={onStrokeWidthChange}
          />
        </St.PenSliderPopup>
      )}

      {/* eraser */}
      <St.IconButton onClick={handleEraserClick}>
        <FaEraser />
      </St.IconButton>
      {showSlider && activeTool === "eraser" && (
        <St.EraserSliderPopup ref={strokeWidthRef}>
          <label>Eraser Thickness</label>
          <input
            type="range"
            className="form-range"
            min="1"
            max="20"
            step="1"
            value={eraserWidth}
            onChange={onEraserWidthChange}
          />
        </St.EraserSliderPopup>
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
