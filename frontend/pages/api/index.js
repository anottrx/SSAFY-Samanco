import axios from 'axios';

const HOST = process.env.NEXT_PUBLIC_ENV_HOST;
const PORT = process.env.NEXT_PUBLIC_ENV_PORT;
const BASE_URL = `${HOST}:${PORT}`;

const url = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': `application/json;charset=UTF-8`,
    'Access-Control-Allow-Origin': '*',
    Accept: 'application/json',
  },
});

const getAuth = (token) =>
  axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': `application/json;charset=UTF-8`,
      'Access-Control-Allow-Origin': `http://localhost:3000`,
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
      'Access-Control-Allow-Credentials': 'true',
    },
  });

const fileUrl = axios.create({
  baseURL: BASE_URL,
  headers: {
    // "Content-Type": `application/json;charset=UTF-8`,
    'Content-Type': `multipart/form-data`,
    'Access-Control-Allow-Origin': '*',
    Accept: 'application/json',
  },
});

const blobUrl = axios.create({
  baseURL: BASE_URL,
  headers: {
    'response-Type': 'blob',
  },
});

export default url;
export { getAuth, fileUrl, blobUrl };
