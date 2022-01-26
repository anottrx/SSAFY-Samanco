package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;
import java.util.Map;

/**
 * 유저 회원수정 API ([POST] /api/user/update) 요청에 필요한 리퀘스트 바디 정의.
 */
@Getter
@Setter
@ToString
@ApiModel("UserUpdatePostRequest")
public class UserUpdatePostReq {

	@ApiModelProperty(name="userId", example="1")
	Long userId;

//	@ApiModelProperty(name="email", example="email@email.com")
//	String email;

	@ApiModelProperty(name="password", example="your_password")
	String password;

	@ApiModelProperty(name="name", example="김싸피")
	String name;

	@ApiModelProperty(name="nickname", example="싸피사만코")
	String nickname;

	@ApiModelProperty(name="phone", example="01012345678")
	String phone;

	@ApiModelProperty(name="userClass", example="JAVA")
	String userClass;

	@ApiModelProperty(name="birthday", example="000410")
	String birthday;

//	@ApiModelProperty(name="generation", example="6")
//	int generation;

//	@ApiModelProperty(name="studentId", example="0643163")
//	String studentId;

	@ApiModelProperty(name="position", example="FRONTEND")
	String position;

	@ApiModelProperty(name="stacks", example="[{java: 3}, {HTML: 1}]")
	List<Map<String, Integer>> stacks;

	@ApiModelProperty(name="link", example="https://kjin41@github.com/")
	String link;

	@ApiModelProperty(name="description", example="JPA 완전 정복..!")
	String description;

}
