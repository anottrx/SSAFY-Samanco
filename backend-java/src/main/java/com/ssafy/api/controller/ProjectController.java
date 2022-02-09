package com.ssafy.api.controller;

import com.ssafy.api.model.ProjectDto;
import com.ssafy.api.model.StackGradeDto;
import com.ssafy.api.model.UserDto;
import com.ssafy.api.request.*;
import com.ssafy.api.response.*;
import com.ssafy.api.service.ProjectService;
import com.ssafy.api.service.FileService;
import com.ssafy.api.service.StackService;
import com.ssafy.api.service.UserService;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Project;
import io.swagger.annotations.*;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.FileUtils;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
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

        ProjectRegisterReq registerInfo=new ProjectRegisterReq();
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

        if (files!=null) {
            System.out.println(files[0].getOriginalFilename());
        }

        // project create
        Project project = projectService.createProject(registerInfo);
        // user's projectId, joinStatus position update
        int joinProjectCode=userService.joinUserProject(project.getHostId(), project.getId(), hostPosition, "OK");

        if (joinProjectCode==401){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "프로젝트를 등록할 수 없습니다."));
        }
        // project 스택 입력
        System.out.println(stacks);
        if (stacks!=null) {
            registerInfo.setStacks(getListMapFromString(stacks));
            stackService.createStack(registerInfo.getStacks(), project.getId(), "project");
        }
        // project 이미지 입력
        if (files!=null) {
            fileService.saveFile(files, project.getId(), "project");
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

        ProjectUpdateReq updateInfo=new ProjectUpdateReq();
        updateInfo.setProjectId(projectId);
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
        stackService.updateStack(updateInfo.getStacks(), updateInfo.getProjectId(), "project");
        // project 이미지 update
        fileService.updateFile(files, updateInfo.getProjectId(), "project");
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
    public ResponseEntity<? extends BaseResponseBody> delete(@RequestBody ProjectUserIdReq deleteInfo) throws IOException {

        // project delete
        projectService.deleteProject(deleteInfo.getUserId(), deleteInfo.getProjectId());

        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }


    @PostMapping("/host")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "가입한 프로젝트 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectProjectByHost(@RequestBody UserIdReq userInfo) throws IOException {

        ProjectDto project=projectService.selectByHost(userInfo.getUserId());
        if (project==null){
            return ResponseEntity.status(200).body(ProjectSelectRes.of(401, "호스트인 프로젝트가 없습니다.", null));
        }
        return ResponseEntity.status(200).body(ProjectSelectRes.of(200, "Success", project));
    }

    @PostMapping("/user")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "가입한 프로젝트 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectProjectByUser(@RequestBody UserIdReq userInfo) throws IOException {

        ProjectDto project=projectService.selectByUser(userInfo.getUserId());
        if (project==null){
            return ResponseEntity.status(200).body(ProjectSelectRes.of(401, "가입한 프로젝트가 없습니다.", null));
        }
        return ResponseEntity.status(200).body(ProjectSelectRes.of(200, "Success", project));
    }

    @PostMapping("/view")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "해당 프로젝트 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectProject(
            @RequestBody @ApiParam(value="project id", required = true) ProjectUserIdReq projectInfo) throws IOException {

        Long projectId= projectInfo.getProjectId();
        Long userId = projectInfo.getUserId();

        ProjectDto project=projectService.selectProject(userId, projectId);
        UserDto user=userService.selectUser(userId);
        if (project==null){
            return ResponseEntity.status(200).body(ProjectSelectRes.of(401, "유효하지 않은 프로젝트입니다.", null));
        }
        if (user!=null && projectId==user.getProjectId()) {
            project.setProjectJoinStatus(user.getProjectJoinStatus());
        }
        return ResponseEntity.status(200).body(ProjectSelectRes.of(200, "Success", project));
    }

