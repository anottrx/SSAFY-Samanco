package com.ssafy.api.service;

import com.ssafy.api.model.StudyDto;
import com.ssafy.api.model.UserDto;
import com.ssafy.api.request.StudyRegisterReq;
import com.ssafy.api.request.StudyUpdateReq;
import com.ssafy.db.entity.Study;

import java.util.List;

public interface StudyService {

    Study createStudy(StudyRegisterReq studyRegisterReq);
    int updateStudy(StudyUpdateReq updateInfo);
    void deleteStudy(Long userId, Long studyId);
    StudyDto selectByHost(Long userId);
    StudyDto selectStudy(Long userId, Long studyId);
    List<StudyDto> selectByUser(Long userId);
    List<StudyDto> selectStudyAll();
    StudyDto studyEntityToDto(Study entity);
    List<StudyDto> selectStudyByTitle(String title);
    List<StudyDto> selectStudyLikeOrder();
    int updateStudyHost(Long studyId, Long newHostId);
    int joinUserStudy(Long userId, Long studyId, String studyJoinStatus);

    int approveUserStudy(Long hostId, Long userId, Long studyId, String joinTag);

    int quitStudy(Long userId, Long studyId);

    int joinCancelStudy(Long userId, Long studyId);
}
