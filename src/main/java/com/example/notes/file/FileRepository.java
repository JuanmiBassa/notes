package com.example.notes.file;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileRepository extends CrudRepository<File, Long> {
  List<File> findAllByNoteId(Long noteId);
}
