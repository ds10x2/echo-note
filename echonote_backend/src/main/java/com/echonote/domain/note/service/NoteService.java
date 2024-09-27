package com.echonote.domain.note.service;

import com.amazonaws.HttpMethod;
import com.echonote.domain.note.dto.NoteCreateRequest;
import com.echonote.domain.note.dto.NoteCreateResponse;
import com.echonote.domain.note.dto.PresignedUrlResponse;

public interface NoteService {
	PresignedUrlResponse generatePreSignUrl(String filePath,
		String bucketName,
		HttpMethod httpMethod);

	NoteCreateResponse addNote(Long userId, NoteCreateRequest noteCreateRequest);
}
