package com.example.notes.note;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NoteController {

  @Autowired
  NoteService noteService;

  @GetMapping("/notes")
  public ResponseEntity<List<Note>> getNotes(Authentication authentication) {
    Long userId = Long.valueOf(authentication.getName());
    List<Note> notes = noteService.getNotesByUserId(userId);
    return ResponseEntity.ok().body(notes);
  }

  @PostMapping("/notes")
  public ResponseEntity<Note> createNote(
      @Valid @RequestBody Note body,
      Authentication authentication) throws URISyntaxException {
    Long userId = Long.valueOf(authentication.getName());
    Note note = new Note();
    note.setUserId(userId);
    note.setTitle(body.getTitle());
    note.setBody(body.getBody());
    note.setIsVoiceNote(body.getIsVoiceNote());
    note.setIsPublic(body.getIsPublic());
    note = noteService.createNote(note);
    return ResponseEntity.created(new URI("/notes/" + note.getId())).body(note);
  }

  @DeleteMapping("/notes/{noteId}")
  public ResponseEntity<Void> deleteNote(
      @PathVariable Long noteId,
      Authentication authentication) {
    Long userId = Long.valueOf(authentication.getName());
    Optional<Note> optionalNote = noteService.getNoteById(noteId);
    if (optionalNote.isEmpty()) {
      return ResponseEntity.notFound().build();
    }

    Note note = optionalNote.get();
    if (userId != note.getUserId()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    noteService.deleteNoteById(noteId);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/notes/{noteId}")
  public ResponseEntity<Note> getNote(
      @PathVariable Long noteId,
      Authentication authentication) {
    Long userId = Long.valueOf(authentication.getName());
    Optional<Note> optionalNote = noteService.getNoteById(noteId);
    if (optionalNote.isEmpty()) {
      return ResponseEntity.notFound().build();
    }

    Note note = optionalNote.get();
    if (userId != note.getUserId() && !note.getIsPublic()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    return ResponseEntity.ok().body(note);
  }

  @PutMapping("/notes/{noteId}")
  public ResponseEntity<Note> updateNote(
      @PathVariable Long noteId,
      @Valid @RequestBody Note body,
      Authentication authentication) {
    Long userId = Long.valueOf(authentication.getName());
    Optional<Note> optionalNote = noteService.getNoteById(noteId);
    if (optionalNote.isEmpty()) {
      return ResponseEntity.notFound().build();
    }

    Note note = optionalNote.get();
    if (userId != note.getUserId()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    note.setTitle(body.getTitle());
    note.setBody(body.getBody());
    note.setIsVoiceNote(body.getIsVoiceNote());
    note.setIsPublic(body.getIsPublic());
    note = noteService.updateNote(note);
    return ResponseEntity.ok().body(note);
  }
}
