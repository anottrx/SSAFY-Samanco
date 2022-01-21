package com.ssafy.api.request;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@ApiModel("ClubUpdatePostReq")
public class ClubUpdatePostReq {

    @ApiModelProperty(name="id", example="1")
    Long id;

    @ApiModelProperty(name="title", example="싸피사만코 같이 하실분 구함")
    String title;

    @ApiModelProperty(name="collect status", example="ING")
    String collectStatus;

    @ApiModelProperty(name="schedule", example="평일 9시~6시")
    String schedule;

    @ApiModelProperty(name="description", example="싸피사만코는 설명설명..")
    String description;

    @ApiModelProperty(name="start date", example="2022-01-19")
    String startDate;

    @ApiModelProperty(name="end date", example="2022-02-19")
    String endDate;

    @ApiModelProperty(name="size", example="5")
    int size;

    @ApiModelProperty(name="stack", example="[{java: 3}, {HTML: 2}]")
    List<Map<String, Integer>> stacks;

    @ApiModelProperty(name="position", example="[{java: 1}, {HTML: 1}]")
    List<Map<String, Integer>> position;

    @ApiModelProperty(name="tag", example="STUDY")
    String tag;
}
