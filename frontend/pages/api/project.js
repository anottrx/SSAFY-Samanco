import api, { fileUrl } from "./index";

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

async function deleteAPI(data) {
    return await api
    .post("/api/project/delete", {
        "id": data.id,
        "hostId": data.hostId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function getProjectAllAPI() {
    return await api
    .get("/api/project")
    .then((res) => res.data)
    .catch((err) => err.response.data)
}

async function updateProjectLike(id) {
    return await api
    .post("/api/project/like", {id: id})
    .then(res => res.data)
    .catch(err => err.response.data)
}

async function getProjectById(data) {
    return await api
    .post("/api/project/view", {
        id: data.id
    })
    .then(res => res.data)
    .catch(err => err.response.data)
}

async function getProjectBytitle(title) {
    return await api
    .get("/api/project/title/"+title)
    .then(res => res.data)
    .catch(err => err.response.data)
}

async function getProjectByDeadLine() {
    return await api
    .get("/api/project/deadline")
    .then(res => res.data)
    .catch(err => err.response.data)
}

async function getProjectByLike() {
    return await api
    .get("/api/project/like")
    .then(res => res.data)
    .catch(err => err.response.data)
}

export {
    registAPI, updateAPI, deleteAPI, getProjectAllAPI, getProjectById,
    getProjectBytitle, getProjectByDeadLine, updateProjectLike, getProjectByLike
}