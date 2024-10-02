package com.echonote.domain.Voice.service;

import java.util.List;

import com.echonote.domain.Voice.dto.AnalysisResultRequest;
import com.echonote.domain.Voice.dto.STTResultRequest;
import com.echonote.domain.Voice.dto.UrlResponse;
import com.echonote.domain.Voice.dto.VoiceSendRequest;
import com.echonote.domain.Voice.entity.STT;

public interface VoiceService {
	UrlResponse generatePreSignUrl(String filePath,
		String bucketName,
		com.amazonaws.HttpMethod httpMethod);

	void insertSTT(STT stt);

	STT getSTT(long id);

	void updateSTT(STT stt);

	void deleteSTT(long id, List<Long> sttId);

	void sendVoice(Long userId, VoiceSendRequest voiceSendRequest);

	void saveSTTResult(STTResultRequest sttResultRequest);

	void saveAnalysisResult(AnalysisResultRequest analysisResultRequest);

	void checkAndProcessVoice(String processId);
}
