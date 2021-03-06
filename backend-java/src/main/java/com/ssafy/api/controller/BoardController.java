package com.ssafy.api.controller;

import com.ssafy.api.model.BoardDto;
import com.ssafy.api.model.FileDto;
import com.ssafy.api.model.UserDto;
import com.ssafy.api.request.*;
import com.ssafy.api.response.*;
import com.ssafy.api.service.FileService;
import com.ssafy.api.service.StackService;
import com.ssafy.api.service.BoardService;
import com.ssafy.api.service.UserService;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Board;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import static com.ssafy.common.util.JsonUtil.getListMapFromString;


@RestController
@RequestMapping("/api/board")
public class BoardController {

    @Autowired
    BoardService boardService;

    @Autowired
    UserService userService;

    @Autowired
    FileService fileService;

    @PostMapping()
    @ApiOperation(value = "board register")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> register(
            @RequestParam("userId") Long userId,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("tag") String tag,    // tag id 추가

//            @RequestParam(required = false, value="startDate") String startDate,
//            @RequestParam(required = false, value="endDate") String endDate,
            @RequestParam(required = false, value="file") MultipartFile[] files) throws IOException, ParseException {

        BoardRegisterReq registerInfo=new BoardRegisterReq();
        registerInfo.setTitle(title);
        registerInfo.setUserId(userId);
        registerInfo.setContent(content);
        registerInfo.setTag(tag);
//        registerInfo.setStartDate(startDate);
//        registerInfo.setEndDate(endDate);

        if (files!=null) {
            System.out.println(files[0].getOriginalFilename());
        }

        // board create
        Board board = boardService.createBoard(registerInfo);

        // board 이미지 입력
        if (files!=null) {
            fileService.saveFile(files, board.getId(), "board");
        }
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @PostMapping("/update")
    @ApiOperation(value = "board update")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> update(
            @RequestParam("boardId") Long boardId,
            @RequestParam("userId") Long userId,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
//            @RequestParam(required = false, value="startDate") String startDate,
//            @RequestParam(required = false, value="endDate") String endDate,
            @RequestParam(required = false, value="file") MultipartFile[] files) throws IOException, ParseException {

        BoardUpdateReq updateInfo=new BoardUpdateReq();
        updateInfo.setBoardId(boardId);
        updateInfo.setTitle(title);
        updateInfo.setUserId(userId);
        updateInfo.setContent(content);
//        updateInfo.setStartDate(startDate);
//        updateInfo.setEndDate(endDate);
        // board update
        int boardCode=boardService.updateBoard(updateInfo);
        // board 이미지 update
        fileService.updateFile(files, updateInfo.getBoardId(), "board");
        if (boardCode==401){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "유효하지 않은 게시글입니다."));
        } else if (boardCode==402){
            return ResponseEntity.status(200).body(BaseResponseBody.of(402, "유효하지 않은 사용자입니다."));
        }
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @PostMapping("/delete")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> delete(@RequestBody BoardUserIdReq deleteInfo) throws IOException {

        // board delete
        int deleteCode=boardService.deleteBoard(deleteInfo.getUserId(), deleteInfo.getBoardId());

        if (deleteCode==401){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "유효하지 않은 사용자입니다."));
        } else if (deleteCode==402){
            return ResponseEntity.status(200).body(BaseResponseBody.of(402, "유효하지 않은 스터디입니다."));
        }
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @PostMapping("/user")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "등록한 게시글 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectBoardByUser(@RequestBody UserIdReq userInfo) throws IOException {

        List<BoardDto> boards=boardService.selectByUser(userInfo.getUserId());
        if (boards==null){
            return ResponseEntity.status(200).body(BoardSelectAllRes.of(401, "등록한 게시글이 없습니다.", null));
        }
        return ResponseEntity.status(200).body(BoardSelectAllRes.of(200, "Success", boards));
    }

    @PostMapping("/view")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "게시글 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectBoard(
            @RequestBody @ApiParam(value="board id", required = true) BoardUserIdHitReq boardInfo) throws IOException {

        BoardDto board=boardService.selectBoard(boardInfo.getUserId(), boardInfo.getBoardId(), boardInfo.getAddHit());
        if (board==null){
            return ResponseEntity.status(200).body(BoardSelectRes.of(401, "유효하지 않은 게시글입니다.", null));
        }
        return ResponseEntity.status(200).body(BoardSelectRes.of(200, "Success", board));
    }

