package com.ssafy.api.service;

import com.ssafy.api.request.ProjectRegisterPostReq;
import com.ssafy.api.request.ProjectUpdatePostReq;
import com.ssafy.db.entity.Project;
import com.ssafy.db.repository.ProjectRepository;
import com.ssafy.db.repository.ProjectRepositorySupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    ProjectRepository projectRepository;

    @Autowired
    ProjectRepositorySupport projectRepositorySupport;

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
    public void updateProject(ProjectUpdatePostReq updateInfo) {
        projectRepositorySupport.updateProject(updateInfo);
    }
}
