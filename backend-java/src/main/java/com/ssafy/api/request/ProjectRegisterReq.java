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
@ApiModel("ProjectRegisterPstReq")
public class ProjectRegisterReq {

    private Long hostId;

    @ApiModelProperty(example="FRONTEND")
    private String hostPosition;
    private String title;

    @ApiModelProperty(example="ING")
    private String collectStatus;
    private String description;

    @ApiModelProperty(example="2022-01-19")
    private String startDate;

    @ApiModelProperty(example="2022-02-19")
    private String endDate;
    private int totalSize;

    @ApiModelProperty(example="[{java: 1}, {HTML: 1}]")
    private List<Map<String, Integer>> stacks;
    private int totalFrontendSize=0;
    private int totalBackendSize=0;
    private int totalMobileSize=0;
    private int totalEmbeddedSize=0;

}
