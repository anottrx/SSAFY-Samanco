package com.ssafy.api.controller;

import com.ssafy.api.model.UserDto;
import com.ssafy.api.request.*;
import com.ssafy.api.response.UserSelectAllPostRes;
import com.ssafy.api.response.UserSelectPostRes;
import com.ssafy.api.service.FileService;
import com.ssafy.api.service.StackService;
import com.ssafy.db.entity.StackGrade;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.ssafy.api.response.UserLoginPostRes;
import com.ssafy.api.response.UserRes;
import com.ssafy.api.service.UserService;
import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.common.util.JwtTokenUtil;
import com.ssafy.db.entity.User;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.web.multipart.MultipartFile;
import springfox.documentation.annotations.ApiIgnore;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import static com.ssafy.common.util.JsonUtil.getListMapFromString;

/**
 * 유저 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@Api(value = "유저 API", tags = {"User"})
@RestController
@RequestMapping("/api/user")
public class UserController {

	@Autowired
	UserService userService;

	@Autowired
	StackService stackService;

	@Autowired
	FileService fileService;

	@Autowired
	PasswordEncoder passwordEncoder;

	@PostMapping()
	@ApiOperation(value = "회원 가입")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 401, message = "인증 실패"),
			@ApiResponse(code = 404, message = "사용자 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<? extends BaseResponseBody> register(
			@RequestParam("email") String email,
			@RequestParam("password") String password,
			@RequestParam("name") String name,
			@RequestParam("nickname") String nickname,
			@RequestParam("studentId") String studentId,
			@RequestParam(required = false, value="phone") String phone,
			@RequestParam(required = false, value="stacks") String stacks,
			@RequestParam(required = false, value="birthday") String birthday,
			@RequestParam(required = false, value="generation") int generation,
			@RequestParam(required = false, value="class") String userClass,
			@RequestParam(required = false, value="position") String position,
			@RequestParam(required = false, value="link") String link,
			@RequestParam(required = false, value="description") String description,
			@RequestParam(required = false, value="file") MultipartFile[] files) throws IOException, ParseException {

		//임의로 리턴된 User 인스턴스. 현재 코드는 회원 가입 성공 여부만 판단하기 때문에 굳이 Insert 된 유저 정보를 응답하지 않음.

      /*
         Todo : BE - 회원가입시 유효성검사
         1. nickname 디비에서 중복된거 있는지 체크
         2. nickname 길이 2자이상 ~ 16자 이하
         3. 비밀번호 8자이상 ~ 16자 이하
         4. 비밀번호 영어, 숫자, 특수문자 필수포함
         5. 이메일은 @ 필수적으로 포함
         6. 전화번호는 01012341234 형식
         */

		UserRegisterPostReq registerInfo=new UserRegisterPostReq();
		registerInfo.setBirthday(birthday);
		registerInfo.setDescription(description);
		registerInfo.setEmail(email);
		registerInfo.setGeneration(generation);
		registerInfo.setUserClass(userClass);
		registerInfo.setLink(link);
		registerInfo.setName(name);
		registerInfo.setNickname(nickname);
		registerInfo.setPassword(password);
		registerInfo.setPhone(phone);
		registerInfo.setStudentId(studentId);
		registerInfo.setPosition(position);

		//1. 이메일 오류
		int emailCode=userService.emailCheck(registerInfo.getEmail());
		if(emailCode == 401)
			return ResponseEntity.status(200).body(BaseResponseBody.of(401,"이메일을 입력해주세요"));
		else if(emailCode == 402)
			return ResponseEntity.status(200).body(BaseResponseBody.of(402,"올바른 이메일 형식으로 입력해주세요."));
		else if(emailCode == 403)
			return ResponseEntity.status(200).body(BaseResponseBody.of(403,"이메일이 중복됩니다. 다른 이메일로 가입해주세요."));

//		//2. 닉네임 오류
		int nickCode=userService.nickCheck(registerInfo.getNickname());
		if(nickCode == 401)
			return ResponseEntity.status(200).body(BaseResponseBody.of(401,"닉네임 길이는 2자이상 16자이하로 해주세요."));
		else if(nickCode == 402)
			return ResponseEntity.status(200).body(BaseResponseBody.of(402,"닉네임이 중복됩니다. 다른 닉네임로 가입해주세요."));

		//3. 비밀번호 오류
		int passCode=userService.pwdCheck(registerInfo.getPassword());
		if(passCode == 401)
			return ResponseEntity.status(200).body(BaseResponseBody.of(401,"비밀번호를 입력해주세요"));
		else if(passCode == 402)
			return ResponseEntity.status(200).body(BaseResponseBody.of(402,"비밀번호는 영문, 숫자, 특수문자 포함 8~16자로 입력해주세요."));


		//4. 이름 오류
		int nameCode=userService.nameCheck(registerInfo.getName());
		if(nameCode == 401)
			return ResponseEntity.status(200).body(BaseResponseBody.of(401,"이름을 입력해주세요"));
		else if(nameCode == 402)
			return ResponseEntity.status(200).body(BaseResponseBody.of(402,"이름은 한글로 입력해주세요."));

		//6. 전화번호 오류
		int phoneCode=userService.phoneCheck(registerInfo.getPhone());
