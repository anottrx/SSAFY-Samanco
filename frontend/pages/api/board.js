import api, { fileUrl } from "./index";

async function getBoardListAll() {
  // 글 전체 목록 출력
  return await api
    .get("/api/board")
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function registBoard(formData) {
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

async function deleteBoard(data) {
  // 글 삭제
  return await api
    .post("/api/board/delete", {
      boardId: data.boardId,
      userId: data.userId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function updateBoard(formData) {
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

async function getArticleByTitle(title) {
  // 글 제목으로 검색
  return await api
    .get("/api/board/title/" + title)
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function getArticleById(data) {
  // 글 아이디로 검색 (boardId)
  return await api
    .post("/api/board/view/", {
      boardId: data.boardId,
      userId: data.userId
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

async function getArticleByTag(tag) {
  // 글 태그로 검색 (tag)
  return await api
    .get("/api/board/tag/" + tag)
    .then((res) => res.data)
    .catch((err) => err.response.data);
}



export {
  getBoardListAll,
  registBoard,
  deleteBoard,
  updateBoard,
  getArticleByTitle,
  getArticleById,
  getArticleByTag
};
