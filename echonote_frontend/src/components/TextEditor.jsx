import React, { useEffect, useRef, useState, useCallback } from "react";
import * as St from "./styles/TextEditor.style";
import EditButton from "@components/common/EditButton";
import textStore from "@stores/textStore";
import drawingTypeStore from "@/stores/drawingTypeStore";

// 텍스트박스 컴포넌트를 메모이제이션
const TextBox = React.memo(
  ({
    item,
    handleMouseDown,
    handleKeyDown,
    updateCurTextItem,
    handleBlur,
    selectedItemId,
    handleDelete,
    handleEdit,
  }) => {
    return (
      <St.TextBox
        key={item.id}
        data-id={item.id}
        x={item.x}
        y={item.y}
        isEditing={item.isEditing}
        isDragging={item.isDragging}
        className="text-box"
        onMouseDown={(e) => handleMouseDown(e, item.id)} // 터치 이벤트 제거
        style={{
          fontSize: `${item.fontSize}px`,
        }}
      >
        {item.isEditing ? (
          <St.TextArea
            value={item.text}
            autoFocus
            onChange={(e) => updateCurTextItem(item.id, e.target.value)}
            onBlur={() => handleBlur(item.id)}
            onKeyDown={(e) => handleKeyDown(e, item.id)}
            style={{ fontSize: `${item.fontSize}px` }}
          />
        ) : (
          <St.TextDetail fontSize={item.fontSize}>{item.text}</St.TextDetail>
        )}
        {selectedItemId === item.id && (
          <St.ButtonContainer className="edit-button-container">
            <EditButton buttonText="삭제" onClick={handleDelete} />
            <EditButton buttonText="수정" onClick={handleEdit} />
          </St.ButtonContainer>
        )}
      </St.TextBox>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.item === nextProps.item && // 아이템이 동일한 경우만 리렌더링 방지
      prevProps.selectedItemId === nextProps.selectedItemId
    );
  }
);

