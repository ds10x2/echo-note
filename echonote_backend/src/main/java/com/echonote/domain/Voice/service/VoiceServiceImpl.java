package com.echonote.domain.Voice.service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.echonote.domain.Memo.entity.Memo;
import com.echonote.domain.Voice.dao.VoiceRepository;
import com.echonote.domain.Voice.dto.PresignedUrlResponse;
import com.echonote.domain.Voice.dto.STTRequest;
import com.echonote.domain.Voice.dto.VoiceProcessRequest;
import com.echonote.domain.Voice.entity.STT;
import com.echonote.domain.note.dao.NoteRepository;
import com.echonote.domain.note.entity.Note;
import com.echonote.global.aop.exception.BusinessLogicException;
import com.echonote.global.aop.exception.ErrorCode;
import com.mongodb.DuplicateKeyException;
import com.mongodb.client.result.UpdateResult;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class VoiceServiceImpl implements VoiceService {

	@Autowired
	private AmazonS3 amazonS3;
	@Autowired
	private NoteRepository noteRepository;
	private final VoiceRepository voiceRepository;
	@Autowired
	private final RestTemplate restTemplate;

	@Override
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

	public void sendSTTFlask(VoiceProcessRequest voiceProcessRequest) {
		String flaskUrl = "http://70.12.130.111/";  // Flask 서버 URL

		// HTTP 헤더 설정
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);  // JSON으로 전송

		// 요청에 데이터 추가
		HttpEntity<VoiceProcessRequest> entity = new HttpEntity<>(voiceProcessRequest, headers);

		// Flask 서버로 POST 요청 보내기
		// ResponseEntity<String> response = restTemplate.exchange(flaskUrl, HttpMethod.POST, entity, String.class);

		// 응답 처리 (필요에 따라)
		// if (response.getStatusCode().is2xxSuccessful()) {
		// 	System.out.println("성공적으로 Flask 서버에 전송되었습니다: " + response.getBody());
		// } else {
		// 	System.err.println("Flask 서버 요청 실패: " + response.getStatusCode());
		// }
	}

	// STT Service
	private final MongoTemplate mongoTemplate;

	@Override
	public void insertSTT(STT stt) {
		try {
			STT insert = voiceRepository.insert(stt);
			log.info("Inserted STT with ID: " + insert.getId());
		} catch (DuplicateKeyException e) {
			log.error("STT with this ID already exists.");
		} catch (Exception e) {
			log.error("An error occurred while inserting STT: " + e.getMessage());
		}

	}

	@Override
	public STT getSTT(long id) {
		Optional<STT> stt = voiceRepository.findById(id);

		if (stt != null) {
			log.info("Found STT: " + stt);
		} else {
			log.warn("STT not found with ID: " + id);
		}

		return stt.orElse(null);
	}

	@Override
	public void updateSTT(STT stt) {
		long id = stt.getId();

		for (STTRequest sttInfo : stt.getResult()) {

			Query query = new Query(Criteria.where("id").is(id).and("segment.id").is(sttInfo));
			Update update = new Update().set("stt.$.segment", sttInfo.getText());

			try {
				UpdateResult result = mongoTemplate.updateFirst(query, update, STT.class);

				if (result.getMatchedCount() > 0) {
					log.info(id + "번 Note " + sttInfo.getId() + "번 STT 업데이트");
				} else {
					log.warn(id + "번 Note " + sttInfo.getId() + "번 STT 업데이트 실패");
				}
			} catch (DataIntegrityViolationException e) {
				log.error("stt 데이터 업데이트 실패: " + e);
			}
		}
	}

	@Override
	public void deleteSTT(long id, List<Long> sttId) {

		for (long stt : sttId) {
			Query query = new Query(Criteria.where("id").is(id).and("memo.id").is(stt));
			Update update = new Update().pull("memo", new Query(Criteria.where("id").is(stt)));

			// 삭제 실행
			try {
				UpdateResult result = mongoTemplate.updateFirst(query, update, Memo.class);

				if (result.getMatchedCount() > 0) {
					log.info(id + "번 Note " + stt + "번 stt 삭제");
				} else {
					log.warn(id + "번 Note " + stt + "번 stt 삭제 실패");
				}
			} catch (DataIntegrityViolationException e) {
				log.error("stt 데이터 삭제 실패: " + e);
			}
		}
	}
}
