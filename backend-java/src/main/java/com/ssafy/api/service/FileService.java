package com.ssafy.api.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileService {

    void userSaveFile(MultipartFile[] files, Long userId) throws IOException;
}
