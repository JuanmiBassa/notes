package com.example.notes.note;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NoteService {

  @Autowired
  NoteRepository noteRepository;

  public Note createNote(Note note) {
    Instant now = Instant.now();
    note.setCreatedAt(now);
    note.setModifiedAt(now);
    return noteRepository.save(note);
  }

  public void deleteNoteById(Long id) {
    noteRepository.deleteById(id);
  }

  public Optional<Note> getNoteById(Long id) {
    return noteRepository.findById(id);
  }

  public List<Note> getNotesByUserId(Long userId) {
    return noteRepository.findAllByUserId(userId);
  }

  public Note updateNote(Note note) {
    Instant now = Instant.now();
    note.setModifiedAt(now);
    noteRepository.save(note);
    return note;
  }
}
