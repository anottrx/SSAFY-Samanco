package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 유저 로그인 API ([POST] /api/v1/auth/login) 요청에 필요한 리퀘스트 바디 정의.
 */
@Getter
@Setter
@ToString
@ApiModel("UserLoginPostRequest")
public class UserLoginPostReq {
	@ApiModelProperty(name="유저 Email", example="sanmanco@ssafy.com")
	String email;
	@ApiModelProperty(name="유저 Password", example="your_password")
	String password;
}
