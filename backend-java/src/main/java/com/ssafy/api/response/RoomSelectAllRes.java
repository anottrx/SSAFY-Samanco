package com.ssafy.api.response;

import com.ssafy.api.model.BoardDto;
import com.ssafy.api.model.RoomDto;
import com.ssafy.common.model.response.BaseResponseBody;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RoomSelectAllRes extends BaseResponseBody {

    private List<RoomDto> rooms;

    public static RoomSelectAllRes of(Integer statusCode, String message, List<RoomDto> rooms) {
        RoomSelectAllRes res = new RoomSelectAllRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setRooms(rooms);

        return res;
    }
}
