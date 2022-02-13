package com.ssafy.db.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.api.request.CommentUpdateReq;
import com.ssafy.db.entity.Comment;
import com.ssafy.db.entity.QComment;
import com.ssafy.db.entity.QUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public class CommentRepositorySupport {

    @Autowired
    JPAQueryFactory jpaQueryFactory;

    @Autowired
    ValidRepository valid;

    QComment qComment=QComment.comment;

    QUser qUser=QUser.user;

    @Transactional
    public void deleteComment(Long commentId) {
        jpaQueryFactory.update(qComment)
                .where(qComment.id.eq(commentId))
                .set(qComment.isDeleted, true).execute();
    }

    @Transactional
    public int updateComment(CommentUpdateReq commentUpdateInfo){

        Long commentId=commentUpdateInfo.getCommentId();
        String content=(commentUpdateInfo.getContent());
        jpaQueryFactory.update(qComment).where(qComment.id.eq(commentId), qComment.isDeleted.eq(false))
                .set(qComment.content, content)
                .execute();

        return 200;
    }

//    public List<Comment> selectByUser(Long userId) {
//        return jpaQueryFactory.selectFrom(qComment)
//                .where(qComment.userId.eq(userId), qComment.isDeleted.eq(false)).orderBy(qComment.id.desc()).fetch();
//    }

    public Comment selectComment(Long commentId) {
        return jpaQueryFactory.selectFrom(qComment)
                .where(qComment.id.eq(commentId), qComment.isDeleted.eq(false)).fetchOne();
    }

    public List<Comment> selectBoardCommentAll(Long boardId) {
        return jpaQueryFactory.selectFrom(qComment)
                .where(qComment.isDeleted.eq(false), qComment.boardId.eq(boardId)).fetch();
    }

}
