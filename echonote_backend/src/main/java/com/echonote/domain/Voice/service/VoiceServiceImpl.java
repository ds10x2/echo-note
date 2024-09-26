package com.echonote.domain.Voice.service;

import java.util.Calendar;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.echonote.domain.Voice.dto.S3SaveResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VoiceServiceImpl implements VoiceService {

	@Autowired
	private AmazonS3 amazonS3;

	public S3SaveResponse generatePreSignUrl(String filePath,
		String bucketName,
		HttpMethod httpMethod) {

		Calendar calendar = Calendar.getInstance();
		calendar.setTime(new Date());
		calendar.add(Calendar.MINUTE, 10); //validfy of 10 minutes

		S3SaveResponse res = new S3SaveResponse();
		res.setPresignedUrl(
			amazonS3.generatePresignedUrl(bucketName, filePath, calendar.getTime(), httpMethod).toString());

		return res;
	}

	// STT Service


}
