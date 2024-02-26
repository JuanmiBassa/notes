package com.example.notes.file;

import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.notes.note.Note;
import com.example.notes.note.NoteService;

@RestController
public class FileController {

  @Autowired
  FileService fileService;

  @Autowired
  NoteService noteService;

  @GetMapping("/notes/{noteId}/files")
  public ResponseEntity<List<FileURI>> getFiles(
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

    List<FileURI> fileURIs = fileService.getFilesByNoteId(noteId).stream()
        .map(file -> {
          URI uri = URI.create("/notes/" + noteId + "/files/" + file.getId());
          FileURI fileURI = new FileURI();
          fileURI.setUri(uri);
          return fileURI;
        })
        .collect(Collectors.toList());

    return ResponseEntity.ok().body(fileURIs);
  }

  @PostMapping("/notes/{noteId}/files")
  public ResponseEntity<FileURI> uploadFile(
      @PathVariable Long noteId,
      @RequestParam("file") MultipartFile multipartFile,
      Authentication authentication) throws IOException {
    Long userId = Long.valueOf(authentication.getName());
    Optional<Note> optionalNote = noteService.getNoteById(noteId);
    if (optionalNote.isEmpty()) {
      return ResponseEntity.notFound().build();
    }

    Note note = optionalNote.get();
    if (userId != note.getUserId()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    File file = new File();
    file.setNoteId(noteId);
    file.setName(multipartFile.getOriginalFilename());
    file.setType(multipartFile.getContentType());
    file.setData(multipartFile.getBytes());
    file = fileService.createFile(file);

    URI location = URI.create("/notes/" + noteId + "/files/" + file.getId());
    FileURI fileURI = new FileURI();
    fileURI.setUri(location);
    return ResponseEntity.created(location).body(fileURI);
  }

  @DeleteMapping("/notes/{noteId}/files/{fileId}")
  public ResponseEntity<Void> deleteFile(
      @PathVariable Long noteId,
      @PathVariable Long fileId,
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

    fileService.deleteFileById(fileId);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/notes/{noteId}/files/{fileId}")
  public ResponseEntity<Resource> downloadFile(
      @PathVariable Long noteId,
      @PathVariable Long fileId,
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

    Optional<File> optionalFile = fileService.getFileById(fileId);
    if (optionalFile.isEmpty()) {
      return ResponseEntity.notFound().build();
    }

    File file = optionalFile.get();
    return ResponseEntity.ok()
        .contentType(MediaType.parseMediaType(file.getType()))
        .header(HttpHeaders.CONTENT_DISPOSITION,
            "attachment; filename=\"" + file.getName() + "\"")
        .body(new ByteArrayResource(file.getData()));
  }
}
