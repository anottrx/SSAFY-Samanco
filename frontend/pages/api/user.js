import api, { getAuth, fileUrl } from './index';

// 로그인 토큰 조회
async function getUserLoginTokenAPI(token) {
  // 내 정보를 조회 -> 이중에서 email, nickname, userId 받음
  return await getAuth(token)
    .get('/api/user/auth')
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function loginAPI(inputState) {
  return await api
    .post('/api/user/login', {
      email: inputState.email,
      password: inputState.password,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function registAPI(formData) {
  return await fileUrl
    .post('/api/user', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 회원가입시 이메일로 인증번호 보내기
async function sendEmailCodeAPI(email) {
  return await api
    .post('/api/email/send', email)
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 회원가입시 이메일로 받은 인증번호로 인증하기
async function checkEmailCodeAPI(data) {
  return await api
    .post('/api/email/code', {
      email: data.email,
      code: data.code
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 나 또는 다른 사람이 내 정보 조회
async function getUserInfoAPI(userId) {
  return await api
    .post('/api/user/view', {
      userId: userId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 비밀번호 재설정 위해 이메일로 인증번호 보내기
async function sendEmailPWCodeAPI(email) {
  return await api
    .post('/api/email/findpass', email)
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 비밀번호 재설정 위해 받은 인증번호 확인하기
async function checkEmailPWAPI(data) {
  return await api
    .post('/api/email/passcode', {
      code: data.code,
      email: data.email
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 비밀번호 재설정
async function resetPWAPI(inputState) {
  return await api
    .post('/api/user/updatepass', {
      email: inputState.email,
      password: inputState.password,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 회원정보 변경
async function updateUserAPI(formData) {
  return await fileUrl
    .post('/api/user/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 회원 탈퇴 -> 실제로 데이터를 지우는 것은 아님
async function deleteUserAPI(userId) {
  return await api
    .post('/api/user/delete', {
      userId: userId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 관리자가 모든 회원 정보를 조회
async function getAllUserInfoAPI() {
  return await api
    .get('/api/user')
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 닉네임 중복 체크
async function checkNicknameAPI(nickname) {
  return await api
    .get('/api/user/nickcheck/' + nickname)
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 회원가입한 후 사용자가 닉네임 수정할 때 닉네임 중복 체크
async function updateNicknameAPI(inputData) {
  return await api
    .post('/api/user/nickcheck', {
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
