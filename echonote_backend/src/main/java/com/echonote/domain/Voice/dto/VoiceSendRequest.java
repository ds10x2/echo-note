package com.echonote.domain.Voice.dto;

import lombok.Data;

@Data
public class VoiceSendRequest {

	private String processId;

	private Long noteId;

	private String objectUrl;

}
