package com.ssafy.api.controller;

import com.ssafy.api.model.CommentDto;
import com.ssafy.api.request.*;
import com.ssafy.api.response.CommentSelectRes;
import com.ssafy.api.service.CommentService;
import com.ssafy.api.service.FileService;
import com.ssafy.api.service.UserService;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Comment;
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


@RestController
@RequestMapping("/api/comment")
public class CommentController {

    @Autowired
    CommentService commentService;

    @Autowired
    UserService userService;

    @Autowired
    FileService fileService;


    @PostMapping()
    @ApiOperation(value = "comment register")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> register(@RequestBody CommentRegisterReq commentRegisterReq) {
        // comment create
        int createCode = commentService.createComment(commentRegisterReq);
        if (createCode==401){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "댓글을 등록할 수 없습니다."));
        }

        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @PostMapping("/update")
    @ApiOperation(value = "comment update")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> update(@RequestBody CommentUpdateReq commentUpdateReq) {

        // comment update
        int commentCode=commentService.updateComment(commentUpdateReq);
        if (commentCode==401){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "댓글을 수정할 수 없습니다."));
        }
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @PostMapping("/delete")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> delete(@RequestBody CommentUserIdReq deleteInfo) {

        // comment delete
        int deleteCode=commentService.deleteComment(deleteInfo.getUserId(), deleteInfo.getCommentId());

        if (deleteCode==401){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "댓글을 삭제할 수 없습니다."));
        }
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @PostMapping("/view")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "게시글 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> selectComment(@RequestBody CommentUserIdReq commentInfo) {

        CommentDto comment=commentService.selectComment(commentInfo.getUserId(), commentInfo.getCommentId());
        if (comment==null){
            return ResponseEntity.status(200).body(CommentSelectRes.of(401, "유효하지 않은 게시글입니다.", null));
        }
        return ResponseEntity.status(200).body(CommentSelectRes.of(200, "Success", comment));
    }

}
