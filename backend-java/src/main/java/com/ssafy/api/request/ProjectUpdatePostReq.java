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
@ApiModel("ProjectUpdatePostReq")
public class ProjectUpdatePostReq {

    @ApiModelProperty(name="id", example="10")
    private Long id;

    @ApiModelProperty(name="hostId", example="1")
    private Long hostId;

    @ApiModelProperty(name="hostPosition", example="FRONTEND")
    private String hostPosition;

    @ApiModelProperty(name="title", example="싸피사만코 같이 하실분 구함")
    private String title;

    @ApiModelProperty(name="collectStatus", example="ING")
    private String collectStatus;

    @ApiModelProperty(name="description", example="싸피사만코는 설명설명..")
    private String description;

    @ApiModelProperty(name="startDate", example="2022-01-19")
    private String startDate;

    @ApiModelProperty(name="endDate", example="2022-02-19")
    private String endDate;

    @ApiModelProperty(name="size", example="5")
    private int totalSize;

    @ApiModelProperty(name="stacks", example="[{java: 3}, {HTML: 2}]")
    private List<Map<String, Integer>> stacks;

    @ApiModelProperty(name="totalFrontendSize", example="3")
    private int totalFrontendSize=0;

    @ApiModelProperty(name="totalBackendSize", example="2")
    private int totalBackendSize=0;

    @ApiModelProperty(name="totalMobileSize", example="0")
    private int totalMobileSize=0;

    @ApiModelProperty(name="totalEmbeddedSize", example="1")
    private int totalEmbeddedSize=0;
}