const TextEditor = ({
  hasDraggedRef,
  isDraggingRef,
  currentPageItems,
  scale,
  parentContainerRef,
}) => {
  const {
    updateTextItem,
    finishEditing,
    updateTextItemPosition,
    addTextItem,
    resetDraggingState,
    deleteTextItem,
  } = textStore();

  const { mode } = drawingTypeStore();

  const [curItems, setCurItems] = useState(currentPageItems);
  const [updatedItems, setUpdatedItems] = useState([]);
  const containerRef = useRef();
  const [selectedItemId, setSelectedItemId] = useState(null);

  // 현재 페이지 아이템이 변경되었을 때만 상태를 업데이트
  useEffect(() => {
    if (JSON.stringify(currentPageItems) !== JSON.stringify(curItems)) {
      setCurItems(currentPageItems);
    }
  }, [currentPageItems]);

  const handleAddTextBox = useCallback(
    (e) => {
      if (isDraggingRef.current || hasDraggedRef.current) return;

      const clientX = e.clientX; // 터치 이벤트 제거
      const clientY = e.clientY; // 터치 이벤트 제거

      const containerRect = containerRef.current.getBoundingClientRect();
      const parentScrollLeft = parentContainerRef.current.scrollLeft;
      const parentScrollTop = parentContainerRef.current.scrollTop;

      const x = (clientX + parentScrollLeft - containerRect.left) / scale;
      const y = (clientY + parentScrollTop - containerRect.top) / scale;

      addTextItem({
        id: Date.now(),
        x,
        y,
        text: "",
        isEditing: true,
        isDragging: false,
        offsetX: 0,
        offsetY: 0,
        fontSize: 16,
      });

      setSelectedItemId(null);
    },
    [addTextItem, isDraggingRef, hasDraggedRef, scale, parentContainerRef]
  );

  const handleClickEvent = useCallback(
    (e) => {
      if (mode.text) {
        // 수정 중인 텍스트 박스에서 추가 클릭 이벤트를 막음
        if (e.target.closest(".edit-button-container")) {
          return;
        }

        const clickedTextBox = e.target.closest(".text-box");
        if (clickedTextBox) {
          const clickedItemId = parseInt(clickedTextBox.dataset.id, 10);
          // 선택된 아이템이 수정 중인지 확인
          if (
            curItems.some((item) => item.id === clickedItemId && item.isEditing)
          ) {
            return; // 수정 중인 텍스트 박스 클릭 무시
          }
          setSelectedItemId(clickedItemId);
        } else {
          handleAddTextBox(e); // 새로운 텍스트 박스 추가
        }
      }
    },
    [handleAddTextBox, curItems, mode.text]
  );

  useEffect(() => {
    const container = containerRef.current;

    if (mode.text) {
      container.addEventListener("mousedown", handleClickEvent); // 터치 이벤트 제거
    }

    return () => {
      container.removeEventListener("mousedown", handleClickEvent); // 터치 이벤트 제거
    };
  }, [handleClickEvent, mode.text]);

  const handleMouseDown = (e, id) => {
    e.stopPropagation();
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    setSelectedItemId(id);

    const clientX = e.clientX; // 터치 이벤트 제거
    const clientY = e.clientY; // 터치 이벤트 제거

    const parentScrollLeft = parentContainerRef.current.scrollLeft;
    const parentScrollTop = parentContainerRef.current.scrollTop;

    const item = curItems.find((item) => item.id === id);
    const offsetX =
      clientX +
      parentScrollLeft -
      (item.x * scale + containerRef.current.offsetLeft);
    const offsetY =
      clientY +
      parentScrollTop -
      (item.y * scale + containerRef.current.offsetTop);

    setCurItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              isDragging: true,
              offsetX: offsetX,
              offsetY: offsetY,
            }
          : item
      )
    );

    document.body.style.userSelect = "none";
  };

  const handleMouseMove = (e) => {
    if (isDraggingRef.current) {
      const clientX = e.clientX; // 터치 이벤트 제거
      const clientY = e.clientY; // 터치 이벤트 제거

      setCurItems((items) =>
        items.map((item) => {
          if (item.isDragging) {
            let newX = (clientX - item.offsetX) / scale; // scale 적용
            let newY = (clientY - item.offsetY) / scale; // scale 적용

            const containerRect = containerRef.current.getBoundingClientRect();
            const containerWidth = containerRect.width / scale; // scale 적용
            const containerHeight = containerRect.height / scale; // scale 적용

            const textBoxWidth = 100;
            const textBoxHeight = item.fontSize;

            if (newX < 0) newX = 0;
            else if (newX + textBoxWidth > containerWidth)
              newX = containerWidth - textBoxWidth;

            if (newY < 0) newY = 0;
            else if (newY + textBoxHeight > containerHeight)
              newY = containerHeight - textBoxHeight;

            return {
              ...item,
              x: newX,
              y: newY,
            };
          }
          return item;
        })
      );

      hasDraggedRef.current = true;
    }
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;

      setCurItems((items) => {
        return items.map((item) => {
          if (item.isDragging) {
            setUpdatedItems((prevItems) => [
              ...prevItems,
              { id: item.id, x: item.x, y: item.y },
            ]);
            return { ...item, isDragging: false };
          }
          return item;
        });
      });

      resetDraggingState();

      if (hasDraggedRef.current) {
        setTimeout(() => {
          hasDraggedRef.current = false;
        }, 50);
      }
    }

    document.body.style.userSelect = "auto";
  };

  // 상태 업데이트 최적화: 업데이트가 있을 때만 실행되도록 설정
  useEffect(() => {
    if (updatedItems.length > 0) {
      updatedItems.forEach(({ id, x, y }) => {
        updateTextItemPosition(id, x, y);
      });
      setUpdatedItems([]); // 업데이트 후 초기화
    }
  }, [updatedItems]);

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseup", handleMouseUp);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleKeyDown = (e, id) => {
    if (e.key === "Enter") {
      if (e.ctrlKey) {
        e.preventDefault();
        updateCurTextItem(
          id,
          curItems.find((item) => item.id === id).text + "\n"
        );
      } else {
        e.preventDefault();
        updateTextItem(id, curItems.find((item) => item.id === id).text);
        finishEditing(id);
      }
    }
  };

  const handleDelete = () => {
    if (selectedItemId !== null) {
      setCurItems(curItems.filter((item) => item.id !== selectedItemId));
      deleteTextItem(selectedItemId);
      setSelectedItemId(null);
    }
  };

  const handleEdit = () => {
    setCurItems((items) =>
      items.map((item) =>
        item.id === selectedItemId ? { ...item, isEditing: true } : item
      )
    );
  };

  const updateCurTextItem = (id, newText) => {
    setCurItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, text: newText } : item
      )
    );
  };

  const handleBlur = (id) => {
    const currentItem = curItems.find((item) => item.id === id);
    if (!currentItem.text.trim()) {
      setCurItems(curItems.filter((item) => item.id !== id));
      deleteTextItem(id);
    } else {
      updateTextItem(id, currentItem.text);
      finishEditing(id);
    }
    setSelectedItemId(null);
  };

  return (
    <St.TextContainer ref={containerRef} mode={mode.text}>
      {curItems.map((item) => (
        <TextBox
          key={item.id}
          item={item}
          handleMouseDown={handleMouseDown}
          handleKeyDown={handleKeyDown}
          updateCurTextItem={updateCurTextItem}
          handleBlur={handleBlur}
          selectedItemId={selectedItemId}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      ))}
    </St.TextContainer>
  );
};

export default TextEditor;
