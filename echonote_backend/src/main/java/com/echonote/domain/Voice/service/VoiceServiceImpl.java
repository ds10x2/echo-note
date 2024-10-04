package com.echonote.domain.Voice.service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.client.RestTemplate;

import com.amazonaws.services.s3.AmazonS3;
import com.echonote.domain.Memo.entity.Memo;
import com.echonote.domain.Voice.dao.VoiceRepository;
import com.echonote.domain.Voice.dto.STTRequest;
import com.echonote.domain.Voice.dto.STTResponse;
import com.echonote.domain.Voice.dto.UrlResponse;
import com.echonote.domain.Voice.dto.VoiceAnalysisResponse;
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
	public UrlResponse generatePreSignUrl(String filePath,
		String bucketName,
		com.amazonaws.HttpMethod httpMethod) {

		Calendar calendar = Calendar.getInstance();
		calendar.setTime(new Date());
		calendar.add(Calendar.MINUTE, 10); //validfy of 10 minutes

		UrlResponse res = new UrlResponse();
		res.setPresignedUrl(
			amazonS3.generatePresignedUrl(bucketName, filePath, calendar.getTime(), httpMethod).toString());
		res.setObjectUrl("https://" + bucketName + ".s3.ap-northeast-2.amazonaws.com/" + filePath);
		return res;
	}

	@Override
	public void sendVoice(Long userId, VoiceProcessRequest voiceProcessRequest) {

		// 1. DB에 S3 URL 저장
		Note note = noteRepository.findById(voiceProcessRequest.getNoteId())
			.orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND));

		note.setRecord_path(voiceProcessRequest.getObjectUrl());

		noteRepository.save(note);
		System.out.println("DB 저장 성공");

		// 2. STT 분석 & 피치 분석 (비동기)
		CompletableFuture<STTResponse> sttFuture = CompletableFuture.supplyAsync(() -> {
			return sendSTTFlask(voiceProcessRequest);
		});

		// CompletableFuture<VoiceAnalysisResponse> pitchFuture = CompletableFuture.supplyAsync(() -> {
		// 	return sendAnalysisFlask(voiceProcessRequest);
		// });

		// 3. 분석 결과 매칭 & 저장
		// sttFuture.thenCombine(pitchFuture, (sttResult, pitchResult) -> {
		// 	// 두 분석 결과를 매칭 및 저장
		// 	voiceService.matchAndSaveAnalysisResults(note, sttResult, pitchResult);
		//
		// 	return null; // 반환값이 필요하지 않으면 null 반환
		// }).exceptionally(ex -> {
		// 	// 에러 처리 로직
		// 	System.err.println("Error occurred during analysis: " + ex.getMessage());
		// 	return null;
		// });
	}

	public STTResponse sendSTTFlask(VoiceProcessRequest voiceProcessRequest) {
		String flaskUrl = "http://70.12.130.111:5000/stt";  // Flask 서버 URL

		// HTTP 헤더 설정
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);  // JSON으로 전송

		// 요청에 데이터 추가
		HttpEntity<VoiceProcessRequest> entity = new HttpEntity<>(voiceProcessRequest, headers);

		// Flask 서버로 POST 요청 보내기
		ResponseEntity<STTResponse> response = restTemplate.exchange(flaskUrl, HttpMethod.POST, entity,
			STTResponse.class);

		// 응답 처리 (필요에 따라)
		if (response.getStatusCode().is2xxSuccessful()) {
			System.out.println("성공적으로 Flask 서버에 전송되었습니다: " + response.getBody());
		} else {
			System.err.println("Flask 서버 요청 실패: " + response.getStatusCode());
		}

		return response.getBody();
	}

	// 음성 분석 모델에 보내기
	public VoiceAnalysisResponse sendAnalysisFlask(VoiceProcessRequest voiceProcessRequest) {
		String flaskUrl = "http://70.12.130.111:5000/";  // Flask 서버 URL

		// HTTP 헤더 설정
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);  // JSON으로 전송

		// 요청에 데이터 추가
		HttpEntity<VoiceProcessRequest> entity = new HttpEntity<>(voiceProcessRequest, headers);

		// Flask 서버로 POST 요청 보내기
		ResponseEntity<VoiceAnalysisResponse> response = restTemplate.exchange(flaskUrl, HttpMethod.POST, entity,
			VoiceAnalysisResponse.class);

		// 응답 처리 (필요에 따라)
		// if (response.getStatusCode().is2xxSuccessful()) {
		// 	System.out.println("성공적으로 Flask 서버에 전송되었습니다: " + response.getBody());
		// } else {
		// 	System.err.println("Flask 서버 요청 실패: " + response.getStatusCode());
		// }

		return response.getBody();
	}

	// STT Service
	private final MongoTemplate mongoTemplate;

	@Override
	public void insertSTT(STT stt) {
		try {
			STT insert = voiceRepository.save(stt);
			log.info("Inserted STT with ID: " + insert.getId());
		} catch (DuplicateKeyException e) {
			log.error("STT with this ID already exists.");
		} catch (Exception e) {
			log.error("An error occurred while inserting STT: " + e.getMessage());
		}
	}



//	@CrossOrigin(origins = "http://localhost:5173")
	@Override
	public STT getSTT(long id) {
		Optional<STT> stt = voiceRepository.findById(id);

		if (stt != null) {
			log.info("Found STT");
		} else {
			log.warn("STT not found with ID: " + id);
		}

		return stt.orElse(null);
	}

	@Override
	public void updateSTT(STT stt) {
		long id = stt.getId();
		System.out.println(stt.toString());

		// Null 체크 추가
		List<STTRequest> results = stt.getResult();
		if (results == null || results.isEmpty()) {
			log.warn("STT 결과가 null이거나 비어있습니다.");
			return; // 결과가 없으면 메서드 종료
		}

		for (STTRequest sttInfo : results) {
			Query query = new Query(Criteria.where("id").is(id).and("result.id").is(sttInfo.getId()));
			log.info("Executing query: " + query); // 쿼리 로깅 추가
			Update update = new Update().set("result.$.text", sttInfo.getText());
			log.info("Update set: "+update);

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
