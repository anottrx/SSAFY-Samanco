import api, {getAuth} from "./index"

async function loginAPI(inputState) {
    return await api.post("/api/v1/auth/login", {
        id: inputState.id,
        password: inputState.password
    })
    .then(res => res.data)
    .catch(err => err.response.data);
}

async function registAPI(inputState) {
    return await api.post("/api/v1/users", {
        email: inputState.email,
        id: inputState.id,
        name: inputState.name,
        password: inputState.password,
        phone: inputState.phone
    })
    .then(res => res.data)
    .catch(err => err.response.data);
}

async function idCheckAPI(id) {
    return await api.get("/api/v1/users/idcheck/"+id)
    .then(res => res.data)
    .catch(err => err.response.data)
}

// 비밀번호 유효성 테스트는 FE에서 처리!
// async function pwCheckAPI(password) {
//     return await api.post("/api/v1/users/passcheck/", {
//         id: "",
//         password: password
//     })
//     .then(res => res.data)
//     .catch(err => err.response.data)
// }

async function getUserInfo(token) {
    return await getAuth(token).get("/api/v1/users/me")
    .then(res => res.data)
    .catch(err => err.response.data)
}

export { loginAPI, registAPI, idCheckAPI, getUserInfo }
