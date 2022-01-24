package com.ssafy.db.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.api.request.UserUpdatePostReq;
import com.ssafy.db.entity.Project;
import com.ssafy.db.entity.QProject;
import com.ssafy.db.entity.QUser;
import com.ssafy.db.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;
import java.util.List;

/**
 * 유저 모델 관련 디비 쿼리 생성을 위한 구현 정의.
 */
@Repository
public class UserRepositorySupport {

    @Autowired
    private JPAQueryFactory jpaQueryFactory;
    QUser qUser = QUser.user;
    QProject qProject=QProject.project;



    @Autowired
    PasswordEncoder passwordEncoder;

//    public Optional<User> findUserByUserId(String email) {
//        User user = jpaQueryFactory.select(qUser).from(qUser)
//                .where(qUser.email.eq(email)).fetchOne();
//        if(user == null) return Optional.empty();
//        return Optional.ofNullable(user);
//    }

    public boolean isValid(Long userId){
        User user = jpaQueryFactory.select(qUser).from(qUser)
                .where(qUser.id.eq(userId), qUser.isDeleted.eq(false)).fetchOne();
        if (user==null){
            return false;
        }
        return true;
    }

    public boolean isProjectValid(Long userId){
        // project 지워지면 등록 가능
        User user = jpaQueryFactory.select(qUser).from(qUser)
                .where(qUser.id.eq(userId), qUser.isDeleted.eq(false)).fetchOne();
        if (user==null){    // 사용자가 탈퇴했거나 없으면
            return false;
        }
        Project project = jpaQueryFactory.selectFrom(qProject)
                .where(qProject.id.eq(user.getProjectId()), qProject.isDeleted.eq(false)).fetchOne();

        if (project!=null){     // 진행중인 프로젝트가 있으면
            return false;
        }
        return true;
    }
    public User findUserByEmail(String email){
        return jpaQueryFactory.select(qUser).from(qUser)
                .where(qUser.email.eq(email), qUser.isDeleted.eq(false)).fetchOne();
    }

    public User findUserByNickname(String nickname) {
        return jpaQueryFactory.select(qUser).from(qUser)
                .where(qUser.nickname.eq(nickname), qUser.isDeleted.eq(false)).fetchOne();
    }

    @Transactional
    public int updateUser(UserUpdatePostReq userUpdateInfo) {
//        User user=jpaQueryFactory.select(qUser).from(qUser)
//                .where(qUser.id.eq(userUpdateInfo.getUserId())).fetchOne();

        Long userId=userUpdateInfo.getUserId();
        if (isValid(userId)) {
            String password = passwordEncoder.encode(userUpdateInfo.getPassword());
            String phone = userUpdateInfo.getPhone();
            String name = userUpdateInfo.getName();
            String birthday = (userUpdateInfo.getBirthday());
            String description = (userUpdateInfo.getDescription());
            String nickname = (userUpdateInfo.getNickname());
            int generation = (userUpdateInfo.getGeneration());
            String link = (userUpdateInfo.getLink());
            String studentId = (userUpdateInfo.getStudentId());

            jpaQueryFactory.update(qUser).where(qUser.id.eq(userId))
                    .set(qUser.name, name).set(qUser.password, password).set(qUser.phone, phone).set(qUser.birthday, birthday)
                    .set(qUser.description, description).set(qUser.description, description).set(qUser.nickname, nickname)
                    .set(qUser.generation, generation).set(qUser.link, link).set(qUser.studentId, studentId).execute();

            return 200;
        }
        return 401;
    }

    @Transactional
    public int updateUserProject(Long userId, Long projectId, String projectPosition, String projectJoinStatus) {
        if (isProjectValid(userId)) {
            jpaQueryFactory.update(qUser).where(qUser.id.eq(userId))
                    .set(qUser.projectId, projectId)
                    .set(qUser.projectPosition, projectPosition)
                    .set(qUser.projectJoinStatus, projectJoinStatus).execute();
            return 200;
        }

        return 401;
    }

    @Transactional
    public void deleteUser(Long userId){
        jpaQueryFactory.update(qUser).where(qUser.id.eq(userId))
                .set(qUser.isDeleted, true).execute();
    }

    public int updatePasswordUserProject(UserUpdatePostReq userUpdateInfo) {
        Long userId=userUpdateInfo.getUserId();
        if (isValid(userId)) {
            String password = passwordEncoder.encode(userUpdateInfo.getPassword());

            jpaQueryFactory.update(qUser).where(qUser.id.eq(userId))
                    .set(qUser.password, password).execute();

            return 200;
        }
        return 401;
    }

    public List<User> selectUserAll() {
        return jpaQueryFactory.selectFrom(qUser).where(qUser.isDeleted.eq(false)).fetch();
    }
}