//		if(phoneCode == 401)
//			return ResponseEntity.status(200).body(BaseResponseBody.of(401,"전화번호를 입력해주세요"));
		if(phoneCode == 402)
			return ResponseEntity.status(200).body(BaseResponseBody.of(402,"올바른 전화번호 형식으로 입력해주세요."));


		// 회원 가입
		User user = userService.createUser(registerInfo);
		// 회원 이미지 입력
		if (files!=null) {
			fileService.saveFile(files, user.getId(), 1);
		}
		// user 스택 입력
		if (stacks!=null) {
			registerInfo.setStacks(getListMapFromString(stacks));
			stackService.createStack(registerInfo.getStacks(), user.getId(), 1);
		}
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}

	@PostMapping("/update")
	@ApiOperation(value = "회원 정보 수정")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 401, message = "인증 실패"),
			@ApiResponse(code = 404, message = "사용자 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<? extends BaseResponseBody> update(
			@RequestParam("userId") Long userId,
//			@RequestParam("email") String email,
			@RequestParam("password") String password,
			@RequestParam("name") String name,
			@RequestParam("nickname") String nickname,
//			@RequestParam("studentId") String studentId,
			@RequestParam(required = false, value="phone") String phone,
			@RequestParam(required = false, value="stacks") String stacks,
			@RequestParam(required = false, value="birthday") String birthday,
//			@RequestParam(required = false, value="generation") int generation,
			@RequestParam(required = false, value="class") String userClass,
			@RequestParam(required = false, value="position") String position,
			@RequestParam(required = false, value="link") String link,
			@RequestParam(required = false, value="description") String description,
			@RequestParam(required = false, value="file") MultipartFile[] files) throws IOException, ParseException {

		//임의로 리턴된 User 인스턴스. 현재 코드는 회원 가입 성공 여부만 판단하기 때문에 굳이 Insert 된 유저 정보를 응답하지 않음.


		UserUpdatePostReq updateInfo=new UserUpdatePostReq();
		updateInfo.setUserId(userId);
		updateInfo.setBirthday(birthday);
		updateInfo.setDescription(description);
//		updateInfo.setEmail(email);
//		updateInfo.setGeneration(generation);
		updateInfo.setUserClass(userClass);
		updateInfo.setLink(link);
		updateInfo.setName(name);
		updateInfo.setNickname(nickname);
		updateInfo.setPassword(password);
		updateInfo.setPhone(phone);
//		updateInfo.setStudentId(studentId);
		updateInfo.setPosition(position);

//		//2. 닉네임 오류
		int nickCode=userService.updateNickCheck(updateInfo.getUserId(), updateInfo.getNickname());
		if(nickCode == 401)
			return ResponseEntity.status(200).body(BaseResponseBody.of(401,"닉네임 길이는 2자이상 16자이하로 해주세요."));
		else if(nickCode == 402)
			return ResponseEntity.status(200).body(BaseResponseBody.of(402,"닉네임이 중복됩니다. 다른 닉네임로 가입해주세요."));

		//3. 비밀번호 오류
		int passCode=userService.pwdCheck(updateInfo.getPassword());
		if(passCode == 401)
			return ResponseEntity.status(200).body(BaseResponseBody.of(401,"비밀번호를 입력해주세요"));
		else if(passCode == 402)
			return ResponseEntity.status(200).body(BaseResponseBody.of(402,"비밀번호는 영문, 숫자, 특수문자 포함 8~16자로 입력해주세요."));


		//4. 이름 오류
		int nameCode=userService.nameCheck(updateInfo.getName());
		if(nameCode == 401)
			return ResponseEntity.status(200).body(BaseResponseBody.of(401,"이름을 입력해주세요"));
		else if(nameCode == 402)
			return ResponseEntity.status(200).body(BaseResponseBody.of(402,"이름은 한글로 입력해주세요."));

		//6. 전화번호 오류
		int phoneCode=userService.phoneCheck(updateInfo.getPhone());
//		if(phoneCode == 401)
//			return ResponseEntity.status(200).body(BaseResponseBody.of(401,"전화번호를 입력해주세요"));
		if(phoneCode == 402)
			return ResponseEntity.status(200).body(BaseResponseBody.of(402,"올바른 전화번호 형식으로 입력해주세요."));


		// 회원 수정
		userService.updateUser(updateInfo);
//		Long userId= updateInfo.getUserId();
		// 회원 스택 수정
		if (stacks!=null) {
			updateInfo.setStacks(getListMapFromString(stacks));
			stackService.updateStack(updateInfo.getStacks(), userId, 1);
		}
		// 회원 이미지 입력
		if (files!=null) {
			fileService.updateFile(files, userId, 1);
		}


		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}

	@PostMapping("/updatepass")
	@ApiOperation(value = "비밀번호 수정")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 401, message = "인증 실패"),
			@ApiResponse(code = 404, message = "사용자 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<? extends BaseResponseBody> updatePassword(
			@RequestBody @ApiParam(value="사용자 아이디랑 비밀번호만", required = true) UserUpdatePostReq updateInfo) throws IOException {

		//임의로 리턴된 User 인스턴스. 현재 코드는 회원 가입 성공 여부만 판단하기 때문에 굳이 Insert 된 유저 정보를 응답하지 않음.

		//3. 비밀번호 오류
		int passCode=userService.pwdCheck(updateInfo.getPassword());
		if(passCode == 401)
			return ResponseEntity.status(200).body(BaseResponseBody.of(401,"비밀번호를 입력해주세요"));
		else if(passCode == 402)
			return ResponseEntity.status(200).body(BaseResponseBody.of(402,"비밀번호는 영문, 숫자, 특수문자 포함 8~16자로 입력해주세요."));

		// 회원 수정
		int updatePasswordCode=userService.updatePasswordUser(updateInfo);
		if (updatePasswordCode==401){
			return ResponseEntity.status(200).body(BaseResponseBody.of(401, "사용자 아이디가 유효하지 않습니다."));
		}
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}

	@PostMapping("/delete")
	@ApiOperation(value = "회원 정보 삭제")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<? extends BaseResponseBody> delete(
			@RequestBody @ApiParam(value="회원 아이디", required = true) UserIdPostReq userId) throws IOException {

		// 회원 삭제 : isDeleted=true
		userService.deleteUser(userId.getUserId());
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}

	@GetMapping("/nickcheck/{nickname}")
	@ApiOperation(value = "등록 시 닉네임 유효성 검사", notes = "<strong>회원 가입 시 닉네임</strong>의 유효성을 검사한다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 401, message = "글자 길이 제한"),
			@ApiResponse(code = 402, message = "중복 닉네임"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<? extends BaseResponseBody> registerNicknameCheck(@PathVariable("nickname") @ApiParam(value="닉네임", required = true) String nickname) {
		//200 일때 사용 가능
		int nickCode=userService.nickCheck(nickname);
		if(nickCode == 401)
			return ResponseEntity.status(200).body(BaseResponseBody.of(401,"닉네임 길이는 2자 이상 16자이하로 해주세요."));
		else if(nickCode == 402)
			return ResponseEntity.status(200).body(BaseResponseBody.of(402,"닉네임이 중복됩니다. 다른 닉네임으로 가입해주세요."));

		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "닉네임 사용 가능합니다."));
	}

	@PostMapping("/nickcheck")
	@ApiOperation(value = "수정 시 닉네임 유효성 검사")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 401, message = "글자 길이 제한"),
			@ApiResponse(code = 402, message = "중복 닉네임"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<? extends BaseResponseBody> updateNicknameCheck(@RequestBody UserUpdateNicknamePostReq userUpdateNicknamePostReq) {
		//200 일때 사용 가능
		Long id=userUpdateNicknamePostReq.getId();
		String nickname= userUpdateNicknamePostReq.getNickname();
		int nickCode=userService.updateNickCheck(id, nickname);
		if(nickCode == 401)
			return ResponseEntity.status(200).body(BaseResponseBody.of(401,"닉네임 길이는 2자 이상 16자이하로 해주세요."));
		else if(nickCode == 402)
			return ResponseEntity.status(200).body(BaseResponseBody.of(402,"닉네임이 중복됩니다. 다른 닉네임으로 가입해주세요."));

		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "닉네임 사용 가능합니다."));
	}

	@GetMapping
	@ApiOperation(value = "사용자 전체 조회")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<? extends BaseResponseBody> selectUserAll() {
		//200 일때 사용 가능
		List<UserDto> users=userService.selectUserAll();
		if (users==null){
			return ResponseEntity.status(200).body(UserSelectAllPostRes.of(200, "사용자가 없습니다.", null));
		}
		return ResponseEntity.status(200).body(UserSelectAllPostRes.of(200, "사용자 전체 목록", users));
	}

	@PostMapping("/view")
	@ApiOperation(value = "사용자 상세보기")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<? extends BaseResponseBody> selectUser(@RequestBody UserIdPostReq userIdPostReq) {
		//200 일때 사용 가능
		UserDto user=userService.selectUser(userIdPostReq.getUserId());
		if (user==null){
			return ResponseEntity.status(200).body(UserSelectPostRes.of(401, "사용자 정보가 없습니다.", null));
		}
		return ResponseEntity.status(200).body(UserSelectPostRes.of(200, "사용자 정보", user));
	}

