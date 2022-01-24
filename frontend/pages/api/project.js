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
    .catch((err) => console.log(err))
}

export {
    registAPI, updateAPI, deleteAPI, getProjectAllAPI
}