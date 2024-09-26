package com.echonote.domain.note.dto;

import lombok.Data;

@Data
public class NoteCreateRequest {
	private String presignedUrl;
}