//    @GetMapping("/view")
//    @ApiResponses({
//            @ApiResponse(code = 200, message = "성공"),
//            @ApiResponse(code = 401, message = "해당 프로젝트 없음"),
//            @ApiResponse(code = 500, message = "서버 오류")
//    })
//    public ResponseEntity<? extends BaseResponseBody> selectProject(
//            @RequestBody @ApiParam(value="project id", required = true) ProjectUserIdReq projectInfo) throws IOException {
//
//        Long projectId= projectInfo.getProjectId();
//        Long userId = projectInfo.getUserId();
//
//        ProjectDto project=projectService.selectProject(userId, projectId);
//        UserDto user=userService.selectUser(userId);
//        if (project==null){
//            return ResponseEntity.status(200).body(ProjectSelectRes.of(401, "유효하지 않은 프로젝트입니다.", null));
//        }
//        if (user!=null && projectId==user.getProjectId()) {
//            project.setProjectJoinStatus(user.getProjectJoinStatus());
//        }
//        return ResponseEntity.status(200).body(ProjectSelectRes.of(200, "Success", project));
//    }

    @GetMapping("/title/{title}")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "프로젝트 목록 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectProjectByTitle(
            @PathVariable("title") String title) throws IOException {

        List<ProjectDto> projects=projectService.selectProjectByTitle(title);
        if (projects==null || projects.size()==0){
            return ResponseEntity.status(200).body(ProjectSelectAllRes.of(401, "프로젝트 목록이 없습니다.", null));
        }
        return ResponseEntity.status(200).body(ProjectSelectAllRes.of(200, "Success", projects));
    }

    @PostMapping("/join")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "해당 프로젝트에 가입 불가"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> joinProject(@RequestBody ProjectJoinReq projectInfo) throws IOException {

        Long projectId=projectInfo.getProjectId();
        Long userId=projectInfo.getUserId();
        String position= projectInfo.getPosition();
        int projectJoinCode= userService.joinUserProject(userId, projectId, position, "BEFORE");
        if (projectJoinCode==401){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "해당 프로젝트에 가입할 수 없습니다."));
        }
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @PostMapping("/approve")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "가입승인 불가"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> approveProject(@RequestBody ProjectApproveReq projectApproveReq) throws IOException {

        Long projectId=projectApproveReq.getProjectId();
        Long userId=projectApproveReq.getUserId();
        Long hostId=projectApproveReq.getHostId();
        String joinTag=projectApproveReq.getJoinTag();

        int projectApproveCode= userService.approveUserProject(hostId, userId, projectId, joinTag);
        if (projectApproveCode==401){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "해당 사용자는 프로젝트에 가입할 수 없습니다."));
        } else if (projectApproveCode==402){
            return ResponseEntity.status(200).body(BaseResponseBody.of(402, "승인 권한이 없습니다."));
        }
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @PostMapping("/quit")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "해당 프로젝트 탈퇴 불가"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> quitProject(@RequestBody ProjectUserIdReq projectUserIdReq) throws IOException {
        int projectQuitCode=userService.quitProject(projectUserIdReq.getUserId(), projectUserIdReq.getProjectId());
        if (projectQuitCode==401){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "유효하지 않은 사용자입니다."));
        } else if (projectQuitCode==402){
            return ResponseEntity.status(200).body(BaseResponseBody.of(402, "프로젝트를 탈퇴할 수 없습니다."));
        } else if (projectQuitCode==403){
            return ResponseEntity.status(200).body(BaseResponseBody.of(403, "호스트는 권한을 넘긴 후 탈퇴하거나 프로젝트를 삭제하세요."));
        }
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @PostMapping("/joincancel")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "해당 프로젝트 지원 취소 불가"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> joinCancelProject(@RequestBody ProjectUserIdReq projectUserIdReq) throws IOException {
        int projectJoinCancelCode=userService.joinCancelProject(projectUserIdReq.getUserId(), projectUserIdReq.getProjectId());
        if (projectJoinCancelCode==401){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "유효하지 않은 사용자입니다."));
        } else if (projectJoinCancelCode==402){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "프로젝트 지원 취소를 할 수 없습니다."));
        }
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @PostMapping("/changehost")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "프로젝트 호스트 변경 불가"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> changeHostProject(@RequestBody ProjectChangeHostReq projectChangeHostReq) throws IOException {
        Long projectId= projectChangeHostReq.getProjectId();
        Long oldHostId=projectChangeHostReq.getOldHostId();
        Long newHostId=projectChangeHostReq.getNewHostId();
        String newHostPosition= projectChangeHostReq.getNewHostPosition();
        UserDto user=userService.selectUser(newHostId);
        System.out.println(user);
        if (user==null || user.getProjectId()!= projectId || !"OK".equalsIgnoreCase(user.getProjectJoinStatus())){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "프로젝트의 호스트를 넘길 수 없습니다."));
        }
        ProjectDto project=projectService.selectByHost(oldHostId);
        System.out.println(project);
        if (project==null || projectId!=project.getId()){
            return ResponseEntity.status(200).body(BaseResponseBody.of(402, "프로젝트의 호스트를 넘길 수 없습니다."));
        }

        int updateProjectHost=projectService.updateProjectHost(projectId, newHostId, newHostPosition);

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
        if (projects==null || projects.size()==0){
            return ResponseEntity.status(200).body(ProjectSelectAllRes.of(401, "등록된 프로젝트가 없습니다.", null));
        }
        return ResponseEntity.status(200).body(ProjectSelectAllRes.of(200, "Success", projects));
    }

    @GetMapping("/stack")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "해당 프로젝트 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectProjectStacks() throws IOException {

        List<String> stacks=stackService.selectStackAll("project");
