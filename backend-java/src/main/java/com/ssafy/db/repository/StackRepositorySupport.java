package com.ssafy.db.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.db.entity.Files;
import com.ssafy.db.entity.QStackGrade;
import com.ssafy.db.entity.StackGrade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public class StackRepositorySupport {

    @Autowired
    private JPAQueryFactory jpaQueryFactory;

    QStackGrade qStackGrade=QStackGrade.stackGrade;

    @Transactional
    public void deleteStack(Long userId) {
        List<StackGrade> results = jpaQueryFactory.selectFrom(qStackGrade).where(qStackGrade.userId.eq(userId)).fetch();
        for (StackGrade stackGrade: results) {
            jpaQueryFactory.delete(qStackGrade).where(qStackGrade.eq(stackGrade)).execute();
        }
    }
}
