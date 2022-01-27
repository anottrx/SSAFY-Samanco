package com.ssafy.api.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class FileRegisterReq {

    private String saveFolder;
    private String saveFile;
    private String originFile;
    private Long userId;
    private Long projectId;
    private Long studyId;
    private Long boardId;

}
