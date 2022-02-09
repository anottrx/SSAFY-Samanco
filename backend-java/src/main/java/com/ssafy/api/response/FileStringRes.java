package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class FileStringRes extends BaseResponseBody {
    private String fileString;

    public static FileStringRes of(Integer statusCode, String message, String fileString) {
        FileStringRes res = new FileStringRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setFileString(fileString);

        return res;
    }
}
