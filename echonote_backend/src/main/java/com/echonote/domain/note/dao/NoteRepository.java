package com.echonote.domain.note.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.echonote.domain.note.entity.Note;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUserId(Long userId);
}
