package com.ssafy.api.response;

import com.ssafy.api.model.UserDto;
import com.ssafy.common.model.response.BaseResponseBody;
import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("UserSelectAllPostRes")
public class UserSelectRes extends BaseResponseBody {

    private UserDto user;

    public static UserSelectRes of(Integer statusCode, String message, UserDto user) {
        UserSelectRes res = new UserSelectRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setUser(user);

        return res;
    }
}
