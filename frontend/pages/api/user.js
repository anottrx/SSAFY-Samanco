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
      //   class: inputState.class,
      //   student_id: inputState.student_id,
      //   stack_array: inputState.stack_array, // array
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
    .get("/api/users/me")
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
    .post("/api/user/find-pass", {
      email: email,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function checkEmailPWAPI(code) {
  // 비밀번호 재설정 위해 받은 인증번호 확인하기
  return await api
    .post("/api/user/pass-code", {
      code: code,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function resetPWAPI(inputState) {
  // 비밀번호 재설정
  return await api
    .post("/api/user/pass", {
      user_id: inputState.user_id,
      password: inputState.password,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function updateUserAPI(inputState) {
  // 회원정보 변경
  return await api
    .post("/api/user/update", {
      user_id: inputState.user_id, // 바꿀 수 없음
      email: inputState.email,
      name: inputState.name, // 바꿀 수 없음
      password: inputState.password,
      phone: inputState.phone,
      nickname: inputState.nickname,
      birthday: inputState.birthday,
      generation: inputState.generation,
      class: inputState.class,
      student_id: inputState.student_id, // 바꿀 수 없음
      stack_array: inputState.stack_array,
      position: inputState.position,
      link: inputState.link,
      description: inputState.description,
      image_id: inputState.image_id,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function deleteUserAPI(user_id) {
  // 회원 탈퇴 -> 실제로 데이터를 지우는 것은 아님
  return await api
    .post("/api/user/delete", {
      user_id: user_id,
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
  return await api
    .get("/api/user/nick-check/" + nickname)
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function checkMemberAPI(inputState) {
  return await api
    .post("/api/user/delete", {
      student_id: inputState.student_id,
      name: inputState.name,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function idCheckAPI(id) {
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
