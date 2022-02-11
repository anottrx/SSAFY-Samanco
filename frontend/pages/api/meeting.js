import api, { fileUrl, blobUrl } from './index';

// 방 등록
async function registAPI(data) {
  return await api
    .post('/api/room', {
      hostId: data.hostId,
      isSecret: data.isSecret,
      password: data.password,
      tag: data.tag,
      tagId: data.tagId,
      title: data.title
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}
// async function registAPI(formData) {
//   return await fileUrl
//     .post('/api/room', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     })
//     .then((res) => res.data)
//     .catch((err) => err.response.data);
// }

// 방 들어가기 (방장, 방장 외의 사람)
async function joinRoomAPI(data) {
  return await api
    .post('/api/room/join', {
      roomId: data.roomId,
      userId: data.userId,
      password: data.password,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 방 나가기 (방장, 방장 외의 사람) -> 방장이 나가면 세션 삭제
async function quitRoomAPI(data) {
  return await api
    .post('/api/room/quit', {
      roomId: data.roomId,
      userId: data.userId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 모든 방 리스트 조회
async function getRoomAllAPI() {
  return await api
    .get('/api/room')
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 방 제목으로 조회
async function getRoomByTitle(title) {
  return await api
    .get('/api/room/title/' + title)
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

// 방 번호로 상세 조회 (roomId)
async function getRoomById(roomId) {
  return await api
    .post('/api/room/view/', {
      roomId: roomId,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
}

export {
  registAPI,
  joinRoomAPI,
  quitRoomAPI,
  getRoomAllAPI,
  getRoomByTitle,
  getRoomById,
};
