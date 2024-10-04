package com.echonote.domain.Voice.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TwoFlaskResult {
	private STTResultRequest sttResultRequest;
	private AnalysisResultRequest analysisResultRequest;
}
