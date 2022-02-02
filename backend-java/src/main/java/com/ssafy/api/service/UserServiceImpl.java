package com.ssafy.api.service;

import com.ssafy.api.model.UserDto;
import com.ssafy.api.request.UserLikeTagReq;
import com.ssafy.api.request.UserLoginReq;
import com.ssafy.api.request.UserUpdateReq;
import com.ssafy.db.entity.Project;
import com.ssafy.db.entity.Study;
import com.ssafy.db.entity.UserLike;
import com.ssafy.db.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ssafy.api.request.UserRegisterReq;
import com.ssafy.db.entity.User;

import java.util.ArrayList;
import java.util.List;
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
	StudyRepositorySupport studyRepositorySupport;

	@Autowired
	UserLikeRepository userLikeRepository;

	@Autowired
	UserLikeRepositorySupport userLikeRepositorySupport;

	@Autowired
	ValidRepository valid;

	@Autowired
	PasswordEncoder passwordEncoder;

	@Override
	public User createUser(UserRegisterReq userRegisterInfo) {
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
		user.setUserClass(userRegisterInfo.getUserClass());
		user.setPosition(userRegisterInfo.getPosition());

		return userRepository.save(user);
	}

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
	public int updateUser(UserUpdateReq userUpdateInfo) {
		return userRepositorySupport.updateUser(userUpdateInfo);
	}

	@Override
	public void deleteUser(Long userId) {
		// stack, file, project, study, board, comment 다 지우기.
		userRepositorySupport.deleteUser(userId);
		stackRepositorySupport.deleteStack(userId, "user");
		fileRepositorySupport.deleteFile(userId, "user");
		Project project=projectRepositorySupport.selectByHost(userId);
		if (project!=null){
			projectRepositorySupport.deleteProject(userId, project.getId());
		}

	}

	@Override
	public int joinUserProject(Long userId, Long projectId, String projectPosition, String projectJoinStatus) {
		return userRepositorySupport.joinUserProject(userId, projectId, projectPosition, projectJoinStatus);
	}

	@Override
	public int approveUserProject(Long hostId, Long userId, Long projectId, String projectJoinStatus) {
		Project project=projectRepositorySupport.selectByHost(hostId);
		System.out.println(project);
		if (project==null || project.getId()!=projectId){
			return 402;	// host 틀림
		}
		User user=userRepositorySupport.selectUser(userId);
		if (user==null || user.getProjectId()!=projectId || !"BEFORE".equalsIgnoreCase(user.getProjectJoinStatus())){
			return 401;
		}
		return userRepositorySupport.approveUserProject(userId, projectJoinStatus);
	}

	@Override
	public int updateUserPassword(UserLoginReq updateInfo) {
		return userRepositorySupport.updateUserPassword(updateInfo);
	}

	@Override
	public List<UserDto> selectUserAll() {
		List<User> results=userRepositorySupport.selectUserAll();
		if (results==null){
			return null;
		}
		List<UserDto> users=new ArrayList<>();
		for (User result: results){
			users.add(userEntityToDto(result));
		}

		return users;
	}

	@Override
	public UserDto selectUser(Long userId) {
		User result=userRepositorySupport.selectUser(userId);
		if (result==null){
			return null;
		}
		return userEntityToDto(result);
	}

	@Override
	public int updateNickCheck(Long id, String nickname) {
		if(nickname.length()<2||nickname.length()>16){
			return 401;
		}
		else if(userRepositorySupport.findUserByNickname(id, nickname)!=null){	// 닉네임 중복
			return 402;
		}
		return 200;
	}

	@Override
	public UserDto userEntityToDto(User result) {
		UserDto user=new UserDto();
		Long userId= result.getId();
		user.setId(userId);
		user.setStudentId(result.getStudentId());
		user.setPosition(result.getPosition());
		user.setPhone(result.getPhone());
//        user.setPassword(result.getPassword());
		user.setName(result.getName());
		user.setDescription(result.getDescription());
		user.setNickname(result.getNickname());
		user.setLink(result.getLink());
		user.setGeneration(result.getGeneration());
		user.setEmail(result.getEmail());
		user.setBirthday(result.getBirthday());
		user.setUserClass(result.getUserClass());
		user.setProjectPosition(result.getProjectPosition());
		user.setProjectId(result.getProjectId());
		user.setProjectJoinStatus(result.getProjectJoinStatus());
		user.setFile(fileRepositorySupport.selectFile(userId, "user"));
		user.setStacks(stackRepositorySupport.selectStack(userId, "user"));

		return user;
	}

	@Override
	public List<UserDto> selectProjectUsers(Long userId, Long projectId) {
		User userResult = userRepositorySupport.selectUser(userId);
		if (userResult==null || userResult.getProjectId()!=projectId){
			return null;
		}
		List<User> results = projectRepositorySupport.selectProjectUsers(projectId);
		if (results==null){
			return null;
		}
		List<UserDto> users=new ArrayList<>();
		for (User result: results){
			users.add(userEntityToDto(result));
		}
		return users;
	}

	@Override
	public List<UserDto> selectProjectJoinUsers(Long userId, Long projectId) {
		Project projectResult = projectRepositorySupport.selectByHost(userId);
		if (projectResult==null || projectResult.getId()!=projectId){
			return null;
		}
		List<User> results = projectRepositorySupport.selectJoinUsers(projectId);
		if (results==null){
			return null;
		}
		List<UserDto> users=new ArrayList<>();
		for (User result: results){
			users.add(userEntityToDto(result));
		}
		return users;
	}

	@Override
	public int quitProject(Long userId, Long projectId) {
		Project project = projectRepositorySupport.selectProject(userId, projectId);
		if (userId.equals(project.getHostId())){
			return 403;
		}
		User user=userRepositorySupport.selectUser(userId);
		if (user.getProjectId()==projectId && "OK".equalsIgnoreCase(user.getProjectJoinStatus())){
			return userRepositorySupport.resetUserProject(userId);
		}
		return 402;
	}

	@Override
	public int joinCancelProject(Long userId, Long projectId) {
		User user=userRepositorySupport.selectUser(userId);
		if (user.getProjectId()==projectId && "BEFORE".equalsIgnoreCase(user.getProjectJoinStatus())){
			return userRepositorySupport.resetUserProject(userId);
		}
		return 402;

	}

	@Override
	public int userLikeTag(UserLikeTagReq userLikeTagReq) {
		Long userId= userLikeTagReq.getUserId();
		Long tagId= userLikeTagReq.getTagId();
		String tag= userLikeTagReq.getTag();
		if (!valid.isUserValid(userId)){
			return 401;
		}
		if (!valid.isTargetValid(tagId, tag)){
			return 402;
		}

		UserLike result=userLikeRepositorySupport.userLike(userId, tagId, tag);
		if (result==null){
			UserLike userLike=new UserLike();
			userLike.setUserId(userId);
			userLike.setTagId(tagId);
			userLike.setTag(tag);
			userLikeRepository.save(userLike);
			return 200;
		} else {
			userLikeRepositorySupport.deleteUserLike(userId, tagId, tag);
			return 201;
		}
	}

	@Override
	public List<UserDto> selectStudyUsers(Long userId, Long studyId) {
		List<Study> studies = studyRepositorySupport.selectByUser(userId);
		for (Study study: studies){
			if (study.getId()==studyId){
				List<User> results = studyRepositorySupport.selectStudyUsers(studyId);

				if (results==null || results.size()==0){
					return null;
				}
				List<UserDto> users=new ArrayList<>();
				for (User result: results){
					users.add(userEntityToDto(result));
				}
				return users;
			}
		}
		return null;
	}

	@Override
	public List<UserDto> selectStudyJoinUsers(Long userId, Long studyId) {
		Study study = studyRepositorySupport.selectStudy(studyId);
		if (study==null || study.getHostId()!=userId){
			return null;
		}
		List<User> results = studyRepositorySupport.selectJoinUsers(studyId);
		if (results==null){
			return null;
		}
		List<UserDto> users=new ArrayList<>();
		for (User result: results){
			users.add(userEntityToDto(result));
		}
		return users;
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




