package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@ApiModel("ProjectJoinPostReq")
public class ProjectJoinPostReq {
    @ApiModelProperty(name="project id", example="10")
    private Long id;

    @ApiModelProperty(name="user id", example="1")
    private Long userId;

    @ApiModelProperty(name="position", example="frontend")
    private String position;
}
