import React, { useState } from "react";
import shapeStore from "@/stores/shapeStore";

// rgba를 hex로 변환하는 함수
const rgbaToHex = (rgba) => {
  const result = rgba.match(
    /^rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([01]?.?\d*)?\)$/
  );
  if (!result) return "#000000";
  const r = parseInt(result[1]).toString(16).padStart(2, "0");
  const g = parseInt(result[2]).toString(16).padStart(2, "0");
  const b = parseInt(result[3]).toString(16).padStart(2, "0");
  return `#${r}${g}${b}`;
};

// hex를 rgba로 변환하는 함수 (alpha 값은 기본적으로 0.5로 설정)
const hexToRgba = (hex, alpha = 1) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const PropertyEditor = () => {
  const { setProperty } = shapeStore();

  const [properties, setProperties] = useState({
    fill: true,
    fillColor: "rgba(255, 105, 105, 0.5)",
    stroke: true,
    strokeColor: "rgba(0, 0, 0, 1)", // 기본값을 rgba로 설정
    strokeWidth: 2,
  });

  // 입력값 변경 처리
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === "checkbox" ? checked : value;

    setProperties((prevProps) => ({
      ...prevProps,
      [name]: updatedValue,
    }));
  };

  // color input의 색상을 hex에서 rgba로 변환
  const handleColorChange = (e) => {
    const { name, value } = e.target;
    const rgbaValue = hexToRgba(value);
    setProperties((prevProps) => ({
      ...prevProps,
      [name]: rgbaValue,
    }));
  };

  // 적용 버튼 클릭 시 zustand에 업데이트
  const applyProperties = () => {
    setProperty(properties);
  };

  return (
    <div
      style={{
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        width: "150px",
      }}
    >
      <h3>Properties 설정</h3>

      <label>
        <input
          type="checkbox"
          name="fill"
          checked={properties.fill}
          onChange={handleChange}
        />
        Fill 사용 여부
      </label>

      <div>
        <label>Fill Color:</label>
        <input
          type="color"
          name="fillColor"
          value={rgbaToHex(properties.fillColor)}
          onChange={handleColorChange}
          disabled={!properties.fill}
        />
      </div>

      <label>
        <input
          type="checkbox"
          name="stroke"
          checked={properties.stroke}
          onChange={handleChange}
        />
        Stroke 사용 여부
      </label>

      <div>
        <label>Stroke Color:</label>
        <input
          type="color"
          name="strokeColor"
          value={rgbaToHex(properties.strokeColor)}
          onChange={handleColorChange}
          disabled={!properties.stroke}
        />
      </div>

      <div>
        <label>Stroke Width:</label>
        <input
          type="number"
          name="strokeWidth"
          value={properties.strokeWidth}
          min="0"
          step="1"
          onChange={handleChange}
          disabled={!properties.stroke}
        />
      </div>

      <button onClick={applyProperties}>Apply</button>
    </div>
  );
};

export default PropertyEditor;
