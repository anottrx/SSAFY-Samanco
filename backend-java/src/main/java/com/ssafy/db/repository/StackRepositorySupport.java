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
    public void deleteStack(Long tagId, String tag) {
        List<StackGrade> results = jpaQueryFactory.selectFrom(qStackGrade)
                .where(qStackGrade.tagId.eq(tagId), qStackGrade.tag.equalsIgnoreCase(tag)).fetch();

        for (StackGrade stackGrade: results) {
            jpaQueryFactory.delete(qStackGrade).where(qStackGrade.eq(stackGrade)).execute();
        }
    }

    public List<StackGradeDto> selectStack(Long tagId, String tag) {
        List<StackGrade> results = jpaQueryFactory.selectFrom(qStackGrade)
                .where(qStackGrade.tagId.eq(tagId), qStackGrade.tag.equalsIgnoreCase(tag)).fetch();;

        List<StackGradeDto> stacks=new ArrayList<>();
        for (StackGrade stackGrade: results) {
            stacks.add(new StackGradeDto(stackGrade.getName(), stackGrade.getGrade()));
        }
        return stacks;
    }

    public List<String> selectStackAll(String tag) {
        List<String> results = jpaQueryFactory.selectDistinct(qStackGrade.name).from(qStackGrade)
                .where(qStackGrade.tag.equalsIgnoreCase(tag)).orderBy(qStackGrade.name.asc()).fetch();;

        List<String> stacks=new ArrayList<>();
        for (String result: results) {
            stacks.add(result);
        }
        return stacks;
    }
}