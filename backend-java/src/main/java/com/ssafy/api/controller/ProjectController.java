package com.ssafy.api.controller;

import com.ssafy.api.model.ProjectDto;
import com.ssafy.api.request.*;
import com.ssafy.api.response.ProjectSelectAllPostRes;
import com.ssafy.api.response.ProjectSelectPostRes;
import com.ssafy.api.service.ProjectService;
import com.ssafy.api.service.FileService;
import com.ssafy.api.service.StackService;
import com.ssafy.api.service.UserService;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Project;
import io.swagger.annotations.*;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

import static com.ssafy.common.util.JsonUtil.getListMapFromString;


@RestController
@RequestMapping("/api/project")
public class ProjectController{

    @Autowired
    ProjectService projectService;

    @Autowired
    UserService userService;

    @Autowired
    StackService stackService;

    @Autowired
    FileService fileService;


    @PostMapping()
    @ApiOperation(value = "project register")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> register(
            @RequestParam("hostId") Long hostId,
            @RequestParam("hostPosition") String hostPosition,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(required = false, value="collectStatus", defaultValue="ING") String collectStatus,
            @RequestParam(required = false, value="stacks") String stacks,
            @RequestParam(required = false, value="totalFrontendSize", defaultValue = "0") int totalFrontendSize,
            @RequestParam(required = false, value="totalBackendSize", defaultValue = "0") int totalBackendSize,
            @RequestParam(required = false, value="totalMobileSize", defaultValue = "0") int totalMobileSize,
            @RequestParam(required = false, value="totalEmbeddedSize", defaultValue = "0") int totalEmbeddedSize,
            @RequestParam(required = false, value="file") MultipartFile[] files) throws IOException, ParseException {

        ProjectRegisterPostReq registerInfo=new ProjectRegisterPostReq();
        registerInfo.setCollectStatus(collectStatus);
        registerInfo.setTitle(title);
        registerInfo.setHostId(hostId);
        registerInfo.setHostPosition(hostPosition);
        registerInfo.setStartDate(startDate);
        registerInfo.setEndDate(endDate);
        registerInfo.setDescription(description);
        registerInfo.setTotalFrontendSize(totalFrontendSize);
        registerInfo.setTotalBackendSize(totalBackendSize);
        registerInfo.setTotalMobileSize(totalMobileSize);
        registerInfo.setTotalEmbeddedSize(totalEmbeddedSize);
        registerInfo.setTotalSize(totalBackendSize+totalEmbeddedSize+totalFrontendSize+totalMobileSize);

//        registerInfo.setStacks(getListMapFromString(stacks));

        if (files!=null) {
            System.out.println(files[0].getOriginalFilename());
        }

        // project 가입
        Project project = projectService.createProject(registerInfo);
        // project host 추가
        int addProjectCode=userService.addProject(project.getHostId(), project.getId(), hostPosition, "OK");

        if (addProjectCode==401){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "프로젝트를 중복하여 등록할 수 없습니다."));
        }
        // project 스택 입력
        if (stacks!=null) {
            registerInfo.setStacks(getListMapFromString(stacks));
            stackService.createStack(registerInfo.getStacks(), project.getId(), 2);
        }
        // project 이미지 입력
        if (files!=null) {
            fileService.saveFile(files, project.getId(), 2);
        }
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

