import axios from "axios";

const url = axios.create({
    baseURL: `http://localhost:8080`,
    headers: {
        "Content-Type": `application/json;charset=UTF-8`,
        "Access-Control-Allow-Origin": "*",
        "Accept": "application/json"
    }
});

const getAuth = (token) => axios.create({
    baseURL: `http://localhost:8080`,
    headers: {
        "Content-Type": `application/json;charset=UTF-8`,
        "Access-Control-Allow-Origin": "*",
        "Accept": "application/json",
        "Authorization": "Bearer "+token,
    }
})

const fileUrl = axios.create({
    baseURL: `http://localhost:8080`,
    headers: {
        "Content-Type": `application/json;charset=UTF-8`,
        "Access-Control-Allow-Origin": "*",
        "Accept": "application/json",
    }
})

export default url;
export {getAuth, fileUrl};
