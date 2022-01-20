package com.ssafy.db.repository;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.db.entity.Files;
import com.ssafy.db.entity.QFiles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public class FileRepositorySupport {

    @Autowired
    JPAQueryFactory jpaQueryFactory;

    QFiles qFiles=QFiles.files;

    @Transactional
    public void userDeleteFile(Long userId) {
        List<Files> results = jpaQueryFactory.selectFrom(qFiles).where(qFiles.userId.eq(userId)).fetch();
        for (Files file: results){
            jpaQueryFactory.delete(qFiles).where(qFiles.eq(file)).execute();
        }
    }
}
