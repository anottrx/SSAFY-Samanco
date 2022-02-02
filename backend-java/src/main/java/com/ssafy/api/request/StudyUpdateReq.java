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
public class StudyUpdateReq {

    private Long studyId;
    private Long hostId;
    private String title;

    @ApiModelProperty(example="ING")
    private String collectStatus;
    private String schedule;
    private String description;
    private int size;
    @ApiModelProperty(example="[{java: 3}, {HTML: 2}]")
    private List<Map<String, Integer>> stacks;

}
