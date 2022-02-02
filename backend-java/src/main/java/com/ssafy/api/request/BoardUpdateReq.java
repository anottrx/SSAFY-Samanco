package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@ToString
public class BoardUpdateReq {

    private Long boardId;
    private Long userId;
    private String title;
    private String content;
    @ApiModelProperty(example="2022-01-19")
    private String startDate;
    @ApiModelProperty(example="2022-02-19")
    private String endDate;
}
