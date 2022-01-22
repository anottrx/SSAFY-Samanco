import axios from "axios";

const url = axios.create({
    baseURL: `http://localhost:8080`,
    headers: {
        "Content-Type": `application/json;charset=UTF-8`,
        "Access-Control-Allow-Origin": "*",
        "Accept": "application/json"
    }
});

export const getAuth = (token) => axios.create({
    baseURL: `http://localhost:8080`,
    headers: {
        "Content-Type": `application/json;charset=UTF-8`,
        "Access-Control-Allow-Origin": "*",
        "Accept": "application/json",
        "Authorization": "Bearer "+token,
    }
})


export default url;
