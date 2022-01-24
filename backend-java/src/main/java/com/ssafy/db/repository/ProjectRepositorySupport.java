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
import org.springframework.security.core.parameters.P;
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

    public Long selectByHost(Long userId) {
        if (isValid(userId)){
            return jpaQueryFactory.select(qUser.projectId).from(qUser).where(qUser.id.eq(userId)).fetchOne();
        }
        return null;
    }

    public ProjectDto selectProject(Long projectId) {
        Project result = jpaQueryFactory.selectFrom(qProject)
                .where(qProject.id.eq(projectId), qProject.isDeleted.eq(false)).fetchOne();
        if (result==null){
            return null;
        }
        List<PositionDto> positions=new ArrayList<>();
        positions.add(new PositionDto("totalFrontend", result.getTotalFrontendSize()));
        positions.add(new PositionDto("totalBackend", result.getTotalBackendSize()));
        positions.add(new PositionDto("totalMobile", result.getTotalMobileSize()));
        positions.add(new PositionDto("totalEmbedded", result.getTotalEmbeddedSize()));
        positions.add(new PositionDto("currentFrontend", result.getCurrentFrontendSize()));
        positions.add(new PositionDto("currentBackend", result.getCurrentBackendSize()));
        positions.add(new PositionDto("currentMobile", result.getCurrentMobileSize()));
        positions.add(new PositionDto("currentEmbedded", result.getCurrentEmbeddedSize()));
        positions.add(new PositionDto("totalSize", result.getSize()));
        ProjectDto projectDto=new ProjectDto();
        projectDto.setDescription(result.getDescription());
        projectDto.setEndDate(result.getEndDate());
        projectDto.setHostId(result.getHostId());
        projectDto.setHit(result.getHit());
        projectDto.setStartDate(result.getStartDate());
        projectDto.setTitle(result.getTitle());
        projectDto.setCollectStatus(result.getCollectStatus());
        projectDto.setId(result.getId());
        projectDto.setLikes(result.getLikes());
        projectDto.setPositions(positions);

        return projectDto;
    }

    public Long selectByUser(Long userId) {
        if (isValid(userId)){
            return jpaQueryFactory.select(qUser.projectId).from(qUser).where(qUser.id.eq(userId)).fetchOne();
        }
        return null;
    }

    public List<Project> selectProjectAll() {
        return jpaQueryFactory.selectFrom(qProject).where(qProject.isDeleted.eq(false)).fetch();
    }

    @Transactional
    public int joinProject(Long projectId, String position) {
        if ("frontend".equalsIgnoreCase(position)){
            jpaQueryFactory.update(qProject).where(qProject.id.eq(projectId))
                .set(qProject.currentFrontendSize, qProject.currentFrontendSize.add(1)).execute();
        } else if ("backend".equalsIgnoreCase(position)){
            jpaQueryFactory.update(qProject).where(qProject.id.eq(projectId))
                    .set(qProject.currentBackendSize, qProject.currentBackendSize.add(1)).execute();
        } else if ("mobile".equalsIgnoreCase(position)){
            jpaQueryFactory.update(qProject).where(qProject.id.eq(projectId))
                    .set(qProject.currentMobileSize, qProject.currentMobileSize.add(1)).execute();
        } else if ("embedded".equalsIgnoreCase(position)){
            jpaQueryFactory.update(qProject).where(qProject.id.eq(projectId))
                    .set(qProject.currentEmbeddedSize, qProject.currentEmbeddedSize.add(1)).execute();
        }
        return 200;
    }
}
