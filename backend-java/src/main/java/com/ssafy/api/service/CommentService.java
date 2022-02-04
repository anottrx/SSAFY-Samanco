package com.ssafy.api.service;

import com.ssafy.api.model.CommentDto;
import com.ssafy.api.request.CommentRegisterReq;
import com.ssafy.api.request.CommentUpdateReq;
import com.ssafy.db.entity.Comment;

import java.util.List;

public interface CommentService {

    int createComment(CommentRegisterReq commentRegisterReq);

    int updateComment(CommentUpdateReq updateInfo);

    int deleteComment(Long userId, Long commentId);

    CommentDto selectComment(Long userId, Long commentId);

    List<CommentDto> selectBoardCommentAll(Long boardId);
    CommentDto commentEntityToDto(Comment entity);
}
