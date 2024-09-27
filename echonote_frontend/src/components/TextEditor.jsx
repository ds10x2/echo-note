import React from "react";
import * as St from "./styles/TextEditor.style";
import { useTextDragging } from "@/hooks/useTextDragging";

const TextEditor = ({
  textItems,
  setTextItems,
  updateTextItem,
  finishEditing,
  handleKeyDown,
}) => {
  const { handleMouseDown, handleTouchStart } = useTextDragging(setTextItems);

  return (
    <>
      {textItems.map((item) => (
        <St.TextBox
          key={item.id}
          x={item.x}
          y={item.y}
          isEditing={item.isEditing}
          isDragging={item.isDragging}
          onMouseDown={(e) => handleMouseDown(e, item.id)}
          onTouchStart={(e) => handleTouchStart(e, item.id)}
          style={{
            fontSize: `${item.fontSize}px`,
          }}
        >
          {item.isEditing ? (
            <St.TextArea
              value={item.text}
              autoFocus
              onChange={(e) => updateTextItem(item.id, e.target.value)}
              onBlur={() => finishEditing(item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              style={{ fontSize: `${item.fontSize}px` }}
            />
          ) : (
            <St.TextDetail fontSize={item.fontSize}>{item.text}</St.TextDetail>
          )}
        </St.TextBox>
      ))}
    </>
  );
};

export default TextEditor;
