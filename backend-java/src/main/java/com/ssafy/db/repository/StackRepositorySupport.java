package com.ssafy.db.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.api.model.StackGradeDto;
import com.ssafy.db.entity.Files;
import com.ssafy.db.entity.QStackGrade;
import com.ssafy.db.entity.StackGrade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    public List<StackGradeDto> selectStack(Long id, int flag) {
        List<StackGrade> results = null;
        if (flag==1){
            results=jpaQueryFactory.selectFrom(qStackGrade).where(qStackGrade.userId.eq(id)).fetch();
        } else if(flag==2){
            results=jpaQueryFactory.selectFrom(qStackGrade).where(qStackGrade.projectId.eq(id)).fetch();
        } else if(flag==3){
            results=jpaQueryFactory.selectFrom(qStackGrade).where(qStackGrade.studyId.eq(id)).fetch();
        }

        List<StackGradeDto> stacks=new ArrayList<>();
        for (StackGrade stackGrade: results) {
            stacks.add(new StackGradeDto(stackGrade.getName(), stackGrade.getGrade()));
        }
        return stacks;
    }
}
