package com.ssafy.api.service;

import com.ssafy.api.model.PositionDto;
import com.ssafy.api.model.ProjectDto;
import com.ssafy.api.request.ProjectDeletePostReq;
import com.ssafy.api.request.ProjectJoinPostReq;
import com.ssafy.api.request.ProjectRegisterPostReq;
import com.ssafy.api.request.ProjectUpdatePostReq;
import com.ssafy.db.entity.Project;
import com.ssafy.db.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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

    @Autowired
    UserRepositorySupport userRepositorySupport;

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
        String hostPosition= projectRegisterPostReq.getHostPosition();
        if ("frontend".equalsIgnoreCase(hostPosition)){
            project.setCurrentFrontendSize(1);
        } else if ("backend".equalsIgnoreCase(hostPosition)){
            project.setCurrentBackendSize(1);
        } else if ("mobile".equalsIgnoreCase(hostPosition)){
            project.setCurrentMobileSize(1);
        } else if ("embedded".equalsIgnoreCase(hostPosition)){
            project.setCurrentEmbeddedSize(1);
        }
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
    public ProjectDto selectByHost(Long userId) {
        Long projectId = projectRepositorySupport.selectByHost(userId);
        if (projectId==null){
            return null;
        }
        return projectRepositorySupport.selectProject(projectId);
    }

    @Override
    public ProjectDto selectProject(Long projectId) {
        ProjectDto project=projectRepositorySupport.selectProject(projectId);
        if (project!=null){
            project.setStacks(stackRepositorySupport.selectStack(projectId, 2));
            return project;
        }
        return null;
    }

    @Override
    public ProjectDto selectByUser(Long userId) {
        Long projectId = projectRepositorySupport.selectByUser(userId);
        if (projectId==null){
            return null;
        }
        return projectRepositorySupport.selectProject(projectId);
    }

    @Override
    public List<ProjectDto> selectProjectAll() {
        List<Project> results = projectRepositorySupport.selectProjectAll();
        List<ProjectDto> projects=new ArrayList<>();
        for (Project result: results) {
            List<PositionDto> positions = new ArrayList<>();
            positions.add(new PositionDto("totalFrontend", result.getTotalFrontendSize()));
            positions.add(new PositionDto("totalBackend", result.getTotalBackendSize()));
            positions.add(new PositionDto("totalMobile", result.getTotalMobileSize()));
            positions.add(new PositionDto("totalEmbedded", result.getTotalEmbeddedSize()));
            positions.add(new PositionDto("currentFrontend", result.getCurrentFrontendSize()));
            positions.add(new PositionDto("currentBackend", result.getCurrentBackendSize()));
            positions.add(new PositionDto("currentMobile", result.getCurrentMobileSize()));
            positions.add(new PositionDto("currentEmbedded", result.getCurrentEmbeddedSize()));
            positions.add(new PositionDto("totalSize", result.getSize()));
            ProjectDto projectDto = new ProjectDto();
            projectDto.setId(result.getId());
            projectDto.setDescription(result.getDescription());
            projectDto.setEndDate(result.getEndDate());
            projectDto.setHostId(result.getHostId());
            projectDto.setHit(result.getHit());
            projectDto.setStartDate(result.getStartDate());
            projectDto.setTitle(result.getTitle());
            projectDto.setCollectStatus(result.getCollectStatus());
            projectDto.setId(result.getId());
            projectDto.setLikes(result.getLikes());
            projectDto.setPositions(positions);
            projectDto.setStacks(stackRepositorySupport.selectStack(result.getId(), 2));
            projects.add(projectDto);
        }

        return projects;
    }

    @Override
    public int joinProject(Long projectId, Long userId, String position) {
        int userUpdateProjectCode=userRepositorySupport.updateUserProject(userId, projectId);
        if (userUpdateProjectCode==401){
            return 401;
        }
        return projectRepositorySupport.joinProject(projectId, position);
    }
}
