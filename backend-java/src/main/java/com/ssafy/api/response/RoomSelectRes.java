package com.ssafy.api.response;

import com.ssafy.api.model.BoardDto;
import com.ssafy.api.model.RoomDto;
import com.ssafy.common.model.response.BaseResponseBody;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomSelectRes extends BaseResponseBody {

    private RoomDto room;

    public static RoomSelectRes of(Integer statusCode, String message, RoomDto room) {
        RoomSelectRes res = new RoomSelectRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setRoom(room);

        return res;
    }
}
