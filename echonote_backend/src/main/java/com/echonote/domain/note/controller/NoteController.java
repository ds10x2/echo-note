package com.echonote.domain.note.controller;

import java.util.List;
import java.util.UUID;

import com.echonote.domain.note.dto.NoteListResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.echonote.domain.Voice.dto.VoiceSendRequest;
import com.echonote.domain.note.dto.NoteCreateRequest;
import com.echonote.domain.note.dto.NoteCreateResponse;
import com.echonote.domain.note.dto.UrlResponse;
import com.echonote.domain.note.service.NoteServiceImpl;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/note")
@Tag(name = "note", description = "note api")
public class NoteController {

	private final NoteServiceImpl noteService;

	@Value("${amazon.aws.bucket}")
	private String bucketName;

	// 확장자명에 따라 presigned url 반환
	@GetMapping
	@Operation(summary = "PDF Presigned url 요청", description = "PDF S3 업로드를 위한 presigned url과 객체 Url을 요청")
	public ResponseEntity<UrlResponse> generatePresignedUrl() {

		UrlResponse response = noteService.generatePreSignUrl(UUID.randomUUID() + ".pdf", bucketName,
			com.amazonaws.HttpMethod.PUT);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PostMapping
	@Operation(summary = "노트 생성", description = "업로드한 pdf에 대한 노트 생성")
	public ResponseEntity<NoteCreateResponse> createNote(@RequestBody NoteCreateRequest noteCreateRequest) {

		Long userId = 1L;
		System.out.println(noteCreateRequest.toString());
		NoteCreateResponse response = noteService.addNote(userId, noteCreateRequest);

		return new ResponseEntity<>(response, HttpStatus.CREATED);

	}

	@GetMapping("/list")
	@Operation()
	public ResponseEntity<List<NoteListResponse>> listNotes() {
		Long userId = 1L;
		List<NoteListResponse> response = noteService.getNoteList(userId);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

}
