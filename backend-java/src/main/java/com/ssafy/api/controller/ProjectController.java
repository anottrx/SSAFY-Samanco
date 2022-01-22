package com.ssafy.api.controller;

import com.ssafy.api.request.ProjectRegisterPostReq;
import com.ssafy.api.request.ProjectUpdatePostReq;
import com.ssafy.api.service.ProjectService;
import com.ssafy.api.service.FileService;
import com.ssafy.api.service.StackService;
import com.ssafy.api.service.UserService;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Project;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Stack;


@RestController
@RequestMapping("/api/project")
public class ProjectController {

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
            @RequestParam("hostId") Long hostId, @RequestParam("hostPosition") String hostPosition,
            @RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate,
            @RequestParam("description") String description, @RequestParam("collectStatus") String collectStatus,
            @RequestParam(required = false, value="stacks") String stacks,
            @RequestParam(required = false, value="totalFrontendSize", defaultValue = "0") int totalFrontendSize,
            @RequestParam(required = false, value="totalBackendSize", defaultValue = "0") int totalBackendSize,
            @RequestParam(required = false, value="totalMobileSize", defaultValue = "0") int totalMobileSize,
            @RequestParam(required = false, value="totalEmbeddedSize", defaultValue = "0") int totalEmbeddedSize,
            @RequestParam(required = false, value="file") MultipartFile[] files) throws IOException {

        ProjectRegisterPostReq registerInfo=new ProjectRegisterPostReq();
        registerInfo.setCollectStatus(collectStatus);
        registerInfo.setHostId(hostId);
        registerInfo.setHostPosition(hostPosition);
        registerInfo.setStartDate(startDate);
        registerInfo.setEndDate(endDate);
        System.out.println(stacks);
//        registerInfo.setStacks(stacks);
        registerInfo.setDescription(description);
        registerInfo.setTotalFrontendSize(totalFrontendSize);
        registerInfo.setTotalBackendSize(totalBackendSize);
        registerInfo.setTotalMobileSize(totalMobileSize);
        registerInfo.setTotalEmbeddedSize(totalEmbeddedSize);

        System.out.println(registerInfo);
        if (files!=null) {
            System.out.println(files[0].getOriginalFilename());
        }

        // project 가입
        Project project = projectService.createProject(registerInfo);
        // project host 추가
        userService.addProject(project.getHostId(), project.getId());

        // project 스택 입력
//        if (registerInfo.getStacks()!=null) {
//            stackService.createStack(registerInfo.getStacks(), project.getId(), 2);
//        }
        // project 이미지 입력
        fileService.saveFile(files, project.getId(), 2);
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
            @RequestBody @ApiParam(value="project info", required = true) ProjectUpdatePostReq updateInfo,
            @RequestPart(required = false) MultipartFile[] files) throws IOException {

        // project update
        projectService.updateProject(updateInfo);
        // project 스택 입력
        stackService.updateStack(updateInfo.getStacks(), updateInfo.getId(), 2);
        // project 이미지 입력
        fileService.updateFile(files, updateInfo.getId(), 2);
//        if (projectCode==401){
//            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "해당 프로젝트는 유효하지 않습니다."));
//        }
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @PostMapping("/delete")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> delete(
            @RequestBody @ApiParam(value="project info", required = true) ProjectUpdatePostReq updateInfo,
            @RequestPart(required = false) MultipartFile[] files) throws IOException {

        // project update
//        int projectCode = projectService.deleteProject(updateInfo);
        // project 스택 입력
        stackService.updateStack(updateInfo.getStacks(), updateInfo.getId(), 2);
        // project 이미지 입력
        fileService.updateFile(files, updateInfo.getId(), 2);

        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }
}