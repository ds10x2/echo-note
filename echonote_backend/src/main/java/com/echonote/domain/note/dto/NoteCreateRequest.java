package com.echonote.domain.note.dto;

import lombok.Data;

import java.util.List;

@Data
public class NoteCreateRequest {
	private String objectUrl;

	private String note_name;

	private List<String> keywords;
}
