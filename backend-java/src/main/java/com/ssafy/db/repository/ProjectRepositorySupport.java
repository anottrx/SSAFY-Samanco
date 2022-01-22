package com.ssafy.db.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.api.model.PositionDto;
import com.ssafy.api.model.ProjectDto;
import com.ssafy.api.request.ProjectDeletePostReq;
import com.ssafy.api.request.ProjectUpdatePostReq;
import com.ssafy.db.entity.Project;
import com.ssafy.db.entity.QProject;
import com.ssafy.db.entity.QUser;
import com.ssafy.db.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ProjectRepositorySupport {

    @Autowired
    JPAQueryFactory jpaQueryFactory;

    QProject qProject=QProject.project;

    QUser qUser=QUser.user;

    public boolean isValid(Long id){
        Project project = jpaQueryFactory.select(qProject).from(qProject)
                .where(qProject.id.eq(id), qProject.isDeleted.eq(false)).fetchOne();
        if (project==null){
            return false;
        }
        return true;
    }

    @Transactional
    public void deleteProject(Long userId, Long projectId) {
        // isDelete=true

        jpaQueryFactory.update(qProject).where(
                qProject.id.eq(projectId),
                        qProject.hostId.eq(userId)
                )
                .set(qProject.isDeleted, true).execute();
    }

    @Transactional
    public int updateProject(ProjectUpdatePostReq projectUpdateInfo){

        Long projectId=projectUpdateInfo.getId();
        Long hostId=projectUpdateInfo.getHostId();
        if (isValid(hostId)&&isValid(projectId)) {
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

    public Project selectByHost(Long userId) {
        if (isValid(userId)){
            Long projectId = jpaQueryFactory.select(qUser.projectId).from(qUser).fetchOne();
            if (isValid(projectId)) {
                return jpaQueryFactory.selectFrom(qProject).where(qProject.id.eq(projectId)).fetchOne();
            }
        }
        return null;
    }

    public ProjectDto selectProject(Long projectId) {
        Project result = jpaQueryFactory.selectFrom(qProject).where(qProject.id.eq(projectId)).fetchOne();
        List<PositionDto> positionDtos=new ArrayList<>();
        positionDtos.add(new PositionDto("FRONTEND", result.getTotalFrontendSize()));

//                [{"total_frontend": 3}, {"current_frontend": 1}]

    }
}
