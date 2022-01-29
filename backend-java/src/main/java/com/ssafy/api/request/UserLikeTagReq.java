package com.ssafy.api.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserLikeTagReq {

    private Long userId;
    private Long tagId;
    private String tag;

}
