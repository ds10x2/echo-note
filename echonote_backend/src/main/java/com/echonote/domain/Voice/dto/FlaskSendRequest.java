package com.echonote.domain.Voice.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FlaskSendRequest {

	private String processId;

	private Long noteId;

	private String objectUrl;
}
