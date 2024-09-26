package com.echonote.domain.note.controller;

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
import com.echonote.domain.note.dto.NoteCreateRequest;
import com.echonote.domain.note.dto.NoteCreateResponse;
import com.echonote.domain.note.dto.PresignedUrlResponse;
import com.echonote.domain.note.service.NoteServiceImpl;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/note")
@Tag(name = "note", description = "voice api")
public class NoteController {

	private final NoteServiceImpl noteService;

	@Value("${amazon.aws.bucket}")
	private String bucketName;

	@GetMapping
	@Operation(summary = "Pdf Presigned url 요청", description = "pdf S3 업로드를 위한 presigned url 요청")
	public ResponseEntity<PresignedUrlResponse> generatePresignedUrl() {

		PresignedUrlResponse response = noteService.generatePreSignUrl(UUID.randomUUID() + ".pdf", bucketName,
			HttpMethod.PUT);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PostMapping
	@Operation(summary = "노트 생성", description = "업로드한 pdf에 대한 노트 생성")
	public ResponseEntity<NoteCreateResponse> createNote(@RequestBody NoteCreateRequest noteCreateRequest) {

		Long userId = 1L;

		NoteCreateResponse response = noteService.addNote(userId, noteCreateRequest);

		return new ResponseEntity<>(response, HttpStatus.CREATED);

	}

}
