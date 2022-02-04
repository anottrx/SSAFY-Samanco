import api, { fileUrl } from "./index";

// 게시물 등록
async function registBoard(formData) {
  return await fileUrl
  .post("/api/board", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  .then((res) => res.data)
  .catch((err) => err.response.data);
}

// 게시물 수정
async function updateBoard(formData) {
  return await fileUrl
  .post("/api/board/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  .then((res) => res.data)
  .catch((err) => err.response.data);
}

// 게시물 삭제
async function deleteBoard(data) {
  return await api
  .post("/api/board/delete", {
    boardId: data.boardId,
    userId: data.userId,
  })
  .then((res) => res.data)
  .catch((err) => err.response.data);
}

// 게시물 전체 목록 조회
async function getBoardListAll() {
  return await api
  .get("/api/board")
  .then((res) => res.data)
  .catch((err) => err.response.data);
}

// 게시물 리스트 태그로 조회 (tag)
async function getArticleByTag(tag) {
  return await api
    .get("/api/board/tag/" + tag)
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 게시물 제목으로 조회
async function getArticleByTitle(title) {
  return await api
    .get("/api/board/title/" + title)
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 게시물 아이디로 상세 조회 (boardId)
async function getArticleById(data) {
  return await api
    .post("/api/board/view/", {
      boardId: data.boardId,
      userId: data.userId
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 댓글 등록
async function registComment(data) {
  return await api
    .post("/api/comment", {
      boardId: data.boardId,
      content: data.content,
      userId: data.userId
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 댓글 수정
async function updateComment(data) {
  return await api
    .post("/api/comment/update", {
      boardId: data.boardId,
      commentId: data.commentId,
      content: data.content,
      userId: data.userId
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 댓글 삭제
async function deleteComment(data) {
  return await api
    .post("/api/comment/delete", {
      commentId: data.commentId,
      userId: data.userId
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// // 게시물 아이디로 댓글 리스트 조회
// async function getCommentByBoardId(data) {
//   return await api
//   .post("/api/comment/view", {
//     boardId: data.boardId,
//     userId: data.userId
//   })
//   .then((res) => res.data)
//   .catch((err) => err.response.data);
// }


export {
  registBoard,
  updateBoard,
  deleteBoard,
  getBoardListAll,
  getArticleByTag,
  getArticleByTitle,
  getArticleById,
  registComment,
  updateComment,
  deleteComment,
  // getCommentByBoardId
};
