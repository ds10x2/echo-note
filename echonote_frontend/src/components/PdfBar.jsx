import { useState, useEffect, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSidebarStore } from "@stores/sideBarStore";
// import { pageStore } from "@stores/pageStore";
import {
  SidebarContainer,
  ImageContainer,
  DraggableImage,
  PageNumber,
} from "@components/styles/PdfBar.style";
import * as pdfjsLib from "pdfjs-dist";

// PDF.js에서 사용될 워커 설정 (필요에 따라 경로를 지정)
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

const PdfBar = () => {
  const { isPdfBarOpened } = useSidebarStore();
  const [images, setImages] = useState([]);

  const pdfUrl =
    "https://www.antennahouse.com/hubfs/xsl-fo-sample/pdf/basic-link-1.pdf";

  // PDF 파일에서 각 페이지를 이미지로 변환
  useEffect(() => {
    const loadPdf = async () => {
      const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
      const numPages = pdf.numPages;
      const imageArray = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        const viewport = page.getViewport({ scale: 1.5 }); // 페이지의 스케일 설정
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // 페이지를 캔버스에 렌더링
        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        // 캔버스를 이미지 데이터 URL로 변환
        const imgSrc = canvas.toDataURL();
        imageArray.push({ id: i, name: `page ${i}`, src: imgSrc });
      }

      setImages(imageArray); // 이미지 배열로 업데이트
    };

    loadPdf();
  }, [pdfUrl]);

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
