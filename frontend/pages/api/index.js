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
<<<<<<< HEAD
        "Content-Type": `multipart/form-data`,
        // "Access-Control-Allow-Origin": "*",
        // "Accept": "application/json",
=======
        // "Content-Type": `application/json;charset=UTF-8`,
        "Content-Type": `multipart/form-data`,
        "Access-Control-Allow-Origin": "*",
        "Accept": "application/json",
>>>>>>> 76ccf4c255d329e5c08358d6ee5cdb3e18227859
    }
})

export default url;
export {getAuth, fileUrl};
