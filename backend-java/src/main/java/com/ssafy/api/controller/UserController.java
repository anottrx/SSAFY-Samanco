package com.ssafy.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.ssafy.api.request.UserLoginPostReq;
import com.ssafy.api.request.UserRegisterPostReq;
import com.ssafy.api.response.UserLoginPostRes;
import com.ssafy.api.response.UserRes;
import com.ssafy.api.service.UserService;
import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.common.util.JwtTokenUtil;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.UserRepositorySupport;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import springfox.documentation.annotations.ApiIgnore;

/**
 * 유저 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@Api(value = "유저 API", tags = {"User"})
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

	@Autowired
	UserService userService;

	@PostMapping()
	@ApiOperation(value = "회원 가입", notes = "<strong>아이디와 패스워드, 이름, 이메일, 전화번호</strong>를 통해 회원가입 한다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 401, message = "인증 실패"),
			@ApiResponse(code = 404, message = "사용자 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<? extends BaseResponseBody> register(
			@RequestBody @ApiParam(value="회원가입 정보", required = true) UserRegisterPostReq registerInfo) {

		//임의로 리턴된 User 인스턴스. 현재 코드는 회원 가입 성공 여부만 판단하기 때문에 굳이 Insert 된 유저 정보를 응답하지 않음.

		String userId = registerInfo.getId();
		String userPwd = registerInfo.getPassword();
		String userName = registerInfo.getName();
		String userEmail = registerInfo.getEmail();
		String userPhone = registerInfo.getPhone();


      /*
         Todo : BE - 회원가입시 유효성검사
         1. id 디비에서 중복된거 있는지 체크
         2. id 길이 4자이상 ~ 16자 이하
         3. 비밀번호 8자이상 ~ 16자 이하
         4. 비밀번호 영어, 숫자, 특수문자 필수포함
         5. 이메일은 @ 필수적으로 포함
         6. 전화번호는 01012341234 형식
         */


		//1. 아이디 오류
		int idCode=userService.idCheck(userId);
		if(idCode == 401)
			return ResponseEntity.status(200).body(BaseResponseBody.of(401,"아이디 길이는 4자이상 16자이하로 해주세요."));
		else if(idCode == 402)
			return ResponseEntity.status(200).body(BaseResponseBody.of(402,"아이디가 중복됩니다. 다른 아이디로 가입해주세요."));

		//3. 비밀번호 오류
		int passCode=userService.pwdCheck(userPwd);
		if(passCode == 401)
			return ResponseEntity.status(200).body(BaseResponseBody.of(401,"비밀번호를 입력해주세요"));
		else if(passCode == 402)
			return ResponseEntity.status(200).body(BaseResponseBody.of(402,"비밀번호는 영문, 숫자, 특수문자 포함 8~16자로 입력해주세요."));


		//4. 이름 오류
		int nameCode=userService.nameCheck((userName));
		if(nameCode == 401)
			return ResponseEntity.status(200).body(BaseResponseBody.of(401,"이름을 입력해주세요"));
		else if(nameCode == 402)
			return ResponseEntity.status(200).body(BaseResponseBody.of(402,"이름은 한글로 입력해주세요."));


		//5. 이메일 오류
		int emailCode=userService.emailCheck((userEmail));
		if(emailCode == 401)
			return ResponseEntity.status(200).body(BaseResponseBody.of(401,"이메일을 입력해주세요"));
		else if(emailCode == 402)
			return ResponseEntity.status(200).body(BaseResponseBody.of(402,"올바른 이메일 형식으로 입력해주세요."));



		//6. 전화번호 오류
		int phoneCode=userService.phoneCheck((userPhone));
		if(phoneCode == 401)
			return ResponseEntity.status(200).body(BaseResponseBody.of(401,"전화번호를 입력해주세요"));
		else if(phoneCode == 402)
			return ResponseEntity.status(200).body(BaseResponseBody.of(402,"올바른 전화번호 형식으로 입력해주세요."));

		// 회원 가입
		User user = userService.createUser(registerInfo);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}

	@GetMapping("idcheck/{userId}")
	@ApiOperation(value = "아이디 유효성 검사", notes = "<strong>회원 가입 시 아이디</strong>의 유효성을 검사한다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 401, message = "글자 길이 제한"),
			@ApiResponse(code = 402, message = "중복 아이디"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<? extends BaseResponseBody> idCheck(@PathVariable("userId") @ApiParam(value="아이디", required = true) String id) {
		//200 일때 사용 가능
		int idCode=userService.idCheck(id);
		if(idCode == 401)
			return ResponseEntity.status(200).body(BaseResponseBody.of(401,"아이디 길이는 4자이상 16자이하로 해주세요."));
		else if(idCode == 402)
			return ResponseEntity.status(200).body(BaseResponseBody.of(402,"아이디가 중복됩니다. 다른 아이디로 가입해주세요."));

		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "아이디 사용 가능합니다."));
	}

	@PostMapping("passcheck")
	@ApiOperation(value = "비밀번호 유효성 검사", notes = "<strong>회원 가입 시 비밀번호</strong>의 유효성을 검사한다. 아이디는 무시하세요.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 401, message = "글자 길이 제한"),
			@ApiResponse(code = 402, message = "비밀번호 요건 미충족"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<? extends BaseResponseBody> passCheck(@RequestBody @ApiParam(value="비밀번호", required = true) UserLoginPostReq loginInfo) {
		//200 일때 사용 가능
		int passCode=userService.pwdCheck(loginInfo.getPassword());
		if(passCode == 401)
			return ResponseEntity.status(200).body(BaseResponseBody.of(401,"비밀번호를 입력해주세요."));
		else if(passCode == 402)
			return ResponseEntity.status(200).body(BaseResponseBody.of(402,"비밀번호는 영문, 숫자, 특수문자 포함 8~16자로 입력해주세요."));

		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "비밀번호 사용 가능합니다."));
	}

	@GetMapping("/me")
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
		String userId = userDetails.getUsername();
		User user = userService.getUserByUserId(userId);

		return ResponseEntity.status(200).body(UserRes.of(user));
	}
}