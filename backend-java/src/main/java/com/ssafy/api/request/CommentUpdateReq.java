package com.ssafy.api.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CommentUpdateReq {

    private Long commentId;
    private Long boardId;
    private Long userId;
    private String content;
}
