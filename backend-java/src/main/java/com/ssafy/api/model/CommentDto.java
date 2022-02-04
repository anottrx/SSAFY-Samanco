package com.ssafy.api.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class CommentDto {

    private Long commentId;
    private Long userId;
    private Long boardId;
    private String content;
    private String nickname;
    private String createdDate;
}
