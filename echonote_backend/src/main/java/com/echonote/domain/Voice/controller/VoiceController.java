package com.echonote.domain.Voice.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.amazonaws.HttpMethod;
import com.echonote.domain.Voice.dto.PresignedUrlResponse;
import com.echonote.domain.Voice.dto.VoiceProcessRequest;
import com.echonote.domain.Voice.service.VoiceServiceImpl;
import com.echonote.domain.note.dto.NoteCreateResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/voice")
@Tag(name = "voice", description = "voice api")
public class VoiceController {
	private final VoiceServiceImpl voiceService;

	@Value("${amazon.aws.bucket}")
	private String bucketName;

	// 확장자명에 따라 presigned url 반환
	@GetMapping
	@Operation(summary = "녹음본 Presigned url 요청", description = "녹음본 S3 업로드를 위한 presigned url 요청")
	public ResponseEntity<PresignedUrlResponse> generatePresignedUrl() {

		PresignedUrlResponse response = voiceService.generatePreSignUrl(UUID.randomUUID() + ".wav", bucketName,
			HttpMethod.PUT);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	//	@PostMapping("/stt")
	//	public ResponseEntity<S3SaveResponse> saveToMongo(@RequestBody String result) {
	//		System.out.println(result);
	//		return new ResponseEntity<>(HttpStatus.OK);
	//	}
	@PostMapping
	@Operation(summary = "음성 저장 및 분석", description = "녹음본의 S3 URL과 STT 처리 결과를 저장")
	public ResponseEntity<NoteCreateResponse> processVoice(@RequestBody VoiceProcessRequest voiceCreateRequest) {

		Long userId = 1L;

		voiceService.sendVoice(userId, voiceCreateRequest);

		return new ResponseEntity<>(null, HttpStatus.OK);

	}

}
