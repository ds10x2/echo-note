package com.echonote.domain.note.service;

import com.amazonaws.HttpMethod;
import com.echonote.domain.note.dto.NoteCreateRequest;
import com.echonote.domain.note.dto.NoteCreateResponse;
import com.echonote.domain.note.dto.NoteListResponse;
import com.echonote.domain.note.dto.UrlResponse;

import java.util.List;

public interface NoteService {
	UrlResponse generatePreSignUrl(String filePath,
								   String bucketName,
								   HttpMethod httpMethod);

	NoteCreateResponse addNote(Long userId, NoteCreateRequest noteCreateRequest);

    List<NoteListResponse> getNoteList(Long userId);
}
