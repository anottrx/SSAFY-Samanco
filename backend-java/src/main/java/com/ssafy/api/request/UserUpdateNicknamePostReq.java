package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@ApiModel("UserUpdateNicknamePostReq")
public class UserUpdateNicknamePostReq {

    @ApiModelProperty(name="id", example="1")
    Long id;
    @ApiModelProperty(name="nickname", example="싸피싸만코")
    String nickname;
}
