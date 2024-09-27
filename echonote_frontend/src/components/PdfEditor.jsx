import React, { useState, useEffect, useRef } from "react";
import * as St from "./styles/PdfEditor.style";
import TextEditor from "@components/TextEditor";
import RectangleEditor from "@components/RectangleEditor";
import { TextEdit } from "@/shared/utils/TextEdit";
import { ButtonContainer } from "./styles/PdfViewer.style";

//편집용
const PdfEditor = ({ containerRef }) => {
  const [textItems, setTextItems] = useState([]);
  const [isTextMode, setIsTextMode] = useState(false);
  const [isRectangleMode, setIsRectangleMode] = useState(false);

  const { addTextItem, updateTextItem, finishEditing, handleKeyDown } =
    TextEdit(textItems, setTextItems, containerRef);

  const edit = (e) => {
    //모드에 따라 처리
    if (isTextMode) addTextItem(e);
  };

  const toggleTextMode = () => {
    setIsTextMode((prev) => !prev);
    setIsRectangleMode(false);
  };
  const toggleRectangleMode = () => {
    setIsRectangleMode((prev) => !prev);
    setIsTextMode(false);
  };

  return (
    <St.PdfEditorContainer onClick={edit}>
      <ButtonContainer>
        <button onClick={toggleTextMode}>
          {isTextMode ? "텍스트 모드 해제" : "텍스트 모드 활성화"}
        </button>
        <button onClick={toggleRectangleMode}>
          {isRectangleMode ? "사각형 모드 해제" : "사각형 모드 활성화"}
        </button>
      </ButtonContainer>
      <TextEditor
        textItems={textItems}
        setTextItems={setTextItems}
        updateTextItem={updateTextItem}
        finishEditing={finishEditing}
        handleKeyDown={handleKeyDown}
      />
      <RectangleEditor />
    </St.PdfEditorContainer>
  );
};

export default PdfEditor;
