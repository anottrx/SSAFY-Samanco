package com.ssafy.db.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.db.entity.QStackGrade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class StackRepositorySupport {

    @Autowired
    private JPAQueryFactory jpaQueryFactory;
    QStackGrade qStackGrade=QStackGrade.stackGrade;

}
