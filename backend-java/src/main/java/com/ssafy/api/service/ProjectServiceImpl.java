package com.ssafy.api.service;

import com.ssafy.api.model.PositionDto;
import com.ssafy.api.model.ProjectDto;
import com.ssafy.api.request.ProjectDeletePostReq;
import com.ssafy.api.request.ProjectRegisterPostReq;
import com.ssafy.api.request.ProjectUpdatePostReq;
import com.ssafy.db.entity.Project;
import com.ssafy.db.repository.FileRepositorySupport;
import com.ssafy.db.repository.ProjectRepository;
import com.ssafy.db.repository.ProjectRepositorySupport;
import com.ssafy.db.repository.StackRepositorySupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    ProjectRepository projectRepository;

    @Autowired
    ProjectRepositorySupport projectRepositorySupport;

    @Autowired
    StackRepositorySupport stackRepositorySupport;

    @Autowired
    FileRepositorySupport fileRepositorySupport;

    @Override
    public Project createProject(ProjectRegisterPostReq projectRegisterPostReq) {
        Project project = new Project();
        project.setHostId(projectRegisterPostReq.getHostId());
        project.setCollectStatus(projectRegisterPostReq.getCollectStatus());
        project.setDescription(projectRegisterPostReq.getDescription());
        project.setSize(projectRegisterPostReq.getSize());
        project.setCollectStatus(projectRegisterPostReq.getCollectStatus());
        project.setTitle(projectRegisterPostReq.getTitle());
        project.setStartDate(projectRegisterPostReq.getStartDate());
        project.setEndDate(projectRegisterPostReq.getEndDate());
        project.setTotalBackendSize(projectRegisterPostReq.getTotalBackendSize());
        project.setTotalFrontendSize(projectRegisterPostReq.getTotalFrontendSize());
        project.setTotalMobileSize(projectRegisterPostReq.getTotalMobileSize());
        project.setTotalEmbeddedSize(projectRegisterPostReq.getTotalEmbeddedSize());

        return projectRepository.save(project);
    }

    @Override
    public int updateProject(ProjectUpdatePostReq updateInfo) {
        return projectRepositorySupport.updateProject(updateInfo);
    }

    @Override
    public void deleteProject(Long userId, Long projectId) {
        projectRepositorySupport.deleteProject(userId, projectId);
        stackRepositorySupport.deleteStack(projectId, 2);
        fileRepositorySupport.deleteFile(projectId, 2);
    }

    @Override
    public Project selectByHost(Long userId) {
        return projectRepositorySupport.selectByHost(userId);
    }

    @Override
    public ProjectDto selectProject(Long projectId) {
        return projectRepositorySupport.selectProject(projectId);
    }
}
