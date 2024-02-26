package com.example.notes.file;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FileService {

  @Autowired
  FileRepository fileRepository;

  File createFile(File file) {
    return fileRepository.save(file);
  }

  void deleteFileById(Long id) {
    fileRepository.deleteById(id);
  }

  Optional<File> getFileById(Long id) {
    return fileRepository.findById(id);
  }

  List<File> getFilesByNoteId(Long noteId) {
    return fileRepository.findAllByNoteId(noteId);
  }
}
