package com.ssafy.api.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ProjectChangeHostReq {

    private Long projectId;
    private Long oldHostId;
    private String newHostPosition;
    private Long newHostId;

}
