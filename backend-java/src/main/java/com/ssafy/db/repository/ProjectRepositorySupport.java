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

    @Autowired
    ValidRepository valid;

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
        User host = jpaQueryFactory.selectFrom(qUser).where(qUser.id.eq(hostId), qUser.isDeleted.eq(false)).fetchOne();
        if (host==null){
            return 402;
        }
        jpaQueryFactory.update(qUser).where(qUser.id.eq(hostId))
                .set(qUser.projectPosition, projectUpdateInfo.getHostPosition())
                .execute();

        if (!isValid(projectId)) {
            return 401;
        }
        String collectStatus=(projectUpdateInfo.getCollectStatus());
        String description=(projectUpdateInfo.getDescription());
//        int size=(projectUpdateInfo.getTotalSize());
        String title=(projectUpdateInfo.getTitle());
        String startDate=(projectUpdateInfo.getStartDate());
        String endDate=(projectUpdateInfo.getEndDate());
        String hostPosition= projectUpdateInfo.getHostPosition();
        int totalFrontendSize=projectUpdateInfo.getTotalFrontendSize();
        int totalBackendSize=projectUpdateInfo.getTotalBackendSize();
        int totalMobileSize=projectUpdateInfo.getTotalMobileSize();
        int totalEmbeddedSize=projectUpdateInfo.getTotalEmbeddedSize();
        int totalSize=projectUpdateInfo.getTotalSize();
        jpaQueryFactory.update(qProject).where(qProject.id.eq(projectId))
                .set(qProject.collectStatus, collectStatus)
                .set(qProject.description, description)
                .set(qProject.title, title)
                .set(qProject.startDate, startDate)
                .set(qProject.endDate, endDate)
                .set(qProject.hostPosition, hostPosition)
                .set(qProject.totalBackendSize, totalBackendSize)
                .set(qProject.totalFrontendSize, totalFrontendSize)
                .set(qProject.totalMobileSize, totalMobileSize)
                .set(qProject.totalEmbeddedSize, totalEmbeddedSize)
                .set(qProject.size, totalSize)
                .execute();

        return 200;
    }

    public Project selectByHost(Long userId) {
       return jpaQueryFactory.selectFrom(qProject)
               .where(qProject.isDeleted.eq(false), qProject.hostId.eq(userId)).fetchOne();
    }

    public User selectByUser(Long userId) {
        return jpaQueryFactory.selectFrom(qUser)
                .where(qUser.id.eq(userId), qUser.isDeleted.eq(false), qUser.projectJoinStatus.eq("OK")).fetchOne();
    }

    public Project selectProject(Long projectId) {
        return jpaQueryFactory.selectFrom(qProject)
                .where(qProject.id.eq(projectId), qProject.isDeleted.eq(false)).fetchOne();
    }


    public List<Project> selectProjectAll() {
        return jpaQueryFactory.selectFrom(qProject).where(qProject.isDeleted.eq(false)).fetch();
    }

    @Transactional
    public int joinProject(Long projectId, Long userId, String position) {
        if (!isValid(projectId)){
            return 401;
        }
        jpaQueryFactory.update(qUser).where(qUser.id.eq(userId))
                .set(qUser.projectId, projectId)
                .set(qUser.projectPosition, position)
                .set(qUser.projectJoinStatus, "BEFORE")
                .execute();
//        if ("frontend".equalsIgnoreCase(position)){
//            jpaQueryFactory.update(qProject).where(qProject.id.eq(projectId))
//                .set(qProject.currentFrontendSize, qProject.currentFrontendSize.add(1)).execute();
//        } else if ("backend".equalsIgnoreCase(position)){
//            jpaQueryFactory.update(qProject).where(qProject.id.eq(projectId))
//                    .set(qProject.currentBackendSize, qProject.currentBackendSize.add(1)).execute();
//        } else if ("mobile".equalsIgnoreCase(position)){
//            jpaQueryFactory.update(qProject).where(qProject.id.eq(projectId))
//                    .set(qProject.currentMobileSize, qProject.currentMobileSize.add(1)).execute();
//        } else if ("embedded".equalsIgnoreCase(position)){
//            jpaQueryFactory.update(qProject).where(qProject.id.eq(projectId))
//                    .set(qProject.currentEmbeddedSize, qProject.currentEmbeddedSize.add(1)).execute();
//        }
        return 200;
    }

    public List<User> selectUsers(Long projectId) {
        return jpaQueryFactory.selectFrom(qUser)
                .where(qUser.projectId.eq(projectId), qUser.isDeleted.eq(false), qUser.projectJoinStatus.eq("OK"))
                .fetch();
    }

    public List<Project> selectByTitle(String title) {
        return jpaQueryFactory.selectFrom(qProject)
                .where(qProject.isDeleted.eq(false), qProject.title.contains(title)).fetch();
    }

    public List<Project> selectProjectLikeOrder() {
        return jpaQueryFactory.selectFrom(qProject).where(qProject.isDeleted.eq(false))
                .orderBy(qProject.likes.desc()).fetch();
    }

    @Transactional
    public int updateProjectLike(Long projectId) {
        if (!isValid(projectId)){
            return 401;
        }

        jpaQueryFactory.update(qProject).where(qProject.id.eq(projectId))
                .set(qProject.likes, qProject.likes.add(1))
                .execute();

        return 200;
    }

}
