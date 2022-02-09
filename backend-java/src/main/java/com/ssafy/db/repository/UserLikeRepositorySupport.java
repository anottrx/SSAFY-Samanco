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
    QProject qProject=QProject.project;
    QBoard qBoard=QBoard.board;
    QStudy qStudy=QStudy.study;

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

    @Transactional
    public void minusTagHit(Long tagId, String tag) {   // project, study 좋아요 누를때 상세보기가 불리면서 조회수 증가 방지
        if ("project".equalsIgnoreCase(tag)){
            jpaQueryFactory.update(qProject)
                    .set(qProject.hit, qProject.hit.add(-1))
                    .where(qProject.id.eq(tagId))
                    .execute();
        } else if ("study".equalsIgnoreCase(tag)){
            jpaQueryFactory.update(qStudy)
                    .set(qStudy.hit, qStudy.hit.add(-1))
                    .where(qStudy.id.eq(tagId))
                    .execute();
        }
    }
}
