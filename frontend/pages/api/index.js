import axios from "axios";

const url = axios.create({
    baseURL: `http://localhost:8089`,
    headers: {
        "Content-Type": `application/json;charset=UTF-8`,
        "Access-Control-Allow-Origin": "*",
        "Accept": "application/json"
    }
});

const getAuth = (token) => axios.create({
    baseURL: `http://localhost:8089`,
    headers: {
        "Content-Type": `application/json;charset=UTF-8`,
        "Access-Control-Allow-Origin": "*",
        "Accept": "application/json",
        "Authorization": "Bearer "+token,
    }
})

const fileUrl = axios.create({
    baseURL: `http://localhost:8089`,
    headers: {
        // "Content-Type": `application/json;charset=UTF-8`,
        "Content-Type": `multipart/form-data`,
        "Access-Control-Allow-Origin": "*",
        "Accept": "application/json",
    }
})

const blobUrl = axios.create({
    baseURL: `http://localhost:8089`,
    headers: {
        "Content-Type": `application/json;charset=UTF-8`,
        "Access-Control-Allow-Origin": "*",
        "Accept": "application/json",
        "response-Type": "blob",
    }
})

export default url;
export {getAuth, fileUrl, blobUrl};