//    @PostMapping()
//    @ApiOperation(value = "project register")
//    @ApiResponses({
//            @ApiResponse(code = 200, message = "성공"),
//            @ApiResponse(code = 401, message = "인증 실패"),
//            @ApiResponse(code = 404, message = "사용자 없음"),
//            @ApiResponse(code = 500, message = "서버 오류")
//    })
//    public ResponseEntity<? extends BaseResponseBody> register(
//            @RequestPart @ApiParam(value="project info", required = true) ProjectRegisterPostReq registerInfo,
//            @RequestPart(required = false, value="file") MultipartFile[] files) throws IOException {
//
//        System.out.println(registerInfo);
//        System.out.println(files[0].getOriginalFilename());
//
//        // project 가입
//        Project project = projectService.createProject(registerInfo);
//        // project host 추가
//        userService.addProject(project.getHostId(), project.getId());
//
//        // project 스택 입력
//        stackService.createStack(registerInfo.getStacks(), project.getId(), 2);
//        // project 이미지 입력
////        fileService.saveFile(files, project.getId(), 2);
//        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
//    }

    @PostMapping("/update")
    @ApiOperation(value = "project update")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> update(
            @RequestParam("projectId") Long projectId, @RequestParam("hostId") Long hostId, @RequestParam("hostPosition") String hostPosition,
            @RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate, @RequestParam("title") String title,
            @RequestParam("description") String description, @RequestParam("collectStatus") String collectStatus,
            @RequestParam(required = false, value="stacks") String stacks,
            @RequestParam(required = false, value="totalFrontendSize", defaultValue = "0") int totalFrontendSize,
            @RequestParam(required = false, value="totalBackendSize", defaultValue = "0") int totalBackendSize,
            @RequestParam(required = false, value="totalMobileSize", defaultValue = "0") int totalMobileSize,
            @RequestParam(required = false, value="totalEmbeddedSize", defaultValue = "0") int totalEmbeddedSize,
            @RequestParam(required = false, value="file") MultipartFile[] files) throws IOException, ParseException {

        ProjectUpdatePostReq updateInfo=new ProjectUpdatePostReq();
        updateInfo.setId(projectId);
        updateInfo.setCollectStatus(collectStatus);
        updateInfo.setTitle(title);
        updateInfo.setHostId(hostId);
        updateInfo.setHostPosition(hostPosition);
        updateInfo.setStartDate(startDate);
        updateInfo.setEndDate(endDate);
        updateInfo.setDescription(description);
        updateInfo.setTotalFrontendSize(totalFrontendSize);
        updateInfo.setTotalBackendSize(totalBackendSize);
        updateInfo.setTotalMobileSize(totalMobileSize);
        updateInfo.setTotalEmbeddedSize(totalEmbeddedSize);
        updateInfo.setTotalSize(totalBackendSize+totalEmbeddedSize+totalFrontendSize+totalMobileSize);
        if (stacks!=null) {
            updateInfo.setStacks(getListMapFromString(stacks));
        }
        // project update
        int projectCode=projectService.updateProject(updateInfo);
        // project 스택 update
        stackService.updateStack(updateInfo.getStacks(), updateInfo.getId(), 2);
        // project 이미지 update
        fileService.updateFile(files, updateInfo.getId(), 2);
        if (projectCode==401){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "해당 프로젝트는 유효하지 않습니다."));
        } else if (projectCode==402){
            return ResponseEntity.status(200).body(BaseResponseBody.of(402, "사용자가 유효하지 않습니다."));
        }
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @PostMapping("/delete")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> delete(
            @RequestBody @ApiParam(value="project id, host id", required = true) ProjectDeletePostReq deleteInfo) throws IOException {

        // project delete
        projectService.deleteProject(deleteInfo.getHostId(), deleteInfo.getId());

        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }


    @PostMapping("/host")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "가입한 프로젝트 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectProjectByHost(
            @RequestBody @ApiParam(value="host id", required = true) UserIdPostReq userInfo) throws IOException {

        ProjectDto project=projectService.selectByHost(userInfo.getUserId());
        if (project==null){
            return ResponseEntity.status(200).body(ProjectSelectPostRes.of(401, "가입한 프로젝트가 없습니다.", null));
        }
        return ResponseEntity.status(200).body(ProjectSelectPostRes.of(200, "Success", project));
    }

    @PostMapping("/user")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "가입한 프로젝트 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectProjectByUser(
            @RequestBody @ApiParam(value="user id", required = true) UserIdPostReq userInfo) throws IOException {

        ProjectDto project=projectService.selectByUser(userInfo.getUserId());
        if (project==null){
            return ResponseEntity.status(200).body(ProjectSelectPostRes.of(401, "가입한 프로젝트가 없습니다.", null));
        }
        return ResponseEntity.status(200).body(ProjectSelectPostRes.of(200, "Success", project));
    }

    @PostMapping("/view")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "해당 프로젝트 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectProject(
            @RequestBody @ApiParam(value="project id", required = true) ProjectIdPostReq projectInfo) throws IOException {

        ProjectDto project=projectService.selectProject(projectInfo.getId());
        if (project==null){
            return ResponseEntity.status(200).body(ProjectSelectPostRes.of(401, "유효하지 않은 프로젝트입니다.", null));
        }
        return ResponseEntity.status(200).body(ProjectSelectPostRes.of(200, "Success", project));
    }

    @GetMapping("/title/{title}")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "프로젝트 목록 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectProjectByTitle(
            @PathVariable("title") String title) throws IOException {

        List<ProjectDto> projects=projectService.selectProjectByTitle(title);
        if (projects==null){
            return ResponseEntity.status(200).body(ProjectSelectAllPostRes.of(401, "프로젝트 목록이 없습니다.", null));
        }
        return ResponseEntity.status(200).body(ProjectSelectAllPostRes.of(200, "Success", projects));
    }

    @PostMapping("/join")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "해당 프로젝트에 가입 불가"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> joinProject(@RequestBody ProjectJoinPostReq projectInfo) throws IOException {

        Long projectId=projectInfo.getId();
        Long userId=projectInfo.getUserId();
        String position= projectInfo.getPosition();
        int projectJoinCode=projectService.joinProject(projectId, userId, position);
        if (projectJoinCode==401){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "해당 프로젝트에 가입할 수 없습니다."));
        }
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @GetMapping
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "해당 프로젝트 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectProjectAll() throws IOException {

        List<ProjectDto> projects=projectService.selectProjectAll();
        if (projects==null){
            return ResponseEntity.status(200).body(ProjectSelectAllPostRes.of(401, "등록된 프로젝트가 없습니다.", null));
        }
        return ResponseEntity.status(200).body(ProjectSelectAllPostRes.of(200, "Success", projects));
    }

    @GetMapping("/like")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "해당 프로젝트 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectProjectLikeOrder() throws IOException {

        List<ProjectDto> projects=projectService.selectProjectLikeOrder();
        if (projects==null){
            return ResponseEntity.status(200).body(ProjectSelectAllPostRes.of(401, "등록된 프로젝트가 없습니다.", null));
        }
        return ResponseEntity.status(200).body(ProjectSelectAllPostRes.of(200, "Success", projects));
    }

    @GetMapping("/deadline")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "해당 프로젝트 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectProjectDeadlineOrder() throws IOException {

        List<ProjectDto> projects=projectService.selectProjectDeadlineOrder();
        if (projects==null){
            return ResponseEntity.status(200).body(ProjectSelectAllPostRes.of(401, "등록된 프로젝트가 없습니다.", null));
        }
        return ResponseEntity.status(200).body(ProjectSelectAllPostRes.of(200, "Success", projects));
    }

    @PostMapping("/like")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "해당 프로젝트 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> updateProjectLike(@RequestBody ProjectIdPostReq projectIdPostReq) throws IOException {

        int likeCode=projectService.updateProjectLike(projectIdPostReq.getId());
        if (likeCode==401){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "등록된 프로젝트가 없습니다."));
        }
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }
}
