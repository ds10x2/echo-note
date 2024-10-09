package com.echonote.domain.note.service;

import com.amazonaws.HttpMethod;
import com.echonote.domain.note.dto.*;

import java.util.List;

public interface NoteService {
	UrlResponse generatePreSignUrl(String filePath,
								   String bucketName,
								   HttpMethod httpMethod);

	NoteCreateResponse addNote(Long userId, NoteCreateRequest noteCreateRequest);

    List<NoteListResponse> getNoteList(Long userId);

	void deleteNote(Long noteId);

	GetNoteResponse getNote(Long noteId);
}
