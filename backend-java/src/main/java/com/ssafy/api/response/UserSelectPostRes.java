package com.ssafy.api.response;

import com.ssafy.api.model.UserDto;
import com.ssafy.common.model.response.BaseResponseBody;
import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@ApiModel("UserSelectAllPostRes")
public class UserSelectPostRes extends BaseResponseBody {

    private UserDto user;

    public static UserSelectPostRes of(Integer statusCode, String message, UserDto user) {
        UserSelectPostRes res = new UserSelectPostRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setUser(user);

        return res;
    }
}
