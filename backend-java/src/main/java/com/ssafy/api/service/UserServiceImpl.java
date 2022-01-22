package com.ssafy.api.service;

import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ssafy.api.request.UserRegisterPostReq;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.UserRepository;
import com.ssafy.db.repository.UserRepositorySupport;

import java.util.Optional;
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
	PasswordEncoder passwordEncoder;

	@Override
	public User createUser(UserRegisterPostReq userRegisterInfo) {
		User user = new User();
		user.setUserId(userRegisterInfo.getId());
		// 보안을 위해서 유저 패스워드 암호화 하여 디비에 저장.
		user.setPassword(passwordEncoder.encode(userRegisterInfo.getPassword()));
		user.setEmail(userRegisterInfo.getEmail());
		user.setPhone(userRegisterInfo.getPhone());
		user.setName(userRegisterInfo.getName());
		return userRepository.save(user);
	}

	@Override
	public User getUserByUserId(String userId) {
		// 디비에 유저 정보 조회 (userId 를 통한 조회).
		if (!userRepositorySupport.findUserByUserId(userId).isPresent()){
			return null;
		}
		User user = userRepositorySupport.findUserByUserId(userId).get();
		return user;
	}

	@Override
	public int idCheck(String userId) {
		//아이디 길이가 안맞으면 401에러 리턴
		if(userId.length()<4 || userId.length()>16){
			return 401;
		}
		//디비에서 userId로 찾아봤는데 null이 아니면 (값이 있으면) 중복되므로 402에러리턴
		else if(userRepositorySupport.findUserByUserId(userId).isPresent()){
			return 402;
		}
		//아이디가 길이도 맞고 중복되지도 않다면 성공 200
		return 200;

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
		if(userEmail == null)
			return 401;
		Pattern emailPattern = Pattern.compile("^[0-9a-zA-Z_-]+@[0-9a-zA-Z]+\\.[a-zA-Z]{2,6}$");
		Matcher emailMatcher = emailPattern.matcher(userEmail);
		if(!emailMatcher.find())
			return 402;

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




