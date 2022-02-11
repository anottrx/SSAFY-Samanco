package com.ssafy.api.service;

import com.ssafy.db.entity.EmailCode;
import com.ssafy.db.repository.EmailRepository;
import com.ssafy.db.repository.EmailRepositorySupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.JavaMailSender;

import javax.mail.Message.RecipientType;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Random;

@Service
public class EmailServiceImpl implements EmailService{

    @Autowired
    JavaMailSender emailSender;

    @Autowired
    EmailRepository emailRepository;

    @Autowired
    EmailRepositorySupport emailRepositorySupport;

    static String code;

    @Override
    public void sendMessage(String email, String tagKor, String tag)throws Exception {
        MimeMessage message = createMessage(email, tagKor);
        try{
            emailSender.send(message);
            EmailCode emailCode=new EmailCode();
            emailCode.setEmail(email);
            emailCode.setCode(code);
            emailCode.setTag(tag);
            emailRepository.save(emailCode);
        } catch(MailException es){
            es.printStackTrace();
            throw new IllegalArgumentException();
        }

    }

    @Override
    public int confirmCode(String email, String code, String tag) {
        if (emailRepositorySupport.selectEmailCode(email, code, tag)==null){
            return 401;
        }
        return 200;
    }

    private MimeMessage createMessage(String email, String tag)throws Exception{
        code=createCode();
        System.out.println("보내는 대상 : "+ email);
        System.out.println("인증 번호 : "+code);
        MimeMessage message = emailSender.createMimeMessage();

        message.addRecipients(RecipientType.TO, email);//보내는 대상
        message.setSubject("싸피사만코 인증번호가 도착했습니다.");//제목

        message.setText(message(tag, code).toString(), "utf-8", "html");//내용
        message.setFrom(new InternetAddress("qudehdqud@gmail.com","싸피사만코"));//보내는 사람

        return message;
    }
    //		인증코드 만들기
    public String createCode() {
        StringBuffer sb = new StringBuffer();
        Random rnd = new Random();

        for (int i = 0; i < 8; i++) { // 인증코드 8자리
            int index = rnd.nextInt(3); // 0~2 까지 랜덤

            switch (index) {
                case 0:
                    sb.append((char) ((int) (rnd.nextInt(26)) + 97));
                    //  a~z  (ex. 1+97=98 => (char)98 = 'b')
                    break;
                case 1:
                    sb.append((char) ((int) (rnd.nextInt(26)) + 65));
                    //  A~Z
                    break;
                case 2:
                    sb.append((rnd.nextInt(10)));
                    // 0~9
                    break;
            }
        }

        return sb.toString();
    }

    public String message(String tag, String code){
        StringBuilder msg=new StringBuilder();
        msg.append("<div style='margin:100px;'>");
        msg.append("<h1> 안녕하세요 싸피사만코 입니다!!! </h1>");
        msg.append("<br>");
        msg.append("<p>"+tag+" 창으로 돌아가 아래 코드를 입력해주세요<p>");
        msg.append("<br>");
        msg.append("<p>감사합니다!<p>");
        msg.append("<br>");
        msg.append("<div align='center' style='border:1px solid black; font-family:verdana';>");
        msg.append("<h3 style='color:blue;'>"+tag+" 확인 코드입니다.</h3>");
        msg.append("<div style='font-size:130%'>");
        msg.append("CODE : <strong>");
        msg.append(code+"</strong><div><br/> ");
        msg.append("</div>");
        return msg.toString();
    }
}
