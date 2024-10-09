package com.echonote.domain.Voice.service;

import java.io.IOException;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
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
import com.echonote.domain.Voice.dto.AnalysisResultRequest;
import com.echonote.domain.Voice.dto.FlaskSendRequest;
import com.echonote.domain.Voice.dto.STTRequest;
import com.echonote.domain.Voice.dto.STTResponse;
import com.echonote.domain.Voice.dto.STTResultRequest;
import com.echonote.domain.Voice.dto.TwoFlaskResult;
import com.echonote.domain.Voice.dto.UrlResponse;
import com.echonote.domain.Voice.dto.VoiceSendRequest;
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

	private final Map<String, TwoFlaskResult> resultStore = new ConcurrentHashMap<>();

	@Override
	public UrlResponse generatePreSignUrl(String filePath,
		String bucketName,
		com.amazonaws.HttpMethod httpMethod) {

		Calendar calendar = Calendar.getInstance();
		calendar.setTime(new Date());
		calendar.add(Calendar.MINUTE, 10); //validfy of 10 minutes

		UrlResponse res = new UrlResponse();
		String fullPath = "wav/" + filePath;
		res.setPresignedUrl(
			amazonS3.generatePresignedUrl(bucketName, fullPath, calendar.getTime(), httpMethod).toString());
		res.setObjectUrl("https://" + bucketName + ".s3.ap-northeast-2.amazonaws.com/" + fullPath);
		return res;
	}

	@Override
	public void sendVoice(Long userId, String processId, VoiceSendRequest voiceSendRequest) {

		// 1. DB에 S3 URL 저장
		Note note = noteRepository.findById(voiceSendRequest.getNoteId())
			.orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND));

		note.setRecord_path(voiceSendRequest.getObjectUrl());

		noteRepository.save(note);
		System.out.println("DB 저장 성공");

		// 2. Flask 모델 요청
		FlaskSendRequest flaskSendRequest = FlaskSendRequest.builder()
			.processId(processId)
			.noteId(voiceSendRequest.getNoteId())
			.objectUrl(voiceSendRequest.getObjectUrl())
			.build();
		sendSTTFlask(flaskSendRequest);


		// 3. Flask에 음성분석 요청
		FlaskSendRequest analysisRequest = FlaskSendRequest.builder()
			.processId(processId)
			.noteId(voiceSendRequest.getNoteId())
			.objectUrl(voiceSendRequest.getObjectUrl())
			.build();
		sendAnalysisFlask(analysisRequest); // 음성 분석 모델에 요청 보내기
	}

	private STTResponse sendSTTFlask(FlaskSendRequest flaskSendRequest) {
		// String flaskUrl = "https://timeisnullnull.duckdns.org:8090/voice_stt/stt";  // STT 모델 API URL
//		String flaskUrl = "http://localhost:5000/stt";
//		String flaskUrl = "http://70.12.130.111:4999/voice_stt/stt";
		String flaskUrl = "https://f1f9-34-83-36-185.ngrok-free.app/voice_stt/stt";
		
		// HTTP 헤더 설정
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);  // JSON으로 전송

		// 요청에 데이터 추가
		HttpEntity<FlaskSendRequest> entity = new HttpEntity<>(flaskSendRequest, headers);

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
	private void sendAnalysisFlask(FlaskSendRequest flaskSendRequest) {
		String flaskUrl = "http://70.12.130.111:4998/voice/analysis";  // 음성 분석 모델 API URL

		// HTTP 헤더 설정
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);  // JSON으로 전송

		// 요청에 데이터 추가
		HttpEntity<FlaskSendRequest> entity = new HttpEntity<>(flaskSendRequest, headers);

		// Flask 서버로 POST 요청 보내기
		ResponseEntity<STTResponse> response = restTemplate.exchange(flaskUrl, HttpMethod.POST, entity,
			STTResponse.class);
		
		// 응답 처리 (필요에 따라)
		if (response.getStatusCode().is2xxSuccessful()) {
			System.out.println("성공적으로 Flask 서버에 전송되었습니다: " + response.getBody());
		} else {
			System.err.println("Flask 서버 요청 실패: " + response.getStatusCode());
		}
	}

	@Override
	public void saveSTTResult(STTResultRequest sttResultRequest) {
		String processId = sttResultRequest.getProcessId();
		TwoFlaskResult twoFlaskResult = resultStore.getOrDefault(processId, new TwoFlaskResult());
		twoFlaskResult.setSttResultRequest(sttResultRequest);
		resultStore.put(processId, twoFlaskResult);

		// 두 결과가 모두 들어오면 합친다.
		if (twoFlaskResult.getSttResultRequest() != null) {
			checkAndProcessVoice(processId); // c 메서드 호출
		}
	}



	@Override
	public void saveAnalysisResult(AnalysisResultRequest analysisResultRequest) {
		String processId = analysisResultRequest.getProcessId();
		TwoFlaskResult twoFlaskResult = resultStore.getOrDefault(processId, new TwoFlaskResult());
		twoFlaskResult.setAnalysisResultRequest(analysisResultRequest);
		resultStore.put(processId, twoFlaskResult);

		// 두 결과가 모두 들어오면 합친다.
		if (twoFlaskResult.getSttResultRequest() != null) {
			checkAndProcessVoice(processId); // c 메서드 호출
		}
	}

	@Override
	public void checkAndProcessVoice(String processId) {
		System.out.println("start result combining");
		TwoFlaskResult twoFlaskResult = resultStore.get(processId);

		// 두 결과가 모두 도착하면 처리
		if (twoFlaskResult != null && twoFlaskResult.getSttResultRequest() != null
			&& twoFlaskResult.getAnalysisResultRequest() != null) {
			
			// 결과 조합하기
			List<STTRequest> sttRequest = twoFlaskResult.getSttResultRequest().getResult();
			List<String> anomalyTimes = twoFlaskResult.getAnalysisResultRequest().getAnomalyTime();

			for (int sttIdx = 0, aIdx = 0; sttIdx < sttRequest.size() || aIdx < anomalyTimes.size(); ) {

				if( Float.parseFloat(sttRequest.get(sttIdx).getStart()) <= Float.parseFloat(anomalyTimes.get(aIdx)) &&
					Float.parseFloat(sttRequest.get(sttIdx).getEnd()) >= Float.parseFloat(anomalyTimes.get(aIdx)) ) {
					// 속성 변경
					System.out.println("changed");
					sttRequest.get(sttIdx).setAnomaly(true);
					aIdx++;
				}

				sttIdx++;
			}


			// MongoDB에 조합한 결과 저장
			STT totalResult = STT.builder()
									.processId(processId)
									.id(twoFlaskResult.getSttResultRequest().getId())
									.result(sttRequest)
									.build();
			voiceRepository.save(totalResult);


			// 저장 완료 후 삭제
			resultStore.remove(processId);
		}
	}

	// 두 모델 결과 조합하는 메소드
	private STT matchResult(TwoFlaskResult twoFlaskResult) {
		STT totalResult = new STT();

		return totalResult;
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
