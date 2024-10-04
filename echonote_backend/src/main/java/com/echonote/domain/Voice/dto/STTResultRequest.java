package com.echonote.domain.Voice.dto;

import java.util.List;

import lombok.Data;

@Data
public class STTResultRequest {
	private String processId;
	private long id;
	private List<STTRequest> result;
}
