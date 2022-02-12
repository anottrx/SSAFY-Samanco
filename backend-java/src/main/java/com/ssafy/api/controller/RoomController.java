package com.ssafy.api.controller;

import com.ssafy.api.model.RoomDto;
import com.ssafy.api.model.UserDto;
import com.ssafy.api.request.*;
import com.ssafy.api.response.RoomSelectAllRes;
import com.ssafy.api.response.RoomSelectRes;
import com.ssafy.api.response.FileStringRes;
import com.ssafy.api.service.RoomService;
import com.ssafy.api.service.FileService;
import com.ssafy.api.service.UserService;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Room;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.FileUtils;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletContext;
import java.io.File;
import java.io.IOException;
import java.util.List;


@RestController
@RequestMapping("/api/room")
public class RoomController {

    @Autowired
    RoomService roomService;

    @Autowired
    UserService userService;

    @Autowired
    FileService fileService;

    @PostMapping()
    @ApiOperation(value = "room register")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> register(@RequestBody RoomRegisterReq roomRegisterReq) throws IOException {

        // room create
        RoomDto room = roomService.createRoom(roomRegisterReq);

        if (room==null){
            return ResponseEntity.status(200).body(RoomSelectRes.of(401, "미팅을 생성할 수 없습니다.", null));
        }
        return ResponseEntity.status(200).body(RoomSelectRes.of(200, "Success", room));
    }

//    @PostMapping("/update")
//    @ApiResponses({
//            @ApiResponse(code = 200, message = "성공"),
//            @ApiResponse(code = 500, message = "서버 오류")
//    })
//    public ResponseEntity<? extends BaseResponseBody> update(@RequestBody RoomUpdateReq roomUpdateReq) throws IOException, ParseException {
//
//        // room update
//        int roomCode=roomService.updateRoom(roomUpdateReq);
//        if (roomCode==401){
//            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "유효하지 않은 미팅입니다."));
//        } else if (roomCode==402){
//            return ResponseEntity.status(200).body(BaseResponseBody.of(402, "유효하지 않은 사용자입니다."));
//        }
//
//        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
//    }

    @PostMapping("/join")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> joinUserRoom(@RequestBody RoomUserIdPassReq roomUserIdPassReq) throws IOException {

        Long userId = roomUserIdPassReq.getUserId();
        Long roomId = roomUserIdPassReq.getRoomId();
        String password = roomUserIdPassReq.getPassword();
        int joinCode = userService.joinUserRoom(userId, roomId, password);
        if (joinCode==401){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "미팅에 참여할 수 없습니다."));
        } else if (joinCode==402){
            return ResponseEntity.status(200).body(BaseResponseBody.of(402, "유효하지 않은 미팅입니다."));
        } else if (joinCode==403){
            return ResponseEntity.status(200).body(BaseResponseBody.of(403, "비밀번호를 다시 확인하세요."));
        } else if (joinCode==405){
            return ResponseEntity.status(200).body(BaseResponseBody.of(405, "인원 초과로 미팅에 참여할 수 없습니다."));
        }
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @PostMapping("/quit")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> joinUserRoom(@RequestBody RoomUserIdReq roomUserIdReq) throws IOException {

        Long userId = roomUserIdReq.getUserId();
        Long roomId = roomUserIdReq.getRoomId();
        int quitCode = userService.quitUserRoom(userId, roomId);
        if (quitCode==401){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "유효하지 않은 사용자입니다."));
        } else if (quitCode==402){
            return ResponseEntity.status(200).body(BaseResponseBody.of(402, "참여하지 않은 미팅입니다."));
        }

        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @PostMapping("/view")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectRoom(@RequestBody RoomIdReq roomInfo) throws IOException {

        Long roomId= roomInfo.getRoomId();
        RoomDto room=roomService.selectRoom(roomId);
        if (room==null){
            return ResponseEntity.status(200).body(RoomSelectRes.of(401, "유효하지 않은 미팅입니다.", null));
        }
        room.setUsers(userService.selectRoomUsers(roomId));
        if (room.getUsers()==null){
            room.setSize(0);
        } else {
            room.setSize(room.getUsers().size());
        }
        return ResponseEntity.status(200).body(RoomSelectRes.of(200, "Success", room));
    }

    @GetMapping()
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "게시글 목록 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectRoomAll(){

        List<RoomDto> rooms= roomService.selectRoomAll();

        if (rooms==null || rooms.size()==0){
            return ResponseEntity.status(200).body(RoomSelectAllRes.of(401, "미팅 목록이 없습니다.", null));
        }
        for (RoomDto room: rooms) {
            room.setUsers(userService.selectRoomUsers(room.getRoomId()));
            if (room.getUsers() == null) {
                room.setSize(0);
            } else {
                room.setSize(room.getUsers().size());
            }
        }
        return ResponseEntity.status(200).body(RoomSelectAllRes.of(200, "Success", rooms));
    }

    @GetMapping("/title/{title}")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "게시글 목록 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectRoomAllByTitle(@PathVariable String title) throws IOException {

        List<RoomDto> rooms= roomService.selectRoomByTitle(title);

        if (rooms==null || rooms.size()==0){
            return ResponseEntity.status(200).body(RoomSelectAllRes.of(401, "미팅 목록이 없습니다.", null));
        }
        return ResponseEntity.status(200).body(RoomSelectAllRes.of(200, "Success", rooms));
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