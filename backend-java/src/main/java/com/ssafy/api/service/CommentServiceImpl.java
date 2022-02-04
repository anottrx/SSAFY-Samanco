package com.ssafy.api.service;

import com.ssafy.api.model.CommentDto;
import com.ssafy.api.request.CommentRegisterReq;
import com.ssafy.api.request.CommentUpdateReq;
import com.ssafy.common.util.DateUtil;
import com.ssafy.db.entity.Comment;
import com.ssafy.db.entity.User;
import com.ssafy.db.entity.UserLike;
import com.ssafy.db.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    CommentRepository commentRepository;

    @Autowired
    CommentRepositorySupport commentRepositorySupport;

    @Autowired
    FileRepositorySupport fileRepositorySupport;

    @Autowired
    ValidRepository valid;

    @Autowired
    UserLikeRepositorySupport userLikeRepositorySupport;

//    @Autowired
//    UserRepositorySupport userRepositorySupport;

    @Override
    public int createComment(CommentRegisterReq commentRegisterReq) {
        Long userId= commentRegisterReq.getUserId();
        Long boardId = commentRegisterReq.getBoardId();
        String content = commentRegisterReq.getContent();
        if (!valid.isUserValid(userId) || !valid.isBoardValid(boardId)){
            return 401;
        }
//        if (!valid.isBoardValid(boardId)){
//            return 402;
//        }
        Comment comment = new Comment();
        comment.setUserId(userId);
        comment.setContent(content);
        comment.setBoardId(boardId);
        commentRepository.save(comment);
        return 200;
    }

    @Override
    public int updateComment(CommentUpdateReq updateInfo) {
        Long userId= updateInfo.getUserId();
        Long commentId= updateInfo.getCommentId();
        Long boardId = updateInfo.getBoardId();
        if (!valid.isUserValid(userId) || !valid.isBoardValid(boardId)){
            return 401;
        }
        Comment comment = commentRepositorySupport.selectComment(commentId);
        if (comment==null || userId!=comment.getUserId()){
            return 401;
        }

        return commentRepositorySupport.updateComment(updateInfo);
    }

    @Override
    public int deleteComment(Long userId, Long commentId) {
        Comment comment = commentRepositorySupport.selectComment(commentId);
        if (comment==null || comment.getUserId()!=userId){
            return 401;
        }
        commentRepositorySupport.deleteComment(commentId);
        return 200;
    }

    @Override
    public CommentDto selectComment(Long userId, Long commentId) {
        Comment result=commentRepositorySupport.selectComment(commentId);
        if (result==null){
            return null;
        }
        CommentDto comment=commentEntityToDto(result);
        return comment;
    }

    @Override
    public List<CommentDto> selectBoardCommentAll(Long boardId) {
        List<Comment> results = commentRepositorySupport.selectBoardCommentAll(boardId);
        if (results==null || results.size()==0){
            return null;
        }
        List<CommentDto> comments=new ArrayList<>();
        for (Comment result: results) {
            CommentDto comment=commentEntityToDto(result);
            comments.add(comment);
        }

        return comments;
    }

    @Override
    public CommentDto commentEntityToDto(Comment result) {
        String nickname = valid.selectUserNickname(result.getUserId());
        if (nickname==null){
            return null;
        }

        CommentDto commentDto=new CommentDto();
        commentDto.setCommentId(result.getId());
        commentDto.setContent(result.getContent());
        commentDto.setUserId(result.getUserId());
        commentDto.setBoardId(result.getBoardId());
        commentDto.setNickname(nickname);

        // 작성 시간
        String createdDate=result.getCreatedDate().toString();
        commentDto.setDateOrTime(DateUtil.DateOrTime(createdDate));
        commentDto.setDateAndTime(DateUtil.DateAndTime(createdDate));

        return  commentDto;
    }

}
