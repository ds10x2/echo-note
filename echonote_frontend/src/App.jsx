import { Component } from "react";
import { ThemeProvider } from "styled-components";
import GlobalStyles from "@shared/styles/GlobalStyles";
import { theme } from "@shared/styles/theme";
import ToolBar from "@components/ToolBar";
import PdfBar from "@components/PdfBar";
import RecordingBar from "@components/RecordingBar";
import {
  Layout,
  MainContent,
  AppContainer,
  RootContainer,
} from "@/Layout.style"; // styled-components로 스타일 불러오기
import STTBar from "@components/stt/STTBar";
import PdfViewer from "@components/PdfViewer";
import { FrameSize } from "@/services/responsiveFrame/frameSize"; // WindowSize 함수 불러오기

class App extends Component {
  state = {
    isPdfBarOpened: false,
    isSTTBarOpened: false,
    isDrawingEditorOpened: false,
    zoom: 1, // 기본 zoom 값 설정
  };

  componentDidMount() {
    // 페이지 로드 시 화면 크기 조정
    this.handleResize();

    // 창 크기 변경 시 화면 크기 조정
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    // 컴포넌트 언마운트 시 리스너 제거
    window.removeEventListener("resize", this.handleResize);
  }

  handleResize = () => {
    // 창 크기 변경에 따른 크기 조정
    const zoom = FrameSize(1280, 800);
    this.setState({ zoom });
  };

  togglePdfBar = () => {
    this.setState((prevState) => ({
      isPdfBarOpened: !prevState.isPdfBarOpened,
    }));
  };

  toggleSTTBar = () => {
    this.setState((prevState) => ({
      isSTTBarOpened: !prevState.isSTTBarOpened,
    }));
  };

  toggleDrawingEditor = () => {
    this.setState((prevState) => ({
      isDrawingEditorOpened: !prevState.isDrawingEditorOpened,
    }));
  };

  render() {
    const originalWarn = console.warn;
    console.warn = (message, ...args) => {
      // "No stroke found!" 경고 메시지를 무시
      if (typeof message === "string" && message.includes("No stroke found!")) {
        return;
      }
      originalWarn(message, ...args);
    };

    return (
      <RootContainer>
        <AppContainer id="App" zoom={this.state.zoom}>
          <ThemeProvider theme={theme}>
            <GlobalStyles />
            <ToolBar onToggleDrawingEditor={this.toggleDrawingEditor} />
            <Layout>
              <RecordingBar />
              <PdfBar />
              <MainContent>
                <PdfViewer
                  isDrawingEditorOpened={this.state.isDrawingEditorOpened}
                />
              </MainContent>
              <STTBar />
            </Layout>
          </ThemeProvider>
        </AppContainer>
      </RootContainer>
    );
  }
}

export default App;
