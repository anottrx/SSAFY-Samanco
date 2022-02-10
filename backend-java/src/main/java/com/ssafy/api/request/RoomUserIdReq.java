package com.ssafy.api.request;

import com.ssafy.api.model.FileDto;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class RoomUserIdReq {

    private Long roomId;
    private Long userId;

}
