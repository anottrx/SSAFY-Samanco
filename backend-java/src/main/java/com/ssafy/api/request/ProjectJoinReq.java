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
public class ProjectJoinReq {
    private Long projectId;
    private Long userId;

    @ApiModelProperty(example="FRONTEND")
    private String position;
}
