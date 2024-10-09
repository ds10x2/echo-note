package com.echonote.domain.Voice.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.*;


import com.echonote.domain.Voice.dto.AnalysisResultRequest;
import com.echonote.domain.Voice.dto.STTResultRequest;
import com.echonote.domain.Voice.dto.UrlResponse;
import com.echonote.domain.Voice.dto.VoiceSendRequest;
import com.echonote.domain.Voice.entity.STT;
import com.echonote.domain.Voice.service.VoiceService;
import com.echonote.domain.note.dto.NoteCreateResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyEmitter;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequiredArgsConstructor
@RequestMapping("/voice")
@Tag(name = "voice", description = "voice api")
public class VoiceController {
	private final VoiceService voiceService;

	@Value("${amazon.aws.bucket}")
	private String bucketName;

//	private final Map<Long, SseEmitter> emitters = new HashMap<>();


	// 확장자명에 따라 presigned url 반환
	@GetMapping
	@Operation(summary = "녹음본 Presigned url 요청", description = "녹음본 S3 업로드를 위한 presigned url과 객체 Url을 요청")
	public ResponseEntity<UrlResponse> generatePresignedUrl() {

		UrlResponse response = voiceService.generatePreSignUrl(UUID.randomUUID() + ".wav", bucketName,
			com.amazonaws.HttpMethod.PUT);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PostMapping
	@Operation(summary = "음성 저장 및 분석", description = "녹음본의 객체 URL을 DB에 저장하고 Flask 모델 API를 호출합니다.")
	public ResponseEntity<NoteCreateResponse> processVoice(@RequestBody VoiceSendRequest voiceSendRequest) {

		Long userId = 1L;
		String processId = UUID.randomUUID().toString();
		voiceService.sendVoice(userId, processId, voiceSendRequest);

		return new ResponseEntity<>(null, HttpStatus.OK);

	}

	@PostMapping("/sttResult")
	@Operation(summary = "STT 모델 결과 받기", description = "Flask STT 모델에서 처리된 결과를 받습니다.")
	public ResponseEntity<String> receiveSTTResult(@RequestBody STTResultRequest sttResultRequest) {
		voiceService.saveSTTResult(sttResultRequest);

		STT stt = new STT().builder()
				.id(sttResultRequest.getId())
				.result(sttResultRequest.getResult())
				.processId(sttResultRequest.getProcessId())
				.build();

		voiceService.insertSTT(stt);

//		if(emitters.get(sttResultRequest.getId()) != null){
//			SseEmitter emitter = emitters.get(sttResultRequest.getId());
//			try {
//				emitter.send(
//						SseEmitter
//								.event()
//								.name("stt_complete")
//								.data("STT 정보 수신 완료"));
//
//				emitter.complete(); // 이미터 kill
//
//			} catch (IOException e) {
//				emitter.completeWithError(e);
//			}finally {
//				// 이미터를 null로 설정 (선택 사항)
//				emitters.remove(sttResultRequest.getId());
//				emitter = null;  // 참조를 제거
//			}
//		}

		// voiceService.checkAndProcessVoice(sttResultRequest.getProcessId());
		return ResponseEntity.ok("STT 완료");
	}

	@PostMapping("/analysisResult")
	@Operation(summary = "음성 분석 모델 결과 받기", description = "Flask 음성 분석 모델에서 처리된 결과를 받습니다.")
	public ResponseEntity<String> receiveSTTResult(@RequestBody AnalysisResultRequest analysisResultRequest) {
		voiceService.saveAnalysisResult(analysisResultRequest);

		System.out.println("=============");
		System.out.println(analysisResultRequest);
		System.out.println("=============");
		// voiceService.checkAndProcessVoice(analysisResultRequest.getProcessId());
		return ResponseEntity.ok("음성 분석 완료");
	}

	@GetMapping("/stt")
	@Operation(summary = "note_id에 대응되는 stt 결과물 반환", description = "result가 processiong중이면 null값으로 들어옵니다.")
	public ResponseEntity<STT> saveSTT(@RequestParam long id) {
		STT stt = voiceService.getSTT(id);

		return new ResponseEntity<>(stt, HttpStatus.OK);
	}

//	@PostMapping("/stt")
//	@Operation(summary = "stt 저장", description = "stt를 저장하는 API. flask 서버와 연동된다.")
//	public ResponseEntity<STT> saveSTT(@RequestBody STT result) {
//		voiceService.insertSTT(result);
//
//		return new ResponseEntity<>(HttpStatus.OK);
//	}

//	@CrossOrigin(origins = "*", allowedHeaders = "*") // 특정 출처 허용
//	@GetMapping(value = "/sse", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
//	public SseEmitter streamSTT(@RequestParam("note_id") long noteId) {
//
//		if(emitters.get(noteId) == null){
//			SseEmitter emitter = new SseEmitter(30*60000L);
//			emitters.put(noteId, emitter);
//
//			emitter.onCompletion(() -> emitters.remove(emitter));
//			emitter.onTimeout(() -> emitters.remove(emitter));
//
//			try {
//				emitter.send(SseEmitter.event().name("")
//				);
//			} catch (IOException e) {
//				emitter.completeWithError(e);
//			}
//
//
//			return emitter;
//		}
//		// 중복 요청에 대한 처리
//		SseEmitter emitter = new SseEmitter(1L);
//		try {
//			emitter.send(SseEmitter.event().data("중복된 요청입니다. 이미 생성된 emitter가 존재합니다.").id("duplicate-request"));
//			emitter.complete(); // 요청을 완료하여 클라이언트가 더 이상 기다리지 않도록 함
//		} catch (IOException e) {
//			emitter.completeWithError(e);
//		}
//
//		return emitter;
//	}


	@PutMapping("/stt")
	@Operation(summary = "stt 업데이트", description = "note_id와 stt 정보를 보내주면 mongoDB에서 업데이트 할 수 있다.")
	public ResponseEntity<STT> updateSTT(@RequestBody STT result) {

		voiceService.updateSTT(result);

		return new ResponseEntity<>(HttpStatus.OK);
	}

	@DeleteMapping("/stt")
	@Operation(summary = "stt 삭제")
	public ResponseEntity<STT> deleteSTT(@RequestHeader("X-Note-Id") long id,
		@RequestHeader("X-Target-STT-Ids") List<Long> sttIds) {
		voiceService.deleteSTT(id, sttIds);

		return new ResponseEntity<>(HttpStatus.OK);
	}

}
