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
    public void deleteStack(Long id, int flag) {
        List<StackGrade> results = null;
        if (flag==1){
            results=jpaQueryFactory.selectFrom(qStackGrade).where(qStackGrade.userId.eq(id)).fetch();
        } else if(flag==2){
            results=jpaQueryFactory.selectFrom(qStackGrade).where(qStackGrade.projectId.eq(id)).fetch();
        } else if(flag==3){
            results=jpaQueryFactory.selectFrom(qStackGrade).where(qStackGrade.studyId.eq(id)).fetch();
        }

        for (StackGrade stackGrade: results) {
            jpaQueryFactory.delete(qStackGrade).where(qStackGrade.eq(stackGrade)).execute();
        }
    }
}
