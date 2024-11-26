# Dockerfile

# 빌드 단계: Gradle 이미지로 빌드 수행
FROM gradle:8.10.1-jdk17 AS build

# 작업 디렉토리 설정
WORKDIR /app

# Gradle 설정 파일을 먼저 복사하여 의존성 캐싱
COPY build.gradle settings.gradle ./

# Gradle 의존성 설치 (캐싱 용도)
RUN gradle dependencies --no-daemon

# 나머지 소스 파일을 복사하여 빌드 수행
COPY . .

# Gradle wrapper에 실행 권한 부여
RUN chmod +x gradlew

# Gradle을 이용하여 프로젝트 빌드 (테스트 제외)
RUN ./gradlew clean build -x test --no-daemon

# 실행 단계: JRE를 사용하여 런타임 이미지 생성
FROM openjdk:17-jdk

# 작업 디렉토리 설정
WORKDIR /app

# 빌드 단계에서 생성된 JAR 파일을 복사
COPY --from=build /app/build/libs/*.jar /app/echonote.jar

# 애플리케이션이 사용할 포트 노출
EXPOSE 8080

# 애플리케이션 실행
CMD ["java", "-jar", "/app/echonote.jar"]
