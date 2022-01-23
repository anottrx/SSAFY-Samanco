package com.ssafy.api.service;

import com.ssafy.api.request.UserUpdatePostReq;
import com.ssafy.db.entity.Project;
import com.ssafy.db.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ssafy.api.request.UserRegisterPostReq;
import com.ssafy.db.entity.User;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 *   유저 관련 비즈니스 로직 처리를 위한 서비스 구현 정의.
 */
@Service("userService")
public class UserServiceImpl implements UserService {
	@Autowired
	UserRepository userRepository;

	@Autowired
	UserRepositorySupport userRepositorySupport;

	@Autowired
	StackRepositorySupport stackRepositorySupport;

	@Autowired
	FileRepositorySupport fileRepositorySupport;

	@Autowired
	ProjectRepositorySupport projectRepositorySupport;

	@Autowired
	PasswordEncoder passwordEncoder;

	@Override
	public User createUser(UserRegisterPostReq userRegisterInfo) {
		User user = new User();
		// 보안을 위해서 유저 패스워드 암호화 하여 디비에 저장.
		user.setPassword(passwordEncoder.encode(userRegisterInfo.getPassword()));
		user.setEmail(userRegisterInfo.getEmail());
		user.setPhone(userRegisterInfo.getPhone());
		user.setName(userRegisterInfo.getName());
		user.setBirthday(userRegisterInfo.getBirthday());
		user.setDescription(userRegisterInfo.getDescription());
		user.setNickname(userRegisterInfo.getNickname());
		user.setGeneration(userRegisterInfo.getGeneration());
		user.setLink(userRegisterInfo.getLink());
		user.setStudentId(userRegisterInfo.getStudentId());

		return userRepository.save(user);
	}

//	@Override
//	public User getUserByUserId(String userId) {
//		// 디비에 유저 정보 조회 (userId 를 통한 조회).
//		if (!userRepositorySupport.findUserByUserId(userId).isPresent()){
//			return null;
//		}
//		User user = userRepositorySupport.findUserByUserId(userId).get();
//		return user;
//	}

	@Override
	public User getUserByEmail(String email) {
		return userRepositorySupport.findUserByEmail(email);
	}

	@Override
	public int nickCheck(String nickname) {
		System.out.println(userRepositorySupport.findUserByNickname(nickname));
		//아이디 길이가 안맞으면 401에러 리턴
		if(nickname.length()<2||nickname.length()>16){
			return 401;
		}
		//디비에서 userId로 찾아봤는데 null이 아니면 (값이 있으면) 중복되므로 402에러 리턴
		else if(userRepositorySupport.findUserByNickname(nickname)!=null){
			return 402;
		}
		//아이디가 길이도 맞고 중복되지도 않다면 성공 200
		return 200;

	}

	@Override
	public int updateUser(UserUpdatePostReq userUpdateInfo) {
		return userRepositorySupport.updateUser(userUpdateInfo);
	}

	@Override
	public void deleteUser(Long userId) {
		// stack, file, project, study, board, comment 다 지우기.
		userRepositorySupport.deleteUser(userId);
		stackRepositorySupport.deleteStack(userId, 1);
		fileRepositorySupport.deleteFile(userId, 1);
		Long projectId=projectRepositorySupport.selectByHost(userId);
		if (projectId!=null){
			projectRepositorySupport.deleteProject(userId, projectId);
		}

	}


	@Override
	public int addProject(Long userId, Long projectId) {
		int updateUserProjectCode=userRepositorySupport.updateUserProject(userId, projectId);
		if (updateUserProjectCode==401){
			projectRepositorySupport.deleteProject(userId, projectId);
		}
		return updateUserProjectCode;
	}

	@Override
	public int pwdCheck(String userPwd) {
		if(userPwd == null)
			return 401;
		// 비밀번호 포맷 확인(영문, 숫자, 특수문자 포함 8~16자리)
		Pattern passPattern = Pattern.compile("^(?=.*[a-zA-Z])(?=.*\\d)(?=.*\\W).{8,16}$");
		Matcher passMatcher = passPattern.matcher(userPwd);
		if(!passMatcher.find()){
			return 402;
		}
		return 200;
	}

	@Override
	public int nameCheck(String userName) {
		if(userName == null)
			return 401;
		Pattern namePattern = Pattern.compile("^[가-힣]*$");
		Matcher nameMatcher = namePattern.matcher(userName);
		if(!nameMatcher.find())
			return 402;

		return 200;
	}

	@Override
	public int emailCheck(String userEmail) {
		if(userEmail==null)
			return 401;
		Pattern emailPattern = Pattern.compile("^[0-9a-zA-Z_-]+@[0-9a-zA-Z]+\\.[a-zA-Z]{2,6}$");
		Matcher emailMatcher = emailPattern.matcher(userEmail);
		if(!emailMatcher.find())
			return 402;
		if (userRepositorySupport.findUserByEmail(userEmail)!=null)	return 403;

		return 200;
	}

	@Override
	public int phoneCheck(String userPhone) {
		if(userPhone == null)
			return 401;
		Pattern phonePattern = Pattern.compile("\\d{2,3}\\d{3,4}\\d{4}");
		Matcher phoneMatcher = phonePattern.matcher(userPhone);
		if(!phoneMatcher.find())
			return 402;

		return 200;
	}


}




