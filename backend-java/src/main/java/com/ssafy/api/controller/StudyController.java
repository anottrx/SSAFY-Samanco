package com.ssafy.api.controller;

import com.ssafy.api.model.StudyDto;
import com.ssafy.api.model.UserDto;
import com.ssafy.api.request.*;
import com.ssafy.api.response.*;
import com.ssafy.api.service.FileService;
import com.ssafy.api.service.StudyService;
import com.ssafy.api.service.StackService;
import com.ssafy.api.service.UserService;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Study;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

import static com.ssafy.common.util.JsonUtil.getListMapFromString;


@RestController
@RequestMapping("/api/study")
public class StudyController {

    @Autowired
    StudyService studyService;

    @Autowired
    UserService userService;

    @Autowired
    StackService stackService;

    @Autowired
    FileService fileService;


    @PostMapping()
    @ApiOperation(value = "study register")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> register(
            @RequestParam("hostId") Long hostId,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(required = false, value = "size", defaultValue = "6") int size,
            @RequestParam(required = false, value="schedule") String schedule,
            @RequestParam(required = false, value="collectStatus", defaultValue="ING") String collectStatus,
            @RequestParam(required = false, value="stacks") String stacks,
            @RequestParam(required = false, value="file") MultipartFile[] files) throws IOException, ParseException {

        StudyRegisterReq registerInfo=new StudyRegisterReq();
        registerInfo.setCollectStatus(collectStatus);
        registerInfo.setTitle(title);
        registerInfo.setHostId(hostId);
        registerInfo.setDescription(description);
        registerInfo.setSchedule(schedule);
        registerInfo.setSize(size);

        if (files!=null) {
            System.out.println(files[0].getOriginalFilename());
        }

        // study create
        Study study = studyService.createStudy(registerInfo);
        // user's studyId, joinStatus position update
        int joinStudyCode=studyService.joinUserStudy(study.getHostId(), study.getId(), "OK");

        if (joinStudyCode==401){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "유효하지 않은 사용자입니다."));
        } else if (joinStudyCode==402){
            return ResponseEntity.status(200).body(BaseResponseBody.of(402, "스터디를 등록할 수 없습니다."));
        } else if (joinStudyCode==403){
            return ResponseEntity.status(200).body(BaseResponseBody.of(403, "이미 등록된 스터디입니다."));
        }
        // study 스택 입력
        if (stacks!=null) {
            registerInfo.setStacks(getListMapFromString(stacks));
            stackService.createStack(registerInfo.getStacks(), study.getId(), "study");
        }
        // study 이미지 입력
        if (files!=null) {
            fileService.saveFile(files, study.getId(), "study");
        }
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @PostMapping("/update")
    @ApiOperation(value = "study update")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> update(
            @RequestParam("studyId") Long studyId,
            @RequestParam("hostId") Long hostId,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(required = false, value = "size", defaultValue = "6") int size,
            @RequestParam(required = false, value = "collectStatus", defaultValue = "ING") String collectStatus,
            @RequestParam(required = false, value="schedule") String schedule,
            @RequestParam(required = false, value="stacks") String stacks,
            @RequestParam(required = false, value="file") MultipartFile[] files) throws IOException, ParseException {

        StudyUpdateReq updateInfo=new StudyUpdateReq();
        updateInfo.setStudyId(studyId);
        updateInfo.setCollectStatus(collectStatus);
        updateInfo.setTitle(title);
        updateInfo.setHostId(hostId);
        updateInfo.setDescription(description);
        updateInfo.setSchedule(schedule);
        updateInfo.setSize(size);
        if (stacks!=null) {
            updateInfo.setStacks(getListMapFromString(stacks));
        }
        // study update
        int studyCode=studyService.updateStudy(updateInfo);
        // study 스택 update
        stackService.updateStack(updateInfo.getStacks(), updateInfo.getStudyId(), "study");
        // study 이미지 update
        fileService.updateFile(files, updateInfo.getStudyId(), "study");
        if (studyCode==401){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "해당 스터디는 유효하지 않습니다."));
        } else if (studyCode==402){
            return ResponseEntity.status(200).body(BaseResponseBody.of(402, "사용자가 유효하지 않습니다."));
        }
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @PostMapping("/delete")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> delete(@RequestBody StudyUserIdReq deleteInfo) throws IOException {

        // study delete
        int deleteCode=studyService.deleteStudy(deleteInfo.getUserId(), deleteInfo.getStudyId());

        if (deleteCode==401){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "유효하지 않은 사용자입니다."));
        } else if (deleteCode==402){
            return ResponseEntity.status(200).body(BaseResponseBody.of(402, "유효하지 않은 스터디입니다."));
        }
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }


    @PostMapping("/host")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "가입한 스터디 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectStudiesByHost(@RequestBody UserIdReq userInfo) throws IOException {

        List<StudyDto> studies=studyService.selectByHost(userInfo.getUserId());
        if (studies==null){
            return ResponseEntity.status(200).body(StudySelectAllRes.of(401, "호스트인 스터디가 없습니다.", null));
        }
        return ResponseEntity.status(200).body(StudySelectAllRes.of(200, "Success", studies));
    }

    @PostMapping("/user")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "가입한 스터디 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectStudyByUser(@RequestBody UserIdReq userInfo) throws IOException {

        List<StudyDto> studies=studyService.selectByUser(userInfo.getUserId());
        if (studies==null){
            return ResponseEntity.status(200).body(StudySelectAllRes.of(401, "가입한 스터디가 없습니다.", null));
        }
        return ResponseEntity.status(200).body(StudySelectAllRes.of(200, "Success", studies));
    }

    @PostMapping("/view")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "해당 스터디 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectStudy(@RequestBody StudyUserIdReq studyInfo) throws IOException {

        Long userId = studyInfo.getUserId();
        Long studyId = studyInfo.getStudyId();
        StudyDto study=studyService.selectStudy(userId, studyId);
        if (study==null) {
            return ResponseEntity.status(200).body(StudySelectRes.of(401, "유효하지 않은 스터디입니다.", null));
        }

        return ResponseEntity.status(200).body(StudySelectRes.of(200, "Success", study));
    }

    @GetMapping("/title/{title}")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "스터디 목록 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectStudyByTitle(
            @PathVariable("title") String title) throws IOException {

        List<StudyDto> studies=studyService.selectStudyByTitle(title);
        if (studies==null || studies.size()==0){
            return ResponseEntity.status(200).body(StudySelectAllRes.of(401, "스터디 목록이 없습니다.", null));
        }
        return ResponseEntity.status(200).body(StudySelectAllRes.of(200, "Success", studies));
    }

    @PostMapping("/join")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> joinStudy(@RequestBody StudyUserIdReq studyUserIdReq) throws IOException {

        Long studyId=studyUserIdReq.getStudyId();
        Long userId=studyUserIdReq.getUserId();
        int studyJoinCode= studyService.joinUserStudy(userId, studyId, "BEFORE");
        if (studyJoinCode==401){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "유효하지 않은 사용자입니다."));
        } else if (studyJoinCode==402){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "유효하지 않은 스터디입니다."));
        } else if (studyJoinCode==403){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "이미 지원했거나 가입한 스터디입니다."));
        }
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @PostMapping("/approve")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "승인 불가"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> approveStudy(@RequestBody StudyApproveReq studyApproveReq) throws IOException {

        Long studyId=studyApproveReq.getStudyId();
        Long userId=studyApproveReq.getUserId();
        Long hostId=studyApproveReq.getHostId();
        String joinTag=studyApproveReq.getJoinTag();

        int studyApproveCode = studyService.approveUserStudy(hostId, userId, studyId, joinTag);
        if (studyApproveCode==401){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "유효하지 않은 사용자입니다."));
        } else if (studyApproveCode==402){
            return ResponseEntity.status(200).body(BaseResponseBody.of(402, "유효하지 않은 스터디입니다."));
        } else if (studyApproveCode==403){
            return ResponseEntity.status(200).body(BaseResponseBody.of(403, "승인할 수 없습니다."));
        }
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @PostMapping("/quit")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> quitStudy(@RequestBody StudyUserIdReq studyUserIdReq) throws IOException {
        int studyQuitCode=studyService.quitStudy(studyUserIdReq.getUserId(), studyUserIdReq.getStudyId());
        if (studyQuitCode==401){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "가입하지 않은 스터디입니다."));
        } else if (studyQuitCode==402){
            return ResponseEntity.status(200).body(BaseResponseBody.of(402, "유효하지 않은 스터디입니다."));
        } else if (studyQuitCode==403){
            return ResponseEntity.status(200).body(BaseResponseBody.of(403, "호스트는 권한을 넘긴 후 탈퇴하거나 스터디를 삭제하세요."));
        }
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @PostMapping("/joincancel")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> joinCancelStudy(@RequestBody StudyUserIdReq studyUserIdReq) throws IOException {
        int studyJoinCancelCode=studyService.joinCancelStudy(studyUserIdReq.getUserId(), studyUserIdReq.getStudyId());
        if (studyJoinCancelCode==401){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "지원하지 않은 스터디입니다."));
        }
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @PostMapping("/changehost")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "스터디 호스트 변경 불가"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> changeHostStudy(@RequestBody StudyChangeHostReq studyChangeHostReq) throws IOException {
        Long studyId= studyChangeHostReq.getStudyId();
        Long oldHostId=studyChangeHostReq.getOldHostId();
        Long newHostId=studyChangeHostReq.getNewHostId();

        int changeHostStudy=studyService.changeHostStudy(studyId, oldHostId, newHostId);
        if (changeHostStudy==401){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "스터디의 호스트를 넘길 수 없습니다."));
        } else if (changeHostStudy==402){
            return ResponseEntity.status(200).body(BaseResponseBody.of(402, "사용자가 스터디에 가입되어 있지 않습니다."));
        }
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));

    }

    @GetMapping
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "해당 스터디 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectStudyAll() throws IOException {

        List<StudyDto> studies=studyService.selectStudyAll();
        if (studies==null || studies.size()==0){
            return ResponseEntity.status(200).body(StudySelectAllRes.of(401, "등록된 스터디가 없습니다.", null));
        }
        return ResponseEntity.status(200).body(StudySelectAllRes.of(200, "Success", studies));
    }

    @GetMapping("/stack")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "해당 스터디 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectStudyStacks() throws IOException {

        List<String> stacks=stackService.selectStackAll("study");
