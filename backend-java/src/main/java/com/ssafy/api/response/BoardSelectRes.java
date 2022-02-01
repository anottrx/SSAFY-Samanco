package com.ssafy.api.response;

import com.ssafy.api.model.BoardDto;
import com.ssafy.api.model.ProjectDto;
import com.ssafy.common.model.response.BaseResponseBody;
import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BoardSelectRes extends BaseResponseBody {

    private BoardDto board;

    public static BoardSelectRes of(Integer statusCode, String message, BoardDto board) {
        BoardSelectRes res = new BoardSelectRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setBoard(board);

        return res;
    }
}
