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
public class ProjectRegisterPostReq {

    @ApiModelProperty(name="host id", example="1")
    private Long hostId;

    @ApiModelProperty(name="host position", example="FRONTEND")
    private String hostPosition;

    @ApiModelProperty(name="title", example="싸피사만코 같이 하실분 구함")
    private String title;

    @ApiModelProperty(name="collect status", example="ING")
    private String collectStatus;

    @ApiModelProperty(name="description", example="싸피사만코는 설명설명..")
    private String description;

    @ApiModelProperty(name="start date", example="2022-01-19")
    private String startDate;

    @ApiModelProperty(name="end date", example="2022-02-19")
    private String endDate;

    @ApiModelProperty(name="size", example="5")
    private int size;

    @ApiModelProperty(name="stack", example="[{java: 1}, {HTML: 1}]")
    private List<Map<String, Integer>> stacks;

    @ApiModelProperty(name="total frontend size", example="3")
    private int totalFrontendSize=0;

    @ApiModelProperty(name="total backend size", example="2")
    private int totalBackendSize=0;

    @ApiModelProperty(name="total mobile size", example="0")
    private int totalMobileSize=0;

    @ApiModelProperty(name="total embedded size", example="1")
    private int totalEmbeddedSize=0;

//    @ApiModelProperty(name="current frontend size", example="3")
//    private int currentFrontendSize=0;
//
//    @ApiModelProperty(name="current backend size", example="3")
//    private int currentBackendSize=0;
//
//    @ApiModelProperty(name="current mobile size", example="3")
//    private int currentMobileSize=0;
//
//    @ApiModelProperty(name="current embedded size", example="3")
//    private int currentEmbeddedSize=0;

}
