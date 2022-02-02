package com.ssafy.api.response;

import com.ssafy.api.model.BoardDto;
import com.ssafy.api.model.ProjectDto;
import com.ssafy.common.model.response.BaseResponseBody;
import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BoardSelectAllRes extends BaseResponseBody {

    private List<BoardDto> boards;

    public static BoardSelectAllRes of(Integer statusCode, String message, List<BoardDto> boards) {
        BoardSelectAllRes res = new BoardSelectAllRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setBoards(boards);

        return res;
    }
}