//    @GetMapping("/{boardId}")
//    @ApiResponses({
//            @ApiResponse(code = 200, message = "성공"),
//            @ApiResponse(code = 401, message = "게시글 없음"),
//            @ApiResponse(code = 500, message = "서버 오류")
//    })
//    public ResponseEntity<? extends BaseResponseBody> selectBoard(@PathVariable("boardId") Long boardId) throws IOException {
//
//        BoardDto board=boardService.selectBoard(0l, boardId);
//        if (board==null){
//            return ResponseEntity.status(200).body(BoardSelectRes.of(401, "유효하지 않은 게시글입니다.", null));
//        }
//        return ResponseEntity.status(200).body(BoardSelectRes.of(200, "Success", board));
//    }

    @PostMapping("/title")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "게시글 목록 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectBoardAllByTitle(@RequestBody BoardTagTitleReq boardTagTitleReq) throws IOException {

        String tag = boardTagTitleReq.getTag();
        String title = boardTagTitleReq.getTitle();
        List<BoardDto> boards=null;
        if ("all".equalsIgnoreCase(tag)) {
            boards = boardService.selectBoardByTitle(title);
        } else {
            boards = boardService.selectBoardByTitleTag(title, tag);
        }
        if (boards==null || boards.size()==0){
            return ResponseEntity.status(200).body(BoardSelectAllRes.of(401, "게시글 목록이 없습니다.", null));
        }
        return ResponseEntity.status(200).body(BoardSelectAllRes.of(200, "Success", boards));
    }

    @GetMapping("/{tag}")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "게시글 목록 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectBoardAllByTag(@PathVariable("tag") String tag) throws IOException {

        List<BoardDto> boards=null;
        System.out.println(tag);
        if ("all".equalsIgnoreCase(tag)) {
            boards = boardService.selectBoardAll();
        } else {
            boards = boardService.selectBoardAllByTag(tag);
        }
        if (boards==null || boards.size()==0){
            return ResponseEntity.status(200).body(BoardSelectAllRes.of(401, "게시글 목록이 없습니다.", null));
        }
        return ResponseEntity.status(200).body(BoardSelectAllRes.of(200, "Success", boards));
    }

//    @GetMapping
//    @ApiResponses({
//            @ApiResponse(code = 200, message = "성공"),
//            @ApiResponse(code = 401, message = "게시글 목록 없음"),
//            @ApiResponse(code = 500, message = "서버 오류")
//    })
//    public ResponseEntity<? extends BaseResponseBody> selectBoardAll() throws IOException {
//
//        List<BoardDto> boards=boardService.selectBoardAll();
//        if (boards==null || boards.size()==0){
//            return ResponseEntity.status(200).body(BoardSelectAllRes.of(401, "게시글 목록이 없습니다.", null));
//        }
//        return ResponseEntity.status(200).body(BoardSelectAllRes.of(200, "Success", boards));
//    }

    @GetMapping("/like/{tag}")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "게시글 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectBoardLikeOrder(@PathVariable("tag") String tag) throws IOException {

        List<BoardDto> boards=null;
        if ("all".equalsIgnoreCase(tag)){
            boards=boardService.selectBoardLikeOrder();
        } else {
            boards=boardService.selectBoardLikeOrderTag(tag);
        }
        if (boards==null || boards.size()==0){
            return ResponseEntity.status(200).body(BoardSelectAllRes.of(401, "유효하지 않은 게시글입니다.", null));
        }
        return ResponseEntity.status(200).body(BoardSelectAllRes.of(200, "Success", boards));
    }

    @PostMapping("/like")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "유효하지 않은 사용자"),
            @ApiResponse(code = 401, message = "유효하지 않은 태그"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> updateBoardLike(@RequestBody UserLikeTagReq userLikeTagReq) throws IOException {

        int likeCode=userService.userLikeTag(userLikeTagReq);
        if (likeCode==401){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "유효하지 않은 사용자입니다."));
        } else if (likeCode==402){
            return ResponseEntity.status(200).body(BaseResponseBody.of(402, "유효하지 않은 태그입니다."));
        } else if (likeCode==201){
            return ResponseEntity.status(200).body(BaseResponseBody.of(201, "좋아요 취소"));
        }
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "좋아요"));
    }

    @GetMapping("/download/{path}")
    public ResponseEntity<? extends BaseResponseBody> getImageWithMediaType(@PathVariable("path") String path) {
        String realPath = new File("").getAbsolutePath() + File.separator + "files";
        String[] paths=path.split("&");
        String filePath = realPath + File.separator + paths[0] + File.separator + paths[1];
        File target = new File(filePath);
        System.out.println("target: "+target);
        byte[] fileByte = new byte[0];
        try {
            fileByte = FileUtils.readFileToByteArray(target);
        } catch (IOException e) {
//            e.printStackTrace();
            System.out.println("file not found");
            return ResponseEntity.status(200).body(FileStringRes.of(401, "해당 파일을 다운로드할 수 없습니다.", null));
        }
        String fileString = new String(Base64.encodeBase64(fileByte));

        return ResponseEntity.status(200).body(FileStringRes.of(200, "success", fileString));
    }

}