package com.ssafy.db.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.api.request.StudyUpdateReq;
import com.ssafy.db.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public class StudyRepositorySupport {

    @Autowired
    JPAQueryFactory jpaQueryFactory;

    @Autowired
    UserStudyRepository userStudyRepository;
    
    @Autowired
    ValidRepository valid;

    QStudy qStudy=QStudy.study;
    QUser qUser=QUser.user;
    QUserStudy qUserStudy=QUserStudy.userStudy;

    @Transactional
    public void deleteStudy(Long userId, Long studyId) {
        // isDelete=true

        jpaQueryFactory.update(qStudy).where(
                qStudy.id.eq(studyId),
                        qStudy.hostId.eq(userId)
                )
                .set(qStudy.isDeleted, true).execute();
    }

    @Transactional
    public int updateStudy(StudyUpdateReq studyUpdateInfo){

        Long studyId=studyUpdateInfo.getStudyId();
        Long hostId=studyUpdateInfo.getHostId();
        if (!valid.isUserValid(hostId)){
            return 401;
        }

        Study study = jpaQueryFactory.selectFrom(qStudy).where(qStudy.id.eq(studyId), qStudy.isDeleted.eq(false)).fetchOne();
        if (study==null || study.getHostId()!=hostId){
            return 402;
        }

        jpaQueryFactory.update(qStudy).where(qStudy.id.eq(studyId))
                .set(qStudy.title, studyUpdateInfo.getTitle())
                .set(qStudy.description, studyUpdateInfo.getDescription())
                .set(qStudy.collectStatus, studyUpdateInfo.getCollectStatus())
                .set(qStudy.schedule, studyUpdateInfo.getSchedule())
                .set(qStudy.size, studyUpdateInfo.getSize())
                .execute();

        return 200;
    }

    public List<Study> selectByHost(Long userId) {
       return jpaQueryFactory.selectFrom(qStudy)
               .where(qStudy.isDeleted.eq(false), qStudy.hostId.eq(userId)).fetch();
    }

    public List<Study> selectByUser(Long userId) {
        return jpaQueryFactory.select(qStudy).from(qUserStudy, qStudy)
                .where(qUserStudy.userId.eq(userId), qUserStudy.studyJoinStatus.equalsIgnoreCase("OK"),
                        qUserStudy.studyId.eq(qStudy.id), qStudy.isDeleted.eq(false))
                .fetch();

    }

    @Transactional
    public Study selectStudy(Long studyId) {
        Study result = jpaQueryFactory.selectFrom(qStudy)
                .where(qStudy.id.eq(studyId), qStudy.isDeleted.eq(false)).fetchOne();
        if (result==null){
            return null;
        }
        // 조회수 증가
        jpaQueryFactory.update(qStudy).where(qStudy.id.eq(studyId))
                .set(qStudy.hit, qStudy.hit.add(1))
                .execute();

        return result;
    }


    public List<Study> selectStudyAll() {
        return jpaQueryFactory.selectFrom(qStudy).where(qStudy.isDeleted.eq(false)).orderBy(qStudy.id.desc()).fetch();
    }

    public List<User> selectStudyUsers(Long studyId) {
        return jpaQueryFactory.select(qUser).from(qUser, qUserStudy)
                .where(qUserStudy.studyId.eq(studyId), qUserStudy.studyJoinStatus.eq("ok"),
                        qUser.id.eq(qUserStudy.userId), qUser.isDeleted.eq(false))
                .fetch();
    }

    public List<Study> selectByTitle(String title) {
        return jpaQueryFactory.selectFrom(qStudy)
                .where(qStudy.isDeleted.eq(false), qStudy.title.contains(title)).fetch();
    }

    public List<User> selectJoinUsers(Long studyId) {
        return jpaQueryFactory.select(qUser).from(qUser, qUserStudy)
                .where(qUserStudy.studyId.eq(studyId), qUserStudy.studyJoinStatus.eq("BEFORE"),
                        qUser.id.eq(qUserStudy.userId), qUser.isDeleted.eq(false))
                .fetch();
    }

    @Transactional
    public int updateStudyHost(Long studyId, Long newHostId) {
        jpaQueryFactory.update(qStudy).where(qStudy.id.eq(studyId))
                .set(qStudy.hostId, newHostId)
                .execute();

        return 200;
    }

    public int joinUserStudy(Long userId, Long studyId, String studyJoinStatus) {
        UserStudy userStudy = jpaQueryFactory.selectFrom(qUserStudy)
                .where(qUserStudy.userId.eq(userId), qUserStudy.studyId.eq(studyId),
                        (qUserStudy.studyJoinStatus.equalsIgnoreCase("OK").or(qUserStudy.studyJoinStatus.equalsIgnoreCase("before"))))
                .fetchOne();
        if (userStudy!=null){
            return 403;
        }
        userStudy=new UserStudy();
        userStudy.setUserId(userId);
        userStudy.setStudyId(studyId);
        userStudy.setStudyJoinStatus(studyJoinStatus);
        userStudyRepository.save(userStudy);
        return 200;
    }

    @Transactional
    public void quitStudy(Long userId, Long studyId) {
        jpaQueryFactory.delete(qUserStudy)
                .where(qUserStudy.studyId.eq(studyId), qUserStudy.userId.eq(userId))
                .execute();

    }

    @Transactional
    public int approveStudy(Long userId, Long studyId, String joinTag) {
        jpaQueryFactory.update(qUserStudy)
                .where(qUserStudy.userId.eq(userId), qUserStudy.studyId.eq(studyId))
                .set(qUserStudy.studyJoinStatus, joinTag)
                .execute();

        return 200;
    }

    public UserStudy selectUserStudy(Long userId, Long studyId) {
        return jpaQueryFactory.selectFrom(qUserStudy)
                .where(qUserStudy.userId.eq(userId), qUserStudy.studyId.eq(studyId))
                .fetchOne();
    }
}
