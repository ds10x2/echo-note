import { useState, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSidebarStore } from "@stores/sideBarStore";
import {
  SidebarContainer,
  ImageContainer,
  DraggableImage,
  PageNumber,
} from "@components/styles/PdfBar.style";

const PdfBar = () => {
  const { isPdfBarOpened } = useSidebarStore();

  const [images, setImages] = useState([
    { id: 1, name: "page 1", src: "https://via.placeholder.com/100x150" },
    { id: 2, name: "page 2", src: "https://via.placeholder.com/100x150" },
    { id: 3, name: "page 3", src: "https://via.placeholder.com/100x150" },
    { id: 4, name: "page 4", src: "https://via.placeholder.com/100x150" },
    { id: 5, name: "page 5", src: "https://via.placeholder.com/100x150" },
    { id: 6, name: "page 6", src: "https://via.placeholder.com/100x150" },
    { id: 7, name: "page 7", src: "https://via.placeholder.com/100x150" },
    { id: 8, name: "page 8", src: "https://via.placeholder.com/100x150" },
    { id: 9, name: "page 9", src: "https://via.placeholder.com/100x150" },
    { id: 10, name: "page 10", src: "https://via.placeholder.com/100x150" },
  ]);

  const moveImage = (dragIndex, hoverIndex) => {
    const draggedImage = images[dragIndex];
    const updatedImages = [...images];
    updatedImages.splice(dragIndex, 1);
    updatedImages.splice(hoverIndex, 0, draggedImage);
    setImages(updatedImages);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <SidebarContainer isOpened={isPdfBarOpened}>
        <ImageContainer>
          {images.map((image, index) => (
            <DraggableItem
              key={image.id}
              index={index}
              id={image.id}
              src={image.src}
              moveImage={moveImage}
              name={image.name}
            />
          ))}
        </ImageContainer>
      </SidebarContainer>
    </DndProvider>
  );
};

const DraggableItem = ({ id, src, index, moveImage, name }) => {
  const ref = useRef(null);

  const [, drag] = useDrag({
    type: "IMAGE",
    item: { id, index },
  });

  const [, drop] = useDrop({
    accept: "IMAGE",
    hover: (draggedItem, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      // 자신 위로 드래그 중인지 체크 (현재 요소의 중간 지점과 비교)
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // 드래그 중인 아이템이 이미 위/아래에 있을 때는 아무런 변화 없음
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // 위/아래로 드래그한 경우 아이템 이동
      moveImage(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div ref={ref}>
      <DraggableImage>
        <img src={src} alt={`Page ${index + 1}`} />
      </DraggableImage>
      <PageNumber>{name}</PageNumber>
    </div>
  );
};

export default PdfBar;
