package com.ssafy.api.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class StudyApproveReq {

    private Long studyId;
    private Long userId;
    private String joinTag;
    private Long hostId;
}
