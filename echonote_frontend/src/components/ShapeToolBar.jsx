import React, { useState, useRef, useEffect } from "react";
import * as St from "@components/styles/ShapeToolBar.style";
import { PiWaveSineBold, PiFileAudio } from "react-icons/pi";
import { FaTrash, FaCircle, FaSquare } from "react-icons/fa";
import { FaXmark, FaRegCircleXmark } from "react-icons/fa6";
import { MdOutlineFormatColorFill, MdOutlineLineWeight } from "react-icons/md";
import shapeStore from "@/stores/shapeStore";
import drawingTypeStore from "@/stores/drawingTypeStore";
import { Colorful } from "@uiw/react-color";
import ToggleButton from "./common/ToggleButton";
import { PiNotePencil } from "react-icons/pi";

const ShapeToolBar = ({}) => {
  const {
    property,
    setFillColor,
    setStrokeColor,
    setFill,
    setStroke,
    selectedShape,
    setSelectedShape,
    removeCircle,
    removeRectangle,
  } = shapeStore();
  const {
    mode,
    shapeMode,
    setRectangleMode,
    setCircleMode,
    setShapeMode,
    setTextMode,
  } = drawingTypeStore();
  const [showFillPalette, setShowFillPalette] = useState(false);
  const [showStrokePalette, setShowStrokePalette] = useState(false);
  const fillPaletteRef = useRef(null);
  const strokePaletteRef = useRef(null);

  const toggleFillPalette = () => {
    if (showStrokePalette) setShowStrokePalette(!showStrokePalette);
    setShowFillPalette(!showFillPalette);
  };

  const toggleStrokePalette = () => {
    if (showFillPalette) setShowFillPalette(!showFillPalette);
    setShowStrokePalette(!showStrokePalette);
  };

  const handleRectangleMode = () => {
    setShowFillPalette(false);
    setShowStrokePalette(false);
    setRectangleMode();
  };

  const handleCircleMode = () => {
    setShowFillPalette(false);
    setShowStrokePalette(false);
    setCircleMode();
  };

  const deleteShape = () => {
    if (selectedShape.type === "rectangle") {
      removeRectangle(selectedShape.id);
    } else if (selectedShape.type === "circle") {
      removeCircle(selectedShape.id);
    }
    setSelectedShape(null, null);
  };

  if (mode.shape && selectedShape.id === null) {
    return (
      <St.ShapeToolContainer isSelected={false}>
        <St.ToolBarButton>
          <St.IconContainer>
            {/* 도형선택 */}
            <St.ToggleButton
              as={FaSquare}
              isActive={shapeMode.rectangle}
              onClick={handleRectangleMode}
            />
            <St.ToggleButton
              as={FaCircle}
              isActive={shapeMode.circle}
              onClick={handleCircleMode}
            />
          </St.IconContainer>
          <St.Divider />
          <St.IconContainer>
            {/* 채우기색 고르기 */}
            <St.ColorPaletteContainer>
              <St.IconButton
                as={MdOutlineFormatColorFill}
                onClick={toggleFillPalette}
                color={property.fillColor}
                isActive={showFillPalette}
              />
              {showFillPalette && (
                <St.ColorPalette ref={fillPaletteRef}>
                  <St.PropertyContainer>
                    <St.PropertyTitle>칠</St.PropertyTitle>
                    <ToggleButton isOn={property.fill} onChange={setFill} />
                  </St.PropertyContainer>
                  <St.AnimatedContainer isVisible={property.fill}>
                    <Colorful
                      color={property.fillColor}
                      onChange={(newColor) => {
                        setFillColor(newColor.hexa);
                      }}
                    />
                  </St.AnimatedContainer>
                </St.ColorPalette>
              )}
            </St.ColorPaletteContainer>
            {/* 선색 고르기 */}
            <St.ColorPaletteContainer>
              <St.IconButton
                as={PiWaveSineBold}
                onClick={toggleStrokePalette}
                color={property.strokeColor}
                isActive={showStrokePalette}
              />
              {showStrokePalette && (
                <St.ColorPalette ref={strokePaletteRef}>
                  <St.PropertyContainer>
                    <St.PropertyTitle>선</St.PropertyTitle>
                    <ToggleButton isOn={property.stroke} onChange={setStroke} />
                  </St.PropertyContainer>
                  <St.AnimatedContainer isVisible={property.stroke}>
                    <St.PropertyContainer>
                      <St.PropertyText>두께</St.PropertyText>
                    </St.PropertyContainer>
                    <Colorful
                      color={property.strokeColor}
                      onChange={(newColor) => {
                        setStrokeColor(newColor.hexa);
                      }}
                    />
                  </St.AnimatedContainer>
                </St.ColorPalette>
              )}
            </St.ColorPaletteContainer>
          </St.IconContainer>
          {/* <ColorPalette value={property.fillColor} onChange={setFillColor} /> */}
          <St.Divider />
          <St.IconContainer>
            <St.IconButton as={FaRegCircleXmark} onClick={setShapeMode} />
          </St.IconContainer>
        </St.ToolBarButton>
      </St.ShapeToolContainer>
    );
  } else if (mode.shape && selectedShape.id !== null) {
    return (
      <St.ShapeToolContainer isSelected={true}>
        <St.ToolBarButton>
          <St.IconContainer>
            <St.IconButton as={PiFileAudio} />
          </St.IconContainer>
          <St.Divider />
          <St.IconContainer>
            {/* 도형 지우기, toolbar 닫기 */}
            <St.IconButton as={FaTrash} onClick={deleteShape} />
            <St.IconButton as={FaRegCircleXmark} onClick={setShapeMode} />
          </St.IconContainer>
        </St.ToolBarButton>
      </St.ShapeToolContainer>
    );
  } else if (mode.text) {
    return (
      <St.TextToolContainer>
        <St.ToolBarButton>
          <St.IconContainer>
            <St.IconButton as={PiFileAudio} />
            <St.IconButton as={PiNotePencil} />
          </St.IconContainer>
          <St.Divider />
          <St.IconContainer>
            {/* 텍스트 지우기, toolbar 닫기 */}
            <St.IconButton as={FaTrash} onClick={deleteShape} />
            <St.IconButton as={FaRegCircleXmark} onClick={setTextMode} />
          </St.IconContainer>
        </St.ToolBarButton>
      </St.TextToolContainer>
    );
  } else return null;
};

export default ShapeToolBar;
