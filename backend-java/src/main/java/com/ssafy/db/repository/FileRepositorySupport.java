package com.ssafy.db.repository;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.api.model.FileDto;
import com.ssafy.db.entity.Files;
import com.ssafy.db.entity.QFiles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@Repository
public class FileRepositorySupport {

    @Autowired
    JPAQueryFactory jpaQueryFactory;

    QFiles qFiles=QFiles.files;

    @Transactional
    public void deleteFile(Long tagId, String tag) {
        List<Files> results=jpaQueryFactory.selectFrom(qFiles)
                .where(qFiles.tagId.eq(tagId), qFiles.tag.equalsIgnoreCase(tag)).fetch();

        for (Files file: results){
            jpaQueryFactory.delete(qFiles).where(qFiles.eq(file)).execute();
        }
    }

    public FileDto selectFile(Long tagId, String tag){
        Files result=jpaQueryFactory.selectFrom(qFiles)
                .where(qFiles.tagId.eq(tagId), qFiles.tag.equalsIgnoreCase(tag)).fetchOne();

        if (result==null){
            return null;
        }
        FileDto file=new FileDto();
        file.setSaveFile(result.getSaveFile());
        file.setOriginFile(result.getOriginFile());
        file.setSaveFolder(result.getSaveFolder());
        return file;
    }

    public List<FileDto> selectFiles(Long tagId, String tag){
        List<Files> results=jpaQueryFactory.selectFrom(qFiles)
                .where(qFiles.tagId.eq(tagId), qFiles.tag.equalsIgnoreCase(tag)).fetch();

        List<FileDto> files=new ArrayList<>();
        for (Files result: results) {
            FileDto file = new FileDto();
            file.setSaveFile(result.getSaveFile());
            file.setOriginFile(result.getOriginFile());
            file.setSaveFolder(result.getSaveFolder());
            files.add(file);
        }
        return files;
    }
}
