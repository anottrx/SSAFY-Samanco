package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("UserIdPostReq")
public class UserIdPostReq {
    @ApiModelProperty(name="유저 id", example="10")
    Long userId;
}
