# 240826 기록

>- [1. 아이디어 회의](#1-아이디어-회의)
>    - [1-1. 음성 인식 기반 웹 사이트 네비게이션](#1-1-음성-인식-기반-웹-사이트-네비게이션)
>    - [1-2. 심리 상담 보조 서비스](#1-2-심리-상담-보조-서비스)
>- [2. 마인드맵 서비스에 활용할 AI 모델 조사](#2-마인드맵-서비스에-활용할-ai-모델-조사)
>    - [2-1. TextRank](#2-1-textrank)
>    - [2-2. BERT](#2-2-bert)

# 1. 아이디어 회의
- 필드트립 때 제시된 아이디어 중 2개를 선택하고 구체화하였다.

## 1-1. 음성 인식 기반 웹 사이트 네비게이션
### WHY?

- 장애인, 고령자는 신체적인 특성으로 인해 [정보 격차](https://www.koddi.or.kr/system/download.jsp?type=hp_board&subType=ATT1&fileName=20230104153331001.pdf&filename=%40%EB%94%94%EC%A7%80%ED%84%B8+%EC%8B%9C%EB%8C%80+%EC%9E%A5%EC%95%A0%EC%9D%B8+%EC%A0%95%EB%B3%B4%EA%B2%A9%EC%B0%A8+%ED%95%B4%EC%86%8C%EB%A5%BC+%EC%9C%84%ED%95%9C+%EB%B0%A9%EC%95%88+%EB%A7%88%EB%A0%A8+%EC%97%B0%EA%B5%AC+%EB%B3%B4%EA%B3%A0%EC%84%9C.pdf&filePath=%2Fhp_board%2FATT1%2F20230104153331001.pdf)를 겪고 있다.
- [발 마우스](https://gnatc.or.kr/shop/item.php?it_id=1416214916), 안구 마우스, 마이크로소프트의 '[어댑티브 악세서리](https://www.microsoft.com/en-us/d/microsoft-adaptive-hub/8pbjx6zn089b?activetab=pivot:overviewtab)' 등 보조장치가 존재하지만 크기가 크고 복잡하거나, 추가적인 비용이 발생한다는 문제가 존재한다.
- 마이크와 음성을 통해 PC를 제어할 수 있다면 손쉽게 정보 격차를 줄일 수 있을 것이라 생각된다.
- [WSR](https://ko.wikipedia.org/wiki/%EC%9C%88%EB%8F%84%EC%9A%B0_%EC%9D%8C%EC%84%B1_%EC%9D%B8%EC%8B%9D)(Windows Speech Recognition, 윈도우 음성 인식)는 한국어를 지원하지 않고, Cortana는 2023년 8월을 기점으로 지원이 종료되었다.

### HOW?
- 정보 격차에 초점을 맞춰 크롬 익스텐션으로 서비스를 제공
- 음성 인식
- 음성 분석
- 동작 수행(포인터 이동, 키보드 입력 등)

## 1-2. 심리 상담 보조 서비스
### WHY?
- 의료 환경과 다르게 심리 상담 분야는 전산화가 잘 이뤄지지 않았다. ([참고 링크](https://behindsciences.kaist.ac.kr/2022/03/10/%EB%B9%84%EC%96%B4-%EC%9E%88%EB%8A%94-%EC%8B%AC%EB%A6%AC%EC%83%81%EB%8B%B4%EC%9D%98-%EA%B8%B0%EC%88%A0/))
    - 다른 목적으로 사용되고 있는 프로그램을 활용할 뿐 심리 상담을 위해 전문적으로 제작된 서비스가 존재하지 않음?( ← 관련 자료 추가 조사 필요 )
- 정신질환을 경함하는 사람들의 수가 늘어나는 만큼 상담에 대한 수요도 크게 증하하고 있다. ([링크](https://www.joongang.co.kr/article/25143933))

### HOW?
- 상담 관리 및 녹음
- 녹음된 상담 내역 분석
    - 화자 분석
    - 내용 요약
    - 주요 감정, 사건, 모순 분석
- 도식화된 상담 결과 제공

# 2. 마인드맵 서비스에 활용할 AI 모델 조사
## 2-1. TextRank
### 참고 링크
[[NLP] TextRank 이용해 핵심 키워드 추출하기](https://stritegdc.tistory.com/98)

### 개요

- 문장 내에서 연관관계가 높은 단어(문장)에 높은 점수를 주는 방식
    - 빈도는 중요하지 않다.
    - 다른 중요 단어(문장)와 얼마나 밀접하게 관련 있는지를 본다.
- 점수가 높은 단어(문장)이 글의 핵심이 된다.
- 따라서 키워드 추출에 활용할 수 있다.

### 한계

- 자유로운 대화의 경우 불필요한 말이 포함되므로 단어들 사이의 연결이 약해질 수 있다.
- 단어들 간의 연결성으로 점수를 매기는데, 문장 구조가 명확하지 않다면 제대로된 점수 산출이 어려울 수 있다.
- 아이디어 회의의 경우
    - 아이디어가 대화에 자주 등장하거나 다른 단어와 강한 연관관계를 가지는가?
    - 오히려 단발적으로 몇 번 얘기되지 않은 단어가 핵심 아이디어일 수도 있다.
    - 아이디어 회의에서 핵심 단어를 추출하기 위해서는 단어간의 연관관계보다는 **맥락 파악**이 필요하다.
- 문장 구조가 명확하고 구조화된 텍스트에 활용해야 좋은 성능을 낼 수 있다.
    - 출판물, 논문, 기사 등

## 2-2. BERT
- 시간 관계 상 내일 조사