//        if (stacks==null || stacks.size()==0){
//            return ResponseEntity.status(200).body(ProjectSelectAllRes.of(401, "등록된 프로젝트가 없습니다.", null));
//        }
        return ResponseEntity.status(200).body(StackSelectAllRes.of(200, "Success", stacks));
    }

    @PostMapping("/userlist")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "해당 사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectProjectUsers(@RequestBody ProjectUserIdReq projectUserIdReq) throws IOException {

        List<UserDto> users=userService.selectProjectUsers(projectUserIdReq.getUserId(), projectUserIdReq.getProjectId());
        if (users==null || users.size()==0){
            return ResponseEntity.status(200).body(UserSelectAllRes.of(401, "함께 프로젝트에 가입되어 있는 사용자가 없습니다.", null));
        }
        return ResponseEntity.status(200).body(UserSelectAllRes.of(200, "Success", users));
    }

    @PostMapping("/joinlist")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "해당 사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectJoinUsers(@RequestBody ProjectUserIdReq projectUserIdReq) throws IOException {

        List<UserDto> users=userService.selectProjectJoinUsers(projectUserIdReq.getUserId(), projectUserIdReq.getProjectId());
        if (users==null || users.size()==0){
            return ResponseEntity.status(200).body(UserSelectAllRes.of(401, "프로젝트에 지원한 사용자가 없습니다.", null));
        }
        return ResponseEntity.status(200).body(UserSelectAllRes.of(200, "Success", users));
    }

    @GetMapping("/like")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "해당 프로젝트 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectProjectLikeOrder() throws IOException {

        List<ProjectDto> projects=projectService.selectProjectLikeOrder();
        if (projects==null || projects.size()==0){
            return ResponseEntity.status(200).body(ProjectSelectAllRes.of(401, "등록된 프로젝트가 없습니다.", null));
        }
        return ResponseEntity.status(200).body(ProjectSelectAllRes.of(200, "Success", projects));
    }

    @GetMapping("/deadline")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "해당 프로젝트 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectProjectDeadlineOrder() throws IOException {

        List<ProjectDto> projects=projectService.selectProjectDeadlineOrder();
        if (projects==null || projects.size()==0){
            return ResponseEntity.status(200).body(ProjectSelectAllRes.of(401, "등록된 프로젝트가 없습니다.", null));
        }
        return ResponseEntity.status(200).body(ProjectSelectAllRes.of(200, "Success", projects));
    }

    @PostMapping("/like")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "유효하지 않은 사용자"),
            @ApiResponse(code = 401, message = "유효하지 않은 태그"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> updateProjectLike(@RequestBody UserLikeTagReq userLikeTagReq) throws IOException {

        int likeCode=userService.userLikeTag(userLikeTagReq);
        if (likeCode==401){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "유효하지 않은 사용자입니다."));
        } else if (likeCode==402){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "유효하지 않은 태그입니다."));
        } else if (likeCode==201){
            return ResponseEntity.status(200).body(BaseResponseBody.of(201, "좋아요 취소"));
        }
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "좋아요"));
    }

    @GetMapping("/download/{path}")
    public ResponseEntity<? extends BaseResponseBody> getImageWithMediaType(@PathVariable("path") String path) throws IOException {
        String realPath = new File("").getAbsolutePath() + File.separator + "files";
        String[] paths=path.split("&");
        String filePath = realPath + File.separator + paths[0] + File.separator + paths[1];
        File target = new File(filePath);
        System.out.println("target: "+target);
        if (target==null){
            return ResponseEntity.status(200).body(FileStringRes.of(401, "해당 파일을 다운로드할 수 없습니다.", null));
        }
        byte[] fileByte = FileUtils.readFileToByteArray(target);
        String fileString = new String(Base64.encodeBase64(fileByte));

        return ResponseEntity.status(200).body(FileStringRes.of(200, "success", fileString));
    }
}
