package com.ssafy.api.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ProjectApproveReq {

    private Long projectId;
    private Long userId;
    private String joinTag;
    private Long hostId;
}
