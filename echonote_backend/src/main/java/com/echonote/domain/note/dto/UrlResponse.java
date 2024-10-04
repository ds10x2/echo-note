package com.echonote.domain.note.dto;

import lombok.Data;

@Data
public class UrlResponse {

	private String presignedUrl;
	private String ObjectUrl;

}
