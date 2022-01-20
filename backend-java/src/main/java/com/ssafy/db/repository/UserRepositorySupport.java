package com.ssafy.db.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.api.request.UserUpdatePostReq;
import com.ssafy.db.entity.QUser;
import com.ssafy.db.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

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

//    public Optional<User> findUserByUserId(String email) {
//        User user = jpaQueryFactory.select(qUser).from(qUser)
//                .where(qUser.email.eq(email)).fetchOne();
//        if(user == null) return Optional.empty();
//        return Optional.ofNullable(user);
//    }

    public User findUserByEmail(String email){
        return jpaQueryFactory.select(qUser).from(qUser)
                .where(qUser.email.eq(email)).fetchOne();
    }

    public User findUserByNickname(String nickname) {
        return jpaQueryFactory.select(qUser).from(qUser)
                .where(qUser.nickname.eq(nickname)).fetchOne();
    }

    @Transactional
    public void updateUser(UserUpdatePostReq userUpdateInfo) {
//        User user=jpaQueryFactory.select(qUser).from(qUser)
//                .where(qUser.id.eq(userUpdateInfo.getUserId())).fetchOne();

        Long userId=userUpdateInfo.getUserId();
        String password=passwordEncoder.encode(userUpdateInfo.getPassword());
        String phone=userUpdateInfo.getPhone();
        String name=userUpdateInfo.getName();
        String birthday=(userUpdateInfo.getBirthday());
        String description=(userUpdateInfo.getDescription());
        String nickname=(userUpdateInfo.getNickname());
        int generation=(userUpdateInfo.getGeneration());
        String link=(userUpdateInfo.getLink());
        String studentId=(userUpdateInfo.getStudentId());

        jpaQueryFactory.update(qUser).where(qUser.id.eq(userId))
                .set(qUser.name, name).set(qUser.password, password).set(qUser.phone, phone).set(qUser.birthday, birthday)
                .set(qUser.description, description).set(qUser.description, description).set(qUser.nickname, nickname)
                .set(qUser.generation, generation).set(qUser.link, link).set(qUser.studentId, studentId).execute();
    }
}
