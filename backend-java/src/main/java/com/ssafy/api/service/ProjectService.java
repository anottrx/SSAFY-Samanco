package com.ssafy.api.service;

import com.ssafy.api.model.ProjectDto;
import com.ssafy.api.request.ProjectRegisterPostReq;
import com.ssafy.api.request.ProjectUpdatePostReq;
import com.ssafy.db.entity.Project;

import java.text.ParseException;
import java.util.List;

public interface ProjectService {

    Project createProject(ProjectRegisterPostReq projectRegisterPostReq);

    int updateProject(ProjectUpdatePostReq updateInfo);

    void deleteProject(Long userId, Long projectId);

    ProjectDto selectByHost(Long userId);
    ProjectDto selectProject(Long projectId);

    ProjectDto selectByUser(Long userId);

    List<ProjectDto> selectProjectAll();

    int joinProject(Long projectId, Long userId, String position);
    ProjectDto projectEntityToDto(Project entity);

    List<ProjectDto> selectProjectByTitle(String title);

    List<ProjectDto> selectProjectLikeOrder();
    List<ProjectDto> selectProjectDeadlineOrder();

    int updateProjectLike(Long id);
}
