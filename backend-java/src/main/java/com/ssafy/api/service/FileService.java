package com.ssafy.api.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileService {

    void saveFile(MultipartFile[] files, Long id, int flag) throws IOException;

    void updateFile(MultipartFile[] files, Long id, int flag) throws IOException;

//    void clubSaveFile(MultipartFile[] files, Long id) throws IOException;
//    void clubUpdateFile(MultipartFile[] files, Long id) throws IOException;
//    void boardSaveFile(MultipartFile[] files, Long id) throws IOException;
//    void boardUpdateFile(MultipartFile[] files, Long id) throws IOException;

}
