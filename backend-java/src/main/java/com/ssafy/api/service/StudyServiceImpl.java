package com.ssafy.api.service;

import com.ssafy.api.model.PositionDto;
import com.ssafy.api.model.StudyDto;
import com.ssafy.api.model.UserDto;
import com.ssafy.api.request.StudyRegisterReq;
import com.ssafy.api.request.StudyUpdateReq;
import com.ssafy.db.entity.Study;
import com.ssafy.db.entity.User;
import com.ssafy.db.entity.UserLike;
import com.ssafy.db.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
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
    public void deleteStudy(Long userId, Long studyId) {
        studyRepositorySupport.deleteStudy(userId, studyId);
        stackRepositorySupport.deleteStack(studyId, "study");
        fileRepositorySupport.deleteFile(studyId, "study");
    }

    @Override
    public StudyDto selectByHost(Long userId) {
        Study result = studyRepositorySupport.selectByHost(userId);
        if (result==null){
            return null;
        }
        StudyDto study=studyEntityToDto(result);
        Long studyId=study.getId();
        study.setStacks(stackRepositorySupport.selectStack(studyId, "study"));
        study.setFile(fileRepositorySupport.selectFile(studyId, "study"));

        return study;
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
        if (userLike!=null) {
            study.setUserLike(true);
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
        return studyRepositorySupport.joinUserStudy(userId, studyId, studyJoinStatus);
    }

    @Override
    public int approveUserStudy(Long hostId, Long userId, Long studyId, String joinTag) {
        Study study = studyRepositorySupport.selectStudy(studyId);
        if (study==null || study.getId()!=studyId || study.getHostId()!=hostId){
            return 401;
        }

        return 0;
    }

    @Override
    public int quitStudy(Long userId, Long studyId) {
//        if (!valid.isUserValid(userId)){
//            return 401;
//        }
        studyRepositorySupport.quitStudy(userId, studyId);
        return 200;
    }

    @Override
    public int joinCancelStudy(Long userId, Long studyId) {
//        if (!valid.isUserValid(userId)){
//            return 401;
//        }
        studyRepositorySupport.quitStudy(userId, studyId);
        return 200;
    }

}
