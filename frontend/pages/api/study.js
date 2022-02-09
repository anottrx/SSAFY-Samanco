import api, { fileUrl, blobUrl } from './index';

// 스터디 등록
async function registAPI(formData) {
  return await fileUrl
    .post('/api/study', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 스터디 수정
async function updateAPI(formData) {
  return await fileUrl
    .post('/api/study/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 스터디 삭제
async function deleteAPI(data) {
  return await api
    .post('/api/study/delete', {
      studyId: data.id,
      userId: data.hostId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 스터디 전체 조회
async function getStudyAllAPI() {
  return await api
    .get('/api/study')
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 스터디 좋아요
async function updateStudyLike(data) {
  return await api
    .post('/api/study/like', {
      tag: data.tag,
      tagId: data.studyId,
      userId: data.userId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 스터디 상세 조회
async function getStudyById(data) {
  return await api
    .post('/api/study/view', {
      studyId: data.studyId,
      userId: data.userId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 스터디 제목으로 검색
async function getStudyBytitle(title) {
  return await api
    .get('/api/study/title/' + title)
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 스터디 마감순으로 정렬
async function getStudyByDeadLine() {
  return await api
    .get('/api/study/deadline')
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 스터디 좋아요 순으로 정렬
async function getStudyByLike() {
  return await api
    .get('/api/study/like')
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 스터디 지원
async function joinStudyAPI(data) {
  return await api
    .post('/api/study/join', {
      position: data.position,
      studyId: data.studyId,
      userId: data.userId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 스터디 지원 취소
async function joinCancelStudy(data) {
  return await api
    .post('/api/study/joincancel', {
      studyId: data.studyId,
      userId: data.userId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 같은 스터디에 있는 유저 조회하기
async function getUserAtStudy(data) {
  return await api
    .post('/api/study/userlist', {
      studyId: data.studyId,
      userId: data.userId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 스터디 지원한 유저 목록 목록
async function getStudyUserByjoin(data) {
  return await api
    .post('/api/study/joinlist', {
      studyId: data.studyId,
      userId: data.userId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 스터디 가입 승인(OK), 거절(NO)
async function approveStudy(data) {
  return await api
    .post('/api/study/approve', {
      joinTag: data.joinTag,
      studyId: data.studyId,
      hostId: data.hostId,
      userId: data.userId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 사용자가 속해있는 스터디 보기
async function getStudyByUserId(id) {
  return await api
    .post('/api/study/user', {
      userId: id,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 스터디 탈퇴
async function quitStudy(data) {
  return await api
    .post('/api/study/quit', {
      userId: data.userId,
      studyId: data.studyId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 스터디 방장 변경
async function changeStudyHost(data) {
  return await api
    .post('/api/study/changehost', {
      studyId: data.studyId,
      oldHostId: data.oldHostId, // 현재
      newHostId: data.newHostId, // 바뀔
      newHostPosition: data.newHostPosition, // 바뀔
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 스터디에 등록된 스택 리스트 불러오기
async function studyStackList() {
  return await api
    .get('/api/study/stack')
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 파일 다운로드
async function studyImageDownload(data) {
  return await blobUrl
    .get('/api/study/download/' + data.saveFolder + '&' + data.saveFile)
    .then((res) => res)
    .catch((err) => err.response.data);
}

export {
  registAPI,
  updateAPI,
  deleteAPI,
  getStudyAllAPI,
  getStudyById,
  getStudyBytitle,
  getStudyByDeadLine,
  updateStudyLike,
  getStudyByLike,
  joinStudyAPI,
  getStudyUserByjoin,
  approveStudy,
  getStudyByUserId,
  getUserAtStudy,
  quitStudy,
  studyStackList,
  changeStudyHost,
  joinCancelStudy,
  studyImageDownload,
};
