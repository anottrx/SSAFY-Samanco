package com.ssafy.api.controller;

import com.ssafy.api.request.UserEmailReq;
import com.ssafy.api.service.EmailService;
import com.ssafy.api.service.EmailServiceImpl;
import com.ssafy.common.model.response.BaseResponseBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
public class EmailController {
    @Autowired
    EmailService service;

    @PostMapping("/mail")
    @ResponseBody
    public ResponseEntity<? extends BaseResponseBody> emailConfirm(@RequestBody String email) throws Exception {
//        System.out.println("전달 받은 이메일 : " + email);
        service.sendSimpleMessage(email);
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @PostMapping("/verifyCode")
    @ResponseBody
    public ResponseEntity<? extends BaseResponseBody> verifyCode(@RequestBody String code) {
//        code = code.substring(1, code.length() - 1);
//        System.out.println("code : " + code);
//        System.out.println("정답 code : " + EmailServiceImpl.ePw);
        if (EmailServiceImpl.ePw.equals(code)) {
            return ResponseEntity.status(200).body(BaseResponseBody.of(200, "일치합니다."));
        }
        return ResponseEntity.status(200).body(BaseResponseBody.of(401, "불일치합니다."));
    }
}