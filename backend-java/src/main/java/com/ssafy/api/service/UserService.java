package com.ssafy.api.service;

import com.ssafy.api.model.UserDto;
import com.ssafy.api.request.UserLoginReq;
import com.ssafy.api.request.UserRegisterReq;
import com.ssafy.api.request.UserUpdateReq;
import com.ssafy.db.entity.User;

import java.util.List;

/**
 *	유저 관련 비즈니스 로직 처리를 위한 서비스 인터페이스 정의.
 */
public interface UserService {
	User createUser(UserRegisterReq userRegisterInfo);
//	User getUserByUserId(String userId);
	User getUserByEmail(String email);
	int pwdCheck(String userPwd);
	int nameCheck(String userName);
	int emailCheck(String userEmail);
	int phoneCheck(String userPhone);
    int nickCheck(String nickname);
    int updateUser(UserUpdateReq registerInfo);
	void deleteUser(Long userId);
	int joinUserProject(Long userId, Long projectId, String projectPosition, String projectJoinStatus);

	int approveUserProject(Long hostId, Long userId, Long projectId, String projectJoinStatus);

	int updateUserPassword(UserLoginReq updateInfo);
	List<UserDto> selectUserAll();
    UserDto selectUser(Long userId);
    int updateNickCheck(Long id, String nickname);
	UserDto userEntityToDto(User user);
    List<UserDto> selectProjectUsers(Long userId, Long projectId);
    List<UserDto> selectJoinUsers(Long userId, Long projectId);
	int quitProject(Long userId, Long projectId);
	int joinCancelProject(Long userId, Long projectId);
}
