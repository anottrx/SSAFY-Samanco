package com.ssafy.api.service;

import com.ssafy.api.model.StudyDto;
import com.ssafy.api.request.StudyRegisterReq;
import com.ssafy.api.request.StudyUpdateReq;
import com.ssafy.db.entity.Study;
import com.ssafy.db.entity.UserLike;
import com.ssafy.db.entity.UserStudy;
import com.ssafy.db.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class StudyServiceImpl implements StudyService {

    @Autowired
    StudyRepository studyRepository;

    @Autowired
    StudyRepositorySupport studyRepositorySupport;

    @Autowired
    StackRepositorySupport stackRepositorySupport;

    @Autowired
    FileRepositorySupport fileRepositorySupport;

    @Autowired
    ValidRepository valid;

    @Autowired
    UserLikeRepositorySupport userLikeRepositorySupport;

//    @Autowired
//    UserRepositorySupport userRepositorySupport;  // 사용 못함

//    @Autowired
//    PasswordEncoder passwordEncoder;

    @Override
    public Study createStudy(StudyRegisterReq studyRegisterReq) {
        Study study = new Study();
        study.setHostId(studyRegisterReq.getHostId());
        study.setCollectStatus(studyRegisterReq.getCollectStatus());
        study.setDescription(studyRegisterReq.getDescription());
        study.setSchedule(studyRegisterReq.getSchedule());
        study.setSize(studyRegisterReq.getSize());
        study.setTitle(studyRegisterReq.getTitle());

        return studyRepository.save(study);
    }

    @Override
    public int updateStudy(StudyUpdateReq updateInfo) {
        return studyRepositorySupport.updateStudy(updateInfo);
    }

    @Override
    public int deleteStudy(Long userId, Long studyId) {
        if (!valid.isUserValid(userId)){
            return 401;
        }
        if (!valid.isStudyValid(studyId)){
            return 402;
        }
        Study study = studyRepositorySupport.selectStudy(studyId);
        if (study==null || study.getHostId()!=userId){
            return 402;
        }
        studyRepositorySupport.deleteStudy(userId, studyId);
        stackRepositorySupport.deleteStack(studyId, "study");
        fileRepositorySupport.deleteFile(studyId, "study");
        return 200;
    }

    @Override
    public List<StudyDto> selectByHost(Long userId) {
        List<Study> results = studyRepositorySupport.selectByHost(userId);
        if (results.size()==0){
            return null;
        }
        List<StudyDto> studies=new ArrayList<>();
        for (Study result: results) {
            StudyDto study=studyEntityToDto(result);
            Long studyId=study.getId();
            study.setStacks(stackRepositorySupport.selectStack(studyId, "study"));
            study.setFile(fileRepositorySupport.selectFile(studyId, "study"));
            studies.add(study);
        }

        return studies;
    }

    @Override
    public StudyDto selectStudy(Long userId, Long studyId) {
        Study result=studyRepositorySupport.selectStudy(studyId);
        if (result==null){
            return null;
        }
        StudyDto study=studyEntityToDto(result);
        study.setStacks(stackRepositorySupport.selectStack(studyId, "study"));
        study.setFile(fileRepositorySupport.selectFile(studyId, "study"));
        UserLike userLike = userLikeRepositorySupport.userLike(userId, studyId, "study");
        UserStudy userStudy = studyRepositorySupport.selectUserStudy(userId, studyId);
        if (userLike!=null) {
            study.setUserLike(true);
        }
        if (userStudy!=null){
            study.setStudyJoinStatus(userStudy.getStudyJoinStatus());
        }

        return study;
    }

    @Override
    public List<StudyDto> selectByUser(Long userId) {
        List<Study> results = studyRepositorySupport.selectByUser(userId);
        if (results==null || results.size()==0){
            return null;
        }
        List<StudyDto> studies=new ArrayList<>();
        for (Study result: results){
            StudyDto studyDto=studyEntityToDto(result);
            studyDto.setStacks(stackRepositorySupport.selectStack(result.getId(), "study"));
            studyDto.setFile(fileRepositorySupport.selectFile(result.getId(), "study"));
            studies.add(studyDto);
        }

        return studies;
    }

    @Override
    public List<StudyDto> selectStudyAll() {
        List<Study> results = studyRepositorySupport.selectStudyAll();
        if (results.size()==0){
            return null;
        }
        List<StudyDto> studies=new ArrayList<>();
        for (Study result: results) {
            StudyDto study=studyEntityToDto(result);
            Long studyId=study.getId();
            study.setStacks(stackRepositorySupport.selectStack(studyId, "study"));
            study.setFile(fileRepositorySupport.selectFile(studyId, "study"));
            studies.add(study);
        }

        return studies;
    }

    @Override
    public StudyDto studyEntityToDto(Study result) {

        // like
        int likes=userLikeRepositorySupport.countUserLikeByTarget(result.getId(), "study");

        StudyDto studyDto=new StudyDto();
        studyDto.setId(result.getId());
        studyDto.setDescription(result.getDescription());
        studyDto.setHostId(result.getHostId());
        studyDto.setHit(result.getHit());
        studyDto.setTitle(result.getTitle());
        studyDto.setCollectStatus(result.getCollectStatus());
        studyDto.setSchedule(result.getSchedule());
        studyDto.setLikes(likes);

        return  studyDto;
    }

    @Override
    public List<StudyDto> selectStudyByTitle(String title) {
        List<Study> results=studyRepositorySupport.selectByTitle(title);
        if (results==null){
            return null;
        }
        List<StudyDto> studies=new ArrayList<>();
        for (Study result: results) {
            StudyDto study=studyEntityToDto(result);
            Long studyId=study.getId();
            study.setStacks(stackRepositorySupport.selectStack(studyId, "study"));
            study.setFile(fileRepositorySupport.selectFile(studyId, "study"));
            studies.add(study);
        }

        return studies;

    }

    @Override
    public List<StudyDto> selectStudyLikeOrder() {
        List<Study> results=studyRepositorySupport.selectStudyAll();
        if (results.size()==0){
            return null;
        }
        List<StudyDto> studies=new ArrayList<>();
        for (Study result: results) {
            StudyDto study=studyEntityToDto(result);
            Long studyId=study.getId();
            study.setStacks(stackRepositorySupport.selectStack(studyId, "study"));
            study.setFile(fileRepositorySupport.selectFile(studyId, "study"));
            studies.add(study);
        }

        Collections.sort(studies, new Comparator<StudyDto>() {
            @Override
            public int compare(StudyDto o1, StudyDto o2) {
                return (int) (o2.getLikes()-o1.getLikes());
            }
        });

        return studies;
    }


    @Override
    public int updateStudyHost(Long studyId, Long newHostId) {
        return studyRepositorySupport.updateStudyHost(studyId, newHostId);
    }

    @Override
    public int joinUserStudy(Long userId, Long studyId, String studyJoinStatus) {
        if (!valid.isUserValid(userId)){
            return 401;
        }
        if (!valid.isStudyValid(studyId)){
            return 402;
        }

        return studyRepositorySupport.joinUserStudy(userId, studyId, studyJoinStatus);
    }

    @Override
    public int approveUserStudy(Long hostId, Long userId, Long studyId, String joinTag) {
        if (!valid.isUserValid(userId) || !valid.isUserValid(hostId)){
            return 401;
        }
        if (!valid.isStudyValid(studyId)){
            return 402;
        }
        Study study = studyRepositorySupport.selectStudy(studyId);
        if (!study.getHostId().equals(hostId)){
            return 401;
        }

        UserStudy userStudy = studyRepositorySupport.selectUserStudy(userId, studyId);
        if (userStudy==null){
            return 403;
        }
        return studyRepositorySupport.approveStudy(userId, studyId, joinTag);
    }

    @Override
    public int quitStudy(Long userId, Long studyId) {
        UserStudy userStudy = studyRepositorySupport.selectUserStudy(userId, studyId);
        if (userStudy==null || !"ok".equalsIgnoreCase(userStudy.getStudyJoinStatus())){
            return 401;
        }
        Study study = studyRepositorySupport.selectStudy(studyId);
        if (study==null){
            return 402;
        }
        System.out.println(study+" "+ userId);
        if (study.getHostId().equals(userId)){
            return 403;
        }
        studyRepositorySupport.quitStudy(userId, studyId);
        return 200;
    }

    @Override
    public int joinCancelStudy(Long userId, Long studyId) {
        UserStudy userStudy = studyRepositorySupport.selectUserStudy(userId, studyId);
        if (userStudy==null || !"before".equalsIgnoreCase(userStudy.getStudyJoinStatus())){
            return 401;
        }
        Study study = studyRepositorySupport.selectStudy(studyId);
        if (study==null){
            return 402;
        }

        studyRepositorySupport.quitStudy(userId, studyId);
        return 200;
    }

    @Override
    public int changeHostStudy(Long studyId, Long oldHostId, Long newHostId) {
        Study study = studyRepositorySupport.selectStudy(studyId);
        if (study==null || study.getHostId()!=oldHostId){
            return 401;
        }
        UserStudy userStudy = studyRepositorySupport.selectUserStudy(newHostId, studyId);
        if (userStudy==null){
            return 402;
        }

        studyRepositorySupport.updateStudyHost(studyId, newHostId);
        return 200;
    }

}
