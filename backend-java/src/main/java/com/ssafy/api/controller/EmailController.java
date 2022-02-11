package com.ssafy.api.controller;

import com.ssafy.api.request.EmailCodeReq;
import com.ssafy.api.request.UserEmailReq;
import com.ssafy.api.service.EmailService;
import com.ssafy.api.service.EmailServiceImpl;
import com.ssafy.api.service.UserService;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    @Autowired
    EmailService emailService;

    @Autowired
    UserService userService;

    @PostMapping("/send")
    public ResponseEntity<? extends BaseResponseBody> registerEmailSend(@RequestBody String email) throws Exception {
        User user = userService.getUserByEmail(email);
        if (user!=null){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "계정이 존재합니다."));
        }
        emailService.sendMessage(email, "회원가입", "register");
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @PostMapping("/code")
    public ResponseEntity<? extends BaseResponseBody> registerConfirmCode(@RequestBody EmailCodeReq emailCodeReq) {
        int verifyCode=emailService.confirmCode(emailCodeReq.getEmail(), emailCodeReq.getCode(), "register");
        if (verifyCode==401) {
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "인증번호가 불일치합니다."));
        }
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @PostMapping("/findpass")
    public ResponseEntity<? extends BaseResponseBody> findPassEmailSend(@RequestBody String email) throws Exception {
        User user = userService.getUserByEmail(email);
        if (user==null){
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "존재하지 않은 이메일입니다."));
        }
        emailService.sendMessage(email, "비밀번호 찾기", "findpass");
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }


    @PostMapping("/passcode")
    public ResponseEntity<? extends BaseResponseBody> findPassConfirmCode(@RequestBody EmailCodeReq emailCodeReq) {
        int verifyCode=emailService.confirmCode(emailCodeReq.getEmail(), emailCodeReq.getCode(), "findpass");
        if (verifyCode==401) {
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "인증번호가 불일치합니다."));
        }
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }
}