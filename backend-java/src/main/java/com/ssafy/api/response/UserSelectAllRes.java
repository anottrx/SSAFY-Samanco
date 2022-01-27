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
public class UserSelectAllRes extends BaseResponseBody {

    private List<UserDto> users;

    public static UserSelectAllRes of(Integer statusCode, String message, List<UserDto> users) {
        UserSelectAllRes res = new UserSelectAllRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setUsers(users);

        return res;
    }
}
