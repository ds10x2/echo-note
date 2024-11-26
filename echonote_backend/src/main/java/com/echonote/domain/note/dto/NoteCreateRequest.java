package com.echonote.domain.note.dto;

import java.util.List;

import lombok.Data;

@Data
public class NoteCreateRequest {
	private String objectUrl;

	private String note_name;

	private List<String> keywords;
}
