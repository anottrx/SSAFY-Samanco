package com.ssafy.db.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.db.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ValidRepository {

    @Autowired
    private JPAQueryFactory jpaQueryFactory;
    QUser qUser = QUser.user;
    QProject qProject=QProject.project;
    QStudy qStudy = QStudy.study;
    QBoard qBoard = QBoard.board;

    public boolean isUserValid(Long userId){
        User user = jpaQueryFactory.select(qUser).from(qUser)
                .where(qUser.id.eq(userId), qUser.isDeleted.eq(false)).fetchOne();
        if (user==null){
            return false;
        }
        return true;
    }

    public boolean isUserValid(String email){
        User user = jpaQueryFactory.select(qUser).from(qUser)
                .where(qUser.email.eq(email), qUser.isDeleted.eq(false)).fetchOne();
        if (user==null){
            return false;
        }
        return true;
    }


    public boolean isProjectValid(Long projectId){
        // project 지워지면 등록 가능
        Project project = jpaQueryFactory.selectFrom(qProject)
                .where(qProject.id.eq(projectId), qProject.isDeleted.eq(false)).fetchOne();

        if (project==null){
            return false;
        }
        return true;
    }

    public boolean updateUserProjectValid(Long userId, Long projectId) {
        if (!isProjectValid(projectId)) {
            return false;
        }
        User user = jpaQueryFactory.selectFrom(qUser)
                .where(qUser.id.eq(userId), qUser.isDeleted.eq(false)).fetchOne();
        if (user==null) {
            return false;
        }
        String status=user.getProjectJoinStatus();
        if (status==null|| status=="" ||status.equals("NO")||status.equals("CANCEL")) {   // 진행중인 프로젝트 없음
            return true;
        }
        Long curProjectId=user.getProjectId();
        if (isProjectValid(curProjectId)){  // 진행중인 프로젝트 존재
            return false;
        }
        return true;
    }

    public boolean isTargetValid(Long targetId, String tag) {
        if ("project".equalsIgnoreCase(tag)){
            return isProjectValid(targetId);
        } else if ("study".equalsIgnoreCase(tag)){
            return isStudyValid(targetId);
        } else if ("user".equalsIgnoreCase(tag)){
            return isUserValid(targetId);
        } else if ("board".equalsIgnoreCase(tag)){
            return isBoardValid(targetId);
        }
        return false;
    }

    private boolean isBoardValid(Long boardId) {
        Board board = jpaQueryFactory.selectFrom(qBoard)
            .where(qBoard.id.eq(boardId), qBoard.isDeleted.eq(false)).fetchOne();

        if (board==null){
            return false;
        }
        return true;
    }

    private boolean isStudyValid(Long studyId) {
        Study study = jpaQueryFactory.selectFrom(qStudy)
                .where(qStudy.id.eq(studyId), qStudy.isDeleted.eq(false)).fetchOne();

        if (study==null){
            return false;
        }
        return true;
    }
}
