import api, { getAuth, fileUrl } from "./index";

async function getBoardListAPI() {
  // 글 목록 출력
  return await api
    .get("/api/board")
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function registBoardAPI(formData) {
  // 글 작성
  return await fileUrl
    .post("/api/board", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function deleteBoardAPI(inputData) {
  // 글 삭제
  return await api
    .post("/api/board/delete", {
      boardId: inputData.boardId,
      userId: inputData.userId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function updateBoardAPI(formData) {
  // 글 수정
  return await fileUrl
    .post("/api/board/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function viewBoardAPI(title) {
  // 글 읽기
  return await api
    .get("/api/board/title/" + title)
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

export {
  getBoardListAPI,
  registBoardAPI,
  deleteBoardAPI,
  updateBoardAPI,
  viewBoardAPI,
};
