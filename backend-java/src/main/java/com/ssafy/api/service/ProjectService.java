package com.ssafy.api.service;

import com.ssafy.api.model.PositionDto;
import com.ssafy.api.model.ProjectDto;
import com.ssafy.api.request.ProjectRegisterPostReq;
import com.ssafy.api.request.ProjectUpdatePostReq;
import com.ssafy.db.entity.Project;

import java.util.List;

public interface ProjectService {

    Project createProject(ProjectRegisterPostReq projectRegisterPostReq);

    int updateProject(ProjectUpdatePostReq updateInfo);

    void deleteProject(Long userId, Long projectId);

    Project selectByHost(Long userId);
    ProjectDto selectProject(Long projectId);

}
