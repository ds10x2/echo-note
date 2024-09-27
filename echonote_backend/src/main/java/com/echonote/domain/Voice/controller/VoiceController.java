package com.echonote.domain.Voice.controller;

import java.util.List;
import java.util.UUID;

import com.echonote.domain.Voice.entity.STT;
import com.echonote.domain.Voice.service.VoiceServiceImpl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.amazonaws.HttpMethod;
import com.echonote.domain.Voice.dto.S3SaveResponse;

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
	@Operation(summary = "presigned url 반환", description = "클라이언트에서 녹음한 wav 파일 업로드 위한 S3 presigned url 반환")
	public ResponseEntity<S3SaveResponse> generatePresignedUrl() {

		S3SaveResponse response = voiceService.generatePreSignUrl(UUID.randomUUID() + ".wav", bucketName,
			HttpMethod.PUT);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@GetMapping("/stt")
	@Operation(summary = "note_id에 대응되는 stt 결과물 반환", description = "result가 processiong중이면 null값으로 들어옵니다.")
	public ResponseEntity<STT> saveSTT(@RequestParam long id) {
		STT stt = voiceService.getSTT(id);
		return new ResponseEntity<>(stt, HttpStatus.OK);
	}

	@PostMapping("/stt")
	@Operation(summary = "stt 저장", description = "stt를 저장하는 API. flask 서버와 연동된다.")
	public ResponseEntity<STT> saveSTT(@RequestBody STT result) {
		voiceService.insertSTT(result);

		return new ResponseEntity<>(HttpStatus.OK);
	}

	@PutMapping("/stt")
	@Operation(summary = "stt 업데이트", description = "note_id와 stt 정보를 보내주면 mongoDB에서 업데이트 할 수 있다.")
	public ResponseEntity<STT> updateSTT(@RequestBody STT result){

		voiceService.updateSTT(result);

		return new ResponseEntity<>(HttpStatus.OK);
	}

	@DeleteMapping("/stt")
	@Operation(summary = "stt 삭제")
	public ResponseEntity<STT> deleteSTT(@RequestHeader("X-Note-Id") long id,
										 @RequestHeader("X-Target-STT-Ids") List<Long> sttIds){
		voiceService.deleteSTT(id, sttIds);

		return new ResponseEntity<>(HttpStatus.OK);
	}



}
