import api, { fileUrl, blobUrl } from './index';

// 게시물 등록
async function registBoard(formData) {
  return await fileUrl
    .post('/api/board', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 게시물 수정
async function updateBoard(formData) {
  return await fileUrl
    .post('/api/board/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 게시물 삭제
async function deleteBoard(data) {
  return await api
    .post('/api/board/delete', {
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
    .get('/api/board/' + tag)
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 게시물 제목으로 조회
async function getArticleByTitle(data) {
  return await api
    .post('/api/board/title/', {
      tag: data.tag,
      title: data.title,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 게시물 아이디로 상세 조회 (boardId)
async function getArticleById(data) {
  return await api
    .post('/api/board/view/', {
      addHit: data.addHit,
      boardId: data.boardId,
      userId: data.userId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 게시물 좋아요
async function updateArticleLike(data) {
  return await api
    .post('/api/board/like', {
      tag: data.tag,
      tagId: data.boardId,
      userId: data.userId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 게시물 좋아요 순으로 정렬
async function orderArticleByLike(tag) {
  return await api
    .get('/api/board/like/' + tag)
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 댓글 등록
async function registComment(data) {
  return await api
    .post('/api/comment', {
      boardId: data.boardId,
      content: data.content,
      userId: data.userId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 댓글 수정
async function updateComment(data) {
  return await api
    .post('/api/comment/update', {
      boardId: data.boardId,
      commentId: data.commentId,
      content: data.content,
      userId: data.userId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 댓글 삭제
async function deleteComment(data) {
  return await api
    .post('/api/comment/delete', {
      commentId: data.commentId,
      userId: data.userId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 파일 다운로드
async function fileDownload(data) {
  return await blobUrl
    .get('/api/board/download/' + data.saveFolder + '&' + data.saveFile)
    .then((res) => res)
    .catch((err) => err.response.data);
}

// 게시물 유저 아이디로 조회
async function getArticleByUserId(userId) {
  return await api
    .post('/api/board/user', {
      userId: userId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

export {
  registBoard,
  updateBoard,
  deleteBoard,
  getArticleByTag,
  getArticleByTitle,
  getArticleById,
  updateArticleLike,
  orderArticleByLike,
  registComment,
  updateComment,
  deleteComment,
  fileDownload,
  getArticleByUserId
};