//	@PostMapping("passcheck")
//	@ApiOperation(value = "비밀번호 유효성 검사", notes = "<strong>회원 가입 시 비밀번호</strong>의 유효성을 검사한다. 아이디는 무시하세요.")
//	@ApiResponses({
//			@ApiResponse(code = 200, message = "성공"),
//			@ApiResponse(code = 401, message = "글자 길이 제한"),
//			@ApiResponse(code = 402, message = "비밀번호 요건 미충족"),
//			@ApiResponse(code = 500, message = "서버 오류")
//	})
//	public ResponseEntity<? extends BaseResponseBody> passCheck(@RequestBody @ApiParam(value="비밀번호", required = true) UserLoginPostReq loginInfo) {
//		//200 일때 사용 가능
//		int passCode=userService.pwdCheck(loginInfo.getPassword());
//		if(passCode == 401)
//			return ResponseEntity.status(200).body(BaseResponseBody.of(401,"비밀번호를 입력해주세요."));
//		else if(passCode == 402)
//			return ResponseEntity.status(200).body(BaseResponseBody.of(402,"비밀번호는 영문, 숫자, 특수문자 포함 8~16자로 입력해주세요."));
//
//		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "비밀번호 사용 가능합니다."));
//	}

	@GetMapping("/auth")
	@ApiOperation(value = "회원 본인 정보 조회", notes = "로그인한 회원 본인의 정보를 응답한다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 401, message = "인증 실패"),
			@ApiResponse(code = 404, message = "사용자 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<UserRes> getUserInfo(@ApiIgnore Authentication authentication) {
		/**
		 * 요청 헤더 액세스 토큰이 포함된 경우에만 실행되는 인증 처리이후, 리턴되는 인증 정보 객체(authentication) 통해서 요청한 유저 식별.
		 * 액세스 토큰이 없이 요청하는 경우, 403 에러({"error": "Forbidden", "message": "Access Denied"}) 발생.
		 */
		SsafyUserDetails userDetails = (SsafyUserDetails)authentication.getDetails();
		String email = userDetails.getEmail();
		User user = userService.getUserByEmail(email);

		return ResponseEntity.status(200).body(UserRes.of(user));
	}

	@PostMapping("/login")
	@ApiOperation(value = "로그인", notes = "<strong>아이디와 패스워드</strong>를 통해 로그인 한다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 401, message = "인증 실패"),
			@ApiResponse(code = 404, message = "사용자 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<UserLoginPostRes> login(@RequestBody @ApiParam(value="로그인 정보", required = true) UserLoginPostReq loginInfo) {
		String email= loginInfo.getEmail();
		String password = loginInfo.getPassword();

		User user = userService.getUserByEmail(email);
		// 로그인 요청한 유저로부터 입력된 패스워드 와 디비에 저장된 유저의 암호화된 패스워드가 같은지 확인.(유효한 패스워드인지 여부 확인)

		if (user==null){
			return ResponseEntity.status(200).body(UserLoginPostRes.of(404, "존재하는 이메일이 없습니다.", null));
		}
		if(passwordEncoder.matches(password, user.getPassword())) {
			// 유효한 패스워드가 맞는 경우, 로그인 성공으로 응답.(액세스 토큰을 포함하여 응답값 전달)
			return ResponseEntity.ok(UserLoginPostRes.of(200, "로그인 성공", JwtTokenUtil.getToken(email)));
		}
		// 유효하지 않는 패스워드인 경우, 로그인 실패로 응답.
		return ResponseEntity.status(200).body(UserLoginPostRes.of(401, "이메일 혹은 비밀번호가 일치하지 않습니다.", null));
	}


}