package com.echonote.domain.note.dto;

import com.echonote.domain.note.entity.Note;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GetNoteResponse {
    private Long note_id;

    private String note_name;

    private String pdf_path;

    private String record_path;

    private LocalDateTime create_at;

    private LocalDateTime update_at;

    private String stt_status;

    public static GetNoteResponse fromEntity(Note note, String stt_status) {
        return GetNoteResponse.builder()
                .note_id(note.getId())
                .note_name(note.getNote_name())
                .pdf_path(note.getPdf_path())
                .record_path(note.getRecord_path())
                .create_at(note.getCreate_at())
                .update_at(note.getUpdate_at())
                .stt_status(stt_status)
                .build();
    }
}
