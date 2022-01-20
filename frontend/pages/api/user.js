import api, { getAuth } from "./index";

async function checkLoginTokenInfo(token) {
  // 로그인 토큰 조회
  return await getAuth(token)
    .get("/api/user/auth")
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function loginAPI(inputState) {
  return await api
    .post("/api/v1/auth/login", {
      id: inputState.id,
      password: inputState.password,
    })
    // .post("/api/user/login", {
    // email: inputState.email,
    // password: inputState.password
    // }
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function registAPI(inputState) {
  return await api
    .post("/api/v1/users", {
      // .post("/api/user", {
      id: inputState.id,
      email: inputState.email,
      name: inputState.name,
      password: inputState.password,
      phone: inputState.phone,
      //   nickname: inputState.nickname,
      //   birthday: inputState.birthday,
      //   generation: inputState.generation,
      //   userClass: inputState.userClass,
      //   studentId: inputState.studentId,
      //   stacks: inputState.stacks, // array
      //   position: inputState.position,
      //   link: inputState.link, // ,로 자르기
      //   description: inputState.description,
      //   image_id: inputState.image_id,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function sendEmailCodeAPI(email) {
  // 이메일로 인증번호 보내기
  return await api
    .post("/api/user/email-send", {
      email: email,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function checkCodeAPI(code) {
  // 이메일로 받은 인증번호로 인증하기
  return await api
    .post("/api/user/email_code", {
      code: code,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function getUserInfo(token) {
  // 내 정보 조회
  return await getAuth(token)
    .get("/api/user/me")
    //   .get("/api/user/me")
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function getOtherInfoAPI(nickname) {
  // 다른 사람 정보 조회
  return await api
    .post("/api/user/view", {
      nickname: nickname,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function sendEmailPWCodeAPI(email) {
  // 비밀번호 재설정 위해 이메일로 인증번호 보내기
  return await api
    .post("/api/user/findpass", {
      email: email,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function checkEmailPWAPI(code) {
  // 비밀번호 재설정 위해 받은 인증번호 확인하기
  return await api
    .post("/api/user/passcode", {
      code: code,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function resetPWAPI(inputState) {
  // 비밀번호 재설정
  return await api
    .post("/api/user/pass", {
      userId: inputState.userId,
      password: inputState.password,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function updateUserAPI(inputState) {
  // 회원정보 변경
  return await api
    .post("/api/user/update", {
      userId: inputState.userId, // 바꿀 수 없음
      email: inputState.email,
      name: inputState.name, // 바꿀 수 없음
      password: inputState.password,
      phone: inputState.phone,
      nickname: inputState.nickname,
      birthday: inputState.birthday,
      generation: inputState.generation, // 바꿀 수 없음
      userClass: inputState.userClass,
      studentId: inputState.studentId, // 바꿀 수 없음
      stacks: inputState.stacks,
      position: inputState.position,
      link: inputState.link,
      description: inputState.description,
      image_id: inputState.image_id,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function deleteUserAPI(userId) {
  // 회원 탈퇴 -> 실제로 데이터를 지우는 것은 아님
  return await api
    .post("/api/user/delete", {
      userId: userId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function getAllUserInfoAPI() {
  // 관리자가 모든 회원 정보를 조회
  return await api
    .get("/api/user")
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function checkNicknameAPI(nickname) {
  // 닉네임 중복 체크
  return await api
    .get("/api/user/nickcheck/" + nickname)
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function checkMemberAPI(inputState) {
  // 싸피생 확인 -> 안 함! 회원가입 때 할 것
  return await api
    .post("/api/user/check", {
      studentId: inputState.studentId,
      name: inputState.name,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function idCheckAPI(id) {
  // 아이디 중복체크 -> 이제는 필요 없음
  return await api
    .get("/api/v1/users/idcheck/" + id)
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 비밀번호 유효성 테스트는 FE에서 처리!
// async function pwCheckAPI(password) {
//     return await api.post("/api/v1/users/passcheck/", {
//         id: "",
//         password: password
//     })
//     .then(res => res.data)
//     .catch(err => err.response.data)
// }

export {
  loginAPI,
  registAPI,
  idCheckAPI,
  getUserInfo,
  checkLoginTokenInfo,
  sendEmailCodeAPI,
  checkCodeAPI,
  getOtherInfoAPI,
  sendEmailPWCodeAPI,
  checkEmailPWAPI,
  resetPWAPI,
  updateUserAPI,
  deleteUserAPI,
  getAllUserInfoAPI,
  checkNicknameAPI,
  checkMemberAPI,
};
