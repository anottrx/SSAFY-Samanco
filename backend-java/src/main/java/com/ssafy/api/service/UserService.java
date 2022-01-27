package com.ssafy.api.service;

import com.ssafy.api.model.UserDto;
import com.ssafy.api.request.UserLoginPostReq;
import com.ssafy.api.request.UserRegisterPostReq;
import com.ssafy.api.request.UserUpdatePostReq;
import com.ssafy.db.entity.User;

import java.util.List;

/**
 *	유저 관련 비즈니스 로직 처리를 위한 서비스 인터페이스 정의.
 */
public interface UserService {
	User createUser(UserRegisterPostReq userRegisterInfo);
//	User getUserByUserId(String userId);
	User getUserByEmail(String email);
	int pwdCheck(String userPwd);
	int nameCheck(String userName);
	int emailCheck(String userEmail);
	int phoneCheck(String userPhone);
    int nickCheck(String nickname);
    int updateUser(UserUpdatePostReq registerInfo);
	void deleteUser(Long userId);
	int updateUserProject(Long userId, Long projectId, String projectPosition, String projectJoinStatus);
    int updateUserPassword(UserLoginPostReq updateInfo);
	List<UserDto> selectUserAll();
    UserDto selectUser(Long userId);
    int updateNickCheck(Long id, String nickname);
	UserDto userEntityToDto(User user);
}
