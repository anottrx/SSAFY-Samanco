import api, { fileUrl, blobUrl } from './index';

// 프로젝트 등록
async function registAPI(formData) {
  return await fileUrl
    .post('/api/project', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 프로젝트 수정
async function updateAPI(formData) {
  return await fileUrl
    .post('/api/project/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 프로젝트 삭제
async function deleteAPI(data) {
  return await api
    .post('/api/project/delete', {
      projectId: data.id,
      userId: data.hostId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 모든 프로젝트 리스트 조회
async function getProjectAllAPI() {
  return await api
    .get('/api/project')
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 프로젝트 좋아요
async function updateProjectLike(data) {
  return await api
    .post('/api/project/like', {
      tag: data.tag,
      tagId: data.projectId,
      userId: data.userId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 프로젝트 상세조회
async function getProjectById(data) {
  return await api
    .post('/api/project/view', {
      projectId: data.projectId,
      userId: data.userId,
      addHit: data.addHit,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 프로젝트 제목으로 검색
async function getProjectBytitle(title) {
  return await api
    .get('/api/project/title/' + title)
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 프로젝트 마감순으로 정렬
async function getProjectByDeadLine() {
  return await api
    .get('/api/project/deadline')
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 프로젝트 좋아요 순으로 정렬
async function getProjectByLike() {
  return await api
    .get('/api/project/like')
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 프로젝트 지원
async function joinProjectAPI(data) {
  return await api
    .post('/api/project/join', {
      position: data.position,
      projectId: data.projectId,
      userId: data.userId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 프로젝트 지원 취소
async function joinCancelProject(data) {
  return await api
    .post('/api/project/joincancel', {
      projectId: data.projectId,
      userId: data.userId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 같은 프로젝트에 있는 유저 조회하기
async function getUserAtProject(data) {
  return await api
    .post('/api/project/userlist', {
      projectId: data.projectId,
      userId: data.userId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 프로젝트 지원한 유저 목록 목록
async function getProjectUserByjoin(data) {
  return await api
    .post('/api/project/joinlist', {
      projectId: data.projectId,
      userId: data.userId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 프로젝트 가입 승인(OK), 거절(NO)
async function approveProject(data) {
  return await api
    .post('/api/project/approve', {
      joinTag: data.joinTag,
      projectId: data.projectId,
      hostId: data.hostId,
      userId: data.userId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 사용자가 속해있는 프로젝트 보기
async function getProjectByUserId(id) {
  return await api
    .post('/api/project/user', {
      userId: id,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 프로젝트 탈퇴
async function quitProject(data) {
  return await api
    .post('/api/project/quit', {
      userId: data.userId,
      projectId: data.projectId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 프로젝트 방장 변경
async function changeProjectHost(data) {
  return await api
    .post('/api/project/changehost', {
      projectId: data.projectId,
      oldHostId: data.oldHostId, // 현재
      newHostId: data.newHostId, // 바뀔
      newHostPosition: data.newHostPosition, // 바뀔
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 프로젝트에 등록된 스택 리스트 불러오기
async function projectStackList() {
  return await api
    .get('/api/project/stack')
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 파일 다운로드
async function projectImageDownload(data) {
  return await blobUrl
    .get('/api/project/download/' + data.saveFolder + '&' + data.saveFile)
    .then((res) => res)
    .catch((err) => err.response.data);
}

export {
  registAPI,
  updateAPI,
  deleteAPI,
  getProjectAllAPI,
  getProjectById,
  getProjectBytitle,
  getProjectByDeadLine,
  updateProjectLike,
  getProjectByLike,
  joinProjectAPI,
  getProjectUserByjoin,
  approveProject,
  getProjectByUserId,
  getUserAtProject,
  quitProject,
  projectStackList,
  changeProjectHost,
  joinCancelProject,
  projectImageDownload,
};
