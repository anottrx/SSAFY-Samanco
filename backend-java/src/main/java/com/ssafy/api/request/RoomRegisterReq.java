package com.ssafy.api.request;

import com.ssafy.api.model.FileDto;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class RoomRegisterReq {

    private Long hostId;
    private String title;
    private int isSecret;
    private String password;
    private String tag;
    private Long tagId;
    private FileDto file;

}
