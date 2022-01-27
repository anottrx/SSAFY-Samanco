package com.ssafy.db.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.db.entity.Project;
import com.ssafy.db.entity.QProject;
import com.ssafy.db.entity.QUser;
import com.ssafy.db.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ValidRepository {

    @Autowired
    private JPAQueryFactory jpaQueryFactory;
    QUser qUser = QUser.user;
    QProject qProject=QProject.project;

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
//        User user = jpaQueryFactory.select(qUser).from(qUser)
//                .where(qUser.id.eq(userId), qUser.isDeleted.eq(false)).fetchOne();
//        if (user==null){    // 사용자가 탈퇴했거나 없으면
//            return false;
//        }
        Project project = jpaQueryFactory.selectFrom(qProject)
                .where(qProject.id.eq(projectId), qProject.isDeleted.eq(false)).fetchOne();

//        if (project!=null){     // 진행중인 프로젝트가 있으면
//            return false;
//        }
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
        if (status==null||status.equals("NO")||status.equals("CANCEL")) {   // 진행중인 프로젝트 없음
            return true;
        }
        Long curProjectId=user.getProjectId();
        if (isProjectValid(curProjectId)){  // 진행중인 프로젝트 존재
            return false;
        }
        return true;
    }
}
