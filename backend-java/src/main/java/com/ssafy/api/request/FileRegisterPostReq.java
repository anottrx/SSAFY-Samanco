package com.ssafy.api.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileRegisterPostReq {

    String saveFolder;
    String saveFile;
    String originFile;
    Long userId;
    Long clubId;
    Long boardId;

}