//        if (stacks==null || stacks.size()==0){
//            return ResponseEntity.status(200).body(StudySelectAllRes.of(401, "등록된 스터디가 없습니다.", null));
//        }
        return ResponseEntity.status(200).body(StackSelectAllRes.of(200, "Success", stacks));
    }

    @PostMapping("/userlist")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "해당 사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectStudyUsers(@RequestBody StudyUserIdReq studyUserIdReq) throws IOException {

        List<UserDto> users=userService.selectStudyUsers(studyUserIdReq.getUserId(), studyUserIdReq.getStudyId());
        if (users==null || users.size()==0){
            return ResponseEntity.status(200).body(UserSelectAllRes.of(401, "함께 스터디 가입되어 있는 사용자가 없습니다.", null));
        }
        return ResponseEntity.status(200).body(UserSelectAllRes.of(200, "Success", users));
    }

    @PostMapping("/joinlist")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "해당 사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectJoinUsers(@RequestBody StudyUserIdReq studyUserIdReq) throws IOException {

        List<UserDto> users=userService.selectStudyJoinUsers(studyUserIdReq.getUserId(), studyUserIdReq.getStudyId());
        if (users==null || users.size()==0){
            return ResponseEntity.status(200).body(UserSelectAllRes.of(401, "스터디에 지원한 사용자가 없습니다.", null));
        }
        return ResponseEntity.status(200).body(UserSelectAllRes.of(200, "Success", users));
    }

    @GetMapping("/like")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "해당 스터디 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectStudyLikeOrder() throws IOException {

        List<StudyDto> studies=studyService.selectStudyLikeOrder();
        if (studies==null || studies.size()==0){
            return ResponseEntity.status(200).body(StudySelectAllRes.of(401, "등록된 스터디가 없습니다.", null));
        }
        return ResponseEntity.status(200).body(StudySelectAllRes.of(200, "Success", studies));
    }

    @PostMapping("/like")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "유효하지 않은 사용자"),
            @ApiResponse(code = 401, message = "유효하지 않은 태그"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> updateStudyLike(@RequestBody UserLikeTagReq userLikeTagReq) throws IOException {

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
}
