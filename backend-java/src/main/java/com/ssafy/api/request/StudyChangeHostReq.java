package com.ssafy.api.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class StudyChangeHostReq {

    private Long studyId;
    private Long oldHostId;
    private Long newHostId;

}
