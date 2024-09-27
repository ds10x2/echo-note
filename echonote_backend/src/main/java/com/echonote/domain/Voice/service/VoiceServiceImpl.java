package com.echonote.domain.Voice.service;

import java.util.Calendar;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.echonote.domain.Voice.dto.PresignedUrlResponse;
import com.echonote.domain.Voice.dto.VoiceProcessRequest;
import com.echonote.domain.note.dao.NoteRepository;
import com.echonote.domain.note.entity.Note;
import com.echonote.global.aop.exception.BusinessLogicException;
import com.echonote.global.aop.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VoiceServiceImpl implements VoiceService {

	@Autowired
	private AmazonS3 amazonS3;
	@Autowired
	private NoteRepository noteRepository;

	public PresignedUrlResponse generatePreSignUrl(String filePath,
		String bucketName,
		HttpMethod httpMethod) {

		Calendar calendar = Calendar.getInstance();
		calendar.setTime(new Date());
		calendar.add(Calendar.MINUTE, 10); //validfy of 10 minutes

		PresignedUrlResponse res = new PresignedUrlResponse();
		res.setPresignedUrl(
			amazonS3.generatePresignedUrl(bucketName, filePath, calendar.getTime(), httpMethod).toString());

		return res;

	}

	public void sendVoice(Long userId, VoiceProcessRequest voiceProcessRequest) {

		// 1. DB에 S3 URL 저장
		Note note = noteRepository.findById(voiceProcessRequest.getNoteId())
			.orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND));

		note.setRecord_path(voiceProcessRequest.getPresignedUrl());

		noteRepository.save(note);

		// 2. STT 분석 & 피치 분석 (비동기)

		// 3. 분석 결과 매칭 & 저장
	}
}
