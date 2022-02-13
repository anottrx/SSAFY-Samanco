package com.ssafy.api.service;

import com.ssafy.api.model.ProjectDto;
import com.ssafy.api.request.ProjectChangeHostReq;
import com.ssafy.api.request.ProjectRegisterReq;
import com.ssafy.api.request.ProjectUpdateReq;
import com.ssafy.db.entity.Project;

import java.util.List;

public interface ProjectService {

    Project createProject(ProjectRegisterReq projectRegisterReq);

    int updateProject(ProjectUpdateReq updateInfo);

    void deleteProject(Long userId, Long projectId);

    ProjectDto selectByHost(Long userId);
    ProjectDto selectProject(Long userId, Long projectId, int addHit);

    ProjectDto selectByUser(Long userId);
    List<ProjectDto> selectProjectAll();
    ProjectDto projectEntityToDto(Project entity);

    List<ProjectDto> selectProjectByTitle(String title);

    List<ProjectDto> selectProjectLikeOrder();
    List<ProjectDto> selectProjectDeadlineOrder();
    int updateProjectHost(Long projectId, Long newHostId, String newHostPosition);
}
