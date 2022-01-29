package com.ssafy.api.response;

import com.ssafy.api.model.StackGradeDto;
import com.ssafy.common.model.response.BaseResponseBody;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class StackSelectAllRes extends BaseResponseBody {

    private List<String> stacks;

    public static StackSelectAllRes of(Integer statusCode, String message, List<String> stacks) {
        StackSelectAllRes res = new StackSelectAllRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setStacks(stacks);

        return res;
    }
}
