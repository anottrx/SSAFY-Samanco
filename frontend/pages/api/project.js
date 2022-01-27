import api, { fileUrl } from "./index";

// 프로젝트 등록
async function registAPI(formData) {
    return await fileUrl
    .post("/api/project", 
        formData
    , {headers: {
        'Content-Type': 'multipart/form-data'
      }})
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 프로젝트 수정
async function updateAPI(formData) {
    return await fileUrl
    .post("/api/project/update", 
        formData
    , {headers: {
        'Content-Type': 'multipart/form-data'
      }})
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 프로젝트 삭제
async function deleteAPI(data) {
    return await api
    .post("/api/project/delete", {
        "projectId": data.id,
        "userId": data.hostId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 모든 프로젝트 리스트 조회
async function getProjectAllAPI() {
    return await api
    .get("/api/project")
    .then((res) => res.data)
    .catch((err) => err.response.data)
}

// 프로젝트 좋아요
async function updateProjectLike(id) {
    return await api
    .post("/api/project/like", {projectId: id})
    .then(res => res.data)
    .catch(err => err.response.data)
}

// 프로젝트 상세조회
async function getProjectById(data) {
    return await api
    .post("/api/project/view", {
        projectId: data.id
    })
    .then(res => res.data)
    .catch(err => err.response.data)
}

// 프로젝트 제목으로 검색
async function getProjectBytitle(title) {
    return await api
    .get("/api/project/title/"+title)
    .then(res => res.data)
    .catch(err => err.response.data)
}

// 프로젝트 마감순으로 정렬
async function getProjectByDeadLine() {
    return await api
    .get("/api/project/deadline")
    .then(res => res.data)
    .catch(err => err.response.data)
}

// 프로젝트 좋아요 순으로 정렬
async function getProjectByLike() {
    return await api
    .get("/api/project/like")
    .then(res => res.data)
    .catch(err => err.response.data)
}

// 프로젝트 가입
async function joinProjectAPI(data) {
    return await api
    .post("/api/project/join", {
        position: data.position,
        projectId: data.projectId,
        userId: data.userId
    })
    .then(res => res.data)
    .catch(err => err.response.data)
}

// 프로젝트 지원한 유저 목록 목록
async function getUserByjoin(data) {
    return await api
    .post("/api/project/joinlist", {
        projectId: data.projectId,
        userId: data.userId
    })
    .then(res => res.data)
    .catch(err => err.response.data)
}

// 프로젝트 가입 승인(OK), 거절(NO) 
async function approveProject(data) {
    return await api
    .post("/api/project/approve", {
        joinTag: data.jointag,
        projectId: data.projectId,
        userId: data.userId
    })
    .then(res => res.data)
    .catch(err => err.response.data)
}

export {
    registAPI, updateAPI, deleteAPI, getProjectAllAPI, getProjectById,
    getProjectBytitle, getProjectByDeadLine, updateProjectLike, getProjectByLike,
    joinProjectAPI, getUserByjoin, approveProject
}