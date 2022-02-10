package com.ssafy.api.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class RoomDto {
    private Long roomId;
    private String nickname;
    private Long hostId;
    private String title;
    private int size;
    private int isSecret;
    private String password;
    private String tag;
    private Long tagId;
    private FileDto file;
    private List<UserDto> users;

}
