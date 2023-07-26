import axios from 'axios';

const baseURL = 'http://192.168.50.88:3000'; // 设置基础URL

// 创建一个Axios实例
const api = axios.create({
  baseURL: baseURL,
});

export function get(url) {
  return api.get(url);
}

export function post(url, data) {
  return api.post(url, data);
}

export function put(url, data) {
  return api.put(url, data);
}

export function del(url) {
  return api.delete(url);
}
