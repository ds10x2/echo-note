package com.echonote.domain.note.service;

import java.util.List;

import com.amazonaws.HttpMethod;
import com.echonote.domain.note.dto.GetNoteResponse;
import com.echonote.domain.note.dto.NoteCreateRequest;
import com.echonote.domain.note.dto.NoteCreateResponse;
import com.echonote.domain.note.dto.NoteListResponse;
import com.echonote.domain.note.dto.UrlResponse;

public interface NoteService {
	UrlResponse generatePreSignUrl(String filePath,
		String bucketName,
		HttpMethod httpMethod);

	NoteCreateResponse addNote(Long userId, NoteCreateRequest noteCreateRequest);

	List<NoteListResponse> getNoteList(Long userId);

	GetNoteResponse getNote(Long noteId);

	void updateDate(Long noteId);

	void deleteNote(Long noteId);
}
