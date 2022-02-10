package com.ssafy.api.service;

import com.ssafy.api.model.PositionDto;
import com.ssafy.api.model.ProjectDto;
import com.ssafy.api.request.ProjectChangeHostReq;
import com.ssafy.api.request.ProjectRegisterReq;
import com.ssafy.api.request.ProjectUpdateReq;
import com.ssafy.db.entity.Project;
import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.User;
import com.ssafy.db.entity.UserLike;
import com.ssafy.db.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

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
    ValidRepository valid;

    @Autowired
    UserLikeRepositorySupport userLikeRepositorySupport;

    @Autowired
    CommonRepository commonRepository;

    @Autowired
    RoomRepositorySupport roomRepositorySupport;

//    @Autowired
//    UserRepositorySupport userRepositorySupport;  // 사용 못함

//    @Autowired
//    PasswordEncoder passwordEncoder;

    @Override
    public Project createProject(ProjectRegisterReq projectRegisterReq) {
        Project project = new Project();
        project.setHostId(projectRegisterReq.getHostId());
        project.setHostPosition(projectRegisterReq.getHostPosition());
        project.setCollectStatus(projectRegisterReq.getCollectStatus());
        project.setDescription(projectRegisterReq.getDescription());
        project.setSize(projectRegisterReq.getTotalSize());
        project.setTitle(projectRegisterReq.getTitle());
        project.setStartDate(projectRegisterReq.getStartDate());
        project.setEndDate(projectRegisterReq.getEndDate());
        project.setTotalBackendSize(projectRegisterReq.getTotalBackendSize());
        project.setTotalFrontendSize(projectRegisterReq.getTotalFrontendSize());
        project.setTotalMobileSize(projectRegisterReq.getTotalMobileSize());
        project.setTotalEmbeddedSize(projectRegisterReq.getTotalEmbeddedSize());

        return projectRepository.save(project);
    }

    @Override
    public int updateProject(ProjectUpdateReq updateInfo) {
        return projectRepositorySupport.updateProject(updateInfo);
    }

    @Override
    public void deleteProject(Long userId, Long projectId) {
        projectRepositorySupport.deleteProject(userId, projectId);
        stackRepositorySupport.deleteStack(projectId, "project");
        fileRepositorySupport.deleteFile(projectId, "project");
    }

    @Override
    public ProjectDto selectByHost(Long userId) {
        Project result = projectRepositorySupport.selectByHost(userId);
        if (result==null){
            return null;
        }
        ProjectDto project=projectEntityToDto(result);
        Long projectId=project.getId();
        project.setStacks(stackRepositorySupport.selectStack(projectId, "project"));
        project.setFile(fileRepositorySupport.selectFile(projectId, "project"));

        return project;
    }

    @Override
    public ProjectDto selectProject(Long userId, Long projectId) {
        Project result=projectRepositorySupport.selectProject(userId, projectId);
        if (result==null){
            return null;
        }
        ProjectDto project=projectEntityToDto(result);
        project.setStacks(stackRepositorySupport.selectStack(projectId, "project"));
        project.setFile(fileRepositorySupport.selectFile(projectId, "project"));
        UserLike userLike = userLikeRepositorySupport.userLike(userId, projectId, "project");
        User user=commonRepository.selectUser(userId);
        if (user.getProjectId()==projectId){
            Room room=roomRepositorySupport.selectRoomByTagId(projectId, "project");
            if (room==null && room.getHostId()==userId){    // 방이 안만들어졌고 방장인 경우
                project.setCanRegister(true);
            }
            if (room!=null && room.getHostId()!=userId){     // 방이 만들어졌고 방장이 아닌 팀원
                project.setCanJoin(true);
            }
        }


        if (userLike!=null) {
            project.setUserLike(true);
        }

        return project;
    }

    @Override
    public ProjectDto selectByUser(Long userId) {
        User result = projectRepositorySupport.selectByUser(userId);
        if (result==null){
            return null;
        }
        Long projectId = result.getProjectId();
        if (projectId==null){
            return null;
        }

        return selectProject(userId, projectId);
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
            if (project==null){
                continue;
            }
            Long projectId=project.getId();
            project.setStacks(stackRepositorySupport.selectStack(projectId, "project"));
            project.setFile(fileRepositorySupport.selectFile(projectId, "project"));
            projects.add(project);
        }

        return projects;
    }

    @Override
    public ProjectDto projectEntityToDto(Project result) {
        // position
        List<User> results=projectRepositorySupport.selectProjectUsers(result.getId());
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

        // like
        int likes=userLikeRepositorySupport.countUserLikeByTarget(result.getId(), "project");

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
        projectDto.setLikes(likes);
        projectDto.setPositions(positions);

        // 마감일 계산
        Calendar todayDate = Calendar.getInstance();
        todayDate.setTime(new Date()); //금일 날짜
        Date endDate = null;
        try {
            endDate = new SimpleDateFormat("yyyy-MM-dd").parse(projectDto.getEndDate());
            Calendar cmpDate = Calendar.getInstance();
            cmpDate.setTime(endDate); //특정 일자
            long deadline = (cmpDate.getTimeInMillis() - todayDate.getTimeInMillis()) / (24*60*60*1000) + 1;
//            System.out.println(deadline + "일 차이");

            projectDto.setDeadline(deadline);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return  projectDto;
    }

    @Override
    public List<ProjectDto> selectProjectByTitle(String title) {
        List<Project> results=projectRepositorySupport.selectByTitle(title);
        if (results==null){
            return null;
        }
        List<ProjectDto> projects=new ArrayList<>();
        for (Project result: results) {
            ProjectDto project=projectEntityToDto(result);
            Long projectId=project.getId();
            project.setStacks(stackRepositorySupport.selectStack(projectId, "project"));
            project.setFile(fileRepositorySupport.selectFile(projectId, "project"));
            projects.add(project);
        }

        return projects;

    }

    @Override
    public List<ProjectDto> selectProjectLikeOrder() {
        List<Project> results=projectRepositorySupport.selectProjectAll();
        if (results==null){
            return null;
        }
        List<ProjectDto> projects=new ArrayList<>();
        for (Project result: results) {
            ProjectDto project=projectEntityToDto(result);
            Long projectId=project.getId();
            project.setStacks(stackRepositorySupport.selectStack(projectId, "project"));
            project.setFile(fileRepositorySupport.selectFile(projectId, "project"));
            projects.add(project);
        }
        Collections.sort(projects, new Comparator<ProjectDto>() {
            @Override
            public int compare(ProjectDto o1, ProjectDto o2) {
                return (int) (o2.getLikes()-o1.getLikes());
            }
        });

        return projects;
    }

    @Override
    public List<ProjectDto> selectProjectDeadlineOrder() {
        List<Project> results=projectRepositorySupport.selectProjectAll();
        if (results==null){
            return null;
        }
        List<ProjectDto> projects=new ArrayList<>();
        for (Project result: results) {
            ProjectDto project=projectEntityToDto(result);
            Long projectId=project.getId();
            project.setStacks(stackRepositorySupport.selectStack(projectId, "project"));
            project.setFile(fileRepositorySupport.selectFile(projectId, "project"));
            projects.add(project);
        }

        Collections.sort(projects, new Comparator<ProjectDto>() {
            @Override
            public int compare(ProjectDto o1, ProjectDto o2) {
                return (int) (o1.getDeadline()-o2.getDeadline());
            }
        });

        return projects;
    }

    @Override
    public int updateProjectHost(Long projectId, Long newHostId, String newHostPosition) {
        return projectRepositorySupport.updateProjectHost(projectId, newHostId, newHostPosition);
    }

}
