package com.ssafy.api.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ProjectUserIdHitReq {

    private Long projectId;
    private Long userId;
    private int addHit;
}
