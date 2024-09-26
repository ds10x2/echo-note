package com.echonote.domain.note.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.echonote.domain.note.entity.Note;

public interface NoteRepository extends JpaRepository<Note, Long> {
}
