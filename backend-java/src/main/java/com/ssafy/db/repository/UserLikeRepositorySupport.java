package com.ssafy.db.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.db.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
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

    public UserLike userLike(Long userId, Long tagId, String tag) {
        return jpaQueryFactory.selectFrom(qUserLike)
                .where(qUserLike.userId.eq(userId), qUserLike.tagId.eq(tagId), qUserLike.tag.equalsIgnoreCase(tag))
                .fetchOne();
    }

    @Transactional
    public void deleteUserLike(Long userId, Long tagId, String tag) {
        jpaQueryFactory.delete(qUserLike)
                .where(qUserLike.userId.eq(userId), qUserLike.tagId.eq(tagId), qUserLike.tag.equalsIgnoreCase(tag))
                .execute();
    }

    public int countUserLikeByTarget(Long tagId, String tag) {
            return jpaQueryFactory.selectFrom(qUserLike)
                .where(qUserLike.tagId.eq(tagId), qUserLike.tag.equalsIgnoreCase(tag)).fetch().size();

    }

}
