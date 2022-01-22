package com.ssafy.db.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.api.request.ProjectUpdatePostReq;
import com.ssafy.db.entity.Project;
import com.ssafy.db.entity.QProject;
import com.ssafy.db.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
public class ProjectRepositorySupport {

    @Autowired
    JPAQueryFactory jpaQueryFactory;

    QProject qProject=QProject.project;

    public boolean isValid(Long id){
        Project project = jpaQueryFactory.select(qProject).from(qProject)
                .where(qProject.id.eq(id), qProject.isDeleted.eq(false)).fetchOne();
        if (project==null){
            return false;
        }
        return true;
    }

    @Transactional
    public void deleteProject(Long id) {
        // isDelete=true
        jpaQueryFactory.update(qProject).where(qProject.id.eq(id))
                .set(qProject.isDeleted, true).execute();
    }

    @Transactional
    public int updateProject(ProjectUpdatePostReq projectUpdateInfo){

        Long projectId=projectUpdateInfo.getId();
        if (isValid(projectId)) {
            String collectStatus=(projectUpdateInfo.getCollectStatus());
            String description=(projectUpdateInfo.getDescription());
            int size=(projectUpdateInfo.getSize());
            String title=(projectUpdateInfo.getTitle());
            String startDate=(projectUpdateInfo.getStartDate());
            String endDate=(projectUpdateInfo.getEndDate());
            int totalFrontendSize=projectUpdateInfo.getTotalFrontendSize();
            int totalBackendSize=projectUpdateInfo.getTotalBackendSize();
            int totalMobileSize=projectUpdateInfo.getTotalMobileSize();
            int totalEmbeddedSize=projectUpdateInfo.getTotalEmbeddedSize();
            jpaQueryFactory.update(qProject).where(qProject.id.eq(projectId))
                    .set(qProject.collectStatus, collectStatus).set(qProject.size, size)
                    .set(qProject.description, description).set(qProject.title, title)
                    .set(qProject.startDate, startDate).set(qProject.endDate, endDate)
                    .set(qProject.totalBackendSize, totalBackendSize)
                    .set(qProject.totalFrontendSize, totalFrontendSize)
                    .set(qProject.totalMobileSize, totalMobileSize)
                    .set(qProject.totalEmbeddedSize, totalEmbeddedSize).execute();

            return 200;
        }
        return 401;
    }
}
