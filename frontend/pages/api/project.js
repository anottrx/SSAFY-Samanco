import api, { fileUrl } from "./index";

async function registAPI(formData) {
    return await fileUrl
    .post("/api/project", 
        formData
    , {headers: {
        'Content-Type': 'multipart/form-data'
      }})
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
}

export {
    registAPI
}