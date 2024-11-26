package com.echonote.domain.note.dto;

import com.echonote.domain.note.entity.Note;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoteListResponse {
    private Long note_id;

    private String note_name;

    private LocalDateTime create_at;

    private LocalDateTime update_at;

    public static NoteListResponse fromEntity(Note note) {
        return NoteListResponse.builder()
                .note_id(note.getId())
                .note_name(note.getNote_name())
                .create_at(note.getCreate_at())
                .update_at(note.getUpdate_at())
                .build();
    }
}
