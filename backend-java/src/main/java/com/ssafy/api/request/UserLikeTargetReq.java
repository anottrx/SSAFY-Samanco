package com.ssafy.api.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserLikeTargetReq {

    private Long userId;
    private Long targetId;
    private String tag;

}
