import styled from "styled-components";

// Root 컨테이너: 화면 중앙에 맞추기
export const RootContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: black;

  display: flex;
  align-items: center;
  justify-content: center;
`;

// App 컨테이너: 고정된 크기를 유지하지만 줌 설정으로 반응형 처리
export const AppContainer = styled.div`
  background: white;
  position: relative;
  width: 1280px; /* 기준 너비 */
  height: 800px; /* 기준 높이 */
  overflow: hidden;
  transform: scale(${(props) => props.zoom}); /* 줌 값에 따라 확대/축소 */
  transform-origin: top left; /* 확대/축소 기준을 왼쪽 상단으로 설정 */
`;

// 레이아웃 컨테이너: 사이드바와 메인 콘텐츠를 배치하는 Flex 레이아웃
export const Layout = styled.div`
  display: flex;
  position: relative;
  height: 100%; /* 100% 높이로 설정 */
`;

// 중앙 메인 콘텐츠를 Flex로 가운데 정렬
export const MainContent = styled.main`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.backgroundColor};
`;
