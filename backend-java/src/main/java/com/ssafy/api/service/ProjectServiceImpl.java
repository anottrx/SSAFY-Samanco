package com.ssafy.api.service;

import com.ssafy.api.model.PositionDto;
import com.ssafy.api.model.ProjectDto;
import com.ssafy.api.request.ProjectDeletePostReq;
import com.ssafy.api.request.ProjectJoinPostReq;
import com.ssafy.api.request.ProjectRegisterPostReq;
import com.ssafy.api.request.ProjectUpdatePostReq;
import com.ssafy.db.entity.Project;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
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

//    @Autowired
//    UserRepositorySupport userRepositorySupport;  // 사용 못함

//    @Autowired
//    PasswordEncoder passwordEncoder;

    @Override
    public Project createProject(ProjectRegisterPostReq projectRegisterPostReq) {
        Project project = new Project();
        project.setHostId(projectRegisterPostReq.getHostId());
        project.setHostPosition(projectRegisterPostReq.getHostPosition());
        project.setCollectStatus(projectRegisterPostReq.getCollectStatus());
        project.setDescription(projectRegisterPostReq.getDescription());
        project.setSize(projectRegisterPostReq.getTotalSize());
        project.setCollectStatus(projectRegisterPostReq.getCollectStatus());
        project.setTitle(projectRegisterPostReq.getTitle());
        project.setStartDate(projectRegisterPostReq.getStartDate());
        project.setEndDate(projectRegisterPostReq.getEndDate());
        project.setTotalBackendSize(projectRegisterPostReq.getTotalBackendSize());
        project.setTotalFrontendSize(projectRegisterPostReq.getTotalFrontendSize());
        project.setTotalMobileSize(projectRegisterPostReq.getTotalMobileSize());
        project.setTotalEmbeddedSize(projectRegisterPostReq.getTotalEmbeddedSize());

//        String hostPosition= projectRegisterPostReq.getHostPosition();
//        if ("frontend".equalsIgnoreCase(hostPosition)){
//            project.setCurrentFrontendSize(1);
//        } else if ("backend".equalsIgnoreCase(hostPosition)){
//            project.setCurrentBackendSize(1);
//        } else if ("mobile".equalsIgnoreCase(hostPosition)){
//            project.setCurrentMobileSize(1);
//        } else if ("embedded".equalsIgnoreCase(hostPosition)){
//            project.setCurrentEmbeddedSize(1);
//        }

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
        Project result = projectRepositorySupport.selectByHost(userId);
        if (result==null){
            return null;
        }
        ProjectDto project=projectEntityToDto(result);
        Long projectId=project.getId();
//        projectRepositorySupport.setCurrentSize(project);
        project.setStacks(stackRepositorySupport.selectStack(projectId, 2));
        project.setFile(fileRepositorySupport.selectFile(projectId, 2));

        return project;
    }

    @Override
    public ProjectDto selectProject(Long projectId) {
        Project result=projectRepositorySupport.selectProject(projectId);
        if (result==null){
            return null;
        }
        ProjectDto project=projectEntityToDto(result);
        project.setStacks(stackRepositorySupport.selectStack(projectId, 2));
        project.setFile(fileRepositorySupport.selectFile(projectId, 2));

        return project;
    }

    @Override
    public ProjectDto selectByUser(Long userId) {
        User result = projectRepositorySupport.selectByUser(userId);
        Long projectId = result.getProjectId();
        if (projectId==null){
            return null;
        }

//        String projectJoinStatus = result.getProjectJoinStatus();
//        if ("OK".equals(projectJoinStatus))
        return selectProject(projectId);
    }

    @Override
    public List<ProjectDto> selectProjectAll() {
        List<Project> results = projectRepositorySupport.selectProjectAll();
        if (results==null){
            return null;
        }
        List<ProjectDto> projects=new ArrayList<>();
        for (Project result: results) {
            ProjectDto project=projectEntityToDto(result);
            Long projectId=project.getId();
            project.setStacks(stackRepositorySupport.selectStack(projectId, 2));
            project.setFile(fileRepositorySupport.selectFile(projectId, 2));
            projects.add(project);
        }

        return projects;
    }

    @Override
    public int joinProject(Long projectId, Long userId, String position) {
//        int joinProjectCode=projectRepositorySupport.joinProject(projectId, position);
        return projectRepositorySupport.joinProject(projectId, userId, position);
    }

    @Override
    public ProjectDto projectEntityToDto(Project result) {
        List<User> results=projectRepositorySupport.selectUsers(result.getId());
        int[] currentPositionSize=new int[4];
        for (User user: results){
            String position= user.getProjectPosition();
            if ("frontend".equalsIgnoreCase(position)){
                currentPositionSize[0]++;
            } else if ("backend".equalsIgnoreCase(position)){
                currentPositionSize[1]++;
            } else if ("mobile".equalsIgnoreCase(position)){
                currentPositionSize[2]++;
            } else if ("embedded".equalsIgnoreCase(position)){
                currentPositionSize[3]++;
            }
        }
        List<PositionDto> positions=new ArrayList<>();
        positions.add(new PositionDto("totalFrontend", result.getTotalFrontendSize()));
        positions.add(new PositionDto("totalBackend", result.getTotalBackendSize()));
        positions.add(new PositionDto("totalMobile", result.getTotalMobileSize()));
        positions.add(new PositionDto("totalEmbedded", result.getTotalEmbeddedSize()));
        positions.add(new PositionDto("currentFrontend", currentPositionSize[0]));
        positions.add(new PositionDto("currentBackend", currentPositionSize[1]));
        positions.add(new PositionDto("currentMobile", currentPositionSize[2]));
        positions.add(new PositionDto("currentEmbedded", currentPositionSize[3]));
        positions.add(new PositionDto("totalSize", result.getSize()));
        positions.add(new PositionDto("currentSize", results.size()));
        ProjectDto projectDto=new ProjectDto();
        projectDto.setId(result.getId());
        projectDto.setDescription(result.getDescription());
        projectDto.setEndDate(result.getEndDate());
        projectDto.setHostId(result.getHostId());
        projectDto.setHit(result.getHit());
        projectDto.setStartDate(result.getStartDate());
        projectDto.setTitle(result.getTitle());
        projectDto.setCollectStatus(result.getCollectStatus());
        projectDto.setHostPosition(result.getHostPosition());
        projectDto.setLikes(result.getLikes());
        projectDto.setPositions(positions);

        return  projectDto;

    }
}
