package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@ApiModel("ProjectRegisterPstReq")
public class StudyUpdatePostReq {

    @ApiModelProperty(name="study id", example="10")
    private Long id;

    @ApiModelProperty(name="user id", example="1")
    private Long hostId;

    @ApiModelProperty(name="title", example="싸피사만코 같이 하실분 구함")
    private String title;

    @ApiModelProperty(name="collect status", example="ING")
    private String collectStatus;

    @ApiModelProperty(name="schedule", example="평일 9시~6시")
    private String schedule;

    @ApiModelProperty(name="description", example="싸피사만코는 설명설명..")
    private String description;

    @ApiModelProperty(name="size", example="5")
    private int size;

    @ApiModelProperty(name="stack", example="[{java: 3}, {HTML: 2}]")
    private List<Map<String, Integer>> stacks;

}
