package com.ssafy.db.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.db.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class CommonRepository {

    @Autowired
    private JPAQueryFactory jpaQueryFactory;

    QUser qUser = QUser.user;
    QProject qProject=QProject.project;
    QStudy qStudy = QStudy.study;
    QBoard qBoard = QBoard.board;
    QComment qComment = QComment.comment;
    QRoom qRoom = QRoom.room;
    QUserStudy qUserStudy = QUserStudy.userStudy;

    public String selectUserNickname(Long userId) {
        return jpaQueryFactory.select(qUser.nickname).from(qUser)
                .where(qUser.isDeleted.eq(false), qUser.id.eq(userId)).fetchOne();
    }

    public User selectUser(Long userId){
        return jpaQueryFactory.selectFrom(qUser)
                .where(qUser.isDeleted.eq(false), qUser.id.eq(userId)).fetchOne();
    }

    public UserStudy selectUserStudy(Long userId, Long tagId) {
        return jpaQueryFactory.selectFrom(qUserStudy)
                .where(qUserStudy.studyId.eq(tagId), qUserStudy.userId.eq(userId), qUserStudy.isDeleted.eq(false))
                .fetchOne();
    }

    public Project selectProject(Long projectId){
        return jpaQueryFactory.selectFrom(qProject)
                .where(qProject.id.eq(projectId), qProject.isDeleted.eq(false)).fetchOne();
    }

    public Study selectStudy(Long studyId){
        return jpaQueryFactory.selectFrom(qStudy)
                .where(qStudy.id.eq(studyId), qStudy.isDeleted.eq(false)).fetchOne();
    }

    public Room selectRoom(Long roomId){
        return jpaQueryFactory.selectFrom(qRoom)
                .where(qRoom.id.eq(roomId), qRoom.isDeleted.eq(false)).fetchOne();
    }

    public Board selectBoard(Long boardId){
        return jpaQueryFactory.selectFrom(qBoard)
                .where(qBoard.id.eq(boardId), qBoard.isDeleted.eq(false)).fetchOne();
    }

}
