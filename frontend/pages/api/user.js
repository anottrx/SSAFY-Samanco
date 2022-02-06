import api, { getAuth, fileUrl } from "./index";

async function getUserLoginTokenAPI(token) {
  // 내 정보를 조회 -> 이중에서 email, nickname, userId 받음
  // 로그인 토큰 조회
  return await getAuth(token)
    .get("/api/user/auth")
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function loginAPI(inputState) {
  return await api
    .post("/api/user/login", {
      email: inputState.email,
      password: inputState.password,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function registAPI(formData) {
  return await fileUrl
    .post("/api/user", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function sendEmailCodeAPI(email) {
  // 회원가입시 이메일로 인증번호 보내기
  return await api
    .post("/api/email/send", {
      email: email,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function checkEmailCodeAPI(code) {
  // 회원가입시 이메일로 받은 인증번호로 인증하기
  return await api
    .post("/api/email/code", {
      code: code,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function getUserInfoAPI(userId) {
  // 나 또는 다른 사람이 내 정보 조회
  return await api
    .post("/api/user/view", {
      userId: userId,
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
    .post("/api/user/updatepass", {
      email: inputState.email,
      password: inputState.password,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function updateUserAPI(formData) {
  // 회원정보 변경
  return await fileUrl
    .post("/api/user/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
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

async function updateNicknameAPI(inputData) {
  // 회원가입한 후 사용자가 닉네임 수정할 때 닉네임 중복 체크
  return await api
    .post("/api/user/nickcheck", {
      userId: inputData.id,
      nickname: inputData.nickname,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

export {
  loginAPI,
  registAPI,
  getUserInfoAPI,
  getUserLoginTokenAPI,
  sendEmailCodeAPI,
  checkEmailCodeAPI,
  sendEmailPWCodeAPI,
  checkEmailPWAPI,
  resetPWAPI,
  updateUserAPI,
  deleteUserAPI,
  getAllUserInfoAPI,
  checkNicknameAPI,
  updateNicknameAPI,
};
