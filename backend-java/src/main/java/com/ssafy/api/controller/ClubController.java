package com.ssafy.api.controller;

import com.ssafy.api.request.ClubRegisterPostReq;
import com.ssafy.api.request.ClubUpdatePostReq;
import com.ssafy.api.service.ClubService;
import com.ssafy.api.service.FileService;
import com.ssafy.api.service.StackService;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Study;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


@RestController
@RequestMapping("/api/club")
public class ClubController {

    @Autowired
    ClubService clubService;

    @Autowired
    StackService stackService;

    @Autowired
    FileService fileService;


    @PostMapping()
    @ApiOperation(value = "club register")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> register(
            @RequestBody @ApiParam(value="club info", required = true) ClubRegisterPostReq registerInfo,
            @RequestPart(required = false) MultipartFile[] files) throws IOException {

        // club 가입
        Study study = clubService.createClub(registerInfo);
        // club 스택 입력
        stackService.createStack(registerInfo.getStacks(), study.getId(), 2);
        // club 이미지 입력
        fileService.saveFile(files, study.getId(), 2);
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @PostMapping("/update")
    @ApiOperation(value = "club update")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> update(
            @RequestBody @ApiParam(value="club info", required = true) ClubUpdatePostReq updateInfo,
            @RequestPart(required = false) MultipartFile[] files) throws IOException {

        // club update
        clubService.updateClub(updateInfo);
        // club 스택 입력
        stackService.updateStack(updateInfo.getStacks(), updateInfo.getId(), 2);
        // club 이미지 입력
        fileService.updateFile(files, updateInfo.getId(), 2);
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }
}
