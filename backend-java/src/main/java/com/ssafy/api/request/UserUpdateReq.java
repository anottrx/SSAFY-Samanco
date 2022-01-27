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
public class UserUpdateReq {

	@ApiModelProperty(example="1")
	Long userId;
	String password;
	String name;
	String nickname;

	@ApiModelProperty(example="01012345678")
	String phone;

	@ApiModelProperty(example="JAVA")
	String userClass;

	@ApiModelProperty(example="000410")
	String birthday;

	@ApiModelProperty(example="FRONTEND")
	String position;

	@ApiModelProperty(example="[{java: 3}, {HTML: 1}]")
	List<Map<String, Integer>> stacks;

	String link;

	String description;

}
