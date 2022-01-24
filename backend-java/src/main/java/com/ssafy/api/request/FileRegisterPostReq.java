package com.ssafy.api.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class FileRegisterPostReq {

    String saveFolder;
    String saveFile;
    String originFile;
    Long userId;
    Long clubId;
    Long boardId;

}
