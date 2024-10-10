package com.echonote.domain.note.service;

import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.echonote.domain.User.dao.UserRepository;
import com.echonote.domain.User.entity.User;
import com.echonote.domain.note.dao.KeywordRepository;
import com.echonote.domain.note.dao.NoteRepository;
import com.echonote.domain.note.dto.GetNoteResponse;
import com.echonote.domain.note.dto.NoteCreateRequest;
import com.echonote.domain.note.dto.NoteCreateResponse;
import com.echonote.domain.note.dto.NoteListResponse;
import com.echonote.domain.note.dto.UrlResponse;
import com.echonote.domain.note.entity.Keywords;
import com.echonote.domain.note.entity.Note;
import com.echonote.global.aop.exception.BusinessLogicException;
import com.echonote.global.aop.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NoteServiceImpl implements NoteService {

	private final UserRepository userRepository;
	private final NoteRepository noteRepository;
	private final KeywordRepository keywordRepository;

	@Autowired
	private AmazonS3 amazonS3;

	public UrlResponse generatePreSignUrl(String filePath,
		String bucketName,
		HttpMethod httpMethod) {

		Calendar calendar = Calendar.getInstance();
		calendar.setTime(new Date());
		calendar.add(Calendar.MINUTE, 10); //validfy of 10 minutes

		UrlResponse res = new UrlResponse();
		String fullPath = "pdf/" + filePath;
		res.setPresignedUrl(
			amazonS3.generatePresignedUrl(bucketName, fullPath, calendar.getTime(), httpMethod).toString());
		res.setObjectUrl("https://" + bucketName + ".s3.ap-northeast-2.amazonaws.com/" + fullPath);
		return res;

	}

	@Override
	public NoteCreateResponse addNote(Long userId, NoteCreateRequest noteCreateRequest) {

		User user = userRepository.findById(userId)
			.orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND));

		Note note = Note.builder()
			.user(user)
			.note_name(noteCreateRequest.getNote_name())
			.pdf_path(noteCreateRequest.getObjectUrl())
			.create_at(LocalDateTime.now())
			.is_processing(false).build();

		NoteCreateResponse res = new NoteCreateResponse();
		Long noteId = noteRepository.save(note).getId();
		res.setNoteId(noteId);

		// 키워드 저장
		Keywords keyword = Keywords.builder()
			.id(noteId)
			.keywords(noteCreateRequest.getKeywords()).build();

		keywordRepository.save(keyword);

		return res;
	}

	@Override
	public List<NoteListResponse> getNoteList(Long userId) {

		List<Note> notes = noteRepository.findByUserId(userId);

		return notes.stream()
			.map(NoteListResponse::fromEntity)
			.collect(Collectors.toList());
	}

	@Override
	public GetNoteResponse getNote(Long noteId) {

		Note note = noteRepository.findById(noteId)
			.orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND));
		String stt_status = note.is_processing() ? "processing" : "done";

		// keyword select
		Keywords keywords = keywordRepository.findById(noteId)
			.orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND));

		GetNoteResponse res = GetNoteResponse.fromEntity(note, stt_status, keywords.getKeywords());

		return res;
	}

	@Override
	public void updateDate(Long noteId) {
		Note note = noteRepository.findById(noteId)
			.orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND));
		note.setUpdate_at(LocalDateTime.now());
		noteRepository.save(note);
	}

	@Override
	public void deleteNote(Long noteId) {
		noteRepository.deleteById(noteId);
	}

}
