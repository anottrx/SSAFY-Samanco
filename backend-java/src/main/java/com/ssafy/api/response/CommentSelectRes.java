package com.ssafy.api.response;

import com.ssafy.api.model.CommentDto;
import com.ssafy.common.model.response.BaseResponseBody;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentSelectRes extends BaseResponseBody {

    private CommentDto comment;

    public static CommentSelectRes of(Integer statusCode, String message, CommentDto comment) {
        CommentSelectRes res = new CommentSelectRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setComment(comment);

        return res;
    }
}
