package com.ssafy.api.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class BoardUserIdHitReq {

    private Long boardId;
    private Long userId;
    private int addHit;
}
