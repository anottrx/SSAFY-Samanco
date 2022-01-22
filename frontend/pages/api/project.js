import api, { fileUrl } from "./index";

async function registAPI(inputState, formData) {
    return await fileUrl
    .post("/api/project", {
        "registerInfo":inputState,
        // formData
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
}

export {
    registAPI
}