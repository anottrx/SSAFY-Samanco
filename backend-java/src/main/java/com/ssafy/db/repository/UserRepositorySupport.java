package com.ssafy.db.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.api.request.UserLoginReq;
import com.ssafy.api.request.UserUpdateReq;
import com.ssafy.db.entity.QUser;
import com.ssafy.db.entity.QUserLike;
import com.ssafy.db.entity.User;

import com.ssafy.db.entity.UserLike;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;

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

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    ValidRepository valid;

    public User findUserByEmail(String email){
        return jpaQueryFactory.select(qUser).from(qUser)
                .where(qUser.email.eq(email), qUser.isDeleted.eq(false)).fetchOne();
    }

    // create 할때
    public User findUserByNickname(String nickname) {
        return jpaQueryFactory.select(qUser).from(qUser)
                .where(qUser.nickname.eq(nickname), qUser.isDeleted.eq(false)).fetchOne();
    }

    // update 할때
    public User findUserByNickname(Long id, String nickname) {
        return jpaQueryFactory.select(qUser).from(qUser)
                .where(qUser.nickname.eq(nickname), qUser.isDeleted.eq(false), qUser.id.ne(id)).fetchOne();
    }

    @Transactional
    public int updateUser(UserUpdateReq userUpdateInfo) {
        Long userId=userUpdateInfo.getUserId();
        if (valid.isUserValid(userId)) {
            jpaQueryFactory.update(qUser).where(qUser.id.eq(userId))
                    .set(qUser.name, userUpdateInfo.getName())
                    .set(qUser.password, passwordEncoder.encode(userUpdateInfo.getPassword()))
                    .set(qUser.phone, userUpdateInfo.getPhone())
                    .set(qUser.birthday, userUpdateInfo.getBirthday())
                    .set(qUser.description, userUpdateInfo.getDescription())
                    .set(qUser.position, userUpdateInfo.getPosition())
                    .set(qUser.nickname, userUpdateInfo.getNickname())
                    .set(qUser.link, userUpdateInfo.getLink())
                    .set(qUser.userClass, userUpdateInfo.getUserClass())
                    .execute();

            return 200;
        }
        return 401;
    }

    @Transactional
    public int joinUserProject(Long userId, Long projectId, String projectPosition, String projectJoinStatus) {
        if (valid.updateUserProjectValid(userId, projectId)) {
            jpaQueryFactory.update(qUser).where(qUser.id.eq(userId))
                    .set(qUser.projectId, projectId)
                    .set(qUser.projectPosition, projectPosition)
                    .set(qUser.projectJoinStatus, projectJoinStatus).execute();
            return 200;
        }
        return 401;
    }
    @Transactional
    public int approveUserProject(Long userId, String projectJoinStatus) {
        jpaQueryFactory.update(qUser).where(qUser.id.eq(userId))
                .set(qUser.projectJoinStatus, projectJoinStatus).execute();
        return 200;
    }

    @Transactional
    public void deleteUser(Long userId){
        jpaQueryFactory.update(qUser).where(qUser.id.eq(userId))
                .set(qUser.isDeleted, true).execute();
    }

    @Transactional
    public int updateUserPassword(UserLoginReq userUpdateInfo) {
        String email=userUpdateInfo.getEmail();
        if (valid.isUserValid(email)) {
            String password = passwordEncoder.encode(userUpdateInfo.getPassword());

            jpaQueryFactory.update(qUser).where(qUser.email.eq(email))
                    .set(qUser.password, password).execute();

            return 200;
        }
        return 401;
    }

    public List<User> selectUserAll() {
        return jpaQueryFactory.selectFrom(qUser).where(qUser.isDeleted.eq(false)).fetch();
    }

    public List<User> selectDeletedUserAll() {
        return jpaQueryFactory.selectFrom(qUser).where(qUser.isDeleted.eq(true)).fetch();
    }

    public User selectUser(Long userId) {
        return jpaQueryFactory.selectFrom(qUser).where(qUser.id.eq(userId), qUser.isDeleted.eq(false)).fetchOne();
    }

    @Transactional
    public int resetUserProject(Long userId) {
        if (valid.isUserValid(userId)) {
            jpaQueryFactory.update(qUser).where(qUser.id.eq(userId))
                    .set(qUser.projectId, 0l)
                    .set(qUser.projectPosition, "")
                    .set(qUser.projectJoinStatus, "").execute();

            return 200;
        }
        return 401;
    }

//    @Transactional
    public List<User> selectRoomUsers(Long roomId) {
        return jpaQueryFactory.selectFrom(qUser)
                .where(qUser.roomId.eq(roomId), qUser.isDeleted.eq(false))
                .fetch();
    }

    @Transactional
    public void quitUserRoom(Long userId){
        jpaQueryFactory.update(qUser)
                .set(qUser.roomId, 0l)
                .where(qUser.id.eq(userId))
                .execute();
    }

    @Transactional
    public void joinUserRoom(Long userId, Long roomId){
        jpaQueryFactory.update(qUser)
                .set(qUser.roomId, roomId)
                .where(qUser.id.eq(userId))
                .execute();
    }

}
