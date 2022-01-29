package com.ssafy.db.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.db.entity.QUser;
import com.ssafy.db.entity.QUserLike;
import com.ssafy.db.entity.UserLike;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public class UserLikeRepositorySupport {

    @Autowired
    private JPAQueryFactory jpaQueryFactory;

    QUserLike qUserLike=QUserLike.userLike;

    @Autowired
    ValidRepository valid;

    public UserLike userLike(Long userId, Long targetId, String tag) {
        return jpaQueryFactory.selectFrom(qUserLike)
                .where(qUserLike.userId.eq(userId), qUserLike.targetId.eq(targetId), qUserLike.tag.equalsIgnoreCase(tag))
                .fetchOne();
    }

    @Transactional
    public void deleteUserLike(Long userId, Long targetId, String tag) {
        jpaQueryFactory.delete(qUserLike)
                .where(qUserLike.userId.eq(userId), qUserLike.targetId.eq(targetId), qUserLike.tag.equalsIgnoreCase(tag))
                .execute();
    }

    public int countUserLikeByTarget(Long targetId, String tag) {
        return jpaQueryFactory.selectFrom(qUserLike)
                .where(qUserLike.targetId.eq(targetId), qUserLike.tag.equalsIgnoreCase(tag)).fetch().size();
    }
}
