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
        // "Content-Type": `application/json;charset=UTF-8`,
        "Content-Type": `multipart/form-data`,
        "Access-Control-Allow-Origin": "*",
        "Accept": "application/json",
=======
        "Content-Type": `multipart/form-data`,
        // "Access-Control-Allow-Origin": "*",
        // "Accept": "application/json",
>>>>>>> 05448cc5cfe521c7784b37ab9550c1992558ea79
    }
})

export default url;
export {getAuth, fileUrl};
