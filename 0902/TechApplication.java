package com.test.tech;

import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.FileContent;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.YouTubeScopes;
import com.google.api.services.youtube.model.Video;
import com.google.api.services.youtube.model.VideoSnippet;
import com.google.api.services.youtube.model.VideoStatus;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;
import java.io.FileReader;
import java.util.Collections;

@SpringBootApplication
public class TechApplication {
	private static final String CLIENT_SECRETS= "src/main/resources/client_secret.json"; // OAuth 2.0 client secrets 파일 경로
	private static final String APPLICATION_NAME = "YouTube Data API Java Upload";
	private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();

	public static void main(String[] args) throws Exception {
//		SpringApplication.run(TechApplication.class, args);

		// HTTP 전송과 인증 설정
		var httpTransport = GoogleNetHttpTransport.newTrustedTransport();

		// 클라이언트 시크릿 파일 읽기
		var clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, new FileReader(CLIENT_SECRETS));

		// OAuth 2.0 흐름 설정
		var flow = new GoogleAuthorizationCodeFlow.Builder(
				httpTransport, JSON_FACTORY, clientSecrets, Collections.singleton(YouTubeScopes.YOUTUBE_UPLOAD))
				.setDataStoreFactory(new FileDataStoreFactory(new java.io.File("tokens")))
				.setAccessType("offline")
				.build();

		// 인증 설정
		var credential = new AuthorizationCodeInstalledApp(flow, new LocalServerReceiver()).authorize("user");

		// YouTube 객체 생성
		var youtubeService = new YouTube.Builder(httpTransport, JSON_FACTORY, credential)
				.setApplicationName(APPLICATION_NAME)
				.build();


		// 업로드할 비디오 파일 설정
		var videoFile = new File("src/main/resources/sample-video.mp4");
		var mediaContent = new FileContent("video/*", videoFile);

		// 비디오 메타데이터 설정
		var videoObjectDefiningMetadata = new Video();
		var snippet = new VideoSnippet();
		snippet.setTitle("테스트 영상");
		snippet.setDescription("00:00 인트로\n00:20 첫번째 기능\n00:45 두번째 기능\n01:05 세번째 기능");
		snippet.setTags(Collections.singletonList("test"));

		videoObjectDefiningMetadata.setSnippet(snippet);

		var status = new VideoStatus();
		status.setPrivacyStatus("public");
		videoObjectDefiningMetadata.setStatus(status);

		// 비디오 업로드 요청 실행
		var videoInsert = youtubeService.videos()
				.insert("snippet,statistics,status", videoObjectDefiningMetadata, mediaContent);

		var returnedVideo = videoInsert.execute();

		// 업로드 결과 출력
		System.out.println("Uploaded: " + returnedVideo.getId());

		// 썸네일 파일 설정
		File thumbnailFile = new File("src/main/resources/sample-thumbnail.png");
		FileContent mediaContentThumb = new FileContent("image/png", thumbnailFile);

		// 썸네일 설정 요청
		YouTube.Thumbnails.Set thumbnailSet = youtubeService.thumbnails()
				.set("u-5oWZHoRXk", mediaContentThumb);
		thumbnailSet.execute();

		System.out.println("Thumbnail set for video: " + "u-5oWZHoRXk");
	}
}