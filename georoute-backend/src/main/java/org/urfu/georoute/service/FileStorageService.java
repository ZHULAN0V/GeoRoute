package org.urfu.georoute.service;

import java.io.IOException;
import java.io.InputStream;

import org.springframework.web.multipart.MultipartFile;

import io.minio.Result;
import io.minio.messages.Item;

public interface FileStorageService {

    String saveFile(MultipartFile file) throws IOException;

    InputStream getFile(String fileName) throws IOException;

    Iterable<Result<Item>> getAllFiles();

    void deleteFile(String fileName) throws IOException;

}
