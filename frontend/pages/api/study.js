import api, { fileUrl } from "./index";

async function registAPI(formData) {
    return await fileUrl
    .post("/api/study", 
        formData
    , {headers: {
        'Content-Type': 'multipart/form-data'
      }})
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function updateAPI(formData) {
    return await fileUrl
    .post("/api/study/update", 
        formData
    , {headers: {
        'Content-Type': 'multipart/form-data'
      }})
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function deleteAPI(data) {
    return await api
    .post("/api/study/delete", {
        "id": data.id,
        "user_id": data.userId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

export {
    registAPI, updateAPI, deleteAPI
}