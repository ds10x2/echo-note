package com.echonote.domain.Voice.service;

import java.util.List;

import com.echonote.domain.Voice.dto.PresignedUrlResponse;
import com.echonote.domain.Voice.dto.VoiceProcessRequest;
import com.echonote.domain.Voice.entity.STT;

import java.util.List;

public interface VoiceService {
	PresignedUrlResponse generatePreSignUrl(String filePath,
		String bucketName,
		com.amazonaws.HttpMethod httpMethod);

	void insertSTT(STT stt);

	STT getSTT(long id);

	void updateSTT(STT stt);

	void deleteSTT(long id, List<Long> sttId);

	void sendVoice(Long userId, VoiceProcessRequest voiceCreateRequest);
}
