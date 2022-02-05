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

// 게시물 리스트 태그로 조회 (tag)
// to do: api 업데이트 되면 경로 변경
async function getArticleByTag(tag) {
  return await api
    .get("/api/board/" + tag)
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 게시물 제목으로 조회
async function getArticleByTitle(data) {
  return await api
    .post("/api/board/title/", {
      tag: data.tag,
      title: data.title
    })
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


// 게시물 좋아요
async function updateArticleLike(data) {
  return await api
    .post("/api/board/like", {
      tag: data.tag,
      tagId: data.boardId,
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
  getArticleByTag,
  getArticleByTitle,
  getArticleById,
  updateArticleLike,
  registComment,
  updateComment,
  deleteComment
};
