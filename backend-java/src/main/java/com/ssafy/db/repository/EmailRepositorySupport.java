package com.ssafy.db.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.db.entity.EmailCode;
import com.ssafy.db.entity.QEmailCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;


@Repository
public class EmailRepositorySupport {

    @Autowired
    JPAQueryFactory jpaQueryFactory;

    @Autowired
    ValidRepository valid;

    QEmailCode qEmailCode=QEmailCode.emailCode;

    public EmailCode selectEmailCode(String email, String code, String tag) {
        return jpaQueryFactory.selectFrom(qEmailCode)
                .where(qEmailCode.email.eq(email), qEmailCode.code.eq(code), qEmailCode.tag.equalsIgnoreCase(tag)).fetchOne();

    }
}
