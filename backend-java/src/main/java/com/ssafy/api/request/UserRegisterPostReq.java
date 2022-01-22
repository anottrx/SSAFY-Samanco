package com.ssafy.api.request;

import com.google.gson.JsonArray;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 유저 회원가입 API ([POST] /api/users) 요청에 필요한 리퀘스트 바디 정의.
 */
@Getter
@Setter
@ApiModel("UserRegisterPostRequest")
public class UserRegisterPostReq {
	@ApiModelProperty(name="유저 email", example="email@email.com")
	String email;

	@ApiModelProperty(name="유저 Password", example="your_password")
	String password;

	@ApiModelProperty(name="유저 Name", example="김싸피")
	String name;

	@ApiModelProperty(name="유저 nickname", example="싸피사만코")
	String nickname;

	@ApiModelProperty(name="유저 Phone", example="01012345678")
	String phone;

	@ApiModelProperty(name="유저 반", example="JAVA")
	String userClass;

	@ApiModelProperty(name="유저 생년월일", example="000410")
	String birthday;

	@ApiModelProperty(name="유저 기수", example="6")
	int generation;

	@ApiModelProperty(name="유저 학번", example="0643163")
	String studentId;

	@ApiModelProperty(name="유저 position", example="FRONTEND")
	String position;

	@ApiModelProperty(name="유저 stack", example="[{java: 3}, {HTML: 1}]")
	List<Map<String, Integer>> stacks;

	@ApiModelProperty(name="유저 link", example="https://kjin41@github.com/")
	String link;

	@ApiModelProperty(name="유저 소개", example="JPA 완전 정복..!")
	String description;

}
