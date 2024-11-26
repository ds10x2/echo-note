import { Component } from "react";
import { ThemeProvider } from "styled-components";
import GlobalStyles from "@shared/styles/GlobalStyles";
import { theme } from "@shared/styles/theme";
import { AppContainer, RootContainer } from "@/Layout.style"; // styled-components로 스타일 불러오기
import { FrameSize } from "@/services/responsiveFrame/frameSize"; // WindowSize 함수 불러오기
import NoteListPage from "@pages/NoteListPage";
import NotePage from "@pages/NotePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

class App extends Component {
  state = {
    zoom: 1,
  };

  componentDidMount() {
    // 화면 크기 조정 관련 로직을 추가하는 경우
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  handleResize = () => {
    // 창 크기 변경에 따른 크기 조정
    const zoom = FrameSize(1280, 800);
    this.setState({ zoom });
  };

  render() {
    return (
      <RootContainer>
        <AppContainer id="App" zoom={this.state.zoom}>
          <ThemeProvider theme={theme}>
            <GlobalStyles />
            <Router>
              <Routes>
                <Route path="/" element={<NoteListPage />} />
                <Route path="/note/:id" element={<NotePage />} />
              </Routes>
            </Router>
          </ThemeProvider>
        </AppContainer>
      </RootContainer>
    );
  }
}

export default App;
