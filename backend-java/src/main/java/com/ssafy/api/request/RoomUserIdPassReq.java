package com.ssafy.api.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class RoomUserIdPassReq {

    private Long roomId;
    private Long userId;
    private String password;

}
