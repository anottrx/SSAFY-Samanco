package com.ssafy.api.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileService {

    void saveFile(MultipartFile[] files, Long tagId, String tag) throws IOException;
    void updateFile(MultipartFile[] files, Long tagId, String tag) throws IOException;


}
