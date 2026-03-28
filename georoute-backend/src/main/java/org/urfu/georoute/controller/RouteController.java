package org.urfu.georoute.controller;

import java.io.IOException;
import java.util.List;
import java.util.stream.StreamSupport;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.urfu.georoute.service.FileStorageService;

import io.minio.errors.MinioException;

@RestController
@RequestMapping(value = "/api/{version}/routes")
public class RouteController {

    private final FileStorageService fileStorageService;

    public RouteController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @GetMapping(version = "1.0")
    public List<String> getAllRoutes() {
        return StreamSupport.stream(fileStorageService.getAllFiles().spliterator(), false)
            .map(r -> {
                try {
                    return r.get().objectName();
                } catch (MinioException e) {
                    throw new RuntimeException(e);
                }
            })
            .toList();
    }

    @GetMapping(value = "/{routeName}", version = "1.0")
    public ResponseEntity<InputStreamResource> getRoute(@PathVariable("routeName") String routeName)
        throws IOException {
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + routeName + "\"")
            .body(new InputStreamResource(fileStorageService.getFile(routeName)));
    }

    @PostMapping(version = "1.0")
    public String saveRoute(@RequestParam("file") MultipartFile file) throws IOException {
        return fileStorageService.saveFile(file);
    }

    @DeleteMapping(value = "/{routeName}", version = "1.0")
    public void deleteRoute(@PathVariable("routeName") String routeName) throws IOException {
        fileStorageService.deleteFile(routeName);
    }

}
