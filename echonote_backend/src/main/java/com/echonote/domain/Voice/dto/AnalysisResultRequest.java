package com.echonote.domain.Voice.dto;

import java.util.List;

import lombok.Data;

@Data
public class AnalysisResultRequest {
	private Long id;
	private String processId;
	private List<Float> anomalyTime;
}
