package com.ssafy.api.service;

public interface EmailService {
    void sendMessage(String to, String tagKor, String tag) throws Exception;
    int confirmCode(String email, String code, String tag);

//    public void sendFindPassMessage(String email, String tag) throws Exception;
}